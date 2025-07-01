"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, ArrowRight, ChevronDown, Phone, Mail, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { useGlobalLoader } from "@/components/LoaderProvider"
import { useRouter } from "next/navigation"
import { useButtonAnalytics } from '@/hooks/use-analytics'

interface HeaderProps {
  scrollY: number
  isLoaded: boolean
}

export default function Header({ scrollY, isLoaded }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerData, setHeaderData] = useState<any>(null)
  const { showLoader, hideLoader } = useGlobalLoader()
  const router = useRouter()
  const { trackButtonClick } = useButtonAnalytics()

  useEffect(() => {
    fetchHeaderData()
  }, [])

  const fetchHeaderData = async () => {
    try {
      const response = await fetch("/api/content?type=header")
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setHeaderData(data[0].content)
        }
      }
    } catch (error) {
      console.error("Error fetching header data:", error)
    }
  }

  const handleAppointmentClick = async () => {
    showLoader()
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      window.location.href = headerData?.cta?.url || '/rendez-vous'
    } finally {
      hideLoader()
    }
  }

  const handleNavClick = (path: string) => {
    showLoader();
    router.push(path);
  };

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-5 lg:px-8 transition-all duration-500 rounded-full w-[95%] max-w-7xl mx-auto ${
        scrollY > 50
          ? "backdrop-blur-xl bg-white/80 border border-gray-200/50 shadow-2xl shadow-black/10"
          : "backdrop-blur-md bg-white/60 border border-gray-100/30 shadow-lg"
      } ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/" className="relative">
            <img 
              src={headerData?.logo?.image || "/bst.png"} 
              alt={headerData?.logo?.alt || "blackswantechnology"} 
              className="w-1/2"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          <button
            onClick={() => { trackButtonClick('header-hubspot'); handleNavClick('/hubspot'); }}
            className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2"
          >
            HubSpot
          </button>
          <button
            onClick={() => { trackButtonClick('header-odoo'); handleNavClick('/odoo'); }}
            className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2"
          >
            Odoo
          </button>
          <button
            onClick={() => { trackButtonClick('header-cas-client'); handleNavClick('/cas-client'); }}
            className="text-gray-600 hover:text-black transition-colors duration-200 font-medium text-sm tracking-wide uppercase py-2"
          >
            Cas Client
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-4">
          {headerData?.cta?.isActive && (
            <div className="relative">
              <button
                className="group w-[18em] bg-[var(--color-black)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-main)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                onClick={handleAppointmentClick}
              >
                {headerData.cta.text || "Prendre Rendez-vous"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          <Button
            asChild
            className="rounded-full bg-green-500 border-2 border-white p-0 w-12 h-12 flex items-center justify-center shadow-none transition-all duration-200 hover:bg-white hover:border-green-500 hover:scale-110 focus:outline-none group"
          >
            <a href={`https://wa.me/${headerData?.contact?.phone?.replace(/\D/g, '') || '212XXXXXXXXX'}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="w-6 h-6 text-white group-hover:text-green-500 transition-colors duration-200" />
            </a>
          </Button>
          
          <Button
            asChild
            className="rounded-full bg-[#ff5c35] border-2 border-white p-0 w-12 h-12 flex items-center justify-center shadow-none transition-all duration-200 hover:bg-white hover:border-[#ff5c35] hover:scale-110 focus:outline-none group"
          >
            <a href={`tel:${headerData?.contact?.phone || '+212XXXXXXXXX'}`} aria-label="Telephone">
              <Phone className="w-6 h-6 text-white group-hover:text-[#ff5c35] transition-colors duration-200" />
            </a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-8 space-y-6 rounded-b-3xl">
          <button 
            onClick={() => { trackButtonClick('mobile-hubspot'); handleNavClick('/hubspot'); }} 
            className="block text-gray-600 hover:text-black transition-colors font-medium text-left w-full py-2"
          >
            HubSpot
          </button>
          <button 
            onClick={() => { trackButtonClick('mobile-odoo'); handleNavClick('/odoo'); }} 
            className="block text-gray-600 hover:text-black transition-colors font-medium text-left w-full py-2"
          >
            Odoo
          </button>
          <button 
            onClick={() => { trackButtonClick('mobile-cas-client'); handleNavClick('/cas-client'); }} 
            className="block text-gray-600 hover:text-black transition-colors font-medium text-left w-full py-2"
          >
            Cas Client
          </button>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-black">Contact</h4>
            {headerData?.contact?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-600" />
                <a href={`tel:${headerData.contact.phone}`} className="text-gray-600 text-sm">
                  {headerData.contact.phone}
                </a>
              </div>
            )}
            {headerData?.contact?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <a href={`mailto:${headerData.contact.email}`} className="text-gray-600 text-sm">
                  {headerData.contact.email}
                </a>
              </div>
            )}
            {headerData?.contact?.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">{headerData.contact.address}</span>
              </div>
            )}
          </div>

          {headerData?.cta?.isActive && (
            <div className="pt-4 border-t border-gray-100">
              <Button 
                className="w-full bg-black text-white"
                onClick={handleAppointmentClick}
              >
                {headerData.cta.text || "Prendre Rendez-vous"}
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              asChild
              className="flex-1 bg-green-500 text-white"
            >
              <a href={`https://wa.me/${headerData?.contact?.phone?.replace(/\D/g, '') || '212XXXXXXXXX'}`} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button
              asChild
              className="flex-1 bg-[#ff5c35] text-white"
            >
              <a href={`tel:${headerData?.contact?.phone || '+212XXXXXXXXX'}`}>
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

