import { getOrderById, getReceiptSignedUrl } from '@/lib/orders'
import { getCurrentUser, isAdminEmail } from '@/lib/auth'

// Admin-only: redirects to a short-lived signed URL for the private receipt.
export async function GET(_req: Request, ctx: RouteContext<'/admin/orders/[id]/receipt'>) {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) {
    return new Response('Forbidden', { status: 403 })
  }

  const { id } = await ctx.params
  const order = await getOrderById(id)
  if (!order?.receiptUrl) return new Response('No receipt', { status: 404 })

  const url = await getReceiptSignedUrl(order.receiptUrl)
  if (!url) return new Response('Receipt unavailable', { status: 404 })

  return Response.redirect(url)
}
