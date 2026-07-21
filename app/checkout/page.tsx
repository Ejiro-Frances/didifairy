'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useCart } from '@/stores/cart-store'
import { formatNGN } from '@/lib/utils'
import { checkoutSchema, fieldErrors } from '@/lib/validation'
import { Field, TextareaField } from '@/components/ui/field'
import BankDetails from '@/components/checkout/bank-details'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  notes: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [form, setForm] = useState(initialForm)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('transfer')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items])
  const deliveryFee = subtotal > 0 ? 3000 : 0
  const total = subtotal + deliveryFee

  const set = (key: keyof typeof initialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setErrors({})

    if (!items.length) {
      setError('Your cart is empty')
      return
    }

    // Client-side validation with the shared Zod schema.
    const parsed = checkoutSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
          paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors)
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      clearCart()
      router.push(`/orders/${data.order.id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
        <section className="flex-1 rounded-2xl border border-[#E8D5A3] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.back()}
                className="mb-2 inline-flex items-center gap-1 text-sm text-[#5C3D2E] hover:text-[#B8962E]"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Checkout</p>
              <h1 className="font-cormorant text-3xl">Complete your order</h1>
            </div>
            <Link href="/" className="text-sm text-[#5C3D2E] underline">Back to shop</Link>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="First name" name="firstName" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
              <Field label="Last name" name="lastName" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
              <Field label="Phone (required)" name="phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
            </div>
            <TextareaField label="Delivery address" name="address" value={form.address} onChange={set('address')} error={errors.address} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="City" name="city" value={form.city} onChange={set('city')} error={errors.city} />
              <Field label="State" name="state" value={form.state} onChange={set('state')} error={errors.state} />
            </div>
            <TextareaField label="Delivery notes (optional)" name="notes" value={form.notes} onChange={set('notes')} error={errors.notes} />

            <div>
              <p className="mb-2 text-sm font-medium">Payment</p>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded border border-[#E8D5A3] px-3 py-2">
                  <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                  <span>Bank transfer</span>
                </label>
                <label className="flex items-center gap-2 rounded border border-[#E8D5A3] px-3 py-2 opacity-60">
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>Card (coming soon)</span>
                </label>
              </div>
              {paymentMethod === 'transfer' && (
                <div className="mt-3">
                  <BankDetails />
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button disabled={submitting} className="w-full rounded bg-[#1A1208] px-4 py-3 font-medium text-white disabled:opacity-60">
              {submitting ? 'Placing order…' : `Place order • ${formatNGN(total)}`}
            </button>
          </form>
        </section>

        <aside className="w-full max-w-md rounded-2xl border border-[#E8D5A3] bg-[#FFF9ED] p-6 shadow-sm">
          <h2 className="mb-4 font-cormorant text-2xl">Order summary</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center justify-between border-b border-[#E8D5A3] pb-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-[#7A6856]">Qty {item.quantity}</p>
                </div>
                <p>{formatNGN(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatNGN(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatNGN(deliveryFee)}</span></div>
            <div className="flex justify-between border-t border-[#E8D5A3] pt-2 text-base font-semibold"><span>Total</span><span>{formatNGN(total)}</span></div>
          </div>
        </aside>
      </div>
    </main>
  )
}
