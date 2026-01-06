
import { supabase } from '../lib/supabaseClient'

/**
 * Fetch all API keys for the current user
 */
export const getApiKeys = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

    return { data, error }
}

/**
 * Create a new API key
 * Generates a random key, hashes it, and stores the hash.
 * Returns the plaintext key ONLY ONCE.
 */
export const createApiKey = async (name) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // 1. Generate Key (32 bytes of random entropy, hex encoded, prefixed)
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const key = 'sk_live_' + Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0')).join('');

    // 2. Hash Key (SHA-256)
    const msgBuffer = new TextEncoder().encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 3. Store in DB
    const { data: inserted, error } = await supabase
        .from('api_keys')
        .insert([{
            name,
            key_hash: keyHash,
            prefix: key.substring(0, 12) + '...', // Show "sk_live_123..."
            user_id: user.id
        }])
        .select()
        .single()

    if (error) return { error }

    return { data: inserted, plainKey: key }
}

/**
 * Delete an API key
 */
export const deleteApiKey = async (id) => {
    const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

    return { error }
}
