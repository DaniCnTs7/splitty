import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import Stripe from 'stripe'
import connectDB from '@/lib/db/mongoose'
import { PaymentCycle } from '@/lib/db/models/PaymentCycle'
import { Group } from '@/lib/db/models/Group'
import { OwnerPayout } from '@/lib/db/models/OwnerPayout'
import { User } from '@/lib/db/models/User'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  await connectDB()

  const targetDate = dayjs().add(2, 'day').startOf('day')

  const cycles = await PaymentCycle.find({
    status: 'MEMBERS_CHARGED',
    cycleDate: {
      $gte: targetDate.toDate(),
      $lt: targetDate.endOf('day').toDate(),
    },
  })

  for (const cycle of cycles) {
    const group = await Group.findById(cycle.groupId)
    if (!group) continue

    const owner = await User.findById(group.ownerId)
    if (!owner?.payoutPaymentMethodId) continue

    const ownerAmount = Number((cycle.totalAmount - cycle.memberAmount).toFixed(2))

    try {
      const payout = await stripe.payouts.create({
        amount: Math.round(ownerAmount * 100),
        currency: 'eur',
        method: 'instant',
      })

      await OwnerPayout.create({
        paymentCycleId: cycle._id,
        ownerId: owner._id,
        amount: ownerAmount,
        stripePayoutId: payout.id,
        status: 'PAID',
      })

      cycle.status = 'COMPLETED'
      await cycle.save()
    } catch (err: any) {
      await OwnerPayout.create({
        paymentCycleId: cycle._id,
        ownerId: owner._id,
        amount: ownerAmount,
        status: 'FAILED',
        failureReason: err.message,
      })
    }
  }

  return NextResponse.json({ success: true })
}
