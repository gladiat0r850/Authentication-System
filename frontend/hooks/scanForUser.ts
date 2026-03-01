import { User } from "@/types";
import { XFetch } from "@/utils/XFetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useUser(){
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  useEffect(()  => {
    async function getUser(){
      try{
      const response = await XFetch('http://localhost:4500/verify-token', {
        method: 'GET'
      })
      const res = await response.json()
      setUser(res)
    }catch(error){
      console.log(error)
    }
    }
    getUser()
  }, [])
  return {user, setUser}
}