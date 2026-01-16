import { supabase } from '../lib/supabaseClient';

export class AnalyticsService {
    /**
     * Fetch hybrid stats using storage snapshot if available, falling back to DB.
     * @param {object} user - Current user object
     * @param {Array} numbers - List of user's numbers
     * @returns {Promise<object>} Stats object
     */
    static async getHybridStats(user, numbers) {
        if (!user) return null;

        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        let chatsToday = 0;
        let dormantCount = 0;
        let totalMessages = 0;
        let activityData = [];
        let dormantClients = [];
        let usedSnapshot = false;

        // Try to leverage snapshot from the first active number
        const activeNum = numbers?.find(n => n.status === 'active');

        if (activeNum) {
            try {
                const { data: snapshotBlob } = await supabase.storage
                    .from('chat-snapshots')
                    .download(`${activeNum.instance_id}/latest_snapshot.json`);

                if (snapshotBlob) {
                    const payload = JSON.parse(await snapshotBlob.text());
                    // console.log('[AnalyticsService] Using snapshot for analytics optimization');

                    chatsToday = payload.chats?.filter(c => c.last_message_at > yesterday.toISOString()).length || 0;

                    dormantClients = payload.chats?.filter(c => c.last_message_at < sevenDaysAgo)
                        .sort((a, b) => new Date(a.last_message_at) - new Date(b.last_message_at))
                        .slice(0, 5) || [];

                    dormantCount = payload.chats?.filter(c => c.last_message_at < sevenDaysAgo).length || 0;

                    // Approximate activity from cached messages in snapshot
                    const allMsgs = Object.values(payload.messageChunks || {}).flat();
                    totalMessages = allMsgs.length;

                    // Generate weekly activity
                    activityData = AnalyticsService.generateActivityData(allMsgs);
                    usedSnapshot = true;
                }
            } catch (e) {
                console.warn('[AnalyticsService] Snapshot analytics failed, falling back to DB:', e);
            }
        }

        if (!usedSnapshot) {
            // FALLBACK TO DB QUERIES
            const { count: cToday } = await supabase
                .from('chats')
                .select('*', { count: 'exact', head: true })
                .gt('last_message_at', yesterday.toISOString());
            chatsToday = cToday || 0;

            const { data: dClients, count: dCount } = await supabase
                .from('chats')
                .select('name, remote_jid, last_message_at', { count: 'exact' })
                .lt('last_message_at', sevenDaysAgo)
                .order('last_message_at', { ascending: true })
                .limit(5);

            dormantClients = dClients || [];
            dormantCount = dCount || 0;

            const { data: messages } = await supabase
                .from('messages')
                .select('timestamp, is_from_me')
                .gt('timestamp', sevenDaysAgo);

            totalMessages = messages?.length || 0;
            activityData = AnalyticsService.generateActivityData(messages || []);
        }

        return {
            chatsToday,
            dormantCount,
            totalMessages,
            activityData,
            dormantClients,
            usedSnapshot
        };
    }

    static generateActivityData(messages) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activityData = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                name: days[d.getDay()],
                date: d.toISOString().split('T')[0],
                sent: 0,
                received: 0
            };
        });

        messages.forEach(msg => {
            const dateStr = (msg.timestamp || '').split('T')[0];
            const day = activityData.find(d => d.date === dateStr);
            if (day) {
                if (msg.is_from_me) day.sent += 1;
                else day.received += 1;
            }
        });

        return activityData;
    }
}
