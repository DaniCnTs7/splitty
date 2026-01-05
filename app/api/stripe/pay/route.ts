import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectDB } from '@/lib/db'
import { Group } from '@/models/Group'
import { User } from '@/models/User'

export async function POST(req: Request) {
  const { groupId } = await req.json()

  await connectDB()
  const group = await Group.findById(groupId).populate('owner members')
  if (!group) return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })

  // Recorre todos los miembros
  const payments = await Promise.all(
    group.members.map(async (memberId: string) => {
      const member = await User.findById(memberId)
      if (!member || !member.paymentMethodId) return null

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: member.amount * 100,
          currency: 'eur',
          customer: member.stripeCustomerId,
          payment_method: member.paymentMethodId,
          off_session: true,
          confirm: true,
          transfer_data: {
            destination: group.owner.stripeConnectAccountId,
          },
          description: `Pago suscripción grupo ${group.name}`,
        })

        return { member: memberId, status: 'success', paymentIntentId: paymentIntent.id }
      } catch (err: any) {
        return { member: memberId, status: 'failed', error: err.message }
      }
    })
  )

  return NextResponse.json({ payments })
}
