import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    ArrowLeft,
    Loader2,
    Plus,
    X,
    Upload,
    Image as ImageIcon,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { fetchCurrentSubscriptionAndPlan, canUseScheduledMessages } from '../lib/planLimits';

// Days of week for recurring
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper function to convert Israel/Jerusalem time to UTC
// Helper function to convert Israel/Jerusalem time to UTC
function convertIsraelTimeToUTC(year, month, day, hour, minute) {
    // Create a date object with the input values and assume it matches Israel time
    // We want to find the UTC timestamp that corresponds to this time in Jerusalem

    // 1. Create a UTC date with the target components (as if it was UTC)
    // We use integer values directly
    const dateComponents = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // 2. Format this UTC date to parts in Jerusalem/Israel timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    });

    const parts = formatter.formatToParts(dateComponents);

    // 3. Extract the components as they appear in Jerusalem time
    const israelYear = parseInt(parts.find(p => p.type === 'year').value);
    const israelMonth = parseInt(parts.find(p => p.type === 'month').value);
    const israelDay = parseInt(parts.find(p => p.type === 'day').value);
    const israelHour = parseInt(parts.find(p => p.type === 'hour').value);
    const israelMinute = parseInt(parts.find(p => p.type === 'minute').value);

    // 4. Calculate the difference (offset) in milliseconds between the UTC representation and how it "looks" in Israel
    // Create a date from the "Israel parts" treating them as UTC to compare apples to apples
    const israelAsUtc = new Date(Date.UTC(israelYear, israelMonth - 1, israelDay, israelHour, israelMinute));

    // The difference is essentially the offset (IsraelTime - OriginalUTC)
    const diff = israelAsUtc.getTime() - dateComponents.getTime();

    // 5. To convert target Israel Time to true UTC, we subtract this offset
    // Target UTC = Target Israel Time (treated as UTC) - Offset
    const targetIsraelAsUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const trueUtcTimestamp = targetIsraelAsUtc.getTime() - diff;

    return new Date(trueUtcTimestamp);
}

export default function ScheduledMessageEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!id && id !== 'new';

    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [currentTime, setCurrentTime] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        number_id: '',
        recipients: [''], // Array of phone numbers
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
        delay_seconds: 0, // Delay between messages in seconds
    });

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadData = async () => {
            try {
                // Fetch numbers
                const { data: numbersData } = await supabase
                    .from('numbers')
                    .select('*')
                    .order('created_at', { ascending: false });

                setNumbers(numbersData || []);

                if (isEditing && id) {
                    // Fetch message
                    const { data: messageData, error } = await supabase
                        .from('scheduled_messages')
                        .select('*')
                        .eq('id', id)
                        .eq('user_id', user.id)
                        .single();

                    if (error) throw error;
                    if (!messageData) {
                        navigate('/app/scheduled');
                        return;
                    }

                    // Fetch recipients
                    const { data: recipientsData } = await supabase
                        .from('scheduled_message_recipients')
                        .select('phone_number')
                        .eq('scheduled_message_id', id)
                        .order('created_at', { ascending: true });

                    const recipients = recipientsData && recipientsData.length > 0
                        ? recipientsData.map(r => r.phone_number)
                        : (messageData.to_phone ? [messageData.to_phone] : ['']); // Fallback to old to_phone for backward compatibility

                    // Check permissions
                    const { plan } = await fetchCurrentSubscriptionAndPlan(supabase, user.id);
                    if (!canUseScheduledMessages(plan)) {
                        alert(t('scheduled.no_permission') || 'You do not have permission to access scheduled messages.');
                        navigate('/app/dashboard');
                        return;
                    }

                    // Convert UTC scheduled_at to Israel/Jerusalem timezone
                    const scheduledAtUTC = new Date(messageData.scheduled_at);
                    // Format in Israel timezone
                    const israelDate = new Intl.DateTimeFormat('en-CA', {
                        timeZone: 'Asia/Jerusalem',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).format(scheduledAtUTC);
                    const israelTime = new Intl.DateTimeFormat('en-GB', {
                        timeZone: 'Asia/Jerusalem',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }).format(scheduledAtUTC);

                    setFormData({
                        number_id: messageData.number_id || '',
                        recipients: recipients,
                        message: messageData.message || '',
                        is_recurring: messageData.is_recurring || false,
                        recurrence_type: messageData.recurrence_type || 'daily',
                        day_of_week: messageData.day_of_week || 0,
                        scheduled_date: israelDate,
                        scheduled_time: israelTime,
                        media_url: messageData.media_url || '',
                        media_type: messageData.media_type || '',
                        media_filename: messageData.media_filename || '',
                        is_community_template: messageData.is_community_template || false,
                        template_name: messageData.template_name || '',
                        template_description: messageData.template_description || '',
                    });
                } else {
                    // Set defaults for new message in Israel/Jerusalem timezone
                    const now = new Date();
                    const tomorrow = new Date(now);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    // Format in Israel timezone
                    const israelDate = new Intl.DateTimeFormat('en-CA', {
                        timeZone: 'Asia/Jerusalem',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).format(tomorrow);

                    setFormData(prev => ({
                        ...prev,
                        scheduled_date: israelDate,
                        scheduled_time: '09:00',
                        number_id: numbersData?.[0]?.id || '',
                    }));

                    // Check permissions for new
                    const { plan } = await fetchCurrentSubscriptionAndPlan(supabase, user.id);
                    if (!canUseScheduledMessages(plan)) {
                        alert(t('scheduled.no_permission') || 'You do not have permission to access scheduled messages.');
                        navigate('/app/dashboard');
                        return;
                    }
                }
            } catch (err) {
                console.error('Error loading data:', err);
                alert('Failed to load data. Redirecting...');
                navigate('/app/scheduled');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user, id, isEditing, navigate]);

    // Update current time display every second
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const israelTime = new Intl.DateTimeFormat('he-IL', {
                timeZone: 'Asia/Jerusalem',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now);
            setCurrentTime(israelTime);
        };

        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to storage bucket
            const bucketName = import.meta.env.VITE_STORAGE_BUCKET || 'GreenBuilders';
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            if (!urlData?.publicUrl) {
                throw new Error('Failed to get public URL');
            }

            // Auto-detect media type
            let mediaType = 'document';
            if (file.type.startsWith('image/')) {
                mediaType = 'image';
            } else if (file.type.startsWith('video/')) {
                mediaType = 'video';
            } else if (file.type.startsWith('audio/')) {
                mediaType = 'audio';
            }

            // Update form data
            setFormData({
                ...formData,
                media_url: urlData.publicUrl,
                media_type: mediaType,
                media_filename: file.name,
            });

            setUploadedFile({
                name: file.name,
                size: file.size,
                type: file.type,
                url: urlData.publicUrl,
            });

            console.log('File uploaded successfully:', {
                fileName,
                publicUrl: urlData.publicUrl,
                mediaType,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Failed to upload file: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFormData({
            ...formData,
            media_url: '',
            media_type: '',
            media_filename: '',
        });
        setUploadedFile(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Filter out empty recipients
        const validRecipients = formData.recipients.filter(r => r.trim() !== '');
        if (!user || !formData.number_id || validRecipients.length === 0 || !formData.message) {
            alert('Please fill in all required fields including at least one recipient');
            return;
        }

        try {
            setSaving(true);

            // Build scheduled_at from date + time in Israel/Jerusalem timezone
            // Convert Israel time to UTC for storage
            const [year, month, day] = formData.scheduled_date.split('-').map(Number);
            const [hour, minute] = formData.scheduled_time.split(':').map(Number);

            // Convert Israel time to UTC
            const scheduledAt = convertIsraelTimeToUTC(year, month, day, hour, minute);

            // Debug logging
            console.log('[SCHEDULE] Converting time:', {
                input: `${formData.scheduled_date} ${formData.scheduled_time} (Israel)`,
                utc: scheduledAt.toISOString(),
                israelCheck: new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Jerusalem',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).format(scheduledAt),
            });

            // Keep to_phone for backward compatibility (use first recipient)
            const payload = {
                user_id: user.id,
                number_id: formData.number_id,
                to_phone: validRecipients[0], // Keep for backward compatibility
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

            // Handle staggering/delay if multiple recipients and delay > 0
            // This splits the single request into multiple scheduled messages
            if (validRecipients.length > 1 && formData.delay_seconds > 0) {
                if (isEditing) {
                    // If editing and switching to staggered, we might need to warn that this will split the message
                    if (!confirm(t('scheduled.confirm_stagger') || 'This will split this message into multiple individual scheduled messages. Continue?')) {
                        setSaving(false);
                        return;
                    }
                    // Delete the original message (it gets replaced by new ones)
                    await supabase.from('scheduled_messages').delete().eq('id', id);
                }

                // Create a message for each recipient with incrementing schedule time
                let savedCount = 0;
                for (let i = 0; i < validRecipients.length; i++) {
                    const recipient = validRecipients[i];
                    const delayMs = i * formData.delay_seconds * 1000;
                    const staggeredTime = new Date(scheduledAt.getTime() + delayMs);

                    // Helper formatting for Israel time (not strictly needed for storage but good for consistency/debug)
                    const staggeredIsraelTime = new Intl.DateTimeFormat('en-GB', {
                        timeZone: 'Asia/Jerusalem',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }).format(staggeredTime);

                    const singlePayload = {
                        ...payload,
                        to_phone: recipient,
                        scheduled_at: staggeredTime.toISOString(),
                        time_of_day: staggeredIsraelTime, // Update visual time
                        status: 'pending'
                    };

                    const { data, error } = await supabase
                        .from('scheduled_messages')
                        .insert(singlePayload)
                        .select('id')
                        .single();

                    if (error) {
                        console.error(`Error saving staggered message for ${recipient}:`, error);
                    } else {
                        // Insert recipient record for this single message
                        await supabase.from('scheduled_message_recipients').insert({
                            scheduled_message_id: data.id,
                            phone_number: recipient,
                            status: 'pending'
                        });
                        savedCount++;
                    }
                }

                // Done
                navigate('/app/scheduled');
                return;
            }

            // Standard save (one message, multiple recipients in table)
            let messageId;
            if (isEditing) {
                const { data, error } = await supabase
                    .from('scheduled_messages')
                    .update(payload)
                    .eq('id', id)
                    .select('id')
                    .single();
                if (error) throw error;
                messageId = data.id;
            } else {
                payload.status = 'pending';
                const { data, error } = await supabase
                    .from('scheduled_messages')
                    .insert(payload)
                    .select('id')
                    .single();
                if (error) throw error;
                messageId = data.id;
            }

            // Save recipients
            // Delete old recipients if editing
            if (isEditing) {
                await supabase
                    .from('scheduled_message_recipients')
                    .delete()
                    .eq('scheduled_message_id', messageId);
            }

            // Insert new recipients
            const recipientsToInsert = validRecipients.map(phone => ({
                scheduled_message_id: messageId,
                phone_number: phone.trim(),
                status: 'pending',
            }));

            if (recipientsToInsert.length > 0) {
                const { error: recipientsError } = await supabase
                    .from('scheduled_message_recipients')
                    .insert(recipientsToInsert);
                if (recipientsError) throw recipientsError;
            }

            navigate('/app/scheduled');
        } catch (err) {
            console.error('Error saving scheduled message:', err);
            alert(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-muted-foreground">Please log in to continue</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/app/scheduled')}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('common.back') || 'Back'}
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing
                        ? t('scheduled.edit') || 'Edit Scheduled Message'
                        : t('scheduled.create') || 'Create Scheduled Message'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isEditing
                        ? t('scheduled.edit_desc') || 'Update your scheduled message details'
                        : t('scheduled.create_desc') || 'Schedule a new WhatsApp message to be sent automatically'}
                </p>
            </div>

            {/* Form */}
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
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

                        {/* Recipients */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('scheduled.recipients') || 'Recipients'} *
                                <span className="text-xs text-muted-foreground ml-2">
                                    ({formData.recipients.filter(r => r.trim() !== '').length} {t('scheduled.recipients_count') || 'recipients'})
                                </span>
                            </label>
                            <div className="space-y-2">
                                {formData.recipients.map((recipient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={recipient}
                                            onChange={(e) => {
                                                const newRecipients = [...formData.recipients];
                                                newRecipients[index] = e.target.value;
                                                setFormData({ ...formData, recipients: newRecipients });
                                            }}
                                            placeholder="+972501234567"
                                            className="flex-1"
                                        />
                                        {formData.recipients.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newRecipients = formData.recipients.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, recipients: newRecipients });
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setFormData({ ...formData, recipients: [...formData.recipients, ''] });
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('scheduled.add_recipient') || 'Add Recipient'}
                                </Button>
                            </div>
                        </div>

                        {/* Staggering / Delay & Spam Warning */}
                        {formData.recipients.filter(r => r.trim()).length > 1 && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        {t('scheduled.delay_seconds') || 'Delay between messages (seconds)'}
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.delay_seconds}
                                        onChange={(e) => setFormData({ ...formData, delay_seconds: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="max-w-[150px]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('scheduled.delay_desc') || 'Adding a delay helps prevent number blocking by spreading out the sending time.'}
                                    </p>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-yellow-800 dark:text-yellow-400">
                                            {t('scheduled.spam_warning_title') || 'Avoid Number Blocking'}
                                        </p>
                                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                                            {t('scheduled.spam_warning_desc') || 'Sending too many messages at once can get your number blocked by WhatsApp. We recommend adding a delay between messages or splitting large lists.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('scheduled.message') || 'Message'} *
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[150px] resize-y"
                                placeholder={t('scheduled.message_placeholder') || 'Enter your message...'}
                                required
                            />
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('scheduled.media_url') || 'Media (optional)'}
                            </label>

                            {!formData.media_url && !uploadedFile ? (
                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="media-upload"
                                        onChange={handleFileUpload}
                                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="media-upload"
                                        className={`flex flex-col items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <span className="text-sm text-muted-foreground">Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    Click to upload or drag and drop
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    Images, Videos, Audio, Documents
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {uploadedFile && (
                                        <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                                            {formData.media_type === 'image' && (
                                                <ImageIcon className="h-5 w-5 text-primary" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(uploadedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

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

                                    <Input
                                        value={formData.media_url}
                                        onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="text-xs"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Or enter a URL manually above
                                    </p>
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
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    שעה נוכחית (ישראל): {currentTime}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        {/* Publish to Community */}
                        <div className="space-y-2 pt-4 border-t">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_community_template}
                                    onChange={(e) => setFormData({ ...formData, is_community_template: e.target.checked })}
                                    className="text-primary rounded"
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
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
                                        placeholder={t('scheduled.template_description') || 'Describe this template...'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate('/app/scheduled')}>
                                {t('common.cancel') || 'Cancel'}
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing
                                    ? t('common.save') || 'Save'
                                    : t('scheduled.create') || 'Create'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
