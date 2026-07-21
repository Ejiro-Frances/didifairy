// Central place to read Supabase env + check whether it's configured, so the
// app can degrade gracefully (e.g. fall back to static products) before you've
// pasted your keys into .env.local.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
export const isSupabaseServiceConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)

// Email treated as the store admin (gates /admin). Defaults to the agreed value.
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@didifairy.com'
