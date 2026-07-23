import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getOrdersForUser } from '@/lib/orders'
import { getProfile } from '@/lib/profile'
import { formatNGN } from '@/lib/utils'

export default async function AccountDashboard() {
  const user = (await getCurrentUser())! // guaranteed by layout
  const [orders, profile] = await Promise.all([
    getOrdersForUser(user.id, user.email ?? ''),
    getProfile(user.id),
  ])

  const inProgress = orders.filter(o => o.status !== 'completed').length
  const completed = orders.filter(o => o.status === 'completed').length
  const recent = orders[0]
  const firstName = profile?.fullName?.split(/\s+/)[0]

  const stats = [
    { label: 'Total orders', value: orders.length },
    { label: 'In progress', value: inProgress },
    { label: 'Completed', value: completed },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-cormorant text-2xl">
        Welcome{firstName ? `, ${firstName}` : ''} 👋
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-[#E8D5A3] bg-white p-4">
            <p className="text-xs text-[#7A6856]">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E8D5A3] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-cormorant text-xl">Most recent order</h3>
          <Link href="/account/orders" className="text-sm text-[#5C3D2E] underline">View all</Link>
        </div>
        {recent ? (
          <Link href={`/orders/${recent.id}`} className="flex items-center justify-between rounded-xl border border-[#E8D5A3] p-4 hover:border-[#B8962E]">
            <div>
              <p className="font-medium">{recent.orderNumber}</p>
              <p className="text-sm capitalize text-[#7A6856]">{recent.status} · payment {recent.paymentStatus}</p>
            </div>
            <p className="font-medium">{formatNGN(recent.total)}</p>
          </Link>
        ) : (
          <p className="text-sm text-[#7A6856]">
            No orders yet. <Link href="/#shop" className="text-[#5C3D2E] underline">Start shopping</Link>.
          </p>
        )}
      </div>

      {(!profile?.phone || !profile?.address) && (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-[#FFF9ED] p-5 text-sm text-[#7A6856]">
          Complete your <Link href="/account/profile" className="text-[#5C3D2E] underline">profile</Link> to
          speed up checkout — we’ll prefill your delivery details.
        </div>
      )}
    </div>
  )
}
