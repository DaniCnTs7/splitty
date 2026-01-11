import InviteAcceptClient from '@/app/components/InviteAcceptClient'
import { notFound } from 'next/navigation'

async function getInvite(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invites/${token}`, {
    cache: 'no-store',
  })

  if (!res.ok) return null
  return res.json()
}

export default async function InvitePage({ params }: { params: { token: string } }) {
  const { token } = await params
  const data = await getInvite(token)
  if (!data) notFound()

  const { invite, group } = data

  return (
    <div className='max-w-md mx-auto text-center'>
      <h1 className='text-2xl font-semibold mb-4'>Invitación a {group.name}</h1>

      <p className='mb-6'>
        Pagarás <strong>{invite.amount} € / mes</strong>
      </p>

      <InviteAcceptClient token={token} />
    </div>
  )
}
