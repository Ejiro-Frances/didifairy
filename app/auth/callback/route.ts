import { NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Completes email confirmation / magic-link sign-in. Supabase redirects here
// after the user clicks the confirmation link. Handles both link formats:
//   - PKCE code flow:  ?code=...
//   - token-hash flow: ?token_hash=...&type=signup
// On success the session cookies are set and we land the user on their account.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') || '/account'

  const supabase = await createClient()

  let ok = false
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    ok = !error
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    ok = !error
  }

  const dest = ok ? next : '/login?message=auth-error'
  return Response.redirect(new URL(dest, request.url))
}
