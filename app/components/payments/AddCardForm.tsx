'use client'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'

export default function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  if (!stripe || !elements) return null // ⚡ evita error de null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/stripe/setup-intent', { method: 'POST' })
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

      const saveRes = await fetch('/api/stripe/save-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method_id: result.setupIntent?.payment_method }),
      })

      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Error guardando el payment method')

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
