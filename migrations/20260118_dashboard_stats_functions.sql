-- Migration: Dashboard Stats Functions
-- Author: PanelMaster
-- Date: 2026-01-18
-- Description: Creates optimized database functions for dashboard statistics
-- Affected tables: chats, scheduled_messages, numbers, messages
-- Rollback: DROP FUNCTION statements at end of file

-- ============================================================================
-- Function 1: Get Active Chats with Messages
-- Returns recent chats for user's numbers with last 2 messages
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_active_chats(p_user_id UUID, p_limit INT DEFAULT 10)
RETURNS TABLE (
    id BIGINT,
    remote_jid TEXT,
    name TEXT,
    profile_pic_url TEXT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    number_id BIGINT,
    messages JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_numbers AS (
        SELECT n.id 
        FROM numbers n 
        WHERE n.user_id = p_user_id
    ),
    recent_chats AS (
        SELECT 
            c.id,
            c.remote_jid,
            c.name,
            c.profile_pic_url,
            c.last_message,
            c.last_message_at,
            c.number_id
        FROM chats c
        WHERE c.number_id IN (SELECT id FROM user_numbers)
        ORDER BY c.last_message_at DESC NULLS LAST
        LIMIT p_limit
    )
    SELECT 
        rc.id,
        rc.remote_jid,
        rc.name,
        rc.profile_pic_url,
        rc.last_message,
        rc.last_message_at,
        rc.number_id,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', m.id,
                        'message', m.message,
                        'timestamp', m.timestamp,
                        'key', m.key
                    )
                    ORDER BY m.timestamp DESC
                )
                FROM (
                    SELECT * FROM messages 
                    WHERE chat_id = rc.id 
                    ORDER BY timestamp DESC 
                    LIMIT 2
                ) m
            ),
            '[]'::jsonb
        ) as messages
    FROM recent_chats rc;
END;
$$;

-- ============================================================================
-- Function 2: Get Scheduled Messages Stats
-- Returns pending and recent scheduled messages
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_scheduled_messages(
    p_user_id UUID,
    p_pending_limit INT DEFAULT 10,
    p_recent_limit INT DEFAULT 10
)
RETURNS TABLE (
    category TEXT,
    id BIGINT,
    to_phone TEXT,
    message TEXT,
    template_name TEXT,
    scheduled_at TIMESTAMPTZ,
    status TEXT,
    number_id BIGINT,
    number_phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH pending_msgs AS (
        SELECT 
            'pending'::TEXT as category,
            sm.id,
            sm.to_phone,
            sm.message,
            sm.template_name,
            sm.scheduled_at,
            sm.status,
            sm.number_id,
            n.phone_number as number_phone,
            1 as sort_group
        FROM scheduled_messages sm
        LEFT JOIN numbers n ON n.id = sm.number_id
        WHERE sm.user_id = p_user_id
            AND sm.status = 'pending'
            AND sm.scheduled_at >= NOW()
        ORDER BY sm.scheduled_at ASC
        LIMIT p_pending_limit
    ),
    recent_msgs AS (
        SELECT 
            'recent'::TEXT as category,
            sm.id,
            sm.to_phone,
            sm.message,
            sm.template_name,
            sm.scheduled_at,
            sm.status,
            sm.number_id,
            n.phone_number as number_phone,
            2 as sort_group
        FROM scheduled_messages sm
        LEFT JOIN numbers n ON n.id = sm.number_id
        WHERE sm.user_id = p_user_id
            AND sm.status IN ('completed', 'failed')
        ORDER BY sm.scheduled_at DESC
        LIMIT p_recent_limit
    )
    SELECT 
        category, id, to_phone, message, template_name, 
        scheduled_at, status, number_id, number_phone
    FROM (
        SELECT * FROM pending_msgs
        UNION ALL
        SELECT * FROM recent_msgs
    ) combined
    ORDER BY sort_group, scheduled_at;
END;
$$;

-- ============================================================================
-- Function 3: Get Dormant Clients
-- Returns chats with no activity in the last N days
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_dormant_clients(
    p_user_id UUID,
    p_days_threshold INT DEFAULT 7,
    p_limit INT DEFAULT 5
)
RETURNS TABLE (
    remote_jid TEXT,
    name TEXT,
    last_message_at TIMESTAMPTZ,
    days_dormant INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_numbers AS (
        SELECT n.id 
        FROM numbers n 
        WHERE n.user_id = p_user_id
    )
    SELECT 
        c.remote_jid,
        c.name,
        c.last_message_at,
        EXTRACT(DAY FROM (NOW() - c.last_message_at))::INT as days_dormant
    FROM chats c
    WHERE c.number_id IN (SELECT id FROM user_numbers)
        AND c.last_message_at < (NOW() - (p_days_threshold || ' days')::INTERVAL)
    ORDER BY c.last_message_at ASC
    LIMIT p_limit;
END;
$$;

-- ============================================================================
-- Function 4: Get System Health Stats
-- Returns counts and status for dashboard overview
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_system_health(p_user_id UUID)
RETURNS TABLE (
    total_numbers INT,
    connected_numbers INT,
    total_chats INT,
    active_chats_7d INT,
    pending_schedules INT,
    failed_schedules_24h INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_numbers AS (
        SELECT n.id, n.status
        FROM numbers n 
        WHERE n.user_id = p_user_id
    ),
    chat_stats AS (
        SELECT 
            COUNT(*)::INT as total,
            COUNT(*) FILTER (WHERE last_message_at > NOW() - INTERVAL '7 days')::INT as active_7d
        FROM chats c
        WHERE c.number_id IN (SELECT id FROM user_numbers)
    ),
    schedule_stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE status = 'pending')::INT as pending,
            COUNT(*) FILTER (WHERE status = 'failed' AND scheduled_at > NOW() - INTERVAL '24 hours')::INT as failed_24h
        FROM scheduled_messages
        WHERE user_id = p_user_id
    )
    SELECT 
        (SELECT COUNT(*)::INT FROM user_numbers) as total_numbers,
        (SELECT COUNT(*)::INT FROM user_numbers WHERE status = 'connected') as connected_numbers,
        cs.total as total_chats,
        cs.active_7d as active_chats_7d,
        ss.pending as pending_schedules,
        ss.failed_24h as failed_schedules_24h
    FROM chat_stats cs, schedule_stats ss;
END;
$$;

-- ============================================================================
-- Grant Execute Permissions
-- ============================================================================
GRANT EXECUTE ON FUNCTION get_dashboard_active_chats(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_scheduled_messages(UUID, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_dormant_clients(UUID, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_system_health(UUID) TO authenticated;

-- ============================================================================
-- ROLLBACK SCRIPT (run these to undo this migration)
-- ============================================================================
-- DROP FUNCTION IF EXISTS get_dashboard_active_chats(UUID, INT);
-- DROP FUNCTION IF EXISTS get_dashboard_scheduled_messages(UUID, INT, INT);
-- DROP FUNCTION IF EXISTS get_dashboard_dormant_clients(UUID, INT, INT);
-- DROP FUNCTION IF EXISTS get_dashboard_system_health(UUID);
