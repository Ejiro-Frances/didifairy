import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import { isSupabaseServiceConfigured } from '@/lib/supabase/env'
import { Profile } from '@/types/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseServiceConfigured) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    fullName: data.full_name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? undefined,
    city: data.city ?? undefined,
    state: data.state ?? undefined,
    createdAt: data.created_at,
  }
}

export interface ProfileWriteInput {
  fullName: string
  phone: string
  address?: string
  city?: string
  state?: string
}

export async function updateProfile(userId: string, email: string, input: ProfileWriteInput) {
  const supabase = createServiceClient()
  // Upsert so a profile row is created if it doesn't exist yet.
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    full_name: input.fullName,
    phone: input.phone,
    address: input.address || null,
    city: input.city || null,
    state: input.state || null,
  })
  if (error) throw new Error(error.message)
}
