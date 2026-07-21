import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import { createOrderNumber, createTrackingCode } from '@/lib/order-utils'
import {
  CustomerProfile,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/types/types'

interface OrderRow {
  id: string
  order_number: string
  tracking_code: string
  customer: CustomerProfile
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  status: OrderStatus
  paystack_reference: string | null
  receipt_url: string | null
  user_id: string | null
  created_at: string
  updated_at: string
}

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    trackingCode: row.tracking_code,
    customer: row.customer,
    items: row.items,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    receiptUrl: row.receipt_url ?? undefined,
    userId: row.user_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface CreateOrderInput {
  customer: CustomerProfile
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus?: PaymentStatus
  userId?: string | null
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = createServiceClient()

  // Retry on the rare unique-constraint collision with a fresh number.
  let lastError: string | undefined
  for (let attempt = 0; attempt < 4; attempt++) {
    const orderNumber = createOrderNumber()
    const trackingCode = createTrackingCode(orderNumber)

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        tracking_code: trackingCode,
        customer: input.customer,
        items: input.items,
        subtotal: input.subtotal,
        delivery_fee: input.deliveryFee,
        total: input.total,
        payment_method: input.paymentMethod,
        payment_status: input.paymentStatus ?? 'pending',
        status: 'pending',
        user_id: input.userId ?? null,
      })
      .select()
      .single()

    if (!error && data) return mapRow(data as OrderRow)

    lastError = error?.message
    // 23505 = unique_violation → regenerate and retry; otherwise bail.
    if (error?.code !== '23505') break
  }

  throw new Error(`Failed to create order: ${lastError ?? 'unknown error'}`)
}

export async function listOrders(): Promise<Order[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as OrderRow[]).map(mapRow)
}

// Orders belonging to a logged-in customer: those linked by user_id, plus any
// guest orders placed with the same email (so pre-signup orders still show up).
export async function getOrdersForUser(userId: string, email: string): Promise<Order[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`user_id.eq.${userId},customer->>email.eq.${email}`)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as OrderRow[]).map(mapRow)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as OrderRow)
}

export async function getOrderByTracking(code: string): Promise<Order | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tracking_code', code.trim().toUpperCase())
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as OrderRow)
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as OrderRow)
}

export async function setOrderReceipt(id: string, receiptPath: string): Promise<Order | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ receipt_url: receiptPath })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as OrderRow)
}

// Short-lived signed URL so the admin can view a private receipt.
export async function getReceiptSignedUrl(path: string): Promise<string | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage.from('receipts').createSignedUrl(path, 600)
  if (error || !data) return null
  return data.signedUrl
}

export async function setOrderPayment(id: string, paymentStatus: PaymentStatus): Promise<Order | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as OrderRow)
}
