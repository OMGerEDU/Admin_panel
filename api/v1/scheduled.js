
import { authenticate, supabaseAdmin } from '../_utils/auth.js'

export default async function handler(req, res) {
    const auth = await authenticate(req, res)
    if (!auth) return

    const { userId } = auth

    // GET: List scheduled messages
    if (req.method === 'GET') {
        const { limit = 20, status } = req.query

        // We need to join with numbers to filter by owner
        // numbers!inner(user_id) ensures we only get messages for numbers owned by this user
        let query = supabaseAdmin
            .from('scheduled_messages')
            .select(`
                *,
                numbers!inner(user_id, phone_number)
            `)
            .eq('numbers.user_id', userId)
            .order('scheduled_at', { ascending: true })
            .limit(Math.min(parseInt(limit), 100))

        if (status) {
            query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({ data })
    }

    // POST: Create scheduled message
    if (req.method === 'POST') {
        const {
            number_id,
            to,
            message,
            media_url,
            scheduled_at,
            is_recurring,
            cron_expression
        } = req.body

        if (!number_id || !to || !scheduled_at) {
            return res.status(400).json({ error: 'Missing required fields: number_id, to, scheduled_at' })
        }

        if (!message && !media_url) {
            return res.status(400).json({ error: 'Must provide either message or media_url' })
        }

        // Verify number ownership
        const { data: numberData } = await supabaseAdmin
            .from('numbers')
            .select('id')
            .eq('id', number_id)
            .eq('user_id', userId)
            .single()

        if (!numberData) {
            return res.status(403).json({ error: 'Access denied to this number' })
        }

        const { data, error } = await supabaseAdmin
            .from('scheduled_messages')
            .insert([{
                number_id,
                to_phone: to, // Maps 'to' in API to 'to_phone' in DB
                message,
                media_url,
                scheduled_at,
                is_recurring: !!is_recurring,
                cron_expression: cron_expression || null,
                status: 'pending'
            }])
            .select()
            .single()

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        return res.status(201).json({ success: true, data })
    }

    // DELETE: Cancel scheduled message
    if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'Missing id param' })

        // Verify ownership via number
        const { data: msg } = await supabaseAdmin
            .from('scheduled_messages')
            .select(`
                id,
                numbers!inner(user_id)
            `)
            .eq('id', id)
            .single()

        if (!msg || msg.numbers.user_id !== userId) {
            return res.status(404).json({ error: 'Not found or access denied' })
        }

        const { error } = await supabaseAdmin
            .from('scheduled_messages')
            .delete()
            .eq('id', id)

        if (error) return res.status(500).json({ error: error.message })

        return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
}
