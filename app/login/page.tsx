import AuthButton from '../components/AuthButton'

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold mb-6'>Iniciar sesión</h1>
      <p className='text-center mb-4'>
        Por favor, inicia sesión para acceder a tu panel de control y gestionar tus grupos.
      </p>
    </div>
  )
}
