import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function AccountsManagement() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, [user]);

    const fetchAccounts = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // Fetch numbers which represent Green-API accounts
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAccounts(data || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountId) => {
        if (!confirm(t('common.confirm_delete'))) return;

        try {
            const { error } = await supabase
                .from('numbers')
                .delete()
                .eq('id', accountId);

            if (error) throw error;
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('accounts_management.title')}</h2>
                    <p className="text-muted-foreground">{t('accounts_management.subtitle')}</p>
                </div>
                <Button onClick={fetchAccounts} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('common.refresh')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('accounts_management.list_title')}</CardTitle>
                    <CardDescription>{t('accounts_management.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('numbers_page.phone_number')}</TableHead>
                                    <TableHead>{t('common.instance_id')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="font-medium">
                                            {account.phone_number || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {account.instance_id || '-'}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            {account.status === 'active' ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">{t('connected')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-sm">{t('disconnected')}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(account.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(account.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
