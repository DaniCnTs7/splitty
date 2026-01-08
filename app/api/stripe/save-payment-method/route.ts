import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import { Membership } from '@/models/Membership'

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

  const memberships = await Membership.find({ userId: user.id })
  memberships.forEach((membership) => (membership.paymentMethodConfigured = true))
  await Membership.bulkSave(memberships)

  return NextResponse.json({ ok: true })
}
