"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from '@/components/theme-provider'
import RouteLoader from "@/components/RouteLoader"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()

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

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RouteLoader />
      {!isDashboard && <Header scrollY={scrollY} isLoaded={isLoaded} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </ThemeProvider>
  )
} 