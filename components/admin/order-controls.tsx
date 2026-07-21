'use client'

import { useTransition } from 'react'
import { updateOrderStatusAction, updatePaymentStatusAction } from '@/app/actions/orders'
import { OrderStatus, PaymentStatus } from '@/types/types'

export default function OrderControls({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={e => {
          const value = e.target.value as OrderStatus
          startTransition(() => {
            void updateOrderStatusAction(orderId, value)
          })
        }}
        className="rounded border border-[#E8D5A3] px-3 py-2"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="completed">Completed</option>
      </select>

      <select
        defaultValue={paymentStatus}
        disabled={isPending}
        onChange={e => {
          const value = e.target.value as PaymentStatus
          startTransition(() => {
            void updatePaymentStatusAction(orderId, value)
          })
        }}
        className="rounded border border-[#E8D5A3] px-3 py-2"
      >
        <option value="pending">Pending payment</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  )
}
