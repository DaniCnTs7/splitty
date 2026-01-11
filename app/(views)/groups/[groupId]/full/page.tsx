export default async function GroupFullPage({ params }: { params: { groupId: string } }) {
  const { groupId } = await params

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold mb-4'>Grupo Completo</h1>
      <p className='text-center max-w-md'>
        Lo sentimos, el grupo {groupId} ya ha alcanzado su número máximo de miembros. No puedes
        unirte en este momento.
      </p>
    </div>
  )
}
