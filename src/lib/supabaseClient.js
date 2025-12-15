import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only log errors in development, not during build
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables!')
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗')
}

// Create client with fallback - use actual values if available, otherwise use placeholders
// This prevents build errors but will show errors at runtime if env vars are missing
let supabase;
try {
  const hasValidConfig = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder');
  
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        persistSession: hasValidConfig, // Enable persistence only if config is valid
        autoRefreshToken: hasValidConfig,
        detectSessionInUrl: true, // Detect auth callback from email confirmation
      },
    }
  )
} catch (error) {
  console.error('Failed to create Supabase client:', error)
  // Create a minimal mock client to prevent crashes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
    }
  }
}

export { supabase }
