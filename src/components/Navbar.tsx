'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center h-4">
        <div className="text-xl font-bold">Elyx</div>
        {userEmail && (
          <div className="flex items-center space-x-4">
            <span>{userEmail}</span>
            <Button onClick={handleSignOut}  className="bg-black
            hover:bg-gray-700 text-white">
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}