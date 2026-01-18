import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Calendar, Clock, Contact, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ScheduleWidget({ messages = [], loading = false }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("next");

    const upcoming = messages
        .filter(m => m.status === 'pending')
        .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
        .slice(0, 5);

    const recent = messages
        .filter(m => m.status !== 'pending')
        .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
        .slice(0, 5);

    // Combine for 'All' tab - Future first, then Recent
    const all = [...upcoming, ...recent].slice(0, 7);

    const renderList = (items, isHistory = false) => {
        if (items.length === 0) {
            return (
                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
                    <Clock className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">{t(isHistory ? 'dashboard.no_recent' : 'dashboard.no_scheduled')}</p>
                </div>
            );
        }
        return (
            <div className="space-y-3 mt-2">
                {items.map((msg, i) => {
                    const isPending = msg.status === 'pending';
                    const isBulk = !msg.to_phone && !msg.recipient_count; // Rough guess or if count > 1

                    return (
                        <div key={msg.id || i} className={`flex items-start gap-3 border-l-2 pl-3 py-1 transition-colors ${isPending ? 'border-primary/60 bg-primary/5 rounded-r-md' : 'border-muted'
                            }`}>
                            <div className="mt-0.5">
                                {isBulk ? <Users className="h-4 w-4 text-muted-foreground" /> : <Contact className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold leading-none truncate mb-1 ${isPending ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {msg.to_phone || t('scheduled.multiple_recipients') || 'Recipients'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mb-1" title={msg.message}>
                                    "{msg.template_name || msg.message}"
                                </p>
                                <p className="text-[10px] text-muted-foreground/70">
                                    {new Date(msg.scheduled_at).toLocaleString()}
                                </p>
                            </div>
                            <div className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider self-center ${msg.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                    msg.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                {msg.status}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return <Card className="h-full"><CardContent className="p-6">Loading...</CardContent></Card>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-violet-500" />
                        {t('dashboard.schedules', 'Schedules')}
                    </CardTitle>
                    <Link to="/app/scheduled">
                        <Button variant="ghost" size="sm" className="h-6 text-xs">{t('view_all', 'View All')}</Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <Tabs defaultValue="next" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-2">
                        <TabsTrigger value="next">{t('dashboard.tab_next', 'Next')}</TabsTrigger>
                        <TabsTrigger value="recent">{t('dashboard.tab_recent', 'Recent')}</TabsTrigger>
                        <TabsTrigger value="all">{t('dashboard.tab_all', 'All')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="next" className="outline-none">
                        {renderList(upcoming, false)}
                    </TabsContent>

                    <TabsContent value="recent" className="outline-none">
                        {renderList(recent, true)}
                    </TabsContent>

                    <TabsContent value="all" className="outline-none">
                        {renderList(all, false)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default ScheduleWidget;
