import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectDB } from '@/lib/db'
import { auth } from '@/auth'
import { getUserFromSession } from '@/lib/auth'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const user = await getUserFromSession()

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    })

    user.stripeCustomerId = customer.id
    user.hasPaymentMethod = true
    await user.save()
  }

  return NextResponse.json({ customerId: user.stripeCustomerId })
}
