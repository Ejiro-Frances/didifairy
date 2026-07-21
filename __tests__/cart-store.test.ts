import { beforeEach, describe, expect, it } from 'vitest'
import { useCart } from '@/stores/cart-store'
import { Product } from '@/types/types'

const product = (id: string, price: number): Product => ({
  id,
  name: `Hair ${id}`,
  description: 'test',
  price,
  status: 'available',
  images: ['/images/waves.png'],
  color: 'Black',
  length: '20inch',
  category: 'Bundles',
})

describe('cart-store', () => {
  beforeEach(() => {
    useCart.setState({ items: [], totalItems: 0, totalPrice: 0, isOpen: false })
  })

  it('recomputes totals reactively when an item is added', () => {
    useCart.getState().addItem(product('1', 1000))
    expect(useCart.getState().totalItems).toBe(1)
    expect(useCart.getState().totalPrice).toBe(1000)
  })

  it('increments quantity for a repeated product instead of duplicating', () => {
    useCart.getState().addItem(product('1', 1000))
    useCart.getState().addItem(product('1', 1000))
    expect(useCart.getState().items).toHaveLength(1)
    expect(useCart.getState().totalItems).toBe(2)
    expect(useCart.getState().totalPrice).toBe(2000)
  })

  it('updates totals on quantity change and removal', () => {
    useCart.getState().addItem(product('1', 1000))
    useCart.getState().addItem(product('2', 500))
    useCart.getState().updateQuantity('1', 3)
    expect(useCart.getState().totalPrice).toBe(3 * 1000 + 500)

    useCart.getState().removeItem('1')
    expect(useCart.getState().totalItems).toBe(1)
    expect(useCart.getState().totalPrice).toBe(500)
  })

  it('ignores quantity updates below 1', () => {
    useCart.getState().addItem(product('1', 1000))
    useCart.getState().updateQuantity('1', 0)
    expect(useCart.getState().totalItems).toBe(1)
  })

  it('clears the cart', () => {
    useCart.getState().addItem(product('1', 1000))
    useCart.getState().clearCart()
    expect(useCart.getState().items).toHaveLength(0)
    expect(useCart.getState().totalItems).toBe(0)
    expect(useCart.getState().totalPrice).toBe(0)
  })
})
