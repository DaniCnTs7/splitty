import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { accountId } = await req.json()

  if (!accountId) {
    return NextResponse.json({ error: 'accountId required' }, { status: 400 })
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    type: 'account_onboarding',
  })

  return NextResponse.json({
    url: accountLink.url,
  })
}
