import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { firstName, lastName, email, dob, address, iban } = body

  const account = await stripe.accounts.create({
    type: 'custom',
    country: 'ES',
    email,
    business_type: 'individual',
    individual: {
      first_name: firstName,
      last_name: lastName,
      dob: {
        day: dob.day,
        month: dob.month,
        year: dob.year,
      },
      address: {
        line1: address.line1,
        city: address.city,
        postal_code: address.postalCode,
        country: 'ES',
      },
    },
    capabilities: {
      transfers: { requested: true },
    },
    external_account: {
      object: 'bank_account',
      country: 'ES',
      currency: 'eur',
      account_number: iban,
    },
  })

  user.stripeConnectAccountId = account.id
  user.canReceivePayments = true
  user.hasPaymentMethod = true
  await user.save()

  return NextResponse.json({ success: true, accountId: account.id })
}
