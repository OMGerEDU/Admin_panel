-- Add unique constraint for chats upsert functionality
-- This allows us to cache contact names for scheduled message personalization

-- First, clean up any duplicate entries (keeping the most recent)
DELETE FROM public.chats a
USING public.chats b
WHERE a.ctid < b.ctid 
    AND a.number_id = b.number_id 
    AND a.remote_jid = b.remote_jid;

-- Add unique constraint
ALTER TABLE public.chats 
ADD CONSTRAINT chats_number_id_remote_jid_unique 
UNIQUE (number_id, remote_jid);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS chats_number_remote_jid_idx 
ON public.chats(number_id, remote_jid);
