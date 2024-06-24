'use client'
import { useEffect, useState } from 'react'
import { useRouter } from '@/navigation'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/user/logoutUser`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw response
        }
        return response.json() // we only get here if there is no error
      })
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        setError(err)
      })
  }, [router])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
