import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Group } from '@/models/Group'
import { Membership } from '@/models/Membership'
import { User } from '@/models/User'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { groupId } = await req.json()

    if (!groupId) {
      return NextResponse.json({ error: 'groupId is required' }, { status: 400 })
    }

    const group = await Group.findById(groupId)

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const account = await stripe.accounts.retrieve(group.stripeConnectAccountId)

    if (!account.capabilities?.transfers || account.capabilities.transfers !== 'active') {
      return NextResponse.json({ error: 'Owner cannot receive transfers yet' })
    }

    const memberships = await Membership.find({
      _id: { $in: group.members },
    })

    if (!memberships.length) {
      return NextResponse.json({ error: 'Group has no memberships' }, { status: 400 })
    }

    const ownerMembership = memberships.find((m) => m.role === 'OWNER')

    if (!ownerMembership) {
      return NextResponse.json({ error: 'Group has no owner membership' }, { status: 400 })
    }

    const owner = await User.findById(ownerMembership.userId)

    if (!owner || !group.stripeConnectAccountId) {
      return NextResponse.json(
        { error: 'Owner is not ready to receive payments' },
        { status: 400 }
      )
    }

    const payingMemberships = memberships.filter((m) => m.role === 'MEMBER')

    if (!payingMemberships.length) {
      return NextResponse.json({ error: 'No members to charge' }, { status: 400 })
    }

    const results = []

    for (const membership of payingMemberships) {
      if (!membership.paymentMethodConfigured) {
        results.push({
          membershipId: membership._id,
          status: 'skipped',
          reason: 'payment method not configured',
        })
        continue
      }

      const user = await User.findById(membership.userId)

      if (!user?.stripeCustomerId || !user?.paymentMethodId) {
        results.push({
          membershipId: membership._id,
          status: 'skipped',
          reason: 'missing stripe data',
        })
        continue
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(membership.amount * 100),
          currency: 'eur',
          customer: user.stripeCustomerId,
          payment_method: user.paymentMethodId,
          off_session: true,
          confirm: true,

          transfer_data: {
            destination: group.stripeConnectAccountId,
          },

          metadata: {
            groupId: group._id.toString(),
            membershipId: membership._id.toString(),
            userId: user._id.toString(),
          },
        })

        results.push({
          membershipId: membership._id,
          status: 'paid',
          paymentIntentId: paymentIntent.id,
        })

        membership.status = 'paid'
        membership.lastPaymentIntentId = paymentIntent.id
        await membership.save()
      } catch (err: any) {
        console.error(`Payment failed for membership ${membership._id}`, err)

        results.push({
          membershipId: membership._id,
          status: 'failed',
          error: err.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      groupId: group._id,
      results,
    })
  } catch (error) {
    console.error('Stripe pay error:', error)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
