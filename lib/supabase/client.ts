'use client'
import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

// Browser Supabase client (anon key). Use in Client Components for reads the
// public RLS policies allow (e.g. products).
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
