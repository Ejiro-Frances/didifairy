'use client'

import { useActionState } from 'react'
import { updateProfileAction, ProfileState } from '@/app/actions/profile'
import { Field, TextareaField } from '@/components/ui/field'
import { Profile } from '@/types/types'

export default function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfileAction, {})

  return (
    <form action={action} className="max-w-xl space-y-4">
      {state.success && (
        <p className="rounded bg-[#B8962E]/10 px-3 py-2 text-sm text-[#7A5C00]">Profile saved.</p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Field label="Full name" name="fullName" defaultValue={profile?.fullName} required error={state.fieldErrors?.fullName} />

      <div>
        <label className="mb-1 block text-xs font-medium text-[#5C3D2E]">Email</label>
        <input value={email} disabled className="w-full rounded border border-[#E8D5A3] bg-[#F4ECD9] px-3 py-2 text-sm text-[#7A6856]" />
      </div>

      <Field label="Phone" name="phone" type="tel" defaultValue={profile?.phone} required error={state.fieldErrors?.phone} />

      <p className="pt-2 text-xs uppercase tracking-[0.2em] text-[#B8962E]">Delivery address</p>
      <TextareaField label="Address" name="address" defaultValue={profile?.address} error={state.fieldErrors?.address} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" name="city" defaultValue={profile?.city} error={state.fieldErrors?.city} />
        <Field label="State" name="state" defaultValue={profile?.state} error={state.fieldErrors?.state} />
      </div>

      <button disabled={pending} className="rounded bg-[#1A1208] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
        {pending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
