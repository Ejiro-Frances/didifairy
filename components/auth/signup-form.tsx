'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signupAction, AuthState } from '@/app/actions/auth'
import { Field } from '@/components/ui/field'
import { PasswordField } from '@/components/ui/password-field'

export default function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signupAction, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Field label="Full name" name="fullName" required error={state.fieldErrors?.fullName} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={state.fieldErrors?.phone} />
      <PasswordField label="Password" name="password" autoComplete="new-password" required error={state.fieldErrors?.password} />
      <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" required error={state.fieldErrors?.confirmPassword} />

      <p className="pt-2 text-xs uppercase tracking-[0.2em] text-[#B8962E]">Delivery address (optional)</p>
      <Field label="Address" name="address" error={state.fieldErrors?.address} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" name="city" error={state.fieldErrors?.city} />
        <Field label="State" name="state" error={state.fieldErrors?.state} />
      </div>

      <button
        disabled={pending}
        className="w-full rounded bg-[#1A1208] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-[#7A6856]">
        Already have an account?{' '}
        <Link href="/login" className="text-[#5C3D2E] underline">Sign in</Link>
      </p>
    </form>
  )
}
