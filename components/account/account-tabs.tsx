'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, UserCog } from 'lucide-react'

const tabs = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/profile', label: 'Profile', icon: UserCog },
]

export default function AccountTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 border-b border-[#E8D5A3]">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = href === '/account' ? pathname === '/account' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm ${
              active
                ? 'border-[#B8962E] font-medium text-[#1A1208]'
                : 'border-transparent text-[#7A6856] hover:text-[#B8962E]'
            }`}
          >
            <Icon size={15} /> {label}
          </Link>
        )
      })}
    </nav>
  )
}
