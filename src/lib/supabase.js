import { createClient } from '@supabase/supabase-js'

// Fallback ke URL anon defaults jika env vars tidak ada (untuk development)
const url = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Export error handler untuk deteksi kegagalan init
export const initSupabaseError = () => {
  const errors = []
  if (!import.meta.env.VITE_SUPABASE_URL) errors.push('VITE_SUPABASE_URL missing')
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) errors.push('VITE_SUPABASE_ANON_KEY missing')
  return errors
}
