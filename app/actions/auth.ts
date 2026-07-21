'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ADMIN_EMAIL } from '@/lib/supabase/env'
import { fieldErrors, loginSchema, signupSchema } from '@/lib/validation'

export interface AuthState {
  error?: string
  fieldErrors?: Record<string, string>
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: 'Invalid email or password' }

  const redirectTo = (formData.get('redirect') as string) || null
  const isAdmin = parsed.data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  redirect(redirectTo || (isAdmin ? '/admin' : '/account'))
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
  })
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  const { fullName, email, phone, password, address, city, state } = parsed.data

  // Send the confirmation email back to whatever origin the request came from
  // (localhost in dev, your domain in prod), falling back to NEXT_PUBLIC_APP_URL.
  const hdrs = await headers()
  const origin =
    hdrs.get('origin') ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error || !data.user) {
    return { error: error?.message ?? 'Could not create account' }
  }

  // Store the customer profile (service role bypasses RLS during signup).
  const service = createServiceClient()
  await service.from('profiles').upsert({
    id: data.user.id,
    full_name: fullName,
    email,
    phone,
    address: address || null,
    city: city || null,
    state: state || null,
  })

  // If email confirmation is enabled there is no session yet.
  if (!data.session) {
    redirect('/login?message=check-email')
  }
  redirect('/account')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
