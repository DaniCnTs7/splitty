import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { payment_method_id } = await req.json()

  if (!payment_method_id)
    return NextResponse.json({ error: 'No payment_method_id provided' }, { status: 400 })

  user.paymentMethodId = payment_method_id
  await user.save()

  return NextResponse.json({ ok: true })
}
