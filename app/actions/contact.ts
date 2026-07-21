'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { contactSchema, fieldErrors } from '@/lib/validation'

export interface ContactState {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function contactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  })
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    })
    if (error) return { error: 'Could not send your message. Please try again.' }
  } catch {
    return { error: 'Messaging is not available right now. Please try again later.' }
  }

  return { success: true }
}
