import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Group } from '@/models/Group'
import { Membership } from '@/models/Membership'
import { getUserFromSession } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, totalAmount, billingDay, totalMembers } = body
  const user = await getUserFromSession()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const group = await Group.create({
    name,
    totalMembers,
    totalAmount,
    billingDay,
    stripeConnectAccountId: user.stripeConnectAccountId,
    ownerId: user,
  })

  const membershipAmount = Number(totalAmount / totalMembers)

  await Membership.create({
    groupId: group._id,
    userId: user,
    role: 'OWNER',
    amount: membershipAmount,
    status: 'pending',
    paymentMethodConfigured: user.hasPaymentMethod,
  })

  return NextResponse.json(group)
}
