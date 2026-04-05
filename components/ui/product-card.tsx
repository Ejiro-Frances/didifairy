'use client'

import { Product } from '@/types/types'
import { formatNGN } from '@/lib/utils'
import { useCart } from '@/stores/cart-store'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
}

const swatchMap: Record<string, string> = {
    'Burgundy': 'linear-gradient(160deg,#3D1C02,#7A3B1E,#C4783A)',
    'Natural Black': 'linear-gradient(160deg,#0D0D0D,#2C1810,#5C3010)',
    'Blonde': 'linear-gradient(160deg,#B8962E,#E8D5A3,#FDFAF5)',
}

export default function ProductCard({ product }: ProductCardProps) {
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
        <div className="group cursor-pointer">
            {/* Image / Swatch */}
            <div className="relative aspect-[3/4] mb-3 overflow-hidden">
                <div
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    style={{ background: swatchMap[product.color] ?? 'linear-gradient(160deg,#B4B2A9,#888780)' }}
                />
                {/* Overlay name */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/50 to-transparent" />
                <p className="absolute bottom-3 left-3 font-cormorant text-base italic text-[#FDFAF5]/90">{product.name}</p>

                {/* Sold out overlay */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-[#1A1208]/30 flex items-center justify-center">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#FDFAF5]/80 border border-[#FDFAF5]/30 px-3 py-1">
                            Sold out
                        </span>
                    </div>
                )}
            </div>

            {/* Status */}
            <span className={`inline-block text-[9px] tracking-[0.18em] uppercase px-3 py-1 rounded-full border mb-2 ${isAvailable
                ? 'bg-[#B8962E]/10 text-[#7A5C00] border-[#E8D5A3]'
                : 'bg-[#5C3D2E]/08 text-[#7A6856] border-[#D3C4B8]'
                }`}>
                {isAvailable ? 'Available' : 'Sold out'}
            </span>

            <h3 className="font-cormorant text-lg text-[#1A1208] mb-1">{product.name}</h3>
            <p className="text-[11px] text-[#7A6856] leading-relaxed mb-2">{product.description}</p>
            <p className="text-[14px] font-medium text-[#5C3D2E] mb-3">{formatNGN(product.price)}</p>

            <button
                onClick={handleAdd}
                disabled={!isAvailable}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.18em] uppercase border transition-all duration-200 ${isAvailable
                    ? added
                        ? 'bg-[#5C3D2E] border-[#5C3D2E] text-[#FDFAF5]'
                        : 'border-[#1A1208] text-[#1A1208] hover:bg-[#1A1208] hover:text-[#FDFAF5]'
                    : 'border-[#B4B2A9] text-[#7A6856] opacity-50 cursor-not-allowed'
                    }`}
            >
                {added ? (
                    <><Check size={12} /> Added to cart</>
                ) : (
                    <><ShoppingBag size={12} strokeWidth={1.5} /> {isAvailable ? 'Add to cart' : 'Sold out'}</>
                )}
            </button>
        </div>
    )
}