import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Invite } from '@/models/Invite'
import { Membership } from '@/models/Membership'
import { Group } from '@/models/Group'
import { getCurrentUserId } from '@/lib/getCurrentUser'

export async function POST(_: Request, { params }: { params: { token: string } }) {
  await connectDB()

  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await params
  const invite = await Invite.findOne({ token })

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: 'Invitación inválida' }, { status: 400 })
  }

  const group = await Group.findById(invite.groupId)
  if (!group) {
    return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
  }
  const existingMembership = await Membership.findOne({
    groupId: invite.groupId,
    userId: userId,
  })

  if (existingMembership) {
    return NextResponse.json({ error: 'Ya eres miembro de este grupo' }, { status: 400 })
  }

  const totalMembers = await Membership.countDocuments({ groupId: invite.groupId })
  console.log('Total members in group:', totalMembers, 'of', group.totalMembers)
  if (totalMembers >= group.totalMembers) {
    return NextResponse.redirect(`${process.env.URL}/groups/${group.name}/full`)
  }

  await Membership.create({
    groupId: invite.groupId,
    userId: userId,
    role: 'MEMBER',
    amount: invite.amount,
    status: 'pending',
  })

  invite.acceptedAt = new Date()
  await invite.save()

  return NextResponse.redirect(`${process.env.URL}/dashboard`)
}
