'use client'
import { useState } from 'react'

type Props = {
  onSuccess: () => void
}

export default function OwnerCustomForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    day: '',
    month: '',
    year: '',
    line1: '',
    city: '',
    postalCode: '',
    iban: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/stripe/connect/custom', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        dob: {
          day: Number(form.day),
          month: Number(form.month),
          year: Number(form.year),
        },
        address: {
          line1: form.line1,
          city: form.city,
          postalCode: form.postalCode,
        },
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) onSuccess()
    else alert('Error creando cuenta: ' + JSON.stringify(data))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 border p-4 rounded-lg bg-white'>
      <h2 className='text-lg font-medium'>Configura cómo recibir pagos</h2>

      <div className='grid grid-cols-2 gap-2'>
        <input
          name='firstName'
          placeholder='Nombre'
          onChange={handleChange}
          required
          className='input border border-black p-1 rounded-lg'
        />
        <input
          name='lastName'
          placeholder='Apellido'
          onChange={handleChange}
          required
          className='input border border-black p-1 rounded-lg'
        />
      </div>
      <div className='flex w-full justify-between gap-2'>
        <input
          name='email'
          placeholder='Email'
          onChange={handleChange}
          type='email'
          required
          className='w-full input border border-black p-1 rounded-lg'
        />

        <div className='flex gap-2'>
          <input
            name='day'
            placeholder='DD'
            onChange={handleChange}
            required
            className='input border border-black p-1 rounded-lg w-16'
          />
          <input
            name='month'
            placeholder='MM'
            onChange={handleChange}
            required
            className='input border border-black p-1 rounded-lg w-16'
          />
          <input
            name='year'
            placeholder='YYYY'
            onChange={handleChange}
            required
            className='input border border-black p-1 rounded-lg w-20'
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <input
          name='line1'
          placeholder='Dirección'
          onChange={handleChange}
          required
          className='input border border-black p-1 rounded-lg'
        />
        <input
          name='city'
          placeholder='Ciudad'
          onChange={handleChange}
          required
          className='input border border-black p-1 rounded-lg'
        />
        <input
          name='postalCode'
          placeholder='Código postal'
          onChange={handleChange}
          required
          className='input border border-black p-1 rounded-lg'
        />
      </div>

      <input
        name='iban'
        placeholder='IBAN'
        onChange={handleChange}
        required
        className='w-full input border border-black p-1 rounded-lg'
      />

      <button
        type='submit'
        className='btn-primary w-full cursor-pointer border p-2 rounded-md bg-black text-white'
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
