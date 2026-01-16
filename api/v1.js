
import { authenticate, supabaseAdmin } from './_utils/auth.js'
import { getProviderByName } from './_utils/providers/index.js'

const GREEN_API_BASE = 'https://api.green-api.com'

// Helper: Normalize phone number to GreenAPI chatId format
function normalizePhoneToChatId(phone) {
    let cleaned = phone.replace(/[^\d+]/g, '')
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1)
    if (cleaned.startsWith('0')) cleaned = '972' + cleaned.substring(1)
    if (!cleaned.startsWith('972')) cleaned = '972' + cleaned
    return `${cleaned}@c.us`
}

export default async function handler(req, res) {
    // 1. Authenticate
    const auth = await authenticate(req, res)
    if (!auth) return // Error already sent

    const { userId } = auth
    const route = req.query.route || ''
    const method = req.method

    try {
        // --- ROUTING ---

        // GET /api/v1/whoami or /api/whoami
        if (route === 'whoami' && method === 'GET') {
            const { data, error } = await supabaseAdmin
                .from('profiles')
                .select('full_name, email')
                .eq('id', userId)
                .single()
            if (error) return res.status(500).json({ error: error.message })
            return res.status(200).json({
                user_id: userId,
                full_name: data?.full_name,
                email: data?.email,
                timestamp: new Date().toISOString()
            })
        }

        // GET /api/v1/numbers
        if (route === 'numbers' && method === 'GET') {
            const { data, error } = await supabaseAdmin
                .from('numbers')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
            if (error) return res.status(500).json({ error: error.message })
            const sanitized = data.map(n => ({
                id: n.id,
                phone_number: n.phone_number,
                instance_id: n.instance_id,
                status: n.status,
                last_seen: n.last_seen
            }))
            return res.status(200).json({ data: sanitized })
        }

        // POST /api/v1/numbers/configure
        if (route === 'numbers/configure' && method === 'POST') {
            const { number_id, use_platform_webhook } = req.body

            if (!number_id) return res.status(400).json({ error: 'Missing number_id' })

            // Get number details
            const { data: numberData, error: dbError } = await supabaseAdmin
                .from('numbers')
                .select('id, instance_id, api_token, user_id')
                .eq('id', number_id)
                .eq('user_id', userId)
                .single()

            if (dbError || !numberData) {
                return res.status(404).json({ error: 'Number not found or access denied' })
            }

            const provider = getProviderByName('green-api')

            // Construct settings
            const settings = {
                delaySendMessagesMilliseconds: 5000,
                markIncomingMessagesReaded: "no",
                outgoingWebhook: "yes",
                outgoingMessageWebhook: "yes",
                outgoingAPIMessageWebhook: "yes",
                stateWebhook: "yes",
                incomingWebhook: "yes",
                deviceWebhook: "yes",
                pollMessageWebhook: "yes" // As requested for reliability
            }

            if (use_platform_webhook) {
                const protocol = req.headers['x-forwarded-proto'] || 'http'
                const host = req.headers['host']
                const hookUrl = `${protocol}://${host}/api/webhooks/greenapi`
                settings.webhookUrl = hookUrl
            }

            try {
                await provider.setSettings(numberData.instance_id, numberData.api_token, settings)
                return res.status(200).json({ success: true, settings_applied: true })
            } catch (err) {
                console.error('Settings config failed:', err)
                return res.status(502).json({ error: 'Failed to configure Green API: ' + err.message })
            }
        }

        // GET /api/v1/chats
        if (route === 'chats' && method === 'GET') {
            const { number_id, limit = 20 } = req.query
            let query = supabaseAdmin
                .from('chats')
                .select(`id, name, remote_jid, last_message, last_message_at, number_id, numbers!inner(user_id)`)
                .eq('numbers.user_id', userId)
                .order('last_message_at', { ascending: false })
                .limit(Math.min(parseInt(limit), 100))
            if (number_id) query = query.eq('number_id', number_id)
            const { data, error } = await query
            if (error) return res.status(500).json({ error: error.message })
            const sanitized = data.map(c => ({
                id: c.id,
                number_id: c.number_id,
                remote_jid: c.remote_jid,
                name: c.name,
                last_message: c.last_message,
                last_message_at: c.last_message_at
            }))
            return res.status(200).json({ data: sanitized })
        }

        // GET /api/v1/chats/:id/messages
        const chatMessagesMatch = route.match(/^chats\/([^\/]+)\/messages$/)
        if (chatMessagesMatch && method === 'GET') {
            const chatId = chatMessagesMatch[1]
            const { limit = 50, before } = req.query
            const { data: chat, error: chatError } = await supabaseAdmin
                .from('chats')
                .select(`id, numbers!inner(user_id)`)
                .eq('id', chatId)
                .eq('numbers.user_id', userId)
                .single()
            if (chatError || !chat) return res.status(404).json({ error: 'Chat not found or access denied' })
            let query = supabaseAdmin
                .from('messages')
                .select(`id, content, is_from_me, timestamp, media_meta`)
                .eq('chat_id', chatId)
                .order('timestamp', { ascending: false })
                .limit(Math.min(parseInt(limit), 100))
            if (before) query = query.lt('timestamp', before)
            const { data: messages, error: messagesError } = await query
            if (messagesError) return res.status(500).json({ error: messagesError.message })
            return res.status(200).json({ data: messages })
        }

        // POST /api/v1/messages/send
        if (route === 'messages/send' && method === 'POST') {
            const { number_id, to, message, media_url, media_filename, caption } = req.body
            if (!number_id || !to) return res.status(400).json({ error: 'Missing required fields: number_id, to' })
            const { data: numberData, error: numberError } = await supabaseAdmin
                .from('numbers')
                .select('id, instance_id, api_token')
                .eq('id', number_id)
                .eq('user_id', userId)
                .single()
            if (numberError || !numberData) return res.status(404).json({ error: 'Number not found or access denied' })
            const remoteChatId = normalizePhoneToChatId(to)
            let result = {}
            if (media_url) {
                const url = `${GREEN_API_BASE}/waInstance${numberData.instance_id}/sendFileByUrl/${numberData.api_token}`
                const apiRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: remoteChatId, urlFile: media_url, fileName: media_filename || 'file', caption: caption || message || '' }),
                })
                if (!apiRes.ok) throw new Error(await apiRes.text())
                result = await apiRes.json()
            } else {
                const url = `${GREEN_API_BASE}/waInstance${numberData.instance_id}/sendMessage/${numberData.api_token}`
                const apiRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: remoteChatId, message }),
                })
                if (!apiRes.ok) throw new Error(await apiRes.text())
                result = await apiRes.json()
            }
            // Log to DB
            let { data: chat } = await supabaseAdmin.from('chats').select('id').eq('number_id', number_id).eq('remote_jid', remoteChatId).single()
            if (!chat) {
                const { data: newChat } = await supabaseAdmin.from('chats').insert([{ number_id, remote_jid: remoteChatId, name: to }]).select('id').single()
                chat = newChat
            }
            if (chat) await supabaseAdmin.from('messages').insert([{ chat_id: chat.id, content: message || '[Media]', is_from_me: true, media_meta: media_url ? { url: media_url, filename: media_filename } : null }])
            return res.status(200).json({ success: true, message_id: result.idMessage, chat_id: remoteChatId })
        }

        // DELETE /api/v1/messages/:id
        const messageMatch = route.match(/^messages\/([^\/]+)$/)
        if (messageMatch && method === 'DELETE') {
            const messageId = messageMatch[1]
            const { data: msg, error: fetchError } = await supabaseAdmin
                .from('messages')
                .select(`id, chats!inner (numbers!inner (user_id))`)
                .eq('id', messageId)
                .single()
            if (fetchError || !msg || msg.chats.numbers.user_id !== userId) return res.status(404).json({ error: 'Message not found or access denied' })
            const { error: deleteError } = await supabaseAdmin.from('messages').delete().eq('id', messageId)
            if (deleteError) return res.status(500).json({ error: deleteError.message })
            return res.status(200).json({ success: true, id: messageId })
        }

        // --- SCHEDULED MESSAGES ---

        // GET /api/v1/scheduled
        if (route === 'scheduled' && method === 'GET') {
            const { limit = 20, status } = req.query
            let query = supabaseAdmin
                .from('scheduled_messages')
                .select(`*, numbers!inner(user_id, phone_number)`)
                .eq('numbers.user_id', userId)
                .order('scheduled_at', { ascending: true })
                .limit(Math.min(parseInt(limit), 100))
            if (status) query = query.eq('status', status)
            const { data, error } = await query
            if (error) return res.status(500).json({ error: error.message })
            return res.status(200).json({ data })
        }

        // POST /api/v1/scheduled
        if (route === 'scheduled' && method === 'POST') {
            const { number_id, to, message, media_url, scheduled_at, is_recurring, cron_expression } = req.body
            if (!number_id || !to || !scheduled_at) return res.status(400).json({ error: 'Missing required fields: number_id, to, scheduled_at' })
            const { data: numberData } = await supabaseAdmin.from('numbers').select('id').eq('id', number_id).eq('user_id', userId).single()
            if (!numberData) return res.status(403).json({ error: 'Access denied to this number' })
            const { data, error } = await supabaseAdmin.from('scheduled_messages').insert([{ number_id, to_phone: to, message, media_url, scheduled_at, is_recurring: !!is_recurring, cron_expression: cron_expression || null, status: 'pending' }]).select().single()
            if (error) return res.status(500).json({ error: error.message })
            return res.status(201).json({ success: true, data })
        }

        // DELETE /api/v1/scheduled
        if (route === 'scheduled' && method === 'DELETE') {
            const { id } = req.query
            if (!id) return res.status(400).json({ error: 'Missing id param' })
            const { data: msg } = await supabaseAdmin.from('scheduled_messages').select(`id, numbers!inner(user_id)`).eq('id', id).single()
            if (!msg || msg.numbers.user_id !== userId) return res.status(404).json({ error: 'Not found or access denied' })
            const { error } = await supabaseAdmin.from('scheduled_messages').delete().eq('id', id)
            if (error) return res.status(500).json({ error: error.message })
            return res.status(200).json({ success: true })
        }

        // DEFAULT: v1 index
        if (route === 'index' || route === '' || route === '/') {
            return res.status(200).json({
                status: 'ok',
                version: 'v1 (consolidated)',
                endpoints: ['/whoami', '/numbers', '/chats', '/chats/:id/messages', '/messages/send', '/scheduled'],
                timestamp: new Date().toISOString()
            })
        }

        return res.status(404).json({ error: 'API Endpoint not found' })

    } catch (err) {
        console.error('Consolidated API Error:', err)
        return res.status(500).json({ error: 'Internal Server Error: ' + err.message })
    }
}
