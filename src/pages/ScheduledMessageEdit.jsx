import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    ArrowLeft,
    Loader2,
} from 'lucide-react';

// Days of week for recurring
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduledMessageEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!id && id !== 'new';

    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
            fetchNumbers();
            if (isEditing) {
                fetchMessage();
            } else {
                // Set defaults for new message
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setFormData({
                    ...formData,
                    scheduled_date: tomorrow.toISOString().split('T')[0],
                    scheduled_time: '09:00',
                });
                setLoading(false);
            }
        }
    }, [user, id]);

    const fetchNumbers = async () => {
        try {
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
            if (data && data.length > 0 && !isEditing) {
                setFormData(prev => ({ ...prev, number_id: data[0]?.id || '' }));
            }
        } catch (err) {
            console.error('Error fetching numbers:', err);
        }
    };

    const fetchMessage = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('scheduled_messages')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            if (!data) {
                navigate('/app/scheduled');
                return;
            }

            const scheduledAt = new Date(data.scheduled_at);
            setFormData({
                number_id: data.number_id || '',
                to_phone: data.to_phone || '',
                message: data.message || '',
                is_recurring: data.is_recurring || false,
                recurrence_type: data.recurrence_type || 'daily',
                day_of_week: data.day_of_week || 0,
                scheduled_date: scheduledAt.toISOString().split('T')[0],
                scheduled_time: scheduledAt.toTimeString().slice(0, 5),
                media_url: data.media_url || '',
                media_type: data.media_type || '',
                media_filename: data.media_filename || '',
                is_community_template: data.is_community_template || false,
                template_name: data.template_name || '',
                template_description: data.template_description || '',
            });
        } catch (err) {
            console.error('Error fetching scheduled message:', err);
            navigate('/app/scheduled');
        } finally {
            setLoading(false);
        }
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

            if (isEditing) {
                const { error } = await supabase
                    .from('scheduled_messages')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
            } else {
                payload.status = 'pending';
                const { error } = await supabase
                    .from('scheduled_messages')
                    .insert(payload);
                if (error) throw error;
            }

            navigate('/app/scheduled');
        } catch (err) {
            console.error('Error saving scheduled message:', err);
            alert(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

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
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[150px] resize-y"
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

