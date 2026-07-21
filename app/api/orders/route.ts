import { NextRequest } from 'next/server'
import { createOrder } from '@/lib/orders'
import { getProductById } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { checkoutSchema, fieldErrors } from '@/lib/validation'
import { CustomerProfile, OrderItem, PaymentMethod } from '@/types/types'

const DELIVERY_FEE = 3000

interface CartLine {
  productId: string
  quantity: number
}

interface CreateOrderBody {
  customer: Partial<CustomerProfile>
  items: CartLine[]
  paymentMethod: PaymentMethod
}

export async function POST(request: NextRequest) {
  let body: CreateOrderBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { customer, items, paymentMethod } = body

  // Validate customer with the shared Zod schema.
  const parsed = checkoutSchema.safeParse(customer)
  if (!parsed.success) {
    return Response.json(
      { error: 'Please check your details', fieldErrors: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  // Validate cart.
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Your cart is empty' }, { status: 400 })
  }
  if (paymentMethod !== 'transfer' && paymentMethod !== 'card') {
    return Response.json({ error: 'Invalid payment method' }, { status: 400 })
  }

  // Resolve authoritative prices server-side — never trust client-sent amounts.
  const orderItems: OrderItem[] = []
  for (const line of items) {
    const qty = Math.floor(Number(line.quantity))
    if (!line?.productId || !Number.isFinite(qty) || qty < 1) {
      return Response.json({ error: 'Invalid cart item' }, { status: 400 })
    }
    const product = await getProductById(line.productId)
    if (!product) {
      return Response.json({ error: `Product not found: ${line.productId}` }, { status: 400 })
    }
    if (product.status === 'sold_out') {
      return Response.json({ error: `${product.name} is sold out` }, { status: 409 })
    }
    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity: qty,
      price: product.price,
    })
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  const c = parsed.data
  const fullCustomer: CustomerProfile = {
    firstName: c.firstName,
    lastName: c.lastName,
    fullName: `${c.firstName} ${c.lastName}`.trim(),
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    notes: c.notes || undefined,
  }

  // Attach the customer account if they're logged in (guest checkout otherwise).
  const user = await getCurrentUser()

  try {
    // Payment always starts 'pending' — for bank transfer the admin confirms
    // after seeing the receipt; the client never sets 'paid'.
    const order = await createOrder({
      customer: fullCustomer,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      userId: user?.id ?? null,
    })
    return Response.json({ order }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order'
    return Response.json({ error: message }, { status: 500 })
  }
}
