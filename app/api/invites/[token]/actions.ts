'use server'

import { auth } from '@/auth'
import { connectDB } from '@/lib/db'
import { Group } from '@/models/Group'
import { Invite } from '@/models/Invite'
import { Membership } from '@/models/Membership'
import { User } from '@/models/User'
import { redirect } from 'next/navigation'

export async function acceptInviteAction(token: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await connectDB()

  const invite = await Invite.findOne({ token })

  if (!invite || invite.acceptedAt) {
    throw new Error('Invite inválida o ya aceptada')
  }

  const user = await User.findOne({ email: session.user.email })

  const membership = await Membership.create({
    groupId: invite.groupId,
    userId: session.user.id,
    role: 'MEMBER',
    amount: invite.amount,
    status: 'pending',
    paymentMethodConfigured:
      user.hasPaymentMethod || user.stripeCustomerId || user.stripeConnectAccountId,
  })

  const group = await Group.findById(invite.groupId)
  group.members.push(membership)
  await group.save()

  invite.acceptedAt = new Date()
  await invite.save()

  redirect('/dashboard')
}
