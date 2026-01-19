-- ============================================================================
-- Setup Scheduled Messages Cron Job
--
-- This migration enables the pg_cron extension and schedules the 
-- `claim_due_scheduled_messages` function to run every minute.
-- ============================================================================

-- Enable pg_cron extension (must be run as superuser, usually handled by Supabase)
-- If you get an error here, ensure pg_cron is enabled in your Supabase project settings.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove existing job if it exists (to prevent duplicates on re-run)
SELECT cron.unschedule('dispatch-scheduled-messages') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'dispatch-scheduled-messages'
);

-- Schedule the job to run every minute
-- Note: The actual message sending happens via an Edge Function or external service
-- This job just marks messages as 'processing' so they can be picked up.
SELECT cron.schedule(
    'dispatch-scheduled-messages',   -- job name
    '* * * * *',                       -- every minute
    $$SELECT claim_due_scheduled_messages(50)$$ -- claim up to 50 messages per run
);

-- Grant permissions if needed (adjust based on your roles)
-- GRANT USAGE ON SCHEMA cron TO authenticated; -- Usually not needed for backend jobs
