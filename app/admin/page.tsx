import Link from 'next/link'
import OrderControls from '@/components/admin/order-controls'
import { listOrders } from '@/lib/orders'
import { formatNGN } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const orders = await listOrders()

  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const stats = [
    { label: 'Total orders', value: orders.length },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { label: 'Completed', value: orders.filter(o => o.status === 'completed').length },
    { label: 'Revenue (paid)', value: formatNGN(revenue) },
  ]

  return (
    <div>
      <h1 className="mb-1 font-cormorant text-3xl">Dashboard</h1>
      <p className="mb-8 text-sm text-[#7A6856]">Manage orders and confirm payments.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-[#E8D5A3] bg-white p-4">
            <p className="text-xs text-[#7A6856]">{s.label}</p>
            <p className="mt-1 text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 font-cormorant text-2xl">Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8D5A3] bg-white p-10 text-center text-[#7A6856]">
          No orders yet. Once a customer checks out, orders appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="rounded-2xl border border-[#E8D5A3] bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-[#7A6856]">{order.customer.fullName} • {order.customer.phone}</p>
                  <p className="text-xs text-[#7A6856]">{order.customer.address}, {order.customer.city}, {order.customer.state}</p>
                </div>
                <OrderControls orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7A6856]">
                <span>Total: {formatNGN(order.total)}</span>
                <span>Tracking: {order.trackingCode}</span>
                {order.receiptUrl ? (
                  <Link href={`/admin/orders/${order.id}/receipt`} className="text-[#5C3D2E] underline">View receipt</Link>
                ) : (
                  <span>No receipt</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
