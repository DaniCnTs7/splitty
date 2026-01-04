'use server'

import { auth } from '@/auth'
import { connectDB } from '@/lib/db'
import { Group } from '@/models/Group'
import { Membership } from '@/models/Membership'

export async function fetchGroups() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await connectDB()

  const memberships = await Membership.find({
    userId: session.user.id,
  })

  const groupIds = memberships.map((m) => m.groupId)

  const groups = await Group.find({ _id: { $in: groupIds } })

  return groups
}
