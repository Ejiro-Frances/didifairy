import Link from 'next/link'
import { getOrderByTracking } from '@/lib/orders'
import { formatNGN } from '@/lib/utils'

const STEPS = ['pending', 'processing', 'shipped', 'completed'] as const

// Public order tracking. Visitors enter a tracking code (or arrive via ?code=).
// searchParams is a Promise in this Next.js version.
export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  const order = code ? await getOrderByTracking(code) : null
  const currentStep = order ? STEPS.indexOf(order.status) : -1

  return (
    <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
      <div className="mx-auto max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Order tracking</p>
        <h1 className="mb-6 font-cormorant text-3xl">Track your order</h1>

        <form method="get" className="mb-8 flex gap-3">
          <input
            name="code"
            defaultValue={code ?? ''}
            placeholder="Enter your tracking code"
            className="flex-1 rounded border border-[#E8D5A3] px-3 py-2"
          />
          <button className="rounded bg-[#1A1208] px-4 py-2 text-sm font-medium text-white">Track</button>
        </form>

        {code && !order && (
          <p className="rounded-2xl border border-[#E8D5A3] bg-white p-5 text-sm text-[#7A6856]">
            No order found for <span className="font-medium">{code}</span>. Double-check the code from your
            confirmation page.
          </p>
        )}

        {order && (
          <div className="rounded-2xl border border-[#E8D5A3] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7A6856]">Order</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <p className="text-sm text-[#7A6856]">{formatNGN(order.total)}</p>
            </div>

            <ol className="space-y-3">
              {STEPS.map((step, i) => {
                const done = i <= currentStep
                return (
                  <li key={step} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                        done ? 'bg-[#B8962E] text-white' : 'bg-[#E8D5A3]/40 text-[#7A6856]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`capitalize ${done ? 'font-medium text-[#1A1208]' : 'text-[#7A6856]'}`}>
                      {step}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        <Link href="/" className="mt-8 inline-block text-sm text-[#5C3D2E] underline">
          Back to shop
        </Link>
      </div>
    </main>
  )
}
