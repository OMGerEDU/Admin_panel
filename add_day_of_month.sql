-- Add day_of_month column to scheduled_messages
alter table public.scheduled_messages
add column if not exists day_of_month int check (day_of_month >= 1 and day_of_month <= 31);
