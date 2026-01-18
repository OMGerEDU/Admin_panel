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

            // 2. Fetch recent chats (for Active & Untagged widgets)
            // Trying to fetch tags. If fails, we fallback gracefully in widget logic?
            // Actually, if query fails, the whole block throws.
            // We'll try to select tags.
            let chats = [];
            try {
                const { data: c } = await supabase
                    .from('chats')
                    .select('*, tags(*)') // Expecting tags relation
                    .order('last_message_at', { ascending: false })
                    .limit(50);
                chats = c || [];
            } catch (err) {
                console.warn('[DASHBOARD] Tag fetch failed, falling back to simple chat fetch', err);
                const { data: c } = await supabase.from('chats').select('*').order('last_message_at', { ascending: false }).limit(50);
                chats = c || [];
            }

            // 3. Scheduled Messages (Pending)
            const { data: scheduled } = await supabase
                .from('scheduled_messages')
                .select('*')
                .eq('status', 'pending')
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true })
                .limit(10);

            // 4. Dormant Clients (Manual Calculation from chats list or separate query if list too small)
            // If we only fetched 50 chats, we might miss dormant ones if there are many active ones.
            // Let's fetch dormant specifically.
            const { data: dormant } = await supabase
                .from('chats')
                .select('name, remote_jid, last_message_at')
                .lt('last_message_at', sevenDaysAgo.toISOString())
                .order('last_message_at', { ascending: true })
                .limit(5);

            setData({
                numbers: numbers || [],
                activeChats: chats.filter(c => new Date(c.last_message_at) > sevenDaysAgo),
                scheduledMessages: scheduled || [],
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
