"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from '@/components/theme-provider'
import { usePageAnalytics } from '@/hooks/use-analytics'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()

  usePageAnalytics();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const isDashboard = pathname ? pathname.startsWith('/dashboard') : false
  const isAuth = pathname ? pathname.startsWith('/auth') : false
  const isMaintenance = pathname ? pathname === '/maintenance' : false
  const isPreview = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('preview') === 'true' : false

  return (
    <ThemeProvider>
      {!isDashboard && !isAuth && !isMaintenance && !isPreview && <Header scrollY={scrollY} isLoaded={isLoaded} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && !isAuth && !isMaintenance && !isPreview && <Footer />}
    </ThemeProvider>
  )
} 