'use server'

import { auth } from '@/auth'
import { connectDB } from '@/lib/db'
import { Invite } from '@/models/Invite'
import { Membership } from '@/models/Membership'
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

  await Membership.create({
    groupId: invite.groupId,
    userId: session.user.id,
    role: 'MEMBER',
    amount: invite.amount,
    status: 'pending',
  })

  invite.acceptedAt = new Date()
  await invite.save()

  redirect('/dashboard')
}
