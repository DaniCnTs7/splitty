'use server'

import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import { Group } from '@/lib/db/models/Group'
import { GroupMember } from '@/lib/db/models/GroupMember'

export async function fetchGroups() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await connectDB()

  const members = await GroupMember.find({
    userId: session.user.id,
  })

  const groupIds = members.map((m) => m.groupId)

  const groups = await Group.find({ _id: { $in: groupIds } })

  return groups
}
