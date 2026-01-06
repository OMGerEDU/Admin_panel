
import { authenticate, supabaseAdmin } from '../../_utils/auth.js'

const GREEN_API_BASE = 'https://api.green-api.com'

// Normalize phone number to GreenAPI chatId format
function normalizePhoneToChatId(phone) {
    let cleaned = phone.replace(/[^\d+]/g, '')
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1)
    if (cleaned.startsWith('0')) cleaned = '972' + cleaned.substring(1)
    if (!cleaned.startsWith('972')) cleaned = '972' + cleaned
    return `${cleaned}@c.us`
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return

    const { userId } = auth
    const { number_id, to, message, media_url, media_filename, caption } = req.body

    if (!number_id || !to) {
        return res.status(400).json({ error: 'Missing required fields: number_id, to' })
    }

    if (!message && !media_url) {
        return res.status(400).json({ error: 'Must provide either message or media_url' })
    }

    // 1. Verify ownership of number
    const { data: numberData, error: numberError } = await supabaseAdmin
        .from('numbers')
        .select('id, instance_id, api_token')
        .eq('id', number_id)
        .eq('user_id', userId)
        .single()

    if (numberError || !numberData) {
        return res.status(404).json({ error: 'Number not found or access denied' })
    }

    if (!numberData.instance_id || !numberData.api_token) {
        return res.status(400).json({ error: 'Number is not connected to GreenAPI' })
    }

    try {
        const chatId = normalizePhoneToChatId(to)
        let result = {}

        // 2. Send via GreenAPI
        if (media_url) {
            const url = `${GREEN_API_BASE}/waInstance${numberData.instance_id}/sendFileByUrl/${numberData.api_token}`
            const apiRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    urlFile: media_url,
                    fileName: media_filename || 'file',
                    caption: caption || message || '',
                }),
            })
            if (!apiRes.ok) throw new Error(await apiRes.text())
            result = await apiRes.json()
        } else {
            const url = `${GREEN_API_BASE}/waInstance${numberData.instance_id}/sendMessage/${numberData.api_token}`
            const apiRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, message }),
            })
            if (!apiRes.ok) throw new Error(await apiRes.text())
            result = await apiRes.json()
        }

        // 3. Log to database (Messages table) - Optional but good for history
        // First find or create chat
        let { data: chat } = await supabaseAdmin
            .from('chats')
            .select('id')
            .eq('number_id', number_id)
            .eq('remote_jid', chatId)
            .single()

        if (!chat) {
            const { data: newChat } = await supabaseAdmin
                .from('chats')
                .insert([{ number_id, remote_jid: chatId, name: to }])
                .select('id')
                .single()
            chat = newChat
        }

        if (chat) {
            await supabaseAdmin
                .from('messages')
                .insert([{
                    chat_id: chat.id,
                    content: message || '[Media]',
                    is_from_me: true,
                    media_meta: media_url ? { url: media_url, filename: media_filename } : null
                }])
        }

        return res.status(200).json({
            success: true,
            message_id: result.idMessage,
            chat_id: chatId
        })

    } catch (err) {
        console.error('API Send Error:', err)
        return res.status(500).json({ error: 'Failed to send message: ' + err.message })
    }
}
