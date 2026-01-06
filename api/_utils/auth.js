
import { createClient } from '@supabase/supabase-js'

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
    if (!apiKey) {
        res.status(401).json({ error: 'Missing x-api-key header' })
        return null
    }

    // 1. Hash the incoming key to compare with stored hash
    const msgBuffer = new TextEncoder().encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 2. Lookup in DB
    const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('user_id, last_used_at')
        .eq('key_hash', keyHash)
        .single()

    if (error || !data) {
        res.status(401).json({ error: 'Invalid API Key' })
        return null
    }

    // 3. Update last_used_at (fire and forget, don't await/block)
    supabaseAdmin
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key_hash', keyHash)
        .then()

    return { userId: data.user_id }
}
