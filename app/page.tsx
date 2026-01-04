import Link from 'next/link'

export default function Home() {
  return (
    <section className='text-center py-20'>
      <h1 className='text-4xl font-bold mb-4'>Comparte suscripciones sin perseguir a nadie</h1>
      <p className='text-gray-600 mb-8'>
        Divide pagos recurrentes automáticamente entre amigos.
      </p>

      <Link href='/dashboard' className='inline-block bg-black text-white px-6 py-3 rounded'>
        Empezar
      </Link>
    </section>
  )
}
