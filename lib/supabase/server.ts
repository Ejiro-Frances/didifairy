import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

// Server Supabase client bound to the request cookies — this is what carries the
// admin's auth session in Server Components, Route Handlers and Server Actions.
// NOTE: cookies() is async in this Next.js version.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component where cookies are read-only.
          // Safe to ignore when a middleware/route refreshes the session.
        }
      },
    },
  })
}
