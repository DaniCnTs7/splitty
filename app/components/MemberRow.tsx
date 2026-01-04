export default function MemberRow({ member }: any) {
  return (
    <div className='flex justify-between p-3 border-b last:border-b-0'>
      <span>{member.email}</span>
      <span
        className={`text-sm ${member.status === 'active' ? 'text-green-600' : 'text-red-500'}`}
      >
        {member.status}
      </span>
      <span className='text-sm'>{member.amount} €</span>
    </div>
  )
}
