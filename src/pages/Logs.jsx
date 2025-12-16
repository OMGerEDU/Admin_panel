import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, AlertCircle, Info, AlertTriangle, Bug, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Logs() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [selectedTab, setSelectedTab] = useState('all'); // 'all' or number_id
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    useEffect(() => {
        fetchLogs();
    }, [user, levelFilter, selectedTab]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            const { data } = await supabase
                .from('numbers')
                .select('id, phone_number, instance_id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
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
                .limit(200); // Increased limit

            // Filter by level
            if (levelFilter !== 'all') {
                query = query.eq('level', levelFilter);
            }

            // Filter by number (tab selection)
            if (selectedTab !== 'all') {
                query = query.eq('number_id', selectedTab);
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

    const getNumberDisplayName = (number) => {
        return number?.phone_number || number?.instance_id || '-';
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.meta?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            getNumberDisplayName(log.numbers)?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Group logs by number for tab counts
    const logsByNumber = {};
    filteredLogs.forEach(log => {
        const key = log.number_id || 'no-instance';
        if (!logsByNumber[key]) {
            logsByNumber[key] = {
                count: 0,
                name: log.number_id ? getNumberDisplayName(log.numbers) : t('logs_page.system_logs')
            };
        }
        logsByNumber[key].count++;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('logs')}</h2>
                    <p className="text-muted-foreground">{t('logs_page.subtitle')}</p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchLogs}
                    title={t('common.refresh')}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('logs_page.list_title')}</CardTitle>
                    <CardDescription>{t('logs_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Tabs for instances */}
                    <div className="mb-4 border-b border-border">
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setSelectedTab('all')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    selectedTab === 'all'
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                )}
                            >
                                {t('logs_page.all_logs') || 'All Logs'}
                                {logsByNumber['all'] && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                                        {filteredLogs.length}
                                    </span>
                                )}
                            </button>
                            {numbers.map((num) => {
                                const key = num.id;
                                const count = logsByNumber[key]?.count || 0;
                                return (
                                    <button
                                        key={num.id}
                                        onClick={() => setSelectedTab(num.id)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                            selectedTab === num.id
                                                ? "border-primary text-primary"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        )}
                                    >
                                        {getNumberDisplayName(num)}
                                        {count > 0 && (
                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

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
                        {(levelFilter !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLevelFilter('all')}
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
                                        <TableHead className="w-[100px]">{t('logs_page.level')}</TableHead>
                                        <TableHead>{t('logs_page.message')}</TableHead>
                                        <TableHead className="w-[150px]">{t('numbers')}</TableHead>
                                        <TableHead className="w-[180px]">{t('common.date')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getLevelIcon(log.level)}
                                                    <span className={cn("text-xs px-2 py-1 rounded", getLevelBadgeColor(log.level))}>
                                                        {log.level}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="truncate">{log.message}</p>
                                                {log.meta && (
                                                    <details className="mt-1">
                                                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                                            {t('logs_page.metadata')}
                                                        </summary>
                                                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-h-40">
                                                            {JSON.stringify(log.meta, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {log.number_id ? (
                                                        getNumberDisplayName(log.numbers)
                                                    ) : (
                                                        <span className="text-muted-foreground italic">
                                                            {t('logs_page.system') || 'System'}
                                                        </span>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
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
