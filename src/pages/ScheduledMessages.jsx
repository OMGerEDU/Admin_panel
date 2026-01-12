import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Popover, PopoverTrigger, PopoverContent, DropdownMenuItem } from '../components/ui/popover';
import { fetchCurrentSubscriptionAndPlan, canUseScheduledMessages } from '../lib/planLimits';
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
    MoreVertical,
} from 'lucide-react';

// Status badge component
function StatusBadge({ status, t }) {
    const statusKeys = {
        pending: 'scheduled.status_pending',
        processing: 'scheduled.status_processing',
        sent: 'scheduled.status_sent',
        failed: 'scheduled.status_failed',
        cancelled: 'scheduled.status_cancelled',
    };
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    const statusKey = statusKeys[status] || `scheduled.status_${status}`;
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
            {t(statusKey)}
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
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function ScheduledMessages() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'inactive' | 'community'
    const [messages, setMessages] = useState([]);
    const [communityTemplates, setCommunityTemplates] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedToast, setCopiedToast] = useState(null);
    const [sendNowDialog, setSendNowDialog] = useState(null); // { message: msg, remember: false }
    const [sendingNow, setSendingNow] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        if (user) {
            checkPermissions();
        }
    }, [user]);

    const checkPermissions = async () => {
        const { plan } = await fetchCurrentSubscriptionAndPlan(supabase, user.id);
        const allowed = canUseScheduledMessages(plan);
        setHasPermission(allowed);
        if (allowed) {
            fetchMessages();
            fetchNumbers();
            fetchCommunityTemplates();
        } else {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('scheduled_messages')
                .select('*, numbers(phone_number, instance_id, api_token)')
                .eq('user_id', user.id)
                .order('scheduled_at', { ascending: true });

            if (error) throw error;

            // Fetch recipient counts for each message
            const messagesWithRecipients = await Promise.all(
                (data || []).map(async (msg) => {
                    const { count } = await supabase
                        .from('scheduled_message_recipients')
                        .select('*', { count: 'exact', head: true })
                        .eq('scheduled_message_id', msg.id);

                    return {
                        ...msg,
                        recipient_count: count || (msg.to_phone ? 1 : 0), // Fallback to 1 if old format
                    };
                })
            );

            setMessages(messagesWithRecipients);
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
        navigate('/app/scheduled/new');
    };

    const handleEdit = (msg, e) => {
        if (e) {
            e.stopPropagation();
        }
        navigate(`/app/scheduled/${msg.id}`);
    };

    const handleDelete = async (id, e) => {
        if (e) {
            e.stopPropagation();
        }
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

    const handleToggleActive = async (msg, e) => {
        if (e) {
            e.stopPropagation();
        }
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

            // Fetch template recipients
            const { data: templateRecipients } = await supabase
                .from('scheduled_message_recipients')
                .select('phone_number')
                .eq('scheduled_message_id', template.id);

            const { data, error } = await supabase
                .from('scheduled_messages')
                .insert({
                    user_id: user.id,
                    number_id: numbers[0]?.id || null,
                    to_phone: templateRecipients?.[0]?.phone_number || template.to_phone || '', // Keep for backward compatibility
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

            // Copy recipients if they exist
            if (templateRecipients && templateRecipients.length > 0) {
                const recipientsToInsert = templateRecipients.map(r => ({
                    scheduled_message_id: data.id,
                    phone_number: r.phone_number,
                    status: 'pending',
                }));

                await supabase
                    .from('scheduled_message_recipients')
                    .insert(recipientsToInsert);
            }

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

    // Duplicate a scheduled message
    const handleDuplicate = async (msg, e) => {
        if (e) {
            e.stopPropagation();
        }
        try {
            const scheduledAt = new Date();
            scheduledAt.setHours(9, 0, 0, 0);
            if (scheduledAt < new Date()) {
                scheduledAt.setDate(scheduledAt.getDate() + 1);
            }

            // Fetch message recipients
            const { data: messageRecipients } = await supabase
                .from('scheduled_message_recipients')
                .select('phone_number')
                .eq('scheduled_message_id', msg.id);

            const { data, error } = await supabase
                .from('scheduled_messages')
                .insert({
                    user_id: user.id,
                    number_id: msg.number_id,
                    to_phone: messageRecipients?.[0]?.phone_number || msg.to_phone || '',
                    message: msg.message,
                    scheduled_at: scheduledAt.toISOString(),
                    is_recurring: msg.is_recurring,
                    recurrence_type: msg.recurrence_type,
                    day_of_week: msg.day_of_week,
                    day_of_month: msg.day_of_month,
                    time_of_day: msg.time_of_day,
                    is_active: false,
                    media_url: msg.media_url,
                    media_type: msg.media_type,
                    media_filename: msg.media_filename,
                    is_community_template: false,
                    status: 'pending',
                    delay_seconds: msg.delay_seconds,
                })
                .select()
                .single();

            if (error) throw error;

            // Copy recipients if they exist
            if (messageRecipients && messageRecipients.length > 0) {
                const recipientsToInsert = messageRecipients.map(r => ({
                    scheduled_message_id: data.id,
                    phone_number: r.phone_number,
                    status: 'pending',
                }));

                await supabase
                    .from('scheduled_message_recipients')
                    .insert(recipientsToInsert);
            }

            // Show toast
            setCopiedToast(data.id);
            setTimeout(() => setCopiedToast(null), 5000);

            fetchMessages();
        } catch (err) {
            console.error('Error duplicating message:', err);
            alert(err.message || t('scheduled.duplicate_error') || 'Failed to duplicate message');
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
        return `${cleaned} @c.us`;
    };

    // Send message immediately via Green API
    const sendMessageNow = async (msg) => {
        if (!msg.numbers?.instance_id || !msg.numbers?.api_token) {
            alert(t('scheduled.missing_credentials') || 'Missing number credentials');
            return;
        }

        try {
            setSendingNow(true);

            // Fetch all recipients
            const { data: recipientsData } = await supabase
                .from('scheduled_message_recipients')
                .select('id, phone_number')
                .eq('scheduled_message_id', msg.id)
                .eq('status', 'pending');

            // Fallback to old to_phone if no recipients table entries
            const recipients = recipientsData && recipientsData.length > 0
                ? recipientsData
                : (msg.to_phone ? [{ id: null, phone_number: msg.to_phone }] : []);

            if (recipients.length === 0) {
                alert(t('scheduled.no_recipients') || 'No recipients found');
                return;
            }

            let successCount = 0;
            let failCount = 0;
            const now = new Date().toISOString();

            // Send to all recipients
            for (const recipient of recipients) {
                try {
                    const chatId = normalizePhoneToChatId(recipient.phone_number);
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

                    // Update recipient status if exists in table
                    if (recipient.id) {
                        await supabase
                            .from('scheduled_message_recipients')
                            .update({
                                status: 'sent',
                                sent_at: now,
                                provider_message_id: providerMessageId,
                            })
                            .eq('id', recipient.id);
                    }

                    successCount++;
                } catch (err) {
                    console.error(`Error sending to ${recipient.phone_number}:`, err);
                    failCount++;

                    // Update recipient status if exists in table
                    if (recipient.id) {
                        await supabase
                            .from('scheduled_message_recipients')
                            .update({
                                status: 'failed',
                                error_message: err.message,
                            })
                            .eq('id', recipient.id);
                    }
                }
            }

            // Update scheduled message status
            const allSent = failCount === 0;
            const updateData = {
                status: allSent ? 'sent' : (successCount > 0 ? 'processing' : 'failed'),
                sent_at: allSent ? now : null,
                last_error: failCount > 0 ? `${failCount} recipients failed` : null,
            };

            const { error: updateError } = await supabase
                .from('scheduled_messages')
                .update(updateData)
                .eq('id', msg.id);

            if (updateError) throw updateError;

            // If recurring, reschedule for next occurrence (this will reset status to 'pending')
            if (msg.is_recurring && allSent) {
                const { error: rpcError } = await supabase.rpc('reschedule_recurring_message', {
                    p_message_id: msg.id,
                });
                if (rpcError) {
                    console.error('Error rescheduling recurring message:', rpcError);
                }
            }

            setSendNowDialog(null);
            fetchMessages();

            if (failCount > 0) {
                alert(`${successCount} sent, ${failCount} failed`);
            }
        } catch (err) {
            console.error('Error sending message now:', err);
            alert(err.message || t('scheduled.send_now_error') || 'Failed to send message');
        } finally {
            setSendingNow(false);
        }
    };

    // Handle Send Now button click
    const handleSendNow = (msg, e) => {
        if (e) {
            e.stopPropagation();
        }
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
                    return `${t(`common.days.${DAY_KEYS[msg.day_of_week]}`)} ${time}`;
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
                        {t('scheduled.title')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('scheduled.subtitle')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                        const now = new Date();
                        const pendingDue = messages.filter(m =>
                            m.status === 'pending' &&
                            new Date(m.scheduled_at) <= now &&
                            m.is_active
                        );

                        // Check if we are in local development
                        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                        let msg = `Found ${pendingDue.length} pending messages that seem overdue.\n`;
                        if (pendingDue.length > 0) {
                            msg += `First one due at: ${new Date(pendingDue[0].scheduled_at).toLocaleString()} (Local)\n`;
                            msg += `UTC Time stored: ${pendingDue[0].scheduled_at}\n\n`;
                        }

                        msg += `Diagnosis:\n`;
                        if (pendingDue.length > 0) {
                            if (isLocal) {
                                msg += `⚠️ You are on localhost. The automatic dispatcher (Cron Job) usually runs on the Cloud (Vercel/Supabase). It does NOT trigger your local machine unless you are running a custom script.\n`;
                                msg += `If you are connected to the Production Database, the Cloud Dispatcher should pick this up eventually.\n`;
                            } else {
                                msg += `The Dispatcher might be down or delayed. Check Supabase Cron Logs.\n`;
                            }
                        } else {
                            msg += `No overdue messages found. System seems healthy or no messages are scheduled for now.\n`;
                        }

                        alert(msg);
                    }}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Check Status
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('scheduled.create')}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Play className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_active')}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {messages.filter((m) => m.is_active).length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('inactive')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inactive'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Pause className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_inactive')}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {messages.filter((m) => !m.is_active).length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('community')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'community'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Users className="inline-block mr-1 h-4 w-4" />
                    {t('scheduled.tab_community')}
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {communityTemplates.length}
                    </span>
                </button>
            </div>

            {/* Content */}
            {hasPermission === false ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">{t('scheduled.upgrade_title')}</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {t('scheduled.upgrade_desc')}
                            </p>
                        </div>
                        <Button onClick={() => navigate('/app/plans')} className="mt-4">
                            {t('common.upgrade') || 'Upgrade Now'}
                        </Button>
                    </CardContent>
                </Card>
            ) : loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : activeTab === 'community' ? (
                /* Community Templates */
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {communityTemplates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            {t('scheduled.no_community_templates')}
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
                                ? t('scheduled.no_active')
                                : t('scheduled.no_inactive')}
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <Card
                                key={msg.id}
                                className={`relative cursor-pointer transition-all hover:shadow-md ${!msg.is_active ? 'opacity-60' : ''}`}
                                onClick={() => handleEdit(msg)}
                            >
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
                                                    {msg.recipient_count > 1
                                                        ? `${msg.recipient_count} ${t('scheduled.recipients') || 'recipients'}`
                                                        : msg.to_phone || t('scheduled.no_recipients') || 'No recipients'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Send className="h-3 w-3" />
                                                    {msg.numbers?.phone_number || 'Unknown source'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatSchedule(msg)}
                                                </span>
                                                <span className="text-[10px] bg-muted px-1 rounded font-mono" title="Stored UTC Time">
                                                    UTC: {msg.scheduled_at}
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
                                            {msg.is_active && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleSendNow(msg, e)}
                                                    title={t('scheduled.send_now') || 'Send Now'}
                                                    className="text-green-600 hover:text-green-700 dark:text-green-400"
                                                >
                                                    <Zap className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title={t('common.actions') || 'Actions'}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-44 p-1" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex flex-col">
                                                        <DropdownMenuItem onClick={(e) => handleEdit(msg, e)}>
                                                            <Edit className="h-4 w-4" />
                                                            {t('common.edit') || 'Edit'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => handleDuplicate(msg, e)}>
                                                            <Copy className="h-4 w-4" />
                                                            {t('scheduled.duplicate') || 'Duplicate'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => handleToggleActive(msg, e)}>
                                                            {msg.is_active ? (
                                                                <>
                                                                    <Pause className="h-4 w-4" />
                                                                    {t('scheduled.stop') || 'Stop'}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play className="h-4 w-4" />
                                                                    {t('scheduled.activate') || 'Activate'}
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => handleDelete(msg.id, e)}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            {t('common.delete') || 'Delete'}
                                                        </DropdownMenuItem>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )
            }

            {/* Copied Toast */}
            {
                copiedToast && (
                    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
                        <Check className="h-5 w-5" />
                        <span>{t('scheduled.copied_success') || 'Template copied!'}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-green-700"
                            onClick={() => {
                                const msg = messages.find((m) => m.id === copiedToast);
                                if (msg) {
                                    navigate(`/app/scheduled/${msg.id}`);
                                }
                                setCopiedToast(null);
                            }}
                        >
                            {t('scheduled.go_to_template') || 'Go to Template'}
                        </Button>
                        <button onClick={() => setCopiedToast(null)} className="hover:bg-green-700 p-1 rounded">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            }

            {/* Send Now Confirmation Dialog */}
            {
                sendNowDialog && (
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
                                    {t('scheduled.send_now_message') || 'Are you sure you want to send this message right now?'}
                                    <br />
                                    <span className="font-medium text-foreground">
                                        {sendNowDialog.message.recipient_count > 1
                                            ? `${sendNowDialog.message.recipient_count} ${t('scheduled.recipients') || 'recipients'}`
                                            : `${t('scheduled.recipient') || 'Recipient'}: ${sendNowDialog.message.to_phone || t('scheduled.no_recipients') || 'No recipients'}`}
                                    </span>
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
                )
            }
        </div >
    );
}

