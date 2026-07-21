import { NextRequest } from 'next/server'
import { getOrderById, setOrderReceipt } from '@/lib/orders'
import { createServiceClient } from '@/lib/supabase/service'

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']

// Uploads a payment receipt for an order into the private `receipts` bucket
// (server-side, service role) and records its path on the order.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<'/api/orders/[id]/receipt'>
) {
  const { id } = await ctx.params

  const order = await getOrderById(id)
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('receipt')
  if (!(file instanceof File)) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return Response.json({ error: 'Use a PNG, JPG, WEBP or PDF' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'bin'
  const path = `${id}/${Date.now()}.${ext}`

  const supabase = createServiceClient()
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(path, file, { contentType: file.type, upsert: true })

  if (uploadError) {
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  await setOrderReceipt(id, path)
  return Response.json({ ok: true }, { status: 201 })
}
