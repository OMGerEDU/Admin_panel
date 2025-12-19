-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";
-- Additional extensions for scheduling & HTTP
create extension if not exists "pgcrypto";
create extension if not exists "pg_net";
create extension if not exists "pg_cron";

create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  -- Mark if user is allowed to use the system (for extension + app)
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Ensure is_active exists even if table already created previously
alter table public.profiles
  add column if not exists is_active boolean default true;

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure each user can own at most one organization
create unique index if not exists organizations_owner_id_unique
  on public.organizations(owner_id);

-- Enable RLS
alter table public.organizations enable row level security;

-- Organization Invites - invite links for users to join organizations
create table if not exists public.organization_invites (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  email text, -- optional hint, can be null for generic invite links
  token text not null unique,
  invited_by uuid references public.profiles(id),
  status text check (status in ('pending', 'accepted', 'expired')) default 'pending',
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure required columns exist on older databases where organization_invites
-- might have been created without the token column
alter table public.organization_invites
  add column if not exists token text,
  add column if not exists invited_by uuid references public.profiles(id);

-- Ensure token is unique for invite links
create unique index if not exists organization_invites_token_key
  on public.organization_invites(token);

alter table public.organization_invites enable row level security;

-- Org members, invitees and internal auth flows (no auth.uid) can view invites
drop policy if exists "Org members can view invites" on public.organization_invites;
drop policy if exists "Org members and invitees can view invites" on public.organization_invites;
create policy "Org members and invitees can view invites" on public.organization_invites
  for select using (
    -- Internal flows like auth triggers, where there is no authenticated user context
    auth.uid() is null
    OR
    -- Existing members of the organization
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.organization_invites.organization_id
      and om.user_id = auth.uid()
    )
    OR
    -- Users who are the target of the invite (by email) or generic invites (email is null)
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and (
        public.organization_invites.email is null
        or lower(p.email) = lower(public.organization_invites.email)
      )
    )
  );

-- Org admins/owners can insert invites
drop policy if exists "Org admins can insert invites" on public.organization_invites;
create policy "Org admins can insert invites" on public.organization_invites
  for insert with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.organization_invites.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
    or exists (
      select 1 from public.organizations o
      where o.id = public.organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

-- Org admins/owners can update invites
drop policy if exists "Org admins can update invites" on public.organization_invites;
create policy "Org admins can update invites" on public.organization_invites
  for update using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.organization_invites.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
    or exists (
      select 1 from public.organizations o
      where o.id = public.organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

-- Org admins/owners can delete invites
drop policy if exists "Org admins can delete invites" on public.organization_invites;
create policy "Org admins can delete invites" on public.organization_invites
  for delete using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.organization_invites.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
    or exists (
      select 1 from public.organizations o
      where o.id = public.organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

-- Create a table for Organization Members
create table if not exists public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Enable RLS
alter table public.organization_members enable row level security;

-- Policies for Organizations
drop policy if exists "Users can view own organizations" on public.organizations;
create policy "Users can view own organizations" on public.organizations
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = public.organizations.id
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (auth.uid() = owner_id);

-- Policies for Organization Members
drop policy if exists "Members can view other members" on public.organization_members;
create policy "Members can view other members" on public.organization_members
  for select using (
    exists (
      select 1 from public.organization_members as om
      where om.organization_id = public.organization_members.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Members can add members" on public.organization_members;
create policy "Members can add members" on public.organization_members
  for insert with check (
      (
        -- Admins can add members
        exists (
            select 1 from public.organization_members as om
            where om.organization_id = organization_id
            and om.user_id = auth.uid()
            and om.role = 'admin'
        )
        OR
        -- Allow self-insert if you are the owner creating the org (initial member)
        exists (
            select 1 from public.organizations as o
            where o.id = organization_id
            and o.owner_id = auth.uid()
        )
        OR
        -- Allow self-insert when joining via a valid pending invite
        -- Note: This check allows any pending invite for the org, since the function
        -- (security definer) will validate the token match separately
        (
          user_id = auth.uid()
          and exists (
            select 1 from public.organization_invites oi
            where oi.organization_id = organization_id
            and oi.status = 'pending'
            and (oi.expires_at is null or oi.expires_at > timezone('utc'::text, now()))
            and (
              -- Generic invite (no email restriction)
              oi.email is null
              or 
              -- Email-specific invite matches user's email
              exists (
                select 1 from public.profiles p
                where p.id = auth.uid()
                and lower(p.email) = lower(oi.email)
              )
            )
          )
        )
      )
      AND
      (
        -- If invites_limit is unlimited (-1), always allow
        coalesce(
          (select invites_limit from public.get_effective_plan_for_user(
             (select owner_id from public.organizations where id = organization_id)
           )),
           -1
        ) = -1
        OR
        -- Otherwise enforce that non-owner members are below invites_limit
        (
          select count(*) 
          from public.organization_members m
          join public.organizations o on o.id = m.organization_id
          where m.organization_id = organization_id
            and m.user_id <> o.owner_id
        ) < coalesce(
          (select invites_limit from public.get_effective_plan_for_user(
             (select owner_id from public.organizations where id = organization_id)
           )),
           -1
        )
      )
  );

drop policy if exists "Admins can delete members" on public.organization_members;
create policy "Admins can delete members" on public.organization_members
  for delete using (
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = public.organization_members.organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      exists (
          select 1 from public.organizations as o
          where o.id = public.organization_members.organization_id
          and o.owner_id = auth.uid()
      )
  );

-- Allow regular members to leave organizations (but not owners)
drop policy if exists "Members can leave organizations" on public.organization_members;
create policy "Members can leave organizations" on public.organization_members
  for delete using (
    public.organization_members.user_id = auth.uid()
    and not exists (
      select 1 from public.organizations o
      where o.id = public.organization_members.organization_id
      and o.owner_id = auth.uid()
    )
  );

-- Function to handle new user signup (also handles organization invite tokens)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_invite record;
  v_invite_token text;
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- If signup included an organization invite token, automatically join the org
  if new.raw_user_meta_data ? 'invite_token' then
    v_invite_token := new.raw_user_meta_data->>'invite_token';

    -- Find the invite by token (bypassing RLS since this is security definer)
    -- We need to use a direct query that doesn't rely on auth.uid()
    select *
    into v_invite
    from public.organization_invites oi
    where oi.token = v_invite_token
      and oi.status = 'pending'
      and (oi.expires_at is null or oi.expires_at > timezone('utc'::text, now()))
    limit 1;

    if found then
      -- Add user as a member of the invited organization
      -- This should work because the function is security definer
      insert into public.organization_members (organization_id, user_id, role)
      values (v_invite.organization_id, new.id, 'member')
      on conflict (organization_id, user_id) do nothing;

      -- Mark invite as accepted
      update public.organization_invites
      set status = 'accepted'
      where id = v_invite.id;
    end if;
  end if;

  return new;
exception
  when others then
    -- Log error but don't fail user creation
    raise warning 'Error in handle_new_user for user %: %', new.id, sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PLANS Table
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique, -- 'Free', 'Pro', 'Agency'
  price_monthly numeric,
  numbers_limit int, -- -1 for unlimited
  instances_limit int, -- -1 for unlimited
  invites_limit int, -- -1 for unlimited
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Plans (Idempotent)
insert into public.plans (name, price_monthly, numbers_limit, instances_limit, invites_limit)
values 
  ('Free', 0, 2, 1, 0),
  ('Pro', 29, 10, 10, 1),
  ('Agency', 99, -1, -1, -1)
on conflict (name) do nothing;

-- SUBSCRIPTIONS / USER PLANS Table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_id uuid references public.plans(id) not null,
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- One active subscription per user for simplicity
);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscription" on public.subscriptions;
create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

-- Helper function: get effective plan for a user (falls back to 'Free')
create or replace function public.get_effective_plan_for_user(p_user_id uuid)
returns public.plans as $$
declare
  v_plan public.plans;
begin
  select p.*
  into v_plan
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = p_user_id
  limit 1;

  if not found then
    select p.*
    into v_plan
    from public.plans p
    where p.name = 'Free'
    limit 1;
  end if;

  return v_plan;
end;
$$ language plpgsql stable;

-- Check function: enforce numbers_limit for current user
create or replace function public.check_numbers_limit()
returns boolean as $$
declare
  v_plan public.plans;
  v_count int;
begin
  if auth.uid() is null then
    return false;
  end if;

  select * into v_plan
  from public.get_effective_plan_for_user(auth.uid());

  -- Unlimited
  if v_plan.numbers_limit is null or v_plan.numbers_limit = -1 then
    return true;
  end if;

  select count(*) into v_count
  from public.numbers n
  where n.user_id = auth.uid();

  return v_count < v_plan.numbers_limit;
end;
$$ language plpgsql stable;

-- Check function: enforce instances_limit for current user, based on instance_id
create or replace function public.check_instances_limit(p_instance_id text)
returns boolean as $$
declare
  v_plan public.plans;
  v_limit int;
  v_count int;
  v_exists boolean;
begin
  if auth.uid() is null then
    return false;
  end if;

  select * into v_plan
  from public.get_effective_plan_for_user(auth.uid());

  v_limit := coalesce(v_plan.instances_limit, -1);

  -- Unlimited
  if v_limit = -1 then
    return true;
  end if;

  -- If no instance_id provided, do not count toward limit
  if p_instance_id is null then
    return true;
  end if;

  -- If this instance_id already exists for the user, allow
  select exists(
    select 1 from public.numbers n
    where n.user_id = auth.uid()
      and n.instance_id = p_instance_id
  ) into v_exists;

  if v_exists then
    return true;
  end if;

  -- Count distinct instances for this user
  select count(distinct n.instance_id) into v_count
  from public.numbers n
  where n.user_id = auth.uid()
    and n.instance_id is not null;

  return v_count < v_limit;
end;
$$ language plpgsql stable;

-- NUMBERS Table
create table if not exists public.numbers (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null,
  user_id uuid references public.profiles(id), -- Owner
  organization_id uuid references public.organizations(id), -- If belongs to org
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(phone_number)
);

-- Enable RLS for Numbers
alter table public.numbers enable row level security;

-- Policy: Users see numbers they own OR numbers in their organization
drop policy if exists "Users can check own or org numbers" on public.numbers;
create policy "Users can check own or org numbers" on public.numbers
  for select using (
    auth.uid() = user_id OR 
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.numbers.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert numbers" on public.numbers;
create policy "Users can insert numbers" on public.numbers
  for insert with check (
    auth.uid() = user_id
    and public.check_numbers_limit()
    and public.check_instances_limit(instance_id)
  );

drop policy if exists "Users can update own numbers" on public.numbers;
create policy "Users can update own numbers" on public.numbers
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own numbers" on public.numbers;
create policy "Users can delete own numbers" on public.numbers
  for delete using (auth.uid() = user_id);

-- CHATS Table
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  number_id uuid references public.numbers(id) not null,
  remote_jid text not null, -- The other person's ID (e.g., WhatsApp JID)
  name text,
  last_message text,
  last_message_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Chats
alter table public.chats enable row level security;

-- Policy: Users see chats for numbers they have access to
drop policy if exists "Users can view chats for their numbers" on public.chats;
create policy "Users can view chats for their numbers" on public.chats
  for select using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and (
        n.user_id = auth.uid() OR
        exists (
          select 1 from public.organization_members om
          where om.organization_id = n.organization_id
          and om.user_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Users can insert chats for their numbers" on public.chats;
create policy "Users can insert chats for their numbers" on public.chats
  for insert with check (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update chats for their numbers" on public.chats;
create policy "Users can update chats for their numbers" on public.chats
  for update using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

-- MESSAGES Table (Optional, but good for history)
create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    chat_id uuid references public.chats(id) not null,
    content text,
    is_from_me boolean default false,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    media_meta jsonb -- Store media metadata (urlFile, downloadUrl, jpegThumbnail, fileName, etc.)
);

-- Add media_meta column if table already exists
alter table public.messages
add column if not exists media_meta jsonb;

alter table public.messages enable row level security;

drop policy if exists "Users can view messages for accessible chats" on public.messages;
create policy "Users can view messages for accessible chats" on public.messages
  for select using (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and (
                  n.user_id = auth.uid() OR
                  exists (
                      select 1 from public.organization_members om
                      where om.organization_id = n.organization_id
                      and om.user_id = auth.uid()
                  )
              )
          )
      )
  );

drop policy if exists "Users can insert messages for accessible chats" on public.messages;
create policy "Users can insert messages for accessible chats" on public.messages
  for insert with check (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and n.user_id = auth.uid()
          )
      )
  );


-- Update NUMBERS table with Green-API fields
alter table public.numbers 
add column if not exists instance_id text,
add column if not exists api_token text,
add column if not exists last_seen timestamp with time zone,
add column if not exists settings jsonb default '{}'::jsonb;

-- Index on instance_id for faster lookups (no uniqueness constraint)
create index if not exists numbers_instance_id_idx on public.numbers (instance_id);

-- WEBHOOKS Table
create table if not exists public.webhooks (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  url text not null,
  events jsonb default '[]'::jsonb, -- Array of event names
  is_active boolean default true,
  secret text,
  retry_policy jsonb default '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Webhooks
alter table public.webhooks enable row level security;

drop policy if exists "Users can view webhooks for their orgs" on public.webhooks;
create policy "Users can view webhooks for their orgs" on public.webhooks
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks
  for all using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

-- LOGS Table
create table if not exists public.logs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  number_id uuid references public.numbers(id),
  level text check (level in ('info', 'warn', 'error', 'debug')) default 'info',
  message text not null,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Logs
alter table public.logs enable row level security;

drop policy if exists "Users can view logs for their scope" on public.logs;
create policy "Users can view logs for their scope" on public.logs
  for select using (
    (organization_id is not null AND exists (
      select 1 from public.organization_members om
      where om.organization_id = public.logs.organization_id
      and om.user_id = auth.uid()
    ))
    OR
    (number_id is not null AND exists (
      select 1 from public.numbers n
      where n.id = public.logs.number_id
      and n.user_id = auth.uid()
    ))
  );

-- Allow users to insert logs for scopes they have access to
drop policy if exists "Users can insert logs for their scope" on public.logs;
create policy "Users can insert logs for their scope" on public.logs
  for insert with check (
    -- System-level or anonymous logs (no org/number) are allowed
    (organization_id is null and number_id is null)
    OR
    -- Org-scoped logs when user is a member
    (organization_id is not null AND exists (
      select 1 from public.organization_members om
      where om.organization_id = public.logs.organization_id
      and om.user_id = auth.uid()
    ))
    OR
    -- Number-scoped logs when user owns the number
    (number_id is not null AND exists (
      select 1 from public.numbers n
      where n.id = public.logs.number_id
      and n.user_id = auth.uid()
    ))
  );

-- AUTOMATION JOBS Table (Simple Queue)
create table if not exists public.automation_jobs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  type text not null, -- 'sync_contacts', 'broadcast', 'check_status'
  payload jsonb,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  run_at timestamp with time zone default timezone('utc'::text, now()),
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Jobs
alter table public.automation_jobs enable row level security;

drop policy if exists "Users can view jobs" on public.automation_jobs;
create policy "Users can view jobs" on public.automation_jobs
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
create policy "Users can insert jobs for their orgs" on public.automation_jobs
  for insert with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
create policy "Users can update jobs for their orgs" on public.automation_jobs
  for update using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

-- BILLING EVENTS / TRANSACTIONS (optional, for plan history UI)
create table if not exists public.billing_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_id uuid references public.plans(id),
  amount numeric,
  currency text default 'USD',
  status text check (status in ('pending', 'paid', 'failed', 'refunded')) default 'paid',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.billing_events enable row level security;

drop policy if exists "Users can view own billing events" on public.billing_events;
create policy "Users can view own billing events" on public.billing_events
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own billing events" on public.billing_events;
create policy "Users can insert own billing events" on public.billing_events
  for insert with check (auth.uid() = user_id);

-- SCHEDULED MESSAGES TABLE FOR WHATSAPP DISPATCH
create table if not exists public.scheduled_messages (
  id uuid primary key default gen_random_uuid(),
  number_id uuid references public.numbers(id) on delete cascade not null,
  to_phone text not null,
  message text not null,
  scheduled_at timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempts int not null default 0,
  last_error text,
  sent_at timestamp with time zone,
  provider_message_id text,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Ensure required columns exist if table was created earlier
alter table public.scheduled_messages
  add column if not exists number_id uuid references public.numbers(id) on delete cascade,
  add column if not exists to_phone text,
  add column if not exists message text,
  add column if not exists scheduled_at timestamp with time zone,
  add column if not exists status text not null default 'pending',
  add column if not exists attempts int not null default 0,
  add column if not exists last_error text,
  add column if not exists sent_at timestamp with time zone,
  add column if not exists provider_message_id text,
  add column if not exists created_at timestamp with time zone not null default timezone('utc'::text, now());

-- Note: If number_id column was just added and contains nulls, you may need to:
-- 1. Update existing rows to set number_id to a valid number
-- 2. Then add the NOT NULL constraint:
--    alter table public.scheduled_messages alter column number_id set not null;
--    alter table public.scheduled_messages alter column to_phone set not null;
--    alter table public.scheduled_messages alter column message set not null;
--    alter table public.scheduled_messages alter column scheduled_at set not null;

-- Index for efficient lookup of due messages
create index if not exists scheduled_messages_status_scheduled_at_idx
  on public.scheduled_messages (status, scheduled_at);

-- Atomic claim function: marks due messages as 'processing' and returns them
create or replace function public.claim_due_scheduled_messages(max_batch integer default 50)
returns setof public.scheduled_messages
language plpgsql
as $$
begin
  return query
  update public.scheduled_messages sm
  set status = 'processing'
  from (
    select id
    from public.scheduled_messages
    where status = 'pending'
      and scheduled_at <= timezone('utc'::text, now())
    order by scheduled_at
    for update skip locked
    limit max_batch
  ) as pending
  where sm.id = pending.id
  returning sm.*;
end;
$$;

-- Schedule cron job to dispatch due messages every minute
-- NOTE: Replace <YOUR_DOMAIN> with your actual Vercel domain (e.g., 'admin-panel-788h-git-main-omgeredus-projects.vercel.app')
-- NOTE: Replace YOUR_CRON_SECRET_HERE with your actual CRON_SECRET value from Vercel environment variables
-- To schedule, run this SQL in Supabase SQL Editor:
/*
select
  cron.schedule(
    'dispatch_scheduled_messages',
    '* * * * *',
    $$
      select net.http_post(
        url := 'https://<YOUR_DOMAIN>/api/dispatch',
        headers := jsonb_build_object(
          'authorization', 'Bearer YOUR_CRON_SECRET_HERE',
          'content-type', 'application/json'
        ),
        body := '{}'::jsonb
      );
    $$
  );
*/

-- SQL Snippets for Cron Job Management:
-- 
-- 1. List all cron jobs:
--    select * from cron.job;
--
-- 2. List cron job execution history:
--    select * from cron.job_run_details order by start_time desc limit 50;
--
-- 3. Unschedule the dispatch job:
--    select cron.unschedule('dispatch_scheduled_messages');
--
-- 4. Reschedule with different interval (e.g., every 5 minutes):
--    select cron.unschedule('dispatch_scheduled_messages');
--    select cron.schedule(
--      'dispatch_scheduled_messages',
--      '*/5 * * * *',
--      $$ ... (same as above) $$
--    );

