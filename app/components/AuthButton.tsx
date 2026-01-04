'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className='text-sm bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700 transition'
      >
        Iniciar sesión con Google
      </button>
    )
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className='text-sm bg-gray-200 px-3 py-1 rounded cursor-pointer hover:bg-gray-300 transition'
    >
      Cerrar sesión
    </button>
  )
}
