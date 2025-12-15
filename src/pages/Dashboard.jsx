import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Smartphone, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    // Mock stats for now
    const stats = [
        { title: "Total Numbers", value: "3", icon: Smartphone, color: "text-blue-500", desc: "2 Active" },
        { title: "System Status", value: "Healthy", icon: CheckCircle2, color: "text-green-500", desc: "All systems operational" },
        { title: "Recent Errors", value: "0", icon: AlertTriangle, color: "text-yellow-500", desc: "Last 24 hours" },
        { title: "API Usage", value: "1.2k", icon: Activity, color: "text-violet-500", desc: "Requests today" }
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
                {stats.map((stat, i) => (
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
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Example chart or activity feed can go here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-accent/20 rounded-md">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions performed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Instance synced
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Instance 61725... synced successfully
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                                        {i + 2}m ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
