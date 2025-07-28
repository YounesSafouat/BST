"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useGlobalLoader } from "@/components/LoaderProvider"
import { useRouter } from "next/navigation"
import { useButtonAnalytics } from '@/hooks/use-analytics'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerData, setHeaderData] = useState<any>(null)
  const [logoVersion, setLogoVersion] = useState(0)
  const { showLoader, hideLoader } = useGlobalLoader()
  const router = useRouter()
  const { trackButtonClick } = useButtonAnalytics()

  const fetchHeaderData = () => {
    fetch("/api/content?type=header&t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setHeaderData(data[0].content)
          setLogoVersion(prev => prev + 1)
        }
      })
      .catch((error) => {
        console.error("Error fetching header data:", error)
        setHeaderData(null)
      })
  }

  useEffect(() => {
    fetchHeaderData()
  }, [])

  const handleNavClick = (path: string) => {
    showLoader();
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            key={`${headerData?.logo?.image}-${headerData?.logo?.size}-${logoVersion}`}
            src={`${headerData?.logo?.image || "/bst.png"}?v=${logoVersion}&t=${Date.now()}`}
            alt={headerData?.logo?.alt || "blackswantechnology"}
            style={{
              width: headerData?.logo?.size || "8em",
              height: "auto",
              maxWidth: "120px",
            }}
            className="object-contain transition-all duration-300 flex-shrink-0"
          />
        </Link>

        {/* Menu Button */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-4 py-6 space-y-4">
          <button
            onClick={() => { trackButtonClick('mobile-nav-hubspot'); handleNavClick('/hubspot'); }}
            className="block w-full text-left text-gray-600 hover:text-black transition-colors font-medium py-2"
          >
            HubSpot
          </button>
          <button
            onClick={() => { trackButtonClick('mobile-nav-about'); handleNavClick('/about'); }}
            className="block w-full text-left text-gray-600 hover:text-black transition-colors font-medium py-2"
          >
            À Propos
          </button>
          <button
            onClick={() => { trackButtonClick('mobile-nav-cas-client'); handleNavClick('/cas-client'); }}
            className="block w-full text-left text-gray-600 hover:text-black transition-colors font-medium py-2"
          >
            Cas Client
          </button>
          <button
            onClick={() => { trackButtonClick('mobile-nav-blog'); handleNavClick('/blog'); }}
            className="block w-full text-left text-gray-600 hover:text-black transition-colors font-medium py-2"
          >
            Blog
          </button>
        </div>
      )}
    </header>
  )
} 