import Link from 'next/link'

export default function GroupCard({ group }: any) {
  return (
    <Link
      key={group._id}
      href={`/groups/${group._id}`}
      className='border rounded p-4 hover:bg-gray-50 block'
    >
      <h2 className='font-medium'>{group.name}</h2>
      <p className='text-sm text-gray-500'>
        {group.maxMembers} miembros · {group.totalAmount} €/mes
      </p>
    </Link>
  )
}
