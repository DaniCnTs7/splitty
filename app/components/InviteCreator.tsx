'use client'

import { useState } from 'react'

export default function InviteCreator({
  groupId,
  amount,
}: {
  groupId: string
  amount: number
}) {
  const [inviteUrl, setInviteUrl] = useState('')

  async function createInvite() {
    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId,
        amount: amount,
      }),
    })

    const invite = await res.json()
    const url = `${window.location.origin}/invite/${invite.token}`

    setInviteUrl(url)
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className='mt-6 space-y-3'>
      <button
        onClick={createInvite}
        className='bg-black text-white px-4 py-2 rounded w-full cursor-pointer'
      >
        Generar invitación
      </button>

      {inviteUrl && (
        <div className='bg-gray-50 border p-3 rounded text-sm'>
          <p className='mb-2'>Invitación copiada al portapapeles:</p>
          <code className='break-all'>{inviteUrl}</code>
        </div>
      )}
    </div>
  )
}
