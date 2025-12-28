import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getNumbersUsage, getInstancesUsage } from '../lib/planLimits';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Search, Plus, MoreHorizontal, RefreshCw, X, Edit, Trash2, HelpCircle } from 'lucide-react';
import { logger } from '../lib/logger';
import GreenApiHelpModal from '../components/GreenApiHelpModal';

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
    const [showModal, setShowModal] = useState(false);
    const [editingNumber, setEditingNumber] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        phone_number: '',
        instance_id: '',
        api_token: '',
        status: 'active'
    });
    const [saving, setSaving] = useState(false);
    const [numbersUsage, setNumbersUsage] = useState({
        used: 0,
        limit: -1,
        planName: null,
    });
    const [instancesUsage, setInstancesUsage] = useState({
        used: 0,
        limit: -1,
    });

    useEffect(() => {
        fetchNumbers();
        fetchNumbersUsage();
    }, [user]);

    const fetchNumbers = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Check if user is a member of an organization
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('organization_id, organizations(owner_id)')
                .eq('user_id', user.id)
                .maybeSingle();

            const ownerId = memberData?.organizations?.owner_id;
            const userIds = [user.id];
            if (ownerId && ownerId !== user.id) {
                userIds.push(ownerId);
            }

            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .in('user_id', userIds)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNumbersUsage = async () => {
        if (!user) return;

        try {
            const { used, limit, plan, error } = await getNumbersUsage(
                supabase,
                user.id,
            );

            if (error) {
                console.error('Error loading numbers usage:', error);
            }

            setNumbersUsage({
                used: used || 0,
                limit: typeof limit === 'number' ? limit : -1,
                planName: plan?.name || null,
            });

            // Instances usage is redundant/same as numbers for now
            setInstancesUsage({ used: 0, limit: -1 });

        } catch (err) {
            console.error('Error in fetchNumbersUsage:', err);
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

    const handleAddNumber = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Enforce plan limit for creating new numbers (editing is always allowed)
        if (!editingNumber) {
            // Enforce numbers per plan
            if (numbersUsage.limit !== -1 && numbersUsage.used >= numbersUsage.limit) {
                alert(t('plans_limits.numbers_reached'));
                return;
            }
            // "Instances" check removed/merged into numbers check
        }

        // Validation
        const instanceId = formData.instance_id.trim();
        const apiToken = formData.api_token.trim();

        if (instanceId.length !== 10 || !/^\d+$/.test(instanceId)) {
            alert(t('validation.instance_id_format') || 'Instance ID must be exactly 10 digits.');
            return;
        }

        if (apiToken.length !== 50) {
            alert(t('validation.api_token_format') || 'API Token must be exactly 50 characters.');
            return;
        }

        try {
            setSaving(true);
            if (editingNumber) {
                // Update existing number
                const { error } = await supabase
                    .from('numbers')
                    .update({
                        phone_number: formData.phone_number,
                        instance_id: formData.instance_id,
                        api_token: formData.api_token,
                        status: formData.status
                    })
                    .eq('id', editingNumber.id);

                if (error) throw error;

                await logger.info(
                    `Number updated: ${formData.phone_number || formData.instance_id}`,
                    { number_id: editingNumber.id },
                    editingNumber.id
                );
            } else {
                // Insert new number
                const { error } = await supabase
                    .from('numbers')
                    .insert({
                        user_id: user.id,
                        phone_number: formData.phone_number,
                        instance_id: formData.instance_id,
                        api_token: formData.api_token,
                        status: formData.status
                    });

                if (error) throw error;

                await logger.info(
                    `New number added: ${formData.phone_number || formData.instance_id}`,
                    { instance_id: formData.instance_id }
                );
            }

            setShowModal(false);
            setEditingNumber(null);
            setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
            fetchNumbers();
            fetchNumbersUsage();
        } catch (error) {
            console.error('Error saving number:', error);
            await logger.error('Failed to save number', { error: error.message });
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEditNumber = (number) => {
        setEditingNumber(number);
        setFormData({
            phone_number: number.phone_number || '',
            instance_id: number.instance_id || '',
            api_token: number.api_token || '', // Note: In production, you might want to mask this
            status: number.status || 'active'
        });
        setShowModal(true);
    };

    const handleOpenAddModal = () => {
        if (!user) return;

        if (numbersUsage.limit !== -1 && numbersUsage.used >= numbersUsage.limit) {
            alert(t('plans_limits.numbers_reached'));
            return;
        }

        setShowModal(true);
    };

    const handleDeleteNumber = async (numberId) => {
        if (!confirm(t('common.confirm_delete'))) return;

        try {
            const { error } = await supabase
                .from('numbers')
                .delete()
                .eq('id', numberId);

            if (error) throw error;

            await logger.warn('Number deleted', { number_id: numberId }, numberId);
            setShowDeleteConfirm(null);
            fetchNumbers();
            fetchNumbersUsage();
        } catch (error) {
            console.error('Error deleting number:', error);
            await logger.error('Failed to delete number', { error: error.message }, numberId);
            alert(error.message);
        }
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
                    <p className="text-xs text-muted-foreground mt-1">
                        {numbersUsage.limit === -1
                            ? `${numbersUsage.used} ${t('numbers_page.numbers_in_use_unlimited')}`
                            : `${numbersUsage.used} / ${numbersUsage.limit} ${t('numbers_page.numbers_in_use')}`}
                        {numbersUsage.planName
                            ? ` · ${numbersUsage.planName} ${t('landing.plans.features')}`
                            : ''}
                    </p>
                </div>
                <Button onClick={handleOpenAddModal}>
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditNumber(number)}
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setShowDeleteConfirm(number.id)}
                                                        title={t('common.delete')}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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

            {/* Add/Edit Number Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{editingNumber ? t('common.edit') : t('add_number')}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingNumber(null);
                                        setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddNumber} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">{t('numbers_page.phone_number')}</label>
                                    <Input
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="+1234567890"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">{t('common.instance_id')}</label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                                            onClick={() => setShowHelpModal(true)}
                                        >
                                            <HelpCircle className="mr-1 h-3 w-3" />
                                            {t('common.where_to_find') || 'Where to find?'}
                                        </Button>
                                    </div>
                                    <Input
                                        value={formData.instance_id}
                                        onChange={(e) => setFormData({ ...formData, instance_id: e.target.value })}
                                        placeholder="10 digits (e.g. 7107372601)"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">API Token</label>
                                    <Input
                                        type="password"
                                        value={formData.api_token}
                                        onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                        placeholder="Green-API token"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('status')}</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                                    >
                                        <option value="active">{t('connected')}</option>
                                        <option value="inactive">{t('disconnected')}</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={saving}>
                                        {saving ? t('common.loading') : t('common.add')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingNumber(null);
                                            setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>{t('common.delete')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{t('common.confirm_delete')}</p>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(null)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteNumber(showDeleteConfirm)}
                                >
                                    {t('common.delete')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
