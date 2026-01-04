import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Membership } from '@/models/Membership'
import { Group } from '@/models/Group'
import { User } from '@/models/User'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const group = await Group.findById(id)
  const members = await Membership.find({ groupId: id })
  const memberDetails = await Promise.all(
    members.map(async (member) => {
      const user = await User.findById(member.userId)
      return {
        ...member.toObject(),
        user: {
          name: user?.name,
          email: user?.email,
        },
      }
    })
  )
  return NextResponse.json({ group, members: memberDetails })
}
