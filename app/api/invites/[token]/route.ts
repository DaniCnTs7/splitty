import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import { Invite } from '@/lib/db/models/Invite'
import { Group } from '@/lib/db/models/Group'

export async function GET(_: Request, { params }: { params: { token: string } }) {
  await connectDB()

  const { token } = await params

  const invite = await Invite.findOne({ token })

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: 'Invitación inválida' }, { status: 404 })
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invitación expirada' }, { status: 410 })
  }

  const group = await Group.findById(invite.groupId)

  return NextResponse.json({ invite, group })
}
