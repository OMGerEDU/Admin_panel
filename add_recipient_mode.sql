-- Add recipient_mode column to scheduled_messages table
-- This column tracks whether recipients were added by phone numbers or by tags

ALTER TABLE scheduled_messages 
ADD COLUMN IF NOT EXISTS recipient_mode TEXT DEFAULT 'phones';

-- Add comment for documentation
COMMENT ON COLUMN scheduled_messages.recipient_mode IS 'How recipients were added: phones or tags';
