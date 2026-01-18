import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, AlertTriangle, RefreshCcw, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StatusWidget({ numbers = [], loading = false }) {
    const { t } = useTranslation();

    const disconnectedNumbers = numbers.filter(n => n.status !== 'active' && n.status !== 'connected');
    const hasIssues = disconnectedNumbers.length > 0;
    const isHealthy = !loading && !hasIssues && numbers.length > 0;
    const noNumbers = !loading && numbers.length === 0;

    if (loading) {
        return (
            <Card className="bg-background/60 backdrop-blur-sm border-muted/50">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-48 bg-muted/50 animate-pulse rounded" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (noNumbers) {
        return (
            <Card className="bg-muted/10 border-dashed">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-muted">
                            <RefreshCcw className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                {t('contacts.no_number_hint')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('support_page.getting_started_text')}
                            </p>
                        </div>
                    </div>
                    <Link to="/app/numbers">
                        <Button size="sm" variant="outline">{t('add_number')}</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`transition-all duration-300 ${hasIssues ? 'border-destructive/50 bg-destructive/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${hasIssues ? 'bg-destructive/10' : 'bg-emerald-500/10'}`}>
                            {hasIssues ? (
                                <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
                            ) : (
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                                {t(hasIssues ? 'dashboard.issues_detected' : 'dashboard.system_health')}
                                {isHealthy && (
                                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        {t('dashboard.operational')}
                                    </span>
                                )}
                            </h3>
                            {hasIssues ? (
                                <div className="text-sm text-muted-foreground mt-1">
                                    {disconnectedNumbers.length} number(s) disconnected:
                                    <ul className="mt-1 space-y-1">
                                        {disconnectedNumbers.map(n => (
                                            <li key={n.id} className="text-destructive font-medium flex items-center text-xs">
                                                <WifiOff className="h-3 w-3 mr-1" />
                                                {n.phone_number || n.instance_id}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {numbers.length} {t('numbers')} • {t('dashboard.operational')}
                                </p>
                            )}
                        </div>
                    </div>

                    {hasIssues && (
                        <Link to="/app/numbers">
                            <Button variant="destructive" size="sm" className="shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all">
                                {t('dashboard.reconnect')}
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default StatusWidget;
