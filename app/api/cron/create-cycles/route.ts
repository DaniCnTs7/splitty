import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import connectDB from '@/lib/db/mongoose'
import { Group } from '@/lib/db/models/Group'
import { GroupMember } from '@/lib/db/models/GroupMember'
import { PaymentCycle } from '@/lib/db/models/PaymentCycle'

export async function POST() {
  await connectDB()

  const groups = await Group.find({ status: 'ACTIVE' })

  for (const group of groups) {
    const now = dayjs()
    const cycleDate = now.date(group.billingDay).add(1, 'month').toDate()

    const exists = await PaymentCycle.findOne({
      groupId: group._id,
      cycleDate,
    })
    if (exists) continue

    const membersCount = await GroupMember.countDocuments({
      groupId: group._id,
      status: 'ACTIVE',
    })

    const stripeFee = 1.2
    const appFee = (group.totalAmount * group.appFeePercent) / 100

    const totalWithFees = group.totalAmount + stripeFee + appFee

    const memberAmount = Number((totalWithFees / membersCount).toFixed(2))

    await PaymentCycle.create({
      groupId: group._id,
      cycleDate,
      totalAmount: group.totalAmount,
      totalWithFees,
      memberAmount,
    })
  }

  return NextResponse.json({ success: true })
}
