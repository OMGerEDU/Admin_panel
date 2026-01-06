
import { authenticate, supabaseAdmin } from '../../_utils/auth.js'

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', 'DELETE')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return

    const { userId } = auth
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ error: 'Missing message ID' })
    }

    // Check ownership via Chat -> Number -> User
    // Difficult to do in one query without join syntax returning data, so we try to delete
    // where the chat's number belongs to user.
    // Actually, simpler: fetch the message with inner join to chats->numbers

    const { data: msg, error: fetchError } = await supabaseAdmin
        .from('messages')
        .select(`
            id,
            chats!inner (
                numbers!inner (
                    user_id
                )
            )
        `)
        .eq('id', id)
        .single()

    if (fetchError || !msg) {
        return res.status(404).json({ error: 'Message not found or access denied' })
    }

    if (msg.chats.numbers.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' })
    }

    // Perform Delete
    const { error: deleteError } = await supabaseAdmin
        .from('messages')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return res.status(500).json({ error: deleteError.message })
    }

    return res.status(200).json({ success: true, id })
}
