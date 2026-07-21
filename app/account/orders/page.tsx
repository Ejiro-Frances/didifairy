import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getOrdersForUser } from '@/lib/orders'
import { formatNGN } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AccountOrdersPage() {
  const user = (await getCurrentUser())!
  const orders = await getOrdersForUser(user.id, user.email ?? '')

  return (
    <div>
      <h2 className="mb-4 font-cormorant text-2xl">Your orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-white p-10 text-center text-[#7A6856]">
          You have no orders yet.{' '}
          <Link href="/#shop" className="text-[#5C3D2E] underline">Start shopping</Link>.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-[#E8D5A3] bg-white p-5 transition-colors hover:border-[#B8962E]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm capitalize text-[#7A6856]">
                    {order.status} · payment {order.paymentStatus}
                  </p>
                </div>
                <p className="font-medium">{formatNGN(order.total)}</p>
              </div>
              <p className="mt-2 text-xs text-[#7A6856]">Tracking: {order.trackingCode}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
