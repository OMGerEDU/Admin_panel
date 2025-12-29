-- SQL to fix missing user_id in tags table
-- Run this in your Supabase SQL Editor

-- 1. Add the missing user_id column
alter table public.tags 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2. Add the check constraint (allow either org or user tag)
alter table public.tags 
drop constraint if exists tags_org_or_user;

alter table public.tags 
add constraint tags_org_or_user check (organization_id is not null or user_id is not null);

-- 3. Drop existing RLS policies (in case they are outdated) and re-create them
drop policy if exists "Users can view tags for their org" on public.tags;
drop policy if exists "Users can view tags for their org or themselves" on public.tags;

create policy "Users can view tags for their org or themselves"
  on public.tags for select
  using (
    (organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    ))
    or
    (user_id = auth.uid())
  );

drop policy if exists "Users can insert tags for their org" on public.tags;
drop policy if exists "Users can insert tags for their org or themselves" on public.tags;

create policy "Users can insert tags for their org or themselves"
  on public.tags for insert
  with check (
    (organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    ))
    or
    (user_id = auth.uid())
  );

drop policy if exists "Users can update tags for their org" on public.tags;
drop policy if exists "Users can update tags for their org or themselves" on public.tags;

create policy "Users can update tags for their org or themselves"
  on public.tags for update
  using (
    (organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    ))
    or
    (user_id = auth.uid())
  );

drop policy if exists "Users can delete tags for their org" on public.tags;
drop policy if exists "Users can delete tags for their org or themselves" on public.tags;

create policy "Users can delete tags for their org or themselves"
  on public.tags for delete
  using (
    (organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    ))
    or
    (user_id = auth.uid())
  );
