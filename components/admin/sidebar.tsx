'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, MessageSquare, Store } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[#E8D5A3] bg-white p-5">
      <Link href="/admin" className="font-cormorant text-2xl">
        didi<em className="not-italic text-[#B8962E]">fairy</em>
      </Link>
      <p className="mb-6 text-[10px] uppercase tracking-[0.2em] text-[#B8962E]">Admin</p>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active ? 'bg-[#1A1208] text-white' : 'text-[#5C3D2E] hover:bg-[#FFF9ED]'
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 space-y-2 border-t border-[#E8D5A3] pt-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5C3D2E] hover:bg-[#FFF9ED]">
          <Store size={16} /> View store
        </Link>
        <p className="truncate px-3 text-xs text-[#7A6856]">{email}</p>
        <form action={logoutAction}>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#5C3D2E] hover:bg-[#FFF9ED]">
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}
