import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { logger } from '../lib/logger';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Play, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function Automation() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchJobs = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // Get user's organizations
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id);

            if (!orgs || orgs.length === 0) {
                setJobs([]);
                return;
            }

            const orgIds = orgs.map(o => o.organization_id);
            const { data, error } = await supabase
                .from('automation_jobs')
                .select('*')
                .in('organization_id', orgIds)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            await logger.error('Error fetching automation jobs', { error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (type) => {
        if (!user) return;

        try {
            // Get first organization
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (!orgs) {
                alert('Please create an organization first');
                return;
            }

            const { error } = await supabase
                .from('automation_jobs')
                .insert({
                    organization_id: orgs.organization_id,
                    type: type,
                    status: 'pending',
                    payload: {}
                });

            if (error) throw error;

            await logger.info('Automation job created', { type, organization_id: orgs.organization_id });
            fetchJobs();
        } catch (error) {
            console.error('Error creating job:', error);
            await logger.error('Error creating automation job', { error: error.message, type });
            alert(error.message);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'processing':
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'sync_contacts': t('automation_page.sync_contacts'),
            'broadcast': t('automation_page.broadcast'),
            'check_status': t('automation_page.check_status')
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('automation')}</h2>
                    <p className="text-muted-foreground">{t('automation_page.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => createJob('sync_contacts')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('automation_page.sync_contacts')}
                    </Button>
                    <Button variant="outline" onClick={() => createJob('check_status')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('automation_page.check_status')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('automation_page.list_title')}</CardTitle>
                    <CardDescription>{t('automation_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('automation_page.job_type')}</TableHead>
                                    <TableHead>{t('automation_page.status')}</TableHead>
                                    <TableHead>{t('automation_page.run_at')}</TableHead>
                                    <TableHead>{t('automation_page.result')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">
                                            {getTypeLabel(job.type)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(job.status)}
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(job.status)}`}>
                                                    {t(`automation_page.${job.status}`)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {job.run_at ? new Date(job.run_at).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {job.result ? (
                                                <details>
                                                    <summary className="text-xs text-muted-foreground cursor-pointer">
                                                        {t('automation_page.result')}
                                                    </summary>
                                                    <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-w-md">
                                                        {JSON.stringify(job.result, null, 2)}
                                                    </pre>
                                                </details>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(job.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
