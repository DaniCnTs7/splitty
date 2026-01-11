'use client'

import { useState } from 'react'
import AddCardModal from './AddCardModal'

export default function AddCardMethod({
  hasCard,
  onAddCard,
  isToReceivePayments,
}: {
  hasCard: boolean
  onAddCard: () => void
  isToReceivePayments: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!hasCard ? (
        <button
          className='w-full cursor-pointer border p-2 rounded-md bg-amber-300 font-bold'
          onClick={() => setOpen(true)}
        >
          {isToReceivePayments
            ? 'Añade tu tarjeta para recibir pagos (la misma con la que pagas la suscripción)'
            : 'Añade tu tarjeta para realizar los pagos'}
        </button>
      ) : (
        <button
          className='w-full cursor-pointer border p-2 rounded-md bg-green-600'
          onClick={() => setOpen(true)}
        >
          {isToReceivePayments
            ? 'Cambia tu tarjeta para recibir pagos (la misma con la que pagas la suscripción)'
            : 'Cambia tu tarjeta para realizar los pagos'}
        </button>
      )}

      {open && (
        <AddCardModal
          isToReceivePayments={isToReceivePayments}
          onClose={() => setOpen(false)}
          onSuccess={onAddCard}
        />
      )}
    </>
  )
}
