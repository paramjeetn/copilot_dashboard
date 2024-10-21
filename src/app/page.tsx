'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import LoginModal from '@/components/AuthModals/LoginModal'
// import RegisterModal from '@/components/AuthModals/RegisterModal'

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(true)
  // const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const openLoginModal = () => {
    setIsLoginOpen(true)
    // setIsRegisterOpen(false)
  }

  // const openRegisterModal = () => {
  //   setIsLoginOpen(false)
  //   setIsRegisterOpen(true)
  // }

  const closeModals = () => {
    setIsLoginOpen(false)
    // setIsRegisterOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
      <Button onClick={openLoginModal}>Login</Button>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeModals}
        // onSwitchToRegister={openRegisterModal}
      />
      {/* <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
      /> */}
    </main>
  )
}