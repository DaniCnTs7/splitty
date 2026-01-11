import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import connectDB from '@/lib/db/mongoose'
import { Invite } from '@/lib/db/models/Invite'

export async function POST(req: Request) {
  const { groupId, amount } = await req.json()

  await connectDB()

  const invite = await Invite.create({
    groupId,
    amount,
    token: randomUUID(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 días
  })

  return NextResponse.json(invite)
}
