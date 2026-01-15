import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase service configuration for API Auth')
}

// Create a singleton client for the serverless functions
// We use SERVICE_ROLE_KEY because we need to bypass RLS to check the api_keys table
// and then we will manually enforce RLS-like logic or use `auth.uid()` if we could impersonate (harder with Supabase direct).
// Easier approach: We trust the API Key, find the user_id, and then include user_id in all queries.
export const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

export async function authenticate(req, res) {
    const apiKey = req.headers['x-api-key']
    const authHeader = req.headers['authorization']

    // 1. Bearer Token Auth (for Frontend)
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
            res.status(401).json({ error: 'Invalid Session Token' })
            return null
        }
        return { userId: user.id }
    }

    // 2. API Key Auth (for External Tools)
    if (apiKey) {
        const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

        const { data, error } = await supabaseAdmin
            .from('api_keys')
            .select('user_id, last_used_at')
            .eq('key_hash', keyHash)
            .single()

        if (error || !data) {
            res.status(401).json({ error: 'Invalid API Key' })
            return null
        }

        // Update last_used_at (fire and forget)
        supabaseAdmin
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('key_hash', keyHash)
            .then()

        return { userId: data.user_id }
    }

    res.status(401).json({ error: 'Missing x-api-key or Authorization header' })
    return null
}
