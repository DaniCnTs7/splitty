'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Navbar() {
  return (
    <nav className='flex items-center justify-between p-4 border-b'>
      <Link href='/' className='font-bold text-lg'>
        Splitty
      </Link>

      <div className='flex gap-4'>
        <Link href='/dashboard'>Dashboard</Link>
        <Link href='/groups/new'>Nuevo grupo</Link>
        <Link href='/settings'>Ajustes</Link>
        <AuthButton />
      </div>
    </nav>
  )
}
