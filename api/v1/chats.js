
import { authenticate, supabaseAdmin } from '../../_utils/auth.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return

    const { userId } = auth
    const { number_id, limit = 20 } = req.query

    let query = supabaseAdmin
        .from('chats')
        .select(`
            id,
            name,
            remote_jid,
            last_message,
            last_message_at,
            number_id,
            numbers!inner(user_id)
        `)
        .eq('numbers.user_id', userId)
        .order('last_message_at', { ascending: false })
        .limit(Math.min(parseInt(limit), 100))

    if (number_id) {
        query = query.eq('number_id', number_id)
    }

    const { data, error } = await query

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    // Sanitize and flatten
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
