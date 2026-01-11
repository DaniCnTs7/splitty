import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { User } from '@/lib/db/models/User'
import { withAuth } from '@/lib/with-auth'
import connectDB from '@/lib/db/mongoose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = withAuth(async (_, {}) => {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  })

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  })
})

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paymentMethodId } = await req.json()

  await connectDB()

  await User.findByIdAndUpdate(session.user.id, {
    payoutPaymentMethodId: paymentMethodId,
  })

  return NextResponse.json({ success: true })
}
