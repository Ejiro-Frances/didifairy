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

export const useCart = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,

    get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
    },
    get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    },

    addItem: (product: Product) => {
        set(state => {
            const existing = state.items.find(i => i.product.id === product.id)
            const items = existing
                ? state.items.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...state.items, { product, quantity: 1 }]
            return { items, isOpen: true }
        })
    },

    removeItem: (productId: string) => {
        set(state => ({
            items: state.items.filter(i => i.product.id !== productId),
        }))
    },

    updateQuantity: (productId: string, qty: number) => {
        if (qty < 1) return
        set(state => ({
            items: state.items.map(i =>
                i.product.id === productId ? { ...i, quantity: qty } : i
            ),
        }))
    },

    clearCart: () => set({ items: [] }),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
}))