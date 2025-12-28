-- Create Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    source TEXT DEFAULT 'manual', -- 'manual', 'prompt_7_days'
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies

-- Authenticated users can insert their own feedback
CREATE POLICY "Users can insert their own feedback" 
ON feedback FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can read their own feedback (optional, but good practice)
CREATE POLICY "Users can read their own feedback" 
ON feedback FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Admins/Service role can read all (implicit for service_role, explicit if needed for admin users logic)
-- Assuming typical Supabase setup where service_role bypasses RLS.
