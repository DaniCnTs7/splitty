'use client'

import { useState } from 'react'

export default function ConnectOnboarding({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  async function startOnboarding() {
    try {
      setLoading(true)

      const res1 = await fetch('/api/stripe/connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const { accountId } = await res1.json()

      const res2 = await fetch('/api/stripe/connect-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      })

      const { url } = await res2.json()

      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Error iniciando onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='border rounded-lg p-4 space-y-3'>
      <h2 className='text-lg font-medium'>Configura cómo recibir pagos</h2>

      <p className='text-sm text-muted-foreground'>
        Necesitamos que completes el proceso para poder enviarte los pagos automáticamente.
      </p>

      <button
        onClick={startOnboarding}
        disabled={loading}
        className='px-4 py-2 rounded bg-black text-white disabled:opacity-50 cursor-pointer'
      >
        {loading ? 'Redirigiendo…' : 'Configurar ahora'}
      </button>
    </div>
  )
}
