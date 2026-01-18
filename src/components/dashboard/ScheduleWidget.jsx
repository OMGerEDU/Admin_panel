import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ScheduleWidget({ messages = [], loading = false }) {
    const { t } = useTranslation();

    const upcoming = messages
        .filter(m => m.status === 'pending')
        .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
        .slice(0, 5);

    if (loading) {
        return <Card className="h-full"><CardContent className="p-6">Loading...</CardContent></Card>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-500" />
                    {t('dashboard.upcoming_schedule')}
                </CardTitle>
                <CardDescription>
                    {t('automation_page.list_desc')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {upcoming.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p>{t('dashboard.no_scheduled')}</p>
                        <Link to="/app/scheduled">
                            <Button variant="link" size="sm" className="mt-2">{t('dashboard.action_schedule')}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcoming.map((msg, i) => (
                            <div key={msg.id || i} className="flex items-start gap-3 border-l-2 border-primary/20 pl-3 py-1">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate mb-1">
                                        {msg.template_name || msg.message?.substring(0, 20)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(msg.scheduled_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-xs bg-muted px-2 py-1 rounded">
                                    {msg.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ScheduleWidget;
