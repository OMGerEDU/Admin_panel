import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Smartphone, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalNumbers: 0,
        activeNumbers: 0,
        recentErrors: 0,
        apiUsage: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

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

            setStats({
                totalNumbers,
                activeNumbers,
                recentErrors: errorCount || 0,
                apiUsage: 0 // TODO: Calculate from actual API usage data
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
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
                            {t('chart_placeholder')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-accent/20 rounded-md">
                            {t('chart_placeholder')}
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
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">{t('common.no_data')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
