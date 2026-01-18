import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { UserX, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DormantWidget({ clients = [], loading = false }) {
    const { t } = useTranslation();

    if (loading) return null;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <UserX className="h-4 w-4 text-destructive" />
                    {t('analytics.dormant_list')}
                </CardTitle>
                <CardDescription>
                    {t('analytics.dormant_list_desc')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {clients.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t('analytics.no_dormant')}</p>
                    ) : (
                        clients.map((client, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                                <div className="space-y-1 min-w-0 flex-1">
                                    <p className="text-sm font-medium leading-none truncate pr-2">
                                        {client.name || client.remote_jid?.split('@')[0] || t('common.no_data')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t('analytics.last_active')}: {new Date(client.last_message_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link to={`/app/chats?remoteJid=${client.remote_jid}`}>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 group">
                                        {t('analytics.reengage')}
                                        <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default DormantWidget;
