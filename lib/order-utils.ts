import { Order } from '@/types/types'

// Pure, environment-agnostic order helpers. Persistence lives in lib/orders.ts
// (server-only, Supabase). Keep this file free of storage/side effects so it can
// be imported anywhere and unit-tested easily.

export function createOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  // 6 base36 chars (~2 billion combos) so same-day orders don't collide.
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `DDF-${stamp}-${random}`
}

// Derived 1:1 from the (unique) order number, keeping ALL of its entropy so
// tracking codes are unique too.
export function createTrackingCode(orderNumber: string) {
  return `TRK${orderNumber.replace(/-/g, '').toUpperCase()}`
}

// Click-to-chat WhatsApp link a customer can tap for a manual update. (The
// automated Cloud API notifications are separate — see lib/whatsapp.ts.)
export function buildWhatsAppUrl(
  order: Pick<Order, 'orderNumber' | 'status'>,
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348140000000'
) {
  const message = `Hello Didifairy, I need an update on order ${order.orderNumber}. Current status: ${order.status}. Thank you.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
