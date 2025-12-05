import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase credentials
// In development, create a .env file with these values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lhdpiawslfpngmehafdo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY not set. Quiz features will not work.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

