'use client'

import { useActionState } from 'react'
import { contactAction, ContactState } from '@/app/actions/contact'
import { Field, TextareaField } from '@/components/ui/field'

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(contactAction, {})

  if (state.success) {
    return (
      <div className="rounded-2xl border border-[#E8D5A3] bg-[#FFF9ED] p-6 text-center">
        <p className="font-cormorant text-2xl">Thank you!</p>
        <p className="mt-2 text-sm text-[#7A6856]">We’ve received your message and will get back to you soon.</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Field label="Name" name="name" required error={state.fieldErrors?.name} />
      <Field label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
      <Field label="Phone (optional)" name="phone" type="tel" error={state.fieldErrors?.phone} />
      <TextareaField label="Message" name="message" required error={state.fieldErrors?.message} />
      <button
        disabled={pending}
        className="w-full rounded bg-[#1A1208] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
