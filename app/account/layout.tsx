import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import AccountTabs from '@/components/account/account-tabs'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/account')

  return (
    <main className="min-h-screen bg-[#FDFAF5] px-6 py-24 text-[#1A1208]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="font-cormorant text-2xl">
              didi<em className="not-italic text-[#B8962E]">fairy</em>
            </Link>
            <p className="mt-1 text-sm text-[#7A6856]">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded border border-[#E8D5A3] px-4 py-2 text-sm">Log out</button>
          </form>
        </div>

        <AccountTabs />
        <div className="mt-6">{children}</div>
      </div>
    </main>
  )
}
