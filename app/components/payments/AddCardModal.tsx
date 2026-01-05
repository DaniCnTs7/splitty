'use client'
import AddCardForm from './AddCardForm'

export default function AddCardModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg max-w-md w-full space-y-4'>
        <h3 className='text-lg font-medium'>Añadir tarjeta</h3>

        <AddCardForm
          onSuccess={() => {
            onSuccess()
            onClose()
          }}
        />

        <button
          className='text-gray-500 underline mt-2 cursor-pointer border p-2 rounded-md'
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
