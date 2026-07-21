import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildWhatsAppUrl } from '@/lib/order-utils'
import { getOrderById } from '@/lib/orders'
import { formatNGN } from '@/lib/utils'
import BankDetails from '@/components/checkout/bank-details'
import ReceiptUpload from '@/components/orders/receipt-upload'

// Server Component: params is a Promise in this Next.js version.
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  return (
    <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#E8D5A3] bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Order received</p>
            <h1 className="font-cormorant text-3xl">{order.orderNumber}</h1>
          </div>
          <Link href="/" className="text-sm text-[#5C3D2E] underline">Continue shopping</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E8D5A3] bg-[#FFF9ED] p-5">
            <p className="text-sm text-[#7A6856]">Status</p>
            <p className="mt-1 font-semibold capitalize">{order.status}</p>
            <p className="mt-2 text-sm text-[#7A6856]">
              Payment: <span className="capitalize">{order.paymentStatus}</span> · {order.paymentMethod}
            </p>
            <p className="mt-2 text-sm text-[#7A6856]">Tracking code: {order.trackingCode}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/track?code=${order.trackingCode}`} className="inline-flex rounded border border-[#1A1208] px-4 py-2 text-sm font-medium">
                Track this order
              </Link>
              <a href={buildWhatsAppUrl(order)} target="_blank" rel="noreferrer" className="inline-flex rounded bg-[#25D366] px-4 py-2 text-sm font-medium text-white">
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {order.paymentMethod === 'transfer' && order.paymentStatus !== 'paid' && (
          <div className="mt-6 rounded-2xl border border-[#E8D5A3] bg-white p-5">
            <h2 className="mb-3 font-cormorant text-xl">Payment</h2>
            <BankDetails />
            {order.receiptUrl ? (
              <p className="mt-3 rounded bg-[#B8962E]/10 px-3 py-2 text-sm text-[#7A5C00]">
                Receipt received — we’ll confirm your payment shortly.
              </p>
            ) : (
              <ReceiptUpload orderId={order.id} />
            )}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E8D5A3] bg-[#FFF9ED] p-5">
            <p className="text-sm text-[#7A6856]">Customer</p>
            <p className="mt-1 font-semibold">{order.customer.fullName}</p>
            <p className="text-sm text-[#7A6856]">{order.customer.email}</p>
            <p className="text-sm text-[#7A6856]">{order.customer.phone}</p>
            <p className="mt-2 text-sm text-[#7A6856]">
              {order.customer.address}, {order.customer.city}, {order.customer.state}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 font-cormorant text-2xl">Items</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={`${item.productId}-${item.quantity}`} className="flex items-center justify-between rounded border border-[#E8D5A3] px-4 py-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-[#7A6856]">Qty {item.quantity}</p>
                </div>
                <p>{formatNGN(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[#E8D5A3] pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatNGN(order.total)}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
