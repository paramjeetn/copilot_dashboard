'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@//firebase'
import Navbar from '@/components/Navbar'
import "./globals.css";
import DashboardSkeleton from '@/components/LoadingPages/LoadingSkeleton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isPublicRoute(pathname)) {
        router.push('/');
      }
      setLoading(false); // Ensure this is only called after routing logic
    });
  
    return () => unsubscribe();
  }, [router, pathname]); // Remove router from dependencies
  

  if (loading) {
    return (
      <html lang="en">
      <body>
        <Navbar />
        <div className="ml-64 mr-64 relative">
         

          <DashboardSkeleton />
      
        </div>
      </body>
    </html>
    )
  }

  return (
    <html lang="en">
      <body>
        <Navbar />
          {children}
      </body>
    </html>
  )
}

function isPublicRoute(pathname: string) {
  const publicRoutes = ['/', '/login']
  return publicRoutes.includes(pathname)
}