"use client"

import { Phone, FileText, Users } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { useButtonAnalytics } from '@/hooks/use-analytics'

interface BottomNavigationProps {
  headerData?: any
}

export default function BottomNavigation({ headerData }: BottomNavigationProps) {
  const { trackButtonClick } = useButtonAnalytics()

  const handlePhoneClick = () => {
    trackButtonClick('bottom-nav-phone')
    window.location.href = `tel:${headerData?.contact?.phone || '+212XXXXXXXXX'}`
  }

  const handleWhatsAppClick = () => {
    trackButtonClick('bottom-nav-whatsapp')
    window.open(`https://wa.me/${headerData?.contact?.phone?.replace(/\D/g, '') || '212XXXXXXXXX'}`, '_blank')
  }

  const handleBlogClick = () => {
    trackButtonClick('bottom-nav-blog')
  }

  const handleCasClientClick = () => {
    trackButtonClick('bottom-nav-cas-client')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 divide-x divide-gray-200/50 shadow-lg">
        {/* Phone Button */}
        <button
          onClick={handlePhoneClick}
          className="flex-1 px-4 py-3 font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100/80 hover:text-[var(--color-main)] flex flex-col items-center gap-1 active:scale-95"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-medium">Téléphone</span>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 px-4 py-3 font-medium text-gray-600 transition-all duration-200 hover:bg-green-50/80 hover:text-green-600 flex flex-col items-center gap-1 active:scale-95"
        >
          <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-medium">WhatsApp</span>
        </button>

        {/* Blog Button */}
        <Link
          href="/blog"
          onClick={handleBlogClick}
          className="flex-1 px-4 py-3 font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50/80 hover:text-blue-600 flex flex-col items-center gap-1 active:scale-95"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-medium">Blog</span>
        </Link>

        {/* Cas Client Button */}
        <Link
          href="/cas-client"
          onClick={handleCasClientClick}
          className="flex-1 px-4 py-3 font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50/80 hover:text-purple-600 flex flex-col items-center gap-1 active:scale-95"
        >
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-medium">Cas Client</span>
        </Link>
      </div>
    </div>
  )
} 