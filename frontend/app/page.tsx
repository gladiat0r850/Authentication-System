'use client'
import useUser from "@/hooks/scanForUser";
import { XFetch } from "@/utils/XFetch";

export default function Home() {
  const {user, setUser} = useUser()
  async function signOut(){
    await XFetch('https://authentication-system-4cka.onrender.com/sign-out', {
      method: 'POST'
    })
    setUser(null)
  }  
  return <div className="flex justify-around">
    <h1>{user?.name}</h1>
    <button onClick={signOut} className="bg-red-400">sign out</button>
  </div>
}
