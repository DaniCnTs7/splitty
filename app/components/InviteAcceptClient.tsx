'use client'

import { useSession, signIn } from 'next-auth/react'
import { useTransition } from 'react'
import { acceptInviteAction } from '../api/invites/[token]/actions'

export default function InviteAcceptClient({ token }: { token: string }) {
  const { data: session, status } = useSession()
  const [isPending, startTransition] = useTransition()

  if (status === 'loading') {
    return <p>Comprobando sesión...</p>
  }

  function onAccept() {
    if (!session) {
      signIn('google', {
        callbackUrl: `/invite/${token}`,
      })
      return
    }

    startTransition(async () => {
      await acceptInviteAction(token)
    })
  }

  return (
    <button
      onClick={onAccept}
      disabled={isPending}
      className='bg-black text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {session
        ? isPending
          ? 'Procesando...'
          : 'Aceptar invitación'
        : 'Inicia sesión para aceptar'}
    </button>
  )
}
