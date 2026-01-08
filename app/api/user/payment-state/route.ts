import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'

export async function GET(_: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(session.user.id)

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const paymentState = {
    canPay: !!user.paymentMethodId,
    canReceive: !!user.stripeConnectAccountId,
    userId: user.id,
  }

  return NextResponse.json(paymentState)
}
