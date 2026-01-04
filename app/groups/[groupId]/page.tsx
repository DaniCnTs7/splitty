import InviteCreator from '@/app/components/InviteCreator'

async function getGroup(id: string) {
  const res = await fetch(`${process.env.URL}/api/groups/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const { groupId } = await params
  const { group, members } = await getGroup(groupId)

  return (
    <>
      <h1 className='text-2xl mb-2'>{group.name}</h1>
      <p>Total: {group.totalAmount} €</p>

      <ul className='mt-4'>
        {members.map((m: any) => (
          <li key={m._id} className='border border-gray-300 rounded-md p-2 mb-2'>
            {m.user.name} · {m.amount} € · {m.status}
          </li>
        ))}
      </ul>

      {members.length >= group.totalMembers ? (
        <p className='mt-4 text-center text-green-500 font-bold'>
          ¡Todos los miembros han aceptado!
        </p>
      ) : (
        <InviteCreator
          groupId={groupId}
          amount={Number(group.totalAmount / group.totalMembers)}
        />
      )}
    </>
  )
}
