'use server'

import { revalidatePath } from 'next/cache'
import { setOrderPayment, setOrderStatus } from '@/lib/orders'
import { OrderStatus, PaymentStatus } from '@/types/types'

// NOTE (Phase 4): these mutate orders and MUST be gated behind admin auth.
// A `requireAdmin()` session check will be added when Supabase Auth lands.
// Server Actions are reachable via direct POST, so the auth check is mandatory.

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const updated = await setOrderStatus(id, status)
  revalidatePath('/admin')
  return updated
}

export async function updatePaymentStatusAction(id: string, paymentStatus: PaymentStatus) {
  const updated = await setOrderPayment(id, paymentStatus)
  revalidatePath('/admin')
  return updated
}
