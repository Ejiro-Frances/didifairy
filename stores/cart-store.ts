'use client'
import { create } from 'zustand'
import { CartItem, Product } from '@/types/types'

interface CartState {
    items: CartItem[]
    isOpen: boolean
    totalItems: number
    totalPrice: number
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, qty: number) => void
    clearCart: () => void
    openCart: () => void
    closeCart: () => void
}

// Derived totals must be recomputed whenever `items` changes. Zustand getters on
// the state object are evaluated once at creation and never react, so instead we
// compute the totals from the next `items` array inside every mutating action.
function totals(items: CartItem[]) {
    return {
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }
}

export const useCart = create<CartState>((set) => ({
    items: [],
    isOpen: false,
    totalItems: 0,
    totalPrice: 0,

    addItem: (product: Product) => {
        set(state => {
            const existing = state.items.find(i => i.product.id === product.id)
            const items = existing
                ? state.items.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...state.items, { product, quantity: 1 }]
            return { items, isOpen: true, ...totals(items) }
        })
    },

    removeItem: (productId: string) => {
        set(state => {
            const items = state.items.filter(i => i.product.id !== productId)
            return { items, ...totals(items) }
        })
    },

    updateQuantity: (productId: string, qty: number) => {
        if (qty < 1) return
        set(state => {
            const items = state.items.map(i =>
                i.product.id === productId ? { ...i, quantity: qty } : i
            )
            return { items, ...totals(items) }
        })
    },

    clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
}))
