import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/db/mongoose'
import { PaymentCycle } from '@/lib/db/models/PaymentCycle'
import { GroupMember } from '@/lib/db/models/GroupMember'
import { MemberPayment } from '@/lib/db/models/MemberPayment'
import { User } from '@/lib/db/models/User'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export async function POST() {
  await connectDB()

  const today = new Date()

  const cycles = await PaymentCycle.find({
    status: 'PENDING',
  })

  for (const cycle of cycles) {
    const chargeDate = addDays(cycle.cycleDate, -7)

    if (!isSameDay(chargeDate, today)) {
      continue
    }

    const members = await GroupMember.find({
      groupId: cycle.groupId,
      status: 'ACTIVE',
    })

    let allPaid = true

    for (const member of members) {
      const payment = await MemberPayment.findOne({
        paymentCycleId: cycle._id,
        userId: member.userId,
      })

      if (payment?.status === 'PAID') {
        continue
      }

      const user = await User.findById(member.userId)

      if (!user || !user.stripeCustomerId || !user.defaultPaymentMethodId) {
        allPaid = false

        if (!payment) {
          await MemberPayment.create({
            paymentCycleId: cycle._id,
            userId: member.userId,
            amount: cycle.memberAmount,
            status: 'FAILED',
            failureReason: 'Missing payment method',
          })
        }

        continue
      }

      try {
        const pi = await stripe.paymentIntents.create({
          amount: Math.round(cycle.memberAmount * 100),
          currency: 'eur',
          customer: user.stripeCustomerId,
          payment_method: user.defaultPaymentMethodId,
          confirm: true,
          off_session: true,
        })

        if (payment) {
          payment.status = 'PAID'
          payment.stripePaymentIntentId = pi.id
          await payment.save()
        } else {
          await MemberPayment.create({
            paymentCycleId: cycle._id,
            userId: member.userId,
            amount: cycle.memberAmount,
            stripePaymentIntentId: pi.id,
            status: 'PAID',
          })
        }
      } catch (err: any) {
        allPaid = false

        if (payment) {
          payment.status = 'FAILED'
          payment.failureReason = err.message
          await payment.save()
        } else {
          await MemberPayment.create({
            paymentCycleId: cycle._id,
            userId: member.userId,
            amount: cycle.memberAmount,
            status: 'FAILED',
            failureReason: err.message,
          })
        }
      }
    }

    if (allPaid) {
      cycle.status = 'MEMBERS_CHARGED'
      await cycle.save()
    }
  }

  return NextResponse.json({ success: true })
}
