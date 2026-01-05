type Props = {
  canReceive: boolean
  canPay: boolean
}

export default function PaymentStatusCard({ canReceive, canPay }: Props) {
  const isComplete = canReceive && canPay

  return (
    <div className='border rounded-lg p-4 bg-white'>
      <h2 className='font-medium mb-1'>Estado de pagos</h2>

      {isComplete ? (
        <p className='text-green-600'>✔ Todo listo para enviar y recibir pagos</p>
      ) : (
        <p className='text-yellow-600'>⚠️ Completa tu configuración de pagos</p>
      )}
    </div>
  )
}
