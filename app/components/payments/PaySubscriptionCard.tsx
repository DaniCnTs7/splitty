'use client'

import { useState } from 'react'
import AddCardModal from './AddCardModal'

export default function PaySubscriptionCard({
  hasCard,
  onAddCard,
}: {
  hasCard: boolean
  onAddCard: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!hasCard ? (
        <button
          className='w-full cursor-pointer border p-2 rounded-md bg-amber-300'
          onClick={() => setOpen(true)}
        >
          Añadir tarjeta
        </button>
      ) : (
        <button
          className='w-full cursor-pointer border p-2 rounded-md'
          onClick={() => setOpen(true)}
        >
          Cambiar tarjeta
        </button>
      )}

      {open && <AddCardModal onClose={() => setOpen(false)} onSuccess={onAddCard} />}
    </>
  )
}
