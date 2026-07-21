import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/sidebar'
import { getCurrentUser, isAdminEmail } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defence-in-depth: proxy gates /admin, but verify here too.
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) redirect('/login?redirect=/admin')

  return (
    <div className="flex min-h-screen bg-[#FDFAF5] text-[#1A1208]">
      <AdminSidebar email={user!.email!} />
      <div className="flex-1 overflow-x-auto px-6 py-10 lg:px-10">{children}</div>
    </div>
  )
}
