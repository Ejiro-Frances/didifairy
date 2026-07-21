import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import { getCurrentUser } from '@/lib/auth'
import { getOrdersForUser } from '@/lib/orders'
import { formatNGN } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/account')

  const orders = await getOrdersForUser(user.id, user.email ?? '')

  return (
    <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">My account</p>
            <h1 className="font-cormorant text-3xl">Your orders</h1>
            <p className="mt-1 text-sm text-[#7A6856]">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded border border-[#E8D5A3] px-4 py-2 text-sm">Log out</button>
          </form>
        </div>

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
    </main>
  )
}
