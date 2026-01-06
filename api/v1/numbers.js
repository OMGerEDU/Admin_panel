
import { authenticate, supabaseAdmin } from '../_utils/auth.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return // Error already sent

    const { userId } = auth

    // Fetch numbers for this user
    // We strictly filter by user_id to ensure multitenancy safety
    const { data, error } = await supabaseAdmin
        .from('numbers')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    // Return sanitized data
    const sanitized = data.map(n => ({
        id: n.id,
        phone_number: n.phone_number,
        instance_id: n.instance_id,
        status: n.status,
        last_seen: n.last_seen
    }))

    return res.status(200).json({ data: sanitized })
}
