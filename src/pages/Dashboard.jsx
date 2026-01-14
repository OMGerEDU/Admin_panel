import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Smartphone,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Plus,
    MessageSquare,
    Clock,
    UserX,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import WelcomeModal from '../components/WelcomeModal';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalNumbers: 0,
        activeNumbers: 0,
        recentErrors: 0,
        apiUsage: 0,
        chatsToday: 0,
        avgResponseTime: '0m',
        dormantCount: 0,
        totalMessages: 0,
        activityData: [],
        dormantClients: [],
        recentActivity: []
    });
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [onboardingState, setOnboardingState] = useState({
        hasNumbers: false,
        hasScheduledMessages: false
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    // Check if user should see onboarding modal
    useEffect(() => {
        if (!user || loading) return;

        const checkOnboarding = async () => {
            try {
                // Check if onboarding was already completed
                const onboardingCompleted = localStorage.getItem('onboarding_completed');
                if (onboardingCompleted === 'true') {
                    return;
                }

                // Check numbers count
                const { count: numbersCount } = await supabase
                    .from('numbers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                // Check scheduled messages count
                const { count: scheduledCount } = await supabase
                    .from('scheduled_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const hasNumbers = (numbersCount || 0) > 0;

                // Account age check
                const accountAgeHours = Math.abs(new Date() - new Date(user.created_at || Date.now())) / 36e5;
                const isOldUser = accountAgeHours > 48;

                console.log('[ONBOARDING] Check:', { accountAgeHours, hasNumbers, isOldUser });

                // HIDE if:
                // 1. User is older than 48 hours
                // 2. OR User has numbers (which implies they are set up)
                if (isOldUser || hasNumbers) {
                    setShowWelcomeModal(false);
                } else {
                    setShowWelcomeModal(true);
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            }
        };

        checkOnboarding();
    }, [user, loading]);

    const fetchDashboardData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // 1. Fetch numbers
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
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

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

            // 4. Analytics (Hybrid: Snapshot + Live fallback)
            let chatsToday = 0;
            let dormantCount = 0;
            let totalMessages = 0;
            let activityData = [];
            let dormantClients = [];

            // Try to leverage snapshot from the first active number for fast global stats
            const activeNum = numbers?.find(n => n.status === 'active');
            let usedSnapshot = false;

            if (activeNum) {
                try {
                    const { data: snapshotBlob } = await supabase.storage
                        .from('chat-snapshots')
                        .download(`${activeNum.instance_id}/latest_snapshot.json`);

                    if (snapshotBlob) {
                        const payload = JSON.parse(await snapshotBlob.text());
                        console.log('[DASHBOARD] Using snapshot for analytics optimization');

                        chatsToday = payload.chats?.filter(c => c.last_message_at > yesterday.toISOString()).length || 0;
                        dormantClients = payload.chats?.filter(c => c.last_message_at < sevenDaysAgo)
                            .sort((a, b) => new Date(a.last_message_at) - new Date(b.last_message_at))
                            .slice(0, 5) || [];
                        dormantCount = payload.chats?.filter(c => c.last_message_at < sevenDaysAgo).length || 0;

                        // Approximate activity from cached messages in snapshot
                        const allMsgs = Object.values(payload.messageChunks || {}).flat();
                        totalMessages = allMsgs.length;

                        // Generate weekly activity
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        activityData = Array.from({ length: 7 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            return {
                                name: days[d.getDay()],
                                date: d.toISOString().split('T')[0],
                                sent: 0,
                                received: 0
                            };
                        });

                        allMsgs.forEach(msg => {
                            const dateStr = (msg.timestamp || '').split('T')[0];
                            const day = activityData.find(d => d.date === dateStr);
                            if (day) {
                                if (msg.is_from_me) day.sent += 1;
                                else day.received += 1;
                            }
                        });
                        usedSnapshot = true;
                    }
                } catch (e) {
                    console.warn('[DASHBOARD] Snapshot analytics failed, falling back to DB:', e);
                }
            }

            if (!usedSnapshot) {
                // FALLBACK TO DB QUERIES (Original Analytics logic)
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

                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                activityData = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return {
                        name: days[d.getDay()],
                        date: d.toISOString().split('T')[0],
                        sent: 0,
                        received: 0
                    };
                });

                messages?.forEach(msg => {
                    const dateStr = (msg.timestamp || '').split('T')[0];
                    const day = activityData.find(d => d.date === dateStr);
                    if (day) {
                        if (msg.is_from_me) day.sent += 1;
                        else day.received += 1;
                    }
                });
            }

            // 5. Fetch recent activity (logs)
            const { data: recentLogs } = await supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(10);

            setStats({
                totalNumbers,
                activeNumbers,
                recentErrors: errorCount || 0,
                apiUsage: apiUsageCount || 0,
                chatsToday,
                dormantCount,
                totalMessages,
                activityData,
                dormantClients,
                avgResponseTime: '14m',
                recentActivity: recentLogs || []
            });

            setOnboardingState({
                hasNumbers: totalNumbers > 0,
                hasScheduledMessages: false
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        {
            title: t('total_numbers'),
            value: stats.totalNumbers.toString(),
            icon: Smartphone,
            color: "text-blue-500",
            desc: `${stats.activeNumbers} ${t('active')}`
        },
        {
            title: t('analytics.chats_today', 'Chats Today'),
            value: stats.chatsToday.toString(),
            icon: MessageSquare,
            color: "text-green-500",
            desc: t('last_24_hours')
        },
        {
            title: t('analytics.dormant', 'Dormant Clients'),
            value: stats.dormantCount.toString(),
            icon: UserX,
            color: "text-red-500",
            desc: t('analytics.dormant_desc', 'No contact for > 7 days')
        },
        {
            title: t('analytics.total_activity', 'Weekly Activity'),
            value: stats.totalMessages > 1000 ? `${(stats.totalMessages / 1000).toFixed(1)}k` : stats.totalMessages.toString(),
            icon: TrendingUp,
            color: "text-violet-500",
            desc: t('analytics.messages_sent_received', 'Messages exchanged')
        }
    ];

    const handleOnboardingComplete = () => {
        setShowWelcomeModal(false);
        // Refresh onboarding state
        const checkState = async () => {
            if (!user) return;
            try {
                const { count: numbersCount } = await supabase
                    .from('numbers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const { count: scheduledCount } = await supabase
                    .from('scheduled_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                setOnboardingState({
                    hasNumbers: (numbersCount || 0) > 0,
                    hasScheduledMessages: (scheduledCount || 0) > 0
                });
            } catch (error) {
                console.error('Error refreshing onboarding state:', error);
            }
        };
        checkState();
    };

    return (
        <div className="space-y-6">
            <WelcomeModal
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
                hasNumbers={onboardingState.hasNumbers}
                hasScheduledMessages={onboardingState.hasScheduledMessages}
                onComplete={handleOnboardingComplete}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
                    <p className="text-muted-foreground">
                        {t('welcome')}, {user?.email}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/app/numbers">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('add_number')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <div className="col-span-4 text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                ) : (
                    statsData.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('analytics.activity_overtime', 'Messaging Activity')}</CardTitle>
                        <CardDescription>
                            {t('analytics.activity_desc', 'Visualizing message volume for the past 7 days.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.activityData}>
                                    <defs>
                                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="sent" stroke="#10b981" fillOpacity={1} fill="url(#colorSent)" />
                                    <Area type="monotone" dataKey="received" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReceived)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('analytics.dormant_list', 'Dormant Clients')}</CardTitle>
                        <CardDescription>
                            {t('analytics.dormant_list_desc', 'Clients you might want to follow up with.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.dormantClients.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">{t('analytics.no_dormant', 'No dormant clients found.')}</p>
                            ) : (
                                stats.dormantClients.map((client, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{client.name || client.remote_jid?.split('@')[0] || t('common.no_data')}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t('analytics.last_active', 'Last active:')} {new Date(client.last_message_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Link to={`/app/chats?remoteJid=${client.remote_jid}`}>
                                            <Button variant="ghost" size="sm" className="h-8 group">
                                                {t('analytics.reengage', 'Re-engage')}
                                                <ArrowUpRight className="ml-2 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>{t('recent_activity')}</CardTitle>
                        <CardDescription>
                            {t('latest_actions')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading ? (
                                <div className="text-center py-4 text-muted-foreground col-span-full">{t('common.loading')}</div>
                            ) : stats.recentActivity.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground col-span-full">{t('common.no_data')}</div>
                            ) : (
                                stats.recentActivity.slice(0, 6).map((log, i) => (
                                    <div key={log.id || i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none truncate max-w-[150px]">
                                                {log.numbers ? (
                                                    `${log.numbers.phone_number || log.numbers.instance_id || ''}`
                                                ) : (
                                                    log.message || t('instance_synced')
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                {log.level === 'error' ? '⚠️ ' : '✓ '}
                                                {log.message || t('synced_successfully')}
                                            </p>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                            {new Date(log.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
