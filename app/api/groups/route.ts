import { withAuth } from '@/lib/with-auth'
import { Group } from '@/lib/db/models/Group'
import { GroupMember } from '@/lib/db/models/GroupMember'
import { NextResponse } from 'next/server'

export const POST = withAuth(async (req, { session }) => {
  const body = await req.json()
  const { name, totalAmount, billingDay, maxMembers } = body
  console.log(maxMembers)
  try {
    const group = await Group.create({
      name,
      totalAmount,
      billingDay,
      maxMembers,
      ownerId: session.user.id,
    })

    await GroupMember.create({
      groupId: group._id,
      userId: session.user.id,
      role: 'OWNER',
    })
    return NextResponse.json(group)
  } catch (error: any) {
    return NextResponse.json({ error })
  }
})
