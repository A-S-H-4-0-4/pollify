// react
import { useEffect } from "react";


// next
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (window.Object !== undefined) {
      router.push("/home")
    }


    return () => { }
  }, [])
  return (
    <div>
    </div>
  )
}