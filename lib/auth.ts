import { User } from '@/models/User'
import { auth } from '@/auth'

export async function getUserFromSession() {
  const session = await auth()

  if (!session || !session.user?.email) return null

  const user = await User.findOne({ email: session.user.email })
  return user
}
