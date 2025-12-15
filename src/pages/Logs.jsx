import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Filter, AlertCircle, Info, AlertTriangle, Bug, X } from 'lucide-react';

export default function Logs() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [numberFilter, setNumberFilter] = useState('all');
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        fetchNumbers();
        fetchLogs();
    }, [user, levelFilter, numberFilter]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            const { data } = await supabase
                .from('numbers')
                .select('id, phone_number, instance_id')
                .eq('user_id', user.id);
            setNumbers(data || []);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };

    const fetchLogs = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            let query = supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(100);

            // Filter by level
            if (levelFilter !== 'all') {
                query = query.eq('level', levelFilter);
            }

            // Filter by number
            if (numberFilter !== 'all') {
                query = query.eq('number_id', numberFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'warn':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'info':
                return <Info className="h-4 w-4 text-blue-500" />;
            case 'debug':
                return <Bug className="h-4 w-4 text-gray-500" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getLevelBadgeColor = (level) => {
        switch (level) {
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'warn':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredLogs = logs.filter(log =>
        log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.meta?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('logs')}</h2>
                    <p className="text-muted-foreground">{t('logs_page.subtitle')}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('logs_page.list_title')}</CardTitle>
                    <CardDescription>{t('logs_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('common.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-3 py-2 rounded-md border bg-background text-sm"
                        >
                            <option value="all">{t('logs_page.all_levels')}</option>
                            <option value="info">{t('logs_page.info')}</option>
                            <option value="warn">{t('logs_page.warn')}</option>
                            <option value="error">{t('logs_page.error')}</option>
                            <option value="debug">{t('logs_page.debug')}</option>
                        </select>
                        <select
                            value={numberFilter}
                            onChange={(e) => setNumberFilter(e.target.value)}
                            className="px-3 py-2 rounded-md border bg-background text-sm"
                        >
                            <option value="all">{t('numbers')}</option>
                            {numbers.map((num) => (
                                <option key={num.id} value={num.id}>
                                    {num.phone_number || num.instance_id || num.id.slice(0, 8)}
                                </option>
                            ))}
                        </select>
                        {(levelFilter !== 'all' || numberFilter !== 'all') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setLevelFilter('all');
                                    setNumberFilter('all');
                                }}
                            >
                                <X className="h-4 w-4 mr-2" />
                                {t('common.filter')}
                            </Button>
                        )}
                    </div>

                    {/* Logs Table */}
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('logs_page.level')}</TableHead>
                                        <TableHead>{t('logs_page.message')}</TableHead>
                                        <TableHead>{t('numbers')}</TableHead>
                                        <TableHead>{t('common.date')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getLevelIcon(log.level)}
                                                    <span className={`text-xs px-2 py-1 rounded ${getLevelBadgeColor(log.level)}`}>
                                                        {log.level}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="truncate">{log.message}</p>
                                                {log.meta && (
                                                    <details className="mt-1">
                                                        <summary className="text-xs text-muted-foreground cursor-pointer">
                                                            {t('logs_page.metadata')}
                                                        </summary>
                                                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                                                            {JSON.stringify(log.meta, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {log.numbers ? (
                                                    log.numbers.phone_number || log.numbers.instance_id || '-'
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
