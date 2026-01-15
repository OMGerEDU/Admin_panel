
import { authenticate, supabaseAdmin } from './_utils/auth.js'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = await authenticate(req, res)
    if (!auth) return // Error already sent

    const { userId } = auth

    // Fetch user profile info
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single()

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
        user_id: userId,
        full_name: data?.full_name,
        email: data?.email,
        timestamp: new Date().toISOString()
    })
}
