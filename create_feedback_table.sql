-- Feedback table for user suggestions and bug reports
create table if not exists public.feedback (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    rating int check (rating >= 1 and rating <= 5),
    category text check (category in ('feedback', 'bug', 'improvement', 'feature_request')) default 'feedback',
    comment text,
    source text, -- 'manual' or 'prompt_7_days'
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Policies
create policy "Users can insert their own feedback." on public.feedback
    for insert with check (auth.uid() = user_id OR user_id is null);

create policy "Admins can view all feedback." on public.feedback
    for select using (
        exists (
            select 1 from public.organization_members
            where user_id = auth.uid()
            and role = 'admin'
        )
    );
