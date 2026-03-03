'use client'
import { Credentials } from "@/types"
import { XFetch } from "@/utils/XFetch"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Page = () => {
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: ''
    })
    const router = useRouter()
    async function Log_in(){
        if(credentials.password && credentials.email){
            const response = await XFetch('https://authentication-system-8.onrender.com/log-in', {
                body: JSON.stringify({...credentials}),
                method: 'POST'
            })
            if(response.ok){
                router.push('/')
            }
        }
    }
  return <>
    <input type="text" onChange={e => setCredentials({...credentials, email: e.target.value})} />
    <input type="text" onChange={e => setCredentials({...credentials, password: e.target.value})} />
    <button onClick={Log_in} className="bg-gray-400">log in</button>
  </>
}

export default Page