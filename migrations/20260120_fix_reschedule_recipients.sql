-- ============================================================================
-- Fix Reschedule Logic - Reset Recipients
-- 
-- The previous version of reschedule_recurring_message only reset the parent
-- message status. We must also reset the status of all recipients in the
-- scheduled_message_recipients table so they are picked up again.
-- ============================================================================

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
    CASE v_msg.recurrence_type
        WHEN 'daily' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 day';
        
        WHEN 'weekly' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 week';
            
        WHEN 'monthly' THEN
            v_next_run := v_msg.scheduled_at + INTERVAL '1 month';
            
        ELSE
            v_next_run := v_msg.scheduled_at + INTERVAL '1 day';
    END CASE;

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

    -- NEW: Reset all recipients for this message to 'pending'
    UPDATE scheduled_message_recipients
    SET 
        status = 'pending',
        sent_at = NULL,
        provider_message_id = NULL,
        error_message = NULL,
        updated_at = NOW()
    WHERE scheduled_message_id = p_message_id;

    RAISE NOTICE 'Rescheduled message % to % and reset recipients', p_message_id, v_next_run;

END;
$$ LANGUAGE plpgsql;
