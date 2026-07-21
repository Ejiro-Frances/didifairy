'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction, AuthState } from '@/app/actions/auth'
import { Field } from '@/components/ui/field'
import { PasswordField } from '@/components/ui/password-field'

export default function LoginForm({ redirectTo, message }: { redirectTo?: string; message?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, {})

  return (
    <form action={action} className="space-y-4">
      {message === 'check-email' && (
        <p className="rounded bg-[#B8962E]/10 px-3 py-2 text-sm text-[#7A5C00]">
          Check your email to confirm your account, then log in.
        </p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <input type="hidden" name="redirect" value={redirectTo ?? ''} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <PasswordField label="Password" name="password" autoComplete="current-password" required error={state.fieldErrors?.password} />

      <button
        disabled={pending}
        className="w-full rounded bg-[#1A1208] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-[#7A6856]">
        No account?{' '}
        <Link href="/signup" className="text-[#5C3D2E] underline">Create one</Link>
      </p>
    </form>
  )
}
