import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, isSupabaseServiceConfigured } from './env'

// Service-role client: FULL database access, BYPASSES Row Level Security.
// SERVER ONLY — never import this into a Client Component. Used for all order
// writes/reads and product management.
export function createServiceClient() {
  if (!isSupabaseServiceConfigured) {
    throw new Error(
      'Supabase service role is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (see docs/SETUP.md).'
    )
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
