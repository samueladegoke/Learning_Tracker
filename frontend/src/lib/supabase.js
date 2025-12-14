import { createClient } from '@supabase/supabase-js'

// =============================================================================
// Supabase Configuration
// =============================================================================
// In development, create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// In production, these should be set via environment variables in your hosting platform

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lhdpiawslfpngmehafdo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required configuration
if (!supabaseAnonKey) {
  const errorMessage = 'VITE_SUPABASE_ANON_KEY is not configured. Quiz features will not work.\n' +
    'Please set this environment variable in your .env file or hosting platform.'
  
  // In development, log a clear error
  console.error('[Supabase Config Error]', errorMessage)
  
  // In production, we could throw to prevent silent failures
  // For now, we create a placeholder client that will fail gracefully on API calls
}

// Create the Supabase client
// Note: If supabaseAnonKey is undefined, API calls will fail with auth errors
// This is intentional - we want clear failures rather than silent undefined behavior
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey || 'missing-key-placeholder'
)

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)
