'use client'

import { useRouter } from 'next/navigation'

export default function NewGroup() {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    const data = {
      name: form.name.value,
      totalAmount: Number(form.totalAmount.value),
      billingDay: Number(form.billingDay.value),
      totalMembers: Number(form.totalMembers.value),
    }

    const response = await fetch('/api/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.redirected) router.push(response.url)
    else router.push('/dashboard')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='mx-auto space-y-4 max-w-md w-full'>
        <h1 className='text-2xl font-semibold mb-4'>Crear nuevo grupo</h1>

        <input
          name='name'
          placeholder='Nombre (Netflix, Spotify...)'
          className='w-full border p-2 rounded'
        />
        <input
          name='totalAmount'
          type='number'
          placeholder='Precio total'
          className='w-full border p-2 rounded'
        />
        <input
          name='billingDay'
          type='number'
          placeholder='Día de cobro (1-28)'
          className='w-full border p-2 rounded'
        />

        <input
          name='totalMembers'
          type='number'
          placeholder='Número total de miembros'
          className='w-full border p-2 rounded'
        />

        <button className='bg-black text-white px-4 py-2 rounded cursor-pointer'>Crear</button>
      </form>
    </>
  )
}
