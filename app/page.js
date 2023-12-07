import Image from 'next/image'
import { getUserSession } from '@/lib/session'

export default async function Home() {
  const user = await getUserSession()
  return (
    <main className="">
      {user ? <div>
        <p className="mb-3">Name: {user.name}</p>
        <p className="mb-3">Email: {user.email}</p>
        <p>Image: {user.image}</p>
        <a href="/api/auth/signout">Sign Out</a>
      </div> :
      <div>
        <p>unauthorized</p>
        <a href="/api/auth/signin">Sign In</a>
      </div>}
    </main>
  )
}
