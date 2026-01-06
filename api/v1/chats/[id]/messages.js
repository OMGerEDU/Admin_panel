
import { authenticate, supabaseAdmin } from '../../../_utils/auth.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return

    const { userId } = auth
    const { id, limit = 50, before } = req.query

    if (!id) {
        return res.status(400).json({ error: 'Chat ID is required' })
    }

    // Verify ownership indirectly
    // We check if the chat exists and belongs to a number owned by the user
    const { data: chat, error: chatError } = await supabaseAdmin
        .from('chats')
        .select(`
            id,
            numbers!inner(user_id)
        `)
        .eq('id', id)
        .eq('numbers.user_id', userId)
        .single()

    if (chatError || !chat) {
        return res.status(404).json({ error: 'Chat not found or access denied' })
    }

    let query = supabaseAdmin
        .from('messages')
        .select(`
            id,
            content,
            is_from_me,
            timestamp,
            media_meta
        `)
        .eq('chat_id', id)
        .order('timestamp', { ascending: false })
        .limit(Math.min(parseInt(limit), 100))

    if (before) {
        query = query.lt('timestamp', before)
    }

    const { data: messages, error: messagesError } = await query

    if (messagesError) {
        return res.status(500).json({ error: messagesError.message })
    }

    return res.status(200).json({
        data: messages.map(m => ({
            id: m.id,
            content: m.content,
            is_from_me: m.is_from_me,
            timestamp: m.timestamp,
            media_meta: m.media_meta
        }))
    })
}
