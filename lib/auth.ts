import 'server-only'
import { ADMIN_EMAIL } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

export function isAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

// Current authenticated user (or null). Uses getUser() which verifies the JWT
// with Supabase — safe to trust, unlike reading the session cookie directly.
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Throws if the caller is not the admin. Call at the top of every admin Server
// Action — the proxy alone is not enough (actions are reachable via direct POST).
export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) {
    throw new Error('Unauthorized')
  }
  return user!
}
