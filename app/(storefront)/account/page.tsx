import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import AccountClient from './account-client'

export const metadata = {
  title: "My Account | The Comfortable Co.",
  description: "Manage your profile, orders, addresses and rewards.",
};

export default async function AccountPage() {
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/auth/login?next=/account')
  }

  return (
    <AccountClient
      user={userData.user}
      customer={userData.customer as any}
    />
  )
}
