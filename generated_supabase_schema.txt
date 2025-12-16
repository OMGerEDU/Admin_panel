-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create a table for public profiles using Supabase Auth
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

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

-- Create a table for Organizations
create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.organizations enable row level security;

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
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      -- Allow self-insert if you are the owner creating the org (this is tricky, usually handled by backend or function. 
      -- For simplicity in this demo, we might need a trusted function to create org+member together)
      -- Allowing initial member creation:
       exists (
          select 1 from public.organizations as o
          where o.id = organization_id
          and o.owner_id = auth.uid()
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

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
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
  for insert with check (auth.uid() = user_id);

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
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Ensure instance_id is unique
create unique index if not exists numbers_instance_id_idx on public.numbers (instance_id);

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
