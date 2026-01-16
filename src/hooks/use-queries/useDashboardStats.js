import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { AnalyticsService } from '../../services/AnalyticsService';

/**
 * Hook to fetch all dashboard statistics.
 */
export function useDashboardStats(user) {
    return useQuery({
        queryKey: ['dashboard_stats', user?.id],
        queryFn: async () => {
            if (!user) return null;

            // 1. Fetch numbers (needed for AnalyticsService fallback/snapshot logic)
            const { data: numbers, error: numbersError } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id);
            if (numbersError) throw numbersError;

            const activeNumbers = numbers?.filter(n => n.status === 'active').length || 0;
            const totalNumbers = numbers?.length || 0;

            // 2. Fetch recent errors
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            const { count: errorCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .eq('level', 'error')
                .gte('created_at', yesterday.toISOString());

            // 3. API Usage
            const { count: apiUsageCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .in('level', ['info', 'warn', 'error'])
                .gte('created_at', yesterday.toISOString());

            // 4. Analytics (Hybrid)
            const analytics = await AnalyticsService.getHybridStats(user, numbers);

            // 5. Recent Activity
            const { data: recentLogs } = await supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(10);

            return {
                totalNumbers,
                activeNumbers,
                recentErrors: errorCount || 0,
                apiUsage: apiUsageCount || 0,
                chatsToday: analytics?.chatsToday || 0,
                dormantCount: analytics?.dormantCount || 0,
                totalMessages: analytics?.totalMessages || 0,
                activityData: analytics?.activityData || [],
                dormantClients: analytics?.dormantClients || [],
                recentActivity: recentLogs || [],
                avgResponseTime: '14m', // Still hardcoded for now as per audit
                usedSnapshot: analytics?.usedSnapshot || false
            };
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
