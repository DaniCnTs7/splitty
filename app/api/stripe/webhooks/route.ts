import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const buf = await req.arrayBuffer()
  const sig = req.headers.get('stripe-signature')!
  let event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Pago exitoso', event.data.object)
      break
    case 'payment_intent.payment_failed':
      console.log('Pago fallido', event.data.object)
      break
    default:
      console.log(`Evento Stripe no manejado: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
