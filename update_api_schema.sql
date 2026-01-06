
-- Migration to add cron_expression to scheduled_messages and create api_keys table

-- 1. Create API Keys Table
create table if not exists public.api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  key_hash text not null, -- We store the hashed key
  prefix text not null,   -- We store the first few chars to show to the user
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Enable RLS for API keys
alter table public.api_keys enable row level security;

-- Policies for API keys
drop policy if exists "Users can view own api keys" on public.api_keys;
create policy "Users can view own api keys" on public.api_keys
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own api keys" on public.api_keys;
create policy "Users can insert own api keys" on public.api_keys
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own api keys" on public.api_keys;
create policy "Users can delete own api keys" on public.api_keys
  for delete using (auth.uid() = user_id);


-- 2. Add cron_expression to scheduled_messages if not exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'scheduled_messages' and column_name = 'cron_expression') then
    alter table public.scheduled_messages add column cron_expression text;
  end if;
end $$;
