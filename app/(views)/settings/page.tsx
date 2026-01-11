'use client'
import { useEffect, useState } from 'react'
import PaymentStatusCard from '../../components/payments/PaymentStatusCard'
import AddCardMethod from '../../components/payments/AddCardMethod'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe-client'

export default function PaymentsSettingsPage() {
  const [paymentState, setPaymentState] = useState({
    canPay: false,
    canReceive: false,
  })

  useEffect(() => {
    async function fetchPaymentState() {
      const res = await fetch('/api/user/payment-state')
      const data = await res.json()
      setPaymentState(data)
    }
    fetchPaymentState()
  }, [])

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold'>Pagos</h1>
        <p className='text-gray-500'>Gestiona cómo envías y recibes dinero en tus grupos.</p>
      </header>
      <PaymentStatusCard canReceive={paymentState.canReceive} canPay={paymentState.canPay} />
      <Elements stripe={stripePromise}>
        <AddCardMethod
          hasCard={paymentState.canPay}
          onAddCard={() => setPaymentState({ ...paymentState, canPay: true })}
          isToReceivePayments={false}
        />

        <AddCardMethod
          hasCard={paymentState.canReceive}
          onAddCard={() => setPaymentState({ ...paymentState, canReceive: true })}
          isToReceivePayments={true}
        />
      </Elements>
    </div>
  )
}
