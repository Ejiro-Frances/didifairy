import CheckoutForm, { CheckoutInitial } from '@/components/checkout/checkout-form'
import { getCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

// Prefills the checkout form from the signed-in customer's profile (guest
// checkout gets an empty form).
export const dynamic = 'force-dynamic'

function splitName(full: string) {
  const [first, ...rest] = full.trim().split(/\s+/)
  return { firstName: first ?? '', lastName: rest.join(' ') }
}

export default async function CheckoutPage() {
  const user = await getCurrentUser()
  let initial: CheckoutInitial | undefined

  if (user) {
    const profile = await getProfile(user.id)
    initial = {
      ...(profile ? splitName(profile.fullName) : {}),
      email: profile?.email || user.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
    }
  }

  return <CheckoutForm initial={initial} />
}
