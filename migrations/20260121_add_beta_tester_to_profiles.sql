-- Add is_beta_tester column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_beta_tester boolean DEFAULT false;

-- Allow users to update their own beta status
-- (Assuming existing policies allow updates to own profile, but explicitly noting this requirement)
-- The existing policy "Users can update own profile." on public.profiles using (auth.uid() = id) should cover this.
