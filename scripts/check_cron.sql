-- ============================================================================
-- Supabase Cron Job Management SQL
-- ============================================================================
-- Run these queries in Supabase SQL Editor to manage the cron job

-- 1. Check if cron job exists
SELECT * FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';

-- 2. Check cron job execution history (last 50 runs)
SELECT 
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'dispatch_scheduled_messages')
ORDER BY start_time DESC 
LIMIT 50;

-- 3. Create/Update the cron job
-- IMPORTANT: Replace <YOUR_DOMAIN> with your actual Vercel domain
-- IMPORTANT: Replace YOUR_CRON_SECRET with your actual CRON_SECRET
-- 
-- First, unschedule if exists:
SELECT cron.unschedule('dispatch_scheduled_messages');

-- Then, schedule the new job:
SELECT cron.schedule(
  'dispatch_scheduled_messages',
  '* * * * *',  -- Every minute
  $$
    SELECT net.http_post(
      url := 'https://<YOUR_DOMAIN>/api/dispatch',
      headers := jsonb_build_object(
        'authorization', 'Bearer YOUR_CRON_SECRET',
        'content-type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- 4. Unschedule the cron job (if needed)
SELECT cron.unschedule('dispatch_scheduled_messages');

-- 5. Check for pending scheduled messages
SELECT 
  id,
  user_id,
  number_id,
  message,
  scheduled_at,
  status,
  is_active,
  created_at,
  NOW() as current_time,
  scheduled_at <= NOW() as is_due
FROM scheduled_messages
WHERE status = 'pending'
  AND is_active = true
ORDER BY scheduled_at ASC
LIMIT 20;

-- 6. Check if messages are being claimed correctly
-- This should return messages that are due and ready to be sent
SELECT * FROM claim_due_scheduled_messages(50);

-- 7. Check recent cron job runs with details
SELECT 
  j.jobname,
  j.schedule,
  j.command,
  jr.status,
  jr.return_message,
  jr.start_time,
  jr.end_time,
  EXTRACT(EPOCH FROM (jr.end_time - jr.start_time)) as duration_seconds
FROM cron.job j
LEFT JOIN cron.job_run_details jr ON j.jobid = jr.jobid
WHERE j.jobname = 'dispatch_scheduled_messages'
ORDER BY jr.start_time DESC
LIMIT 10;

