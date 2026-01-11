import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { User } from '@/lib/db/models/User'
import { withAuth } from '@/lib/with-auth'
import connectDB from '@/lib/db/mongoose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = withAuth(async (_, { session }) => {
  const user = await User.findById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
    })

    customerId = customer.id
    user.stripeCustomerId = customerId
    await user.save()
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
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
  if (!paymentMethodId) {
    return NextResponse.json({ error: 'paymentMethodId required' }, { status: 400 })
  }

  await connectDB()

  await User.findByIdAndUpdate(session.user.id, {
    defaultPaymentMethodId: paymentMethodId,
  })

  return NextResponse.json({ success: true })
}
