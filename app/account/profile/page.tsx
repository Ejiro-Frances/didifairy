import { getCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import ProfileForm from '@/components/account/profile-form'

export const dynamic = 'force-dynamic'

export default async function AccountProfilePage() {
  const user = (await getCurrentUser())!
  const profile = await getProfile(user.id)

  return (
    <div>
      <h2 className="mb-4 font-cormorant text-2xl">Your profile</h2>
      <p className="mb-6 text-sm text-[#7A6856]">
        Keep these up to date — we use them to prefill your checkout details.
      </p>
      <ProfileForm profile={profile} email={user.email ?? ''} />
    </div>
  )
}
