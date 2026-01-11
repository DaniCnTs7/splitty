'use client'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'

export default function AddCardForm({
  onSuccess,
  isToReceivePayments,
}: {
  onSuccess: () => void
  isToReceivePayments: boolean
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  if (!stripe || !elements) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = isToReceivePayments
        ? '/api/payment-method/owner'
        : '/api/payment-method/member'
      const res = await fetch(apiUrl, { method: 'POST' })
      const { clientSecret } = await res.json()

      const card = elements.getElement(CardElement)
      if (!card) throw new Error('No se encontró el CardElement')

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card },
      })

      setLoading(false)

      if (result.error) {
        setLoading(false)
        alert(result.error.message || 'Error guardando tarjeta')
        return
      }

      const { setupIntent } = result
      const paymentMethodId = setupIntent.payment_method

      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
        }),
      })

      setLoading(false)
      onSuccess()
    } catch (err: any) {
      setLoading(false)
      alert(err.message || 'Error guardando tarjeta')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <CardElement options={{ hidePostalCode: true }} />
      <button
        type='submit'
        className='btn-primary w-full cursor-pointer border p-2 rounded-md'
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar tarjeta'}
      </button>
    </form>
  )
}
