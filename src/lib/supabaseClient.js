import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only log errors in development, not during build
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables!')
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗')
}

// Create client with fallback empty strings to prevent build errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
