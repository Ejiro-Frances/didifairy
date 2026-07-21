'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/stores/cart-store'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const { totalItems, openCart, items } = useCart()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFAF5]/90 backdrop-blur-md border-b border-[#E8D5A3]/40">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

                <Link href="/" className="font-cormorant text-2xl font-normal tracking-wider text-[#1A1208]">
                    didi<em className="text-[#B8962E] not-italic">fairy</em>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {['Shop', 'Gallery', 'About', 'Contact'].map(link => (
                        <Link
                            key={link}
                            href={link === 'Contact' ? '/contact' : `#${link.toLowerCase()}`}
                            className="text-[10px] tracking-[0.2em] uppercase text-[#7A6856] hover:text-[#B8962E] transition-colors"
                        >
                            {link}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/account" aria-label="My account" className="hidden p-2 text-[#1A1208] hover:text-[#B8962E] md:block">
                        <User size={20} strokeWidth={1.5} />
                    </Link>
                    <button
                        onClick={openCart}
                        className="relative p-2 text-[#1A1208] hover:text-[#B8962E] transition-colors"
                        aria-label="Open cart"
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#B8962E] text-[#FDFAF5] text-[9px] rounded-full flex items-center justify-center font-medium">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <button
                        className="md:hidden p-2 text-[#1A1208]"
                        onClick={() => setMobileOpen(v => !v)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-[#FDFAF5] border-t border-[#E8D5A3]/40 px-6 py-4 flex flex-col gap-4">
                    {['Shop', 'Gallery', 'About', 'Contact'].map(link => (
                        <Link
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-[11px] tracking-[0.2em] uppercase text-[#7A6856]"
                        >
                            {link}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setMobileOpen(false)
                            if (items.length) router.push('/checkout')
                            else openCart()
                        }}
                        className="text-left text-[11px] tracking-[0.2em] uppercase text-[#1A1208]"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </header>
    )
}