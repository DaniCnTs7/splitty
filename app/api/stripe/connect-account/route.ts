import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  await connectDB()

  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const user = await User.findById(userId)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.stripeConnectAccountId) {
    return NextResponse.json({
      accountId: user.stripeConnectAccountId,
    })
  }

  const account = await stripe.accounts.create({
    type: 'custom',
    country: 'ES',
    email: user.email,
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
    },
    business_type: 'individual',
  })

  user.stripeConnectAccountId = account.id
  await user.save()

  return NextResponse.json({
    accountId: account.id,
  })
}
