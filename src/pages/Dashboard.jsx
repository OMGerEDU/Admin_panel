import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Smartphone, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
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
                const hasScheduledMessages = (scheduledCount || 0) > 0;

                setOnboardingState({
                    hasNumbers,
                    hasScheduledMessages
                });

                // Show modal if user hasn't completed onboarding
                // (either no numbers or no scheduled messages)
                if (!hasNumbers || !hasScheduledMessages) {
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

            // Fetch numbers for the user
            const { data: numbers, error: numbersError } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id);

            if (numbersError) throw numbersError;

            const activeNumbers = numbers?.filter(n => n.status === 'active').length || 0;
            const totalNumbers = numbers?.length || 0;

            // Fetch recent errors from logs (last 24 hours)
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);

            const { count: errorCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .eq('level', 'error')
                .gte('created_at', yesterday.toISOString());

            // Fetch recent activity (last 10 logs)
            const { data: recentLogs } = await supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(10);

            // Calculate API usage from logs (count of info/error/warn logs in last 24 hours as proxy)
            const { count: apiUsageCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .in('level', ['info', 'warn', 'error'])
                .gte('created_at', yesterday.toISOString());

            setStats({
                totalNumbers,
                activeNumbers,
                recentErrors: errorCount || 0,
                apiUsage: apiUsageCount || 0, // API calls approximated from log activity
                recentActivity: recentLogs || []
            });

            // Update onboarding state based on fetched data
            setOnboardingState({
                hasNumbers: totalNumbers > 0,
                hasScheduledMessages: false // Will be updated separately if needed
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
            title: t('system_status'),
            value: t('healthy'),
            icon: CheckCircle2,
            color: "text-green-500",
            desc: t('all_systems_operational')
        },
        {
            title: t('recent_errors'),
            value: stats.recentErrors.toString(),
            icon: AlertTriangle,
            color: "text-yellow-500",
            desc: t('last_24_hours')
        },
        {
            title: t('api_usage'),
            value: stats.apiUsage > 0 ? `${(stats.apiUsage / 1000).toFixed(1)}k` : "0",
            icon: Activity,
            color: "text-violet-500",
            desc: t('requests_today')
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
                        <CardTitle>{t('overview')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.overview_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-accent/20 rounded-md p-4">
                            <div className="text-center space-y-2">
                                <Activity className="h-12 w-12 mx-auto opacity-50" />
                                <p className="text-sm font-medium">{t('dashboard.chart_coming_soon')}</p>
                                <p className="text-xs">{t('dashboard.chart_desc')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('recent_activity')}</CardTitle>
                        <CardDescription>
                            {t('latest_actions')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-4 text-muted-foreground">{t('common.loading')}</div>
                            ) : stats.recentActivity.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">{t('common.no_data')}</div>
                            ) : (
                                stats.recentActivity.slice(0, 5).map((log, i) => (
                                    <div key={log.id || i} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {log.numbers ? (
                                                    `${t('instance_synced')} ${log.numbers.phone_number || log.numbers.instance_id || ''}`
                                                ) : (
                                                    log.message || t('instance_synced')
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {log.level === 'error' ? '⚠️ ' : '✓ '}
                                                {log.message || t('synced_successfully')}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
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
