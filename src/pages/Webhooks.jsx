import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Trash2, Edit, Power, PowerOff, ExternalLink } from 'lucide-react';

export default function Webhooks() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        events: [],
        is_active: true,
        secret: ''
    });

    useEffect(() => {
        fetchWebhooks();
    }, [user]);

    const fetchWebhooks = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // First get user's organizations
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id);

            if (!orgs || orgs.length === 0) {
                setWebhooks([]);
                return;
            }

            const orgIds = orgs.map(o => o.organization_id);
            const { data, error } = await supabase
                .from('webhooks')
                .select('*, organizations(name)')
                .in('organization_id', orgIds)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWebhooks(data || []);
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Get first organization for now (or create one)
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

            const webhookData = {
                organization_id: orgs.organization_id,
                url: formData.url,
                events: formData.events,
                is_active: formData.is_active,
                secret: formData.secret || null
            };

            if (editingWebhook) {
                const { error } = await supabase
                    .from('webhooks')
                    .update(webhookData)
                    .eq('id', editingWebhook.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('webhooks')
                    .insert(webhookData);
                if (error) throw error;
            }

            setShowModal(false);
            setEditingWebhook(null);
            setFormData({ url: '', events: [], is_active: true, secret: '' });
            fetchWebhooks();
        } catch (error) {
            console.error('Error saving webhook:', error);
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;

        try {
            const { error } = await supabase
                .from('webhooks')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchWebhooks();
        } catch (error) {
            console.error('Error deleting webhook:', error);
            alert(error.message);
        }
    };

    const toggleActive = async (webhook) => {
        try {
            const { error } = await supabase
                .from('webhooks')
                .update({ is_active: !webhook.is_active })
                .eq('id', webhook.id);
            if (error) throw error;
            fetchWebhooks();
        } catch (error) {
            console.error('Error toggling webhook:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('webhooks')}</h2>
                    <p className="text-muted-foreground">{t('webhooks_page.subtitle')}</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('webhooks_page.add_webhook')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('webhooks_page.list_title')}</CardTitle>
                    <CardDescription>{t('webhooks_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : webhooks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('webhooks_page.url')}</TableHead>
                                    <TableHead>{t('webhooks_page.events')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {webhooks.map((webhook) => (
                                    <TableRow key={webhook.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                <span className="max-w-xs truncate">{webhook.url}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {(webhook.events || []).slice(0, 2).map((event, i) => (
                                                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                                        {event}
                                                    </span>
                                                ))}
                                                {(webhook.events || []).length > 2 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +{(webhook.events || []).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleActive(webhook)}
                                            >
                                                {webhook.is_active ? (
                                                    <>
                                                        <Power className="h-4 w-4 mr-1 text-green-500" />
                                                        {t('connected')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <PowerOff className="h-4 w-4 mr-1 text-red-500" />
                                                        {t('disconnected')}
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(webhook.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingWebhook(webhook);
                                                        setFormData({
                                                            url: webhook.url,
                                                            events: webhook.events || [],
                                                            is_active: webhook.is_active,
                                                            secret: webhook.secret || ''
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(webhook.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                {editingWebhook ? t('webhooks_page.edit_webhook') : t('webhooks_page.add_webhook')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">{t('webhooks_page.url')}</label>
                                    <Input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com/webhook"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('webhooks_page.secret')}</label>
                                    <Input
                                        type="text"
                                        value={formData.secret}
                                        onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                                        placeholder="Optional webhook secret"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium">
                                        {t('webhooks_page.active')}
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1">
                                        {editingWebhook ? t('common.save') : t('common.add')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingWebhook(null);
                                            setFormData({ url: '', events: [], is_active: true, secret: '' });
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
        </div>
    );
}
