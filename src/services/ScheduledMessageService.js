import { supabase } from '../lib/supabaseClient';

export class ScheduledMessageService {

    /**
     * Copy a community template to the user's account.
     */
    static async copyTemplate(template, user, defaultNumberId) {
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
                number_id: defaultNumberId || null,
                to_phone: templateRecipients?.[0]?.phone_number || template.to_phone || '',
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

        // Copy recipients
        if (templateRecipients && templateRecipients.length > 0) {
            const recipientsToInsert = templateRecipients.map(r => ({
                scheduled_message_id: data.id,
                phone_number: r.phone_number,
                status: 'pending',
            }));

            await supabase.from('scheduled_message_recipients').insert(recipientsToInsert);
        }

        return data;
    }

    /**
     * Duplicate an existing scheduled message.
     */
    static async duplicateMessage(msg, user) {
        const scheduledAt = new Date();
        scheduledAt.setHours(9, 0, 0, 0);
        if (scheduledAt < new Date()) {
            scheduledAt.setDate(scheduledAt.getDate() + 1);
        }

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

        if (messageRecipients && messageRecipients.length > 0) {
            const recipientsToInsert = messageRecipients.map(r => ({
                scheduled_message_id: data.id,
                phone_number: r.phone_number,
                status: 'pending',
            }));

            await supabase.from('scheduled_message_recipients').insert(recipientsToInsert);
        }

        return data;
    }

    /**
     * Trigger immediate send for a scheduled message.
     */
    static async sendNow(msg) {
        if (!msg.numbers?.instance_id || !msg.numbers?.api_token) {
            throw new Error('Missing number credentials');
        }

        const { data: recipientsData } = await supabase
            .from('scheduled_message_recipients')
            .select('id, phone_number')
            .eq('scheduled_message_id', msg.id)
            .eq('status', 'pending');

        const recipients = recipientsData && recipientsData.length > 0
            ? recipientsData
            : (msg.to_phone ? [{ id: null, phone_number: msg.to_phone }] : []);

        if (recipients.length === 0) {
            throw new Error('No recipients found');
        }

        let successCount = 0;
        let failCount = 0;
        const now = new Date().toISOString();

        for (const recipient of recipients) {
            try {
                const chatId = ScheduledMessageService.normalizePhoneToChatId(recipient.phone_number);
                const url = `https://api.green-api.com/waInstance${msg.numbers.instance_id}/sendMessage/${msg.numbers.api_token}`;

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

                if (recipient.id) {
                    await supabase
                        .from('scheduled_message_recipients')
                        .update({ status: 'sent', sent_at: now, provider_message_id: providerMessageId })
                        .eq('id', recipient.id);
                }
                successCount++;
            } catch (err) {
                console.error(`Error sending to ${recipient.phone_number}:`, err);
                failCount++;
                if (recipient.id) {
                    await supabase
                        .from('scheduled_message_recipients')
                        .update({ status: 'failed', error_message: err.message })
                        .eq('id', recipient.id);
                }
            }
        }

        const allSent = failCount === 0;
        await supabase
            .from('scheduled_messages')
            .update({
                status: allSent ? 'sent' : (successCount > 0 ? 'processing' : 'failed'),
                sent_at: allSent ? now : null,
                last_error: failCount > 0 ? `${failCount} recipients failed` : null,
            })
            .eq('id', msg.id);

        if (msg.is_recurring && allSent) {
            await supabase.rpc('reschedule_recurring_message', { p_message_id: msg.id });
        }

        return { successCount, failCount };
    }

    static normalizePhoneToChatId(phone) {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '972' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('972')) {
            cleaned = '972' + cleaned;
        }
        return `${cleaned}@c.us`;
    }
}
