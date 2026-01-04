import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Membership } from '@/models/Membership'
import { Group } from '@/models/Group'
import { auth } from '@/auth'

export async function GET() {
  await connectDB()

  const userId = await auth()
  console.log('User ID:', userId)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const memberships = await Membership.find({
    userId: userId,
  })

  const groupIds = memberships.map((m) => m.groupId)

  const groups = await Group.find({ _id: { $in: groupIds } })

  return NextResponse.json(groups)
}
