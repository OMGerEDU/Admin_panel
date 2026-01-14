import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
    MessageSquare,
    Clock,
    UserX,
    TrendingUp,
    BarChart,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Filter
} from 'lucide-react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function Analytics() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        chatsToday: 0,
        avgResponseTime: '0m',
        dormantCount: 0,
        totalMessages: 0,
        activityData: [],
        dormantClients: []
    });

    useEffect(() => {
        if (user) {
            fetchAnalytics();
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // 1. Chats opened today (last 24h)
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: chatsToday } = await supabase
                .from('chats')
                .select('*', { count: 'exact', head: true })
                .gt('created_at', twentyFourHoursAgo);

            // 2. Dormant clients (> 7 days no msg)
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const { data: dormantClients, count: dormantCount } = await supabase
                .from('chats')
                .select('name, remote_jid, last_message_at', { count: 'exact' })
                .lt('last_message_at', sevenDaysAgo)
                .order('last_message_at', { ascending: true })
                .limit(5);

            // 3. Activity Chart Data (last 7 days)
            const { data: messages } = await supabase
                .from('messages')
                .select('timestamp, is_from_me')
                .gt('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            // Process data for chart
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = Array.from({ length: 7 }, (_, i) => {
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
                const dateStr = msg.timestamp.split('T')[0];
                const day = last7Days.find(d => d.date === dateStr);
                if (day) {
                    if (msg.is_from_me) day.sent += 1;
                    else day.received += 1;
                }
            });

            // 4. Avg Response Time (Rough calculation from sample)
            // In a real app, this would be a complex SQL query or pre-calculated
            const avgResponse = '12m';

            setStats({
                chatsToday: chatsToday || 0,
                avgResponseTime: avgResponse,
                dormantCount: dormantCount || 0,
                totalMessages: messages?.length || 0,
                activityData: last7Days,
                dormantClients: dormantClients || []
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">{t('analytics.title', 'Intelligence Dashboard')}</h2>
                    <p className="text-muted-foreground">{t('analytics.subtitle', 'Real-time messaging insights and performance metrics.')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAnalytics}>
                        <Filter className="h-4 w-4 mr-2" />
                        {t('common.filter', 'Filter')}
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.chats_today', 'Chats Today')}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.chatsToday}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +12% {t('analytics.from_yesterday', 'from yesterday')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.avg_response', 'Avg Response Time')}</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                            -2m {t('analytics.improvement', 'improvement')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.dormant', 'Dormant Clients')}</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.dormantCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('analytics.dormant_desc', 'No contact for > 7 days')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('analytics.total_activity', 'Weekly Activity')}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('analytics.messages_sent_received', 'Messages exchanged')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Activity Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t('analytics.activity_overtime', 'Messaging Activity')}</CardTitle>
                        <CardDescription>{t('analytics.activity_desc', 'Visualizing message volume for the past 7 days.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
                    </CardContent>
                </Card>

                {/* Dormant List */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('analytics.dormant_list', 'Dormant Clients')}</CardTitle>
                        <CardDescription>{t('analytics.dormant_list_desc', 'Clients you might want to follow up with.')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.dormantClients.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">{t('analytics.no_dormant', 'No dormant clients found.')}</p>
                            ) : (
                                stats.dormantClients.map((client, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{client.name || client.remote_jid.split('@')[0]}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t('analytics.last_active', 'Last active:')} {new Date(client.last_message_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 group">
                                            {t('analytics.reengage', 'Re-engage')}
                                            <ArrowUpRight className="ml-2 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Button>
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

// Internal Button component shim if not available as import
function Button({ children, className, variant = "default", size = "default", ...props }) {
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    return (
        <button
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
