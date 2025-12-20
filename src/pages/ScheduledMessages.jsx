import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Plus,
    Calendar,
    Clock,
    Phone,
    MessageSquare,
    Repeat,
    Users,
    Edit,
    Trash2,
    Copy,
    X,
    Image,
    Video,
    Music,
    File,
    Check,
    AlertCircle,
    Loader2,
    Send,
    Pause,
    Play,
    Zap,
} from 'lucide-react';

// Status badge component
function StatusBadge({ status, t }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
            {t(`scheduled.status_${status}`) || status}
        </span>
    );
}

// Media type icon
function MediaIcon({ type }) {
    switch (type) {
        case 'image': return <Image className="h-4 w-4" />;
        case 'video': return <Video className="h-4 w-4" />;
        case 'audio': return <Music className="h-4 w-4" />;
        case 'document': return <File className="h-4 w-4" />;
        default: return null;
    }
}

// Days of week for recurring
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduledMessages() {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'inactive' | 'community'
    const [messages, setMessages] = useState([]);
    const [communityTemplates, setCommunityTemplates] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [copiedToast, setCopiedToast] = useState(null);
    const [sendNowDialog, setSendNowDialog] = useState(null); // { message: msg, remember: false }
    const [sendingNow, setSendingNow] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        number_id: '',
        to_phone: '',
        message: '',
        is_recurring: false,
        recurrence_type: 'daily',
        day_of_week: 0,
        scheduled_date: '',
        scheduled_time: '',
        media_url: '',
        media_type: '',
        media_filename: '',
        is_community_template: false,
        template_name: '',
        template_description: '',
    });

    useEffect(() => {
        if (user) {
            fetchMessages();
            fetchNumbers();
            fetchCommunityTemplates();
        }
    }, [user]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('scheduled_messages')
                .select('*, numbers(phone_number, instance_id, api_token)')
                .eq('user_id', user.id)
                .order('scheduled_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error('Error fetching scheduled messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNumbers = async () => {
        try {
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
        } catch (err) {
            console.error('Error fetching numbers:', err);
        }
    };

    const fetchCommunityTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('scheduled_messages')
                .select('*, profiles(full_name, email)')
                .eq('is_community_template', true)
                .neq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCommunityTemplates(data || []);
        } catch (err) {
            console.error('Error fetching community templates:', err);
        }
    };

    const handleCreate = () => {
        setEditingMessage(null);
        setFormData({
            number_id: numbers[0]?.id || '',
            to_phone: '',
            message: '',
            is_recurring: false,
            recurrence_type: 'daily',
            day_of_week: 0,
            scheduled_date: new Date().toISOString().split('T')[0],
            scheduled_time: '09:00',
            media_url: '',
            media_type: '',
            media_filename: '',
            is_community_template: false,
            template_name: '',
            template_description: '',
        });
        setShowModal(true);
    };

    const handleEdit = (msg) => {
        const scheduledAt = new Date(msg.scheduled_at);
        setEditingMessage(msg);
        setFormData({
            number_id: msg.number_id || '',
            to_phone: msg.to_phone || '',
            message: msg.message || '',
            is_recurring: msg.is_recurring || false,
            recurrence_type: msg.recurrence_type || 'daily',
            day_of_week: msg.day_of_week || 0,
            scheduled_date: scheduledAt.toISOString().split('T')[0],
            scheduled_time: scheduledAt.toTimeString().slice(0, 5),
            media_url: msg.media_url || '',
            media_type: msg.media_type || '',
            media_filename: msg.media_filename || '',
            is_community_template: msg.is_community_template || false,
            template_name: msg.template_name || '',
            template_description: msg.template_description || '',
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user || !formData.number_id || !formData.to_phone || !formData.message) return;

        try {
            setSaving(true);

            // Build scheduled_at from date + time
            const scheduledAt = new Date(`${formData.scheduled_date}T${formData.scheduled_time}:00`);

            const payload = {
                user_id: user.id,
                number_id: formData.number_id,
                to_phone: formData.to_phone,
                message: formData.message,
                scheduled_at: scheduledAt.toISOString(),
                is_recurring: formData.is_recurring,
                recurrence_type: formData.is_recurring ? formData.recurrence_type : null,
                day_of_week: formData.is_recurring && formData.recurrence_type === 'weekly' ? formData.day_of_week : null,
                time_of_day: formData.scheduled_time,
                is_active: true,
                media_url: formData.media_url || null,
                media_type: formData.media_type || null,
                media_filename: formData.media_filename || null,
                is_community_template: formData.is_community_template,
                template_name: formData.is_community_template ? formData.template_name : null,
                template_description: formData.is_community_template ? formData.template_description : null,
            };

            if (editingMessage) {
                const { error } = await supabase
                    .from('scheduled_messages')
                    .update(payload)
                    .eq('id', editingMessage.id);
                if (error) throw error;
            } else {
                payload.status = 'pending';
                const { error } = await supabase
                    .from('scheduled_messages')
                    .insert(payload);
                if (error) throw error;
            }

            setShowModal(false);
            fetchMessages();
            if (formData.is_community_template) {
                fetchCommunityTemplates();
            }
        } catch (err) {
            console.error('Error saving scheduled message:', err);
            alert(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('scheduled.confirm_delete') || 'Are you sure you want to delete this scheduled message?')) return;

        try {
            const { error } = await supabase
                .from('scheduled_messages')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchMessages();
        } catch (err) {
            console.error('Error deleting scheduled message:', err);
        }
    };

    const handleToggleActive = async (msg) => {
        try {
            const { error } = await supabase
                .from('scheduled_messages')
                .update({ is_active: !msg.is_active })
                .eq('id', msg.id);
            if (error) throw error;
            fetchMessages();
        } catch (err) {
            console.error('Error toggling active status:', err);
        }
    };

    const handleCopyTemplate = async (template) => {
        try {
            const scheduledAt = new Date();
            scheduledAt.setHours(9, 0, 0, 0);
            if (scheduledAt < new Date()) {
                scheduledAt.setDate(scheduledAt.getDate() + 1);
            }

            const { data, error } = await supabase
                .from('scheduled_messages')
                .insert({
                    user_id: user.id,
                    number_id: numbers[0]?.id || null,
                    to_phone: '',
                    message: template.message,
                    scheduled_at: scheduledAt.toISOString(),
                    is_recurring: template.is_recurring,
                    recurrence_type: template.recurrence_type,
                    day_of_week: template.day_of_week,
                    time_of_day: template.time_of_day,
                    is_active: false,
                    media_url: template.media_url,
                    media_type: template.media_type,
                    media_filename: template.media_filename,
                    is_community_template: false,
                    copied_from_id: template.id,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;

            // Show toast
            setCopiedToast(data.id);
            setTimeout(() => setCopiedToast(null), 5000);

            fetchMessages();
        } catch (err) {
            console.error('Error copying template:', err);
            alert(err.message || 'Failed to copy template');
        }
    };

    // Normalize phone number to chatId format (like dispatch.ts)
    const normalizePhoneToChatId = (phone) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '972' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('972')) {
            cleaned = '972' + cleaned;
        }
        return `${cleaned}@c.us`;
    };

    // Send message immediately via Green API
    const sendMessageNow = async (msg) => {
        if (!msg.numbers?.instance_id || !msg.numbers?.api_token) {
            alert(t('scheduled.missing_credentials') || 'Missing number credentials');
            return;
        }

        try {
            setSendingNow(true);
            const chatId = normalizePhoneToChatId(msg.to_phone);
            const url = `https://api.green-api.com/waInstance${msg.numbers.instance_id}/sendMessage/${msg.numbers.api_token}`;

            // Send text message
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, message: msg.message }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`GreenAPI error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            const providerMessageId = data.idMessage || null;

            // If there's media, send it too
            if (msg.media_url && msg.media_type) {
                const mediaUrl = `https://api.green-api.com/waInstance${msg.numbers.instance_id}/sendFileByUrl/${msg.numbers.api_token}`;
                await fetch(mediaUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatId,
                        urlFile: msg.media_url,
                        fileName: msg.media_filename || 'file',
                        caption: msg.message,
                    }),
                });
            }

            // Update scheduled message status to 'sent' first
            const updateData = {
                status: 'sent',
                sent_at: new Date().toISOString(),
                provider_message_id: providerMessageId,
                last_error: null,
            };

            const { error: updateError } = await supabase
                .from('scheduled_messages')
                .update(updateData)
                .eq('id', msg.id);

            if (updateError) throw updateError;

            // If recurring, reschedule for next occurrence (this will reset status to 'pending')
            if (msg.is_recurring) {
                const { error: rpcError } = await supabase.rpc('reschedule_recurring_message', {
                    p_message_id: msg.id,
                });
                if (rpcError) {
                    console.error('Error rescheduling recurring message:', rpcError);
                }
            }

            setSendNowDialog(null);
            fetchMessages();
        } catch (err) {
            console.error('Error sending message now:', err);
            alert(err.message || t('scheduled.send_now_error') || 'Failed to send message');
        } finally {
            setSendingNow(false);
        }
    };

    // Handle Send Now button click
    const handleSendNow = (msg) => {
        const rememberPreference = localStorage.getItem('scheduled_send_now_skip_confirm');
        if (rememberPreference === 'true') {
            // Skip confirmation if user chose to remember
            sendMessageNow(msg);
        } else {
            // Show confirmation dialog
            setSendNowDialog({ message: msg, remember: false });
        }
    };

    // Handle confirmation dialog confirm
    const handleConfirmSendNow = () => {
        if (sendNowDialog) {
            if (sendNowDialog.remember) {
                localStorage.setItem('scheduled_send_now_skip_confirm', 'true');
            }
            sendMessageNow(sendNowDialog.message);
        }
    };

    // Filter messages by active tab
    const filteredMessages = messages.filter((msg) => {
        if (activeTab === 'active') return msg.is_active;
        if (activeTab === 'inactive') return !msg.is_active;
        return true;
    });

    const formatSchedule = (msg) => {
        if (msg.is_recurring) {
            const time = msg.time_of_day || new Date(msg.scheduled_at).toTimeString().slice(0, 5);
            switch (msg.recurrence_type) {
                case 'daily':
                    return `${t('scheduled.daily')} ${time}`;
                case 'weekly':
                    return `${DAYS_OF_WEEK[msg.day_of_week]} ${time}`;
                case 'monthly':
                    return `${t('scheduled.monthly')} ${time}`;
                default:
                    return time;
            }
        }
        return new Date(msg.scheduled_at).toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {t('scheduled.title') || 'Scheduled Messages'}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('scheduled.subtitle') || 'Schedule WhatsApp messages to be sent automatically'}
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('scheduled.create') || 'Create New'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'active'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Play className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_active') || 'Active'}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {messages.filter((m) => m.is_active).length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('inactive')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'inactive'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Pause className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_inactive') || 'Inactive'}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {messages.filter((m) => !m.is_active).length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('community')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'community'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Users className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_community') || 'Community Templates'}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {communityTemplates.length}
                    </span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : activeTab === 'community' ? (
                /* Community Templates */
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {communityTemplates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            {t('scheduled.no_community_templates') || 'No community templates yet'}
                        </div>
                    ) : (
                        communityTemplates.map((template) => (
                            <Card key={template.id} className="relative overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {template.template_name || 'Untitled Template'}
                                        {template.media_type && <MediaIcon type={template.media_type} />}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('scheduled.by') || 'by'} {template.profiles?.full_name || template.profiles?.email || 'Anonymous'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {template.template_description && (
                                        <p className="text-sm text-muted-foreground">
                                            {template.template_description}
                                        </p>
                                    )}
                                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                                        <p className="line-clamp-3">{template.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {template.is_recurring && (
                                            <span className="flex items-center gap-1">
                                                <Repeat className="h-3 w-3" />
                                                {template.recurrence_type}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleCopyTemplate(template)}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        {t('scheduled.copy_to_account') || 'Copy to My Account'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                /* Active/Inactive Messages */
                <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            {activeTab === 'active'
                                ? t('scheduled.no_active') || 'No active scheduled messages'
                                : t('scheduled.no_inactive') || 'No inactive scheduled messages'}
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <Card key={msg.id} className={`relative ${!msg.is_active ? 'opacity-60' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            {/* Header row */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <StatusBadge status={msg.status} t={t} />
                                                {msg.is_recurring && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                        <Repeat className="h-3 w-3" />
                                                        {msg.recurrence_type}
                                                    </span>
                                                )}
                                                {msg.media_type && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                        <MediaIcon type={msg.media_type} />
                                                        {msg.media_type}
                                                    </span>
                                                )}
                                                {msg.is_community_template && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                                        <Users className="h-3 w-3" />
                                                        {t('scheduled.shared') || 'Shared'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Message preview */}
                                            <p className="text-sm line-clamp-2">{msg.message}</p>

                                            {/* Details row */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {msg.to_phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Send className="h-3 w-3" />
                                                    {msg.numbers?.phone_number || 'Unknown source'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatSchedule(msg)}
                                                </span>
                                            </div>

                                            {/* Error message if failed */}
                                            {msg.status === 'failed' && msg.last_error && (
                                                <div className="flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">{msg.last_error}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            {msg.status === 'pending' && msg.is_active && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSendNow(msg)}
                                                    title={t('scheduled.send_now') || 'Send Now'}
                                                    className="text-green-600 hover:text-green-700 dark:text-green-400"
                                                >
                                                    <Zap className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleActive(msg)}
                                                title={msg.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                {msg.is_active ? (
                                                    <Pause className="h-4 w-4" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(msg)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(msg.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Copied Toast */}
            {copiedToast && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
                    <Check className="h-5 w-5" />
                    <span>{t('scheduled.copied_success') || 'Template copied!'}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-green-700"
                        onClick={() => {
                            const msg = messages.find((m) => m.id === copiedToast);
                            if (msg) handleEdit(msg);
                            setCopiedToast(null);
                        }}
                    >
                        {t('scheduled.go_to_template') || 'Go to Template'}
                    </Button>
                    <button onClick={() => setCopiedToast(null)} className="hover:bg-green-700 p-1 rounded">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-card border rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                {editingMessage
                                    ? t('scheduled.edit') || 'Edit Scheduled Message'
                                    : t('scheduled.create') || 'Create Scheduled Message'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {/* Source Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('scheduled.source_number') || 'Source Number'} *
                                </label>
                                <select
                                    value={formData.number_id}
                                    onChange={(e) => setFormData({ ...formData, number_id: e.target.value })}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="">{t('scheduled.select_number') || 'Select a number'}</option>
                                    {numbers.map((num) => (
                                        <option key={num.id} value={num.id}>
                                            {num.phone_number}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Recipient Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('scheduled.recipient') || 'Recipient Phone'} *
                                </label>
                                <Input
                                    value={formData.to_phone}
                                    onChange={(e) => setFormData({ ...formData, to_phone: e.target.value })}
                                    placeholder="+972501234567"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('scheduled.message') || 'Message'} *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[100px] resize-y"
                                    placeholder={t('scheduled.message_placeholder') || 'Enter your message...'}
                                    required
                                />
                            </div>

                            {/* Media URL */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('scheduled.media_url') || 'Media URL (optional)'}
                                </label>
                                <Input
                                    value={formData.media_url}
                                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.media_url && (
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.media_type}
                                            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">{t('scheduled.media_type') || 'Media type'}</option>
                                            <option value="image">{t('scheduled.image') || 'Image'}</option>
                                            <option value="video">{t('scheduled.video') || 'Video'}</option>
                                            <option value="audio">{t('scheduled.audio') || 'Audio'}</option>
                                            <option value="document">{t('scheduled.document') || 'Document'}</option>
                                        </select>
                                        <Input
                                            value={formData.media_filename}
                                            onChange={(e) => setFormData({ ...formData, media_filename: e.target.value })}
                                            placeholder={t('scheduled.filename') || 'Filename'}
                                            className="flex-1"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Schedule Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('scheduled.schedule_type') || 'Schedule Type'}
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!formData.is_recurring}
                                            onChange={() => setFormData({ ...formData, is_recurring: false })}
                                            className="text-primary"
                                        />
                                        <span className="text-sm">{t('scheduled.one_time') || 'One-time'}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.is_recurring}
                                            onChange={() => setFormData({ ...formData, is_recurring: true })}
                                            className="text-primary"
                                        />
                                        <span className="text-sm">{t('scheduled.recurring') || 'Recurring'}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Recurrence Options */}
                            {formData.is_recurring && (
                                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                    <select
                                        value={formData.recurrence_type}
                                        onChange={(e) => setFormData({ ...formData, recurrence_type: e.target.value })}
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="daily">{t('scheduled.daily') || 'Daily'}</option>
                                        <option value="weekly">{t('scheduled.weekly') || 'Weekly'}</option>
                                        <option value="monthly">{t('scheduled.monthly') || 'Monthly'}</option>
                                    </select>

                                    {formData.recurrence_type === 'weekly' && (
                                        <select
                                            value={formData.day_of_week}
                                            onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        >
                                            {DAYS_OF_WEEK.map((day, index) => (
                                                <option key={index} value={index}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {formData.is_recurring
                                            ? t('scheduled.start_date') || 'Start Date'
                                            : t('scheduled.date') || 'Date'} *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.scheduled_date}
                                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t('scheduled.time') || 'Time'} *
                                    </label>
                                    <Input
                                        type="time"
                                        value={formData.scheduled_time}
                                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Publish to Community */}
                            <div className="space-y-2 pt-4 border-t">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_community_template}
                                        onChange={(e) => setFormData({ ...formData, is_community_template: e.target.checked })}
                                        className="text-primary"
                                    />
                                    <span className="text-sm font-medium">
                                        {t('scheduled.publish_community') || 'Publish to Community Templates'}
                                    </span>
                                </label>

                                {formData.is_community_template && (
                                    <div className="space-y-2 pl-6">
                                        <Input
                                            value={formData.template_name}
                                            onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                                            placeholder={t('scheduled.template_name') || 'Template name'}
                                        />
                                        <textarea
                                            value={formData.template_description}
                                            onChange={(e) => setFormData({ ...formData, template_description: e.target.value })}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px] resize-y"
                                            placeholder={t('scheduled.template_description') || 'Describe this template...'}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingMessage
                                        ? t('common.save') || 'Save'
                                        : t('scheduled.create') || 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send Now Confirmation Dialog */}
            {sendNowDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-card border rounded-lg shadow-xl w-full max-w-md m-4 animate-in zoom-in-95">
                        <div className="p-6 space-y-4">
                            {/* Cute header */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {t('scheduled.send_now_title') || 'Send Message Now?'}
                                </h3>
                            </div>

                            {/* Message */}
                            <p className="text-sm text-muted-foreground">
                                {t('scheduled.send_now_message') || 
                                `Are you sure you want to send this message to ${sendNowDialog.message.to_phone} right now?`}
                            </p>

                            {/* Message preview */}
                            <div className="bg-muted/50 rounded-lg p-3 text-sm">
                                <p className="line-clamp-3">{sendNowDialog.message.message}</p>
                            </div>

                            {/* Remember option */}
                            <label className="flex items-center gap-2 cursor-pointer pt-2">
                                <input
                                    type="checkbox"
                                    checked={sendNowDialog.remember}
                                    onChange={(e) => setSendNowDialog({ ...sendNowDialog, remember: e.target.checked })}
                                    className="text-primary rounded"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {t('scheduled.remember_option') || 'Remember this option (skip confirmation next time)'}
                                </span>
                            </label>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSendNowDialog(null)}
                                    disabled={sendingNow}
                                >
                                    {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmSendNow}
                                    disabled={sendingNow}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {sendingNow && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('scheduled.send_now_confirm') || 'Send Now'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

