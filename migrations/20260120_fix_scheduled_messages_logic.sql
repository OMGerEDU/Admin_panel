-- ============================================================================
-- Fix Scheduled Messages Logic
-- 
-- 1. claim_due_scheduled_messages: Correctly claiming pending messages
-- 2. reschedule_recurring_message: Calculating next run time for recurring
-- ============================================================================

-- Function 1: Claim Due Scheduled Messages
-- Selects 'pending' messages that are due and marks them as 'processing'
-- atomicity is ensured by FOR UPDATE SKIP LOCKED

DROP FUNCTION IF EXISTS claim_due_scheduled_messages(INT);
CREATE OR REPLACE FUNCTION claim_due_scheduled_messages(max_batch INT DEFAULT 50)
RETURNS SETOF scheduled_messages AS $$
DECLARE
    claimed_ids UUID[];
BEGIN
    -- 1. Identify IDs to claim
    -- We use a CTE with FOR UPDATE SKIP LOCKED to handle concurrency safely
    WITH eligible_messages AS (
        SELECT id
        FROM scheduled_messages
        WHERE status = 'pending'
          AND is_active = true
          AND scheduled_at <= NOW()
        ORDER BY scheduled_at ASC
        LIMIT max_batch
        FOR UPDATE SKIP LOCKED
    )
    
    -- 2. Update status to 'processing' and return the rows
    UPDATE scheduled_messages
    SET 
        status = 'processing',
        updated_at = NOW()
    WHERE id IN (SELECT id FROM eligible_messages)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Reschedule Recurring Message
-- Calculations the next occurrence for a recurring message and resets it to 'pending'

DROP FUNCTION IF EXISTS reschedule_recurring_message(UUID);
CREATE OR REPLACE FUNCTION reschedule_recurring_message(p_message_id UUID)
RETURNS VOID AS $$
DECLARE
    v_msg scheduled_messages%ROWTYPE;
    v_next_run TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get message details
    SELECT * INTO v_msg FROM scheduled_messages WHERE id = p_message_id;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'Message with ID % not found', p_message_id;
        RETURN;
    END IF;

    -- Only reschedule if it is actually recurring
    IF v_msg.is_recurring IS NOT TRUE THEN
        RETURN;
    END IF;

    -- Calculate next run time
    -- We base it on the previous 'scheduled_at' to maintain the cycle, 
    -- rather than NOW(), to prevent drift if the processor is delayed.
    CASE v_msg.recurrence_type
        WHEN 'daily' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 day';
        
        WHEN 'weekly' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 week';
            
        WHEN 'monthly' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 month';
            
        ELSE
            -- Unknown type, default to daily or log warning
            v_next_run := v_msg.scheduled_at + INTERVAL '1 day';
    END CASE;

    -- If for some reason next run is still in the past (e.g. system down for days),
    -- keep adding intervals until it is in the future?
    -- For now, let's just stick to the formal next interval. 
    -- If the system was down for a month, it might send 30 daily messages in a row. 
    -- Ideally, we might want to skip to NOW() + interval, but that depends on business logic.
    -- We will stick to strict interval logic for now.

    -- Update the message
    UPDATE scheduled_messages
    SET 
        scheduled_at = v_next_run,
        status = 'pending',
        attempts = 0,
        sent_at = NULL,
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_message_id;

    RAISE NOTICE 'Rescheduled message % to %', p_message_id, v_next_run;

END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your roles)
GRANT EXECUTE ON FUNCTION claim_due_scheduled_messages(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_due_scheduled_messages(INT) TO service_role;

GRANT EXECUTE ON FUNCTION reschedule_recurring_message(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reschedule_recurring_message(UUID) TO service_role;
