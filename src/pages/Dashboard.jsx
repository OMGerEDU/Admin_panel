import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import WelcomeModal from '../components/WelcomeModal';

import StatusWidget from '../components/dashboard/StatusWidget';
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget';
import ActiveChatsWidget from '../components/dashboard/ActiveChatsWidget';
import ScheduleWidget from '../components/dashboard/ScheduleWidget';
import UntaggedWidget from '../components/dashboard/UntaggedWidget';
import DormantWidget from '../components/dashboard/DormantWidget';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        numbers: [],
        activeChats: [],
        scheduledMessages: [],
        dormantClients: [],
        allChats: [] // Used for untagged calculation
    });

    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    // Onboarding check (Keep logic from original)
    useEffect(() => {
        if (!user || loading) return;
        const checkOnboarding = async () => {
            try {
                const completed = localStorage.getItem('onboarding_completed');
                if (completed === 'true') return;

                const { count: numbersCount } = await supabase.from('numbers').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                const hasNumbers = (numbersCount || 0) > 0;
                const accountAgeHours = Math.abs(new Date() - new Date(user.created_at || Date.now())) / 36e5;
                if (accountAgeHours > 48 || hasNumbers) setShowWelcomeModal(false);
                else setShowWelcomeModal(true);
            } catch (e) { console.error(e); }
        };
        checkOnboarding();
    }, [user, loading]);

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            console.log('[DASHBOARD] Fetching data via RPC functions for user:', user.id);

            // Call all database functions in parallel
            const [chatsResult, scheduledResult, dormantResult, healthResult] = await Promise.all([
                supabase.rpc('get_dashboard_active_chats_v2', {
                    p_user_id: user.id,
                    p_limit: 10
                }),
                supabase.rpc('get_dashboard_scheduled_messages_v2', {
                    p_user_id: user.id,
                    p_pending_limit: 10,
                    p_recent_limit: 10
                }),
                supabase.rpc('get_dashboard_dormant_clients_v2', {
                    p_user_id: user.id,
                    p_days_threshold: 7,
                    p_limit: 5
                }),
                supabase.rpc('get_dashboard_system_health_v2', {
                    p_user_id: user.id
                })
            ]);

            // Log any errors
            if (chatsResult.error) console.error('[DASHBOARD] Chats RPC error:', chatsResult.error);
            if (scheduledResult.error) console.error('[DASHBOARD] Scheduled RPC error:', scheduledResult.error);
            if (dormantResult.error) console.error('[DASHBOARD] Dormant RPC error:', dormantResult.error);
            if (healthResult.error) console.error('[DASHBOARD] Health RPC error:', healthResult.error);

            // Process results
            const chats = chatsResult.data || [];
            const scheduled = scheduledResult.data || [];
            const dormant = dormantResult.data || [];
            const health = healthResult.data?.[0] || {};

            console.log('[DASHBOARD] RPC Results:', {
                chats: chats.length,
                scheduled: scheduled.length,
                dormant: dormant.length,
                health
            });

            // Parse messages JSONB for each chat (already parsed by Supabase)
            chats.forEach(chat => {
                chat.messages = chat.messages || [];
            });

            setData({
                numbers: [], // Will be populated from health stats if needed
                activeChats: chats,
                scheduledMessages: scheduled,
                dormantClients: dormant,
                systemHealth: health,
                allChats: chats
            });

        } catch (error) {
            console.error('[DASHBOARD] RPC fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t('dashboard')}
                </h2>
                <p className="text-muted-foreground mt-1">
                    {t('welcome')}, {user?.email}
                </p>
            </div>

            <WelcomeModal
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
                hasNumbers={data.numbers.length > 0}
                onComplete={() => fetchDashboardData()}
            />

            {/* 1. Operations Center */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <StatusWidget numbers={data.numbers} loading={loading} />
                    </div>
                    <div className="md:col-span-2">
                        <QuickActionsWidget />
                    </div>
                </div>
            </div>

            {/* 2. Workflow Feed */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground/80">{t('dashboard.overview_desc')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-stretch">
                    {/* Active Chats - Takes 2 cols on Large */}
                    <div className="lg:col-span-2 h-full">
                        <ActiveChatsWidget chats={data.activeChats} loading={loading} />
                    </div>

                    {/* Schedule - Takes 1 col */}
                    <div className="h-full">
                        <ScheduleWidget messages={data.scheduledMessages} loading={loading} />
                    </div>
                </div>
            </div>

            {/* 3. Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DormantWidget clients={data.dormantClients} loading={loading} />
                <UntaggedWidget chats={data.allChats} loading={loading} />
            </div>
        </div>
    );
}
