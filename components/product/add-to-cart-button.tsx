'use client'

import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { useCart } from '@/stores/cart-store'
import { Product } from '@/types/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const isAvailable = product.status === 'available'

  function handleAdd() {
    if (!isAvailable) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!isAvailable}
      className={`flex w-full items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
        isAvailable
          ? added
            ? 'bg-[#5C3D2E] text-[#FDFAF5]'
            : 'bg-[#1A1208] text-[#FDFAF5] hover:bg-[#5C3D2E]'
          : 'cursor-not-allowed bg-[#B4B2A9] text-[#FDFAF5] opacity-60'
      }`}
    >
      {added ? (
        <><Check size={14} /> Added to cart</>
      ) : (
        <><ShoppingBag size={14} strokeWidth={1.5} /> {isAvailable ? 'Add to cart' : 'Sold out'}</>
      )}
    </button>
  )
}
