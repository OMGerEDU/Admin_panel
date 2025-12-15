import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Search, Plus, MoreHorizontal, RefreshCw } from 'lucide-react';

// Simple Badge component since we don't have it in UI lib yet
function StatusBadge({ status, t }) {
    const styles = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    const statusText = {
        active: t('connected'),
        inactive: t('disconnected'),
        pending: 'Pending'
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
            {statusText[status] || status}
        </span>
    );
}

export default function Numbers() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return t('common.no_data');
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('common.loading');
        if (diffMins < 60) return `${diffMins} ${t('ago')}`;
        if (diffHours < 24) return `${diffHours}h ${t('ago')}`;
        return `${diffDays}d ${t('ago')}`;
    };

    const filteredNumbers = numbers.filter(num =>
        num.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        num.instance_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('numbers_page.title')}</h2>
                    <p className="text-muted-foreground">{t('numbers_page.subtitle')}</p>
                </div>
                <Button onClick={() => {/* TODO: Open add number modal */}}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('add_number')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('numbers_page.list_title')}</CardTitle>
                    <CardDescription>
                        {t('numbers_page.list_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder={t('numbers_page.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('common.instance_id')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.last_seen')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {t('common.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredNumbers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {t('common.no_data')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNumbers.map((number) => (
                                        <TableRow key={number.id}>
                                            <TableCell className="font-medium">
                                                {number.phone_number || number.instance_id || number.id.slice(0, 8)}
                                            </TableCell>
                                            <TableCell>{number.instance_id || '-'}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={number.status || 'pending'} t={t} />
                                            </TableCell>
                                            <TableCell>{formatLastSeen(number.last_seen)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={fetchNumbers}
                                                        title={t('numbers_page.refresh')}
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
