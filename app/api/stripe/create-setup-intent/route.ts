import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getUserFromSession } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(_: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    })
    user.stripeCustomerId = customer.id
    await user.save()
  }

  // Crear SetupIntent para que registre tarjeta
  const setupIntent = await stripe.setupIntents.create({
    customer: user.stripeCustomerId,
  })

  return NextResponse.json({ clientSecret: setupIntent.client_secret })
}
