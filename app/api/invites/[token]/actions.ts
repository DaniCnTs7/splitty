'use server'

import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import { Invite } from '@/lib/db/models/Invite'
import { redirect } from 'next/navigation'
import { GroupMember } from '@/lib/db/models/GroupMember'
import { Group } from '@/lib/db/models/Group'

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

  await GroupMember.create({
    groupId: invite.groupId,
    userId: session.user.id,
    role: 'MEMBER',
  })

  invite.acceptedAt = new Date()
  await invite.save()

  const group = await Group.findById(invite.groupId)

  if (!group) throw new Error('Grupo no encontrado')

  const members = await GroupMember.find({ groupId: invite.groupId })

  if (members?.length === group.maxMembers) {
    group.status = 'ACTIVE'
    await group.save()
  }

  redirect('/dashboard')
}
