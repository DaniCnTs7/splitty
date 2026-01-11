import { NextResponse } from 'next/server'
import { Group } from '@/lib/db/models/Group'
import { GroupMember } from '@/lib/db/models/GroupMember'
import { User } from '@/lib/db/models/User'
import { withAuth } from '@/lib/with-auth'

export const POST = withAuth(async (_, { params, session }) => {
  const members = await GroupMember.find({
    groupId: params.groupId,
    status: 'ACTIVE',
  })

  const users = await User.find({
    _id: { $in: members.map((m) => m.userId) },
  })

  const allHavePayment = users.every((u) => u.defaultPaymentMethodId)
  const owner = users.find((u) => u._id.equals(session.user.id))

  if (!allHavePayment || !owner?.payoutPaymentMethodId) {
    return NextResponse.json({ error: 'Missing payment methods' }, { status: 400 })
  }

  await Group.findByIdAndUpdate(params.groupId, { status: 'ACTIVE' })

  return NextResponse.json({ success: true })
})
