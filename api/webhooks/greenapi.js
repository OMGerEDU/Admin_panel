
import { supabaseAdmin } from '../_utils/auth.js'
import { getProvider } from '../_utils/providers/index.js'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const payload = req.body
        const provider = getProvider('green-api')
        const normalized = provider.normalizeWebhook(payload)
        const instanceId = normalized.instance

        if (!instanceId) {
            // Some events might not have instance ID or be relevant
            return res.status(200).json({ received: true })
        }

        // Find the number associated with this instance
        const { data: numberData } = await supabaseAdmin
            .from('numbers')
            .select('id, user_id')
            .eq('instance_id', instanceId)
            .single()

        if (!numberData) {
            console.warn(`Webhook received for unknown instance: ${instanceId}`)
            return res.status(200).json({ received: true, ignored: 'unknown_instance' })
        }

        // Handle specific events
        if (normalized.event === 'message.received') {
            await handleIncomingMessage(numberData, normalized.data)
        } else if (normalized.event === 'connection.update') {
            await handleConnectionUpdate(numberData, normalized.data)
        }

        return res.status(200).json({ success: true })

    } catch (err) {
        console.error('Webhook Error:', err)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

async function handleIncomingMessage(numberData, messageData) {
    const { remoteJid, fromMe, id, content, media_meta } = messageData

    // Find or create chat
    let { data: chat } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('number_id', numberData.id)
        .eq('remote_jid', remoteJid)
        .single()

    if (!chat) {
        const { data: newChat } = await supabaseAdmin
            .from('chats')
            .insert([{
                number_id: numberData.id,
                remote_jid: remoteJid,
                name: remoteJid.split('@')[0]
            }])
            .select('id')
            .single()
        chat = newChat
    }

    if (chat) {
        await supabaseAdmin
            .from('messages')
            .insert([{
                chat_id: chat.id,
                content: content.text || '[Media]',
                is_from_me: fromMe,
                media_meta: media_meta || null,
                green_message_id: id
            }])
    }
}

async function handleConnectionUpdate(numberData, updateData) {
    const { state } = updateData
    await supabaseAdmin
        .from('numbers')
        .update({
            status: state === 'open' ? 'active' : 'disconnected',
            last_seen: new Date().toISOString()
        })
        .eq('id', numberData.id)
}
