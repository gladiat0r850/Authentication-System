'use client'
import generateID from "@/utils/generateID";
import { XFetch } from "@/utils/XFetch";
import { useState } from "react";

export default function Home() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  })
  async function Register(){
    await XFetch('https://authentication-system-8.onrender.com/sign-up', {
      method: 'POST',
      body: JSON.stringify({...credentials, id: generateID()})
    })
  }
  return <>
    <input type="text" onChange={e => setCredentials({...credentials, name: e.target.value})} />
    <input type="text" onChange={e => setCredentials({...credentials, email: e.target.value})} />
    <input type="text" onChange={e => setCredentials({...credentials, password: e.target.value})} />
    <button onClick={Register} className="bg-gray-400">register</button>
  </>
}
