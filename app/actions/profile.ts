'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { updateProfile } from '@/lib/profile'
import { fieldErrors, profileSchema } from '@/lib/validation'

export interface ProfileState {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function updateProfileAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You are not signed in.' }

  const parsed = profileSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
  })
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  try {
    await updateProfile(user.id, user.email ?? '', parsed.data)
  } catch {
    return { error: 'Could not save your profile. Please try again.' }
  }

  revalidatePath('/account/profile')
  return { success: true }
}
