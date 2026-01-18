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
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // 1. Fetch Numbers
            const { data: numbers } = await supabase.from('numbers').select('*').eq('user_id', user.id);

            // 2. Fetch recent chats for user's numbers
            let chats = [];
            if (numbers && numbers.length > 0) {
                const numberIds = numbers.map(n => n.id);
                try {
                    const { data: c } = await supabase
                        .from('chats')
                        .select('*, tags(*)')
                        .in('number_id', numberIds)
                        .order('last_message_at', { ascending: false })
                        .limit(10);
                    chats = c || [];
                } catch (err) {
                    console.warn('[DASHBOARD] Tag fetch failed, falling back', err);
                    const { data: c } = await supabase
                        .from('chats')
                        .select('*')
                        .in('number_id', numberIds)
                        .order('last_message_at', { ascending: false })
                        .limit(10);
                    chats = c || [];
                }
            }

            // 2b. Fetch last 2 messages for these chats (Optimization: single query)
            if (chats.length > 0) {
                const chatIds = chats.map(c => c.chatId || c.remote_jid);
                // Can't easily use 'in' for distinct limit without complex query or stored proc.
                // For 10 chats, we can do parallel queries or one big query and filtering in JS.
                // Given low volume, fetching last 5 messages for all these IDs in one go is fine if indexed?
                // Or just loop parellel.
                const messagesPromises = chats.map(c =>
                    supabase
                        .from('messages')
                        .select('*')
                        .eq('chat_id', c.id) // Assuming internal ID
                        .order('timestamp', { ascending: false })
                        .limit(2)
                );

                const results = await Promise.all(messagesPromises);
                chats = chats.map((c, i) => ({
                    ...c,
                    messages: results[i].data || []
                }));
            }

            // 3. Scheduled Messages (Pending AND Recent)
            const { data: scheduledPending } = await supabase
                .from('scheduled_messages')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'pending')
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true })
                .limit(10);

            const { data: scheduledRecent } = await supabase
                .from('scheduled_messages')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['completed', 'failed'])
                .order('scheduled_at', { ascending: false })
                .limit(10);

            // 4. Dormant Clients
            const { data: dormant } = numbers && numbers.length > 0 ? await supabase
                .from('chats')
                .select('name, remote_jid, last_message_at')
                .in('number_id', numberIds)
                .lt('last_message_at', sevenDaysAgo.toISOString())
                .order('last_message_at', { ascending: true })
                .limit(5) : { data: [] };

            setData({
                numbers: numbers || [],
                activeChats: chats, // Show recent chats regardless of time window
                scheduledMessages: [...(scheduledPending || []), ...(scheduledRecent || [])],
                dormantClients: dormant || [],
                allChats: chats
            });

        } catch (error) {
            console.error('[DASHBOARD] Fetch failed:', error);
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
