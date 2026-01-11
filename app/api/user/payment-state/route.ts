import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User'
import { auth } from '@/auth'

export async function GET(_: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(session.user.id)

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const paymentState = {
    canPay: !!user.defaultPaymentMethodId,
    canReceive: !!user.payoutPaymentMethodId,
  }

  return NextResponse.json(paymentState)
}
