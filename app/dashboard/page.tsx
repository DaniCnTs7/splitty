import { auth } from '@/auth'
import GroupCard from '../components/GroupCard'
import { fetchGroups } from './actions'

export default async function Dashboard() {
  const groups = await fetchGroups()

  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return <p className='flex justify-center'>No estás en ningún grupo aún.</p>
  }

  return (
    <>
      <h1 className='text-2xl font-semibold mb-4'>Tus grupos</h1>

      <div className='grid gap-4'>
        {groups.map((group: any) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>
    </>
  )
}
