import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import { isSupabaseServiceConfigured } from '@/lib/supabase/env'
import { ContactMessage, Profile } from '@/types/types'

export async function listProfiles(): Promise<Profile[]> {
  if (!isSupabaseServiceConfigured) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(row => ({
    id: row.id,
    fullName: row.full_name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    createdAt: row.created_at,
  }))
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseServiceConfigured) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message,
    createdAt: row.created_at,
  }))
}
