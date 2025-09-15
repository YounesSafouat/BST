/**
 * BottomNavigation.tsx
 * 
 * Bottom navigation component that provides quick access to key actions
 * on mobile devices. This component includes contact buttons, blog access,
 * and client case studies with regional contact information.
 * 
 * WHERE IT'S USED:
 * - Root layout (/app/layout.tsx) - Mobile bottom navigation
 * - Automatically included in every page through the root layout
 * - Only visible on mobile devices (hidden on desktop)
 * 
 * KEY FEATURES:
 * - Quick access to phone and WhatsApp contact
 * - Blog and client case studies navigation
 * - Regional contact number selection based on location
 * - Analytics tracking for user interactions
 * - Responsive design with hover effects
 * - Fixed bottom positioning for easy access
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Integrates with geolocation API for regional content
 * - Fetches contact data from CMS API
 * - Implements analytics tracking for user interactions
 * - Uses Next.js Link for navigation
 * - Responsive design with Tailwind CSS
 * - Handles fallback contact information
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import { Phone, FileText, Users } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { useButtonAnalytics } from '@/hooks/use-analytics'
import { useEffect, useState } from 'react'
import { getRegionFromCountry } from '@/lib/geolocation'
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'

interface BottomNavigationProps {
  headerData?: any
}

export default function BottomNavigation({ headerData }: BottomNavigationProps) {
  const { trackButtonClick } = useButtonAnalytics()
  const [contactData, setContactData] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const { data: location, loading: locationLoading } = useGeolocationSingleton();

  // Fetch regional contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.content?.regionalContact) {
            setContactData(data.content.regionalContact);
          }
        }
      } catch (error) {
        console.error('Error fetching contact data for bottom navigation:', error);
      }
    };

    fetchContactData();
  }, []);

  // Update contact numbers based on detected region
  useEffect(() => {
    if (location && contactData) {
      const region = getRegionFromCountry(location.countryCode);

      let phone: string | null = null;
      let whatsapp: string | null = null;

      switch (region) {
        case 'france':
          phone = contactData.france?.phone || null;
          whatsapp = contactData.france?.whatsapp || null;
          break;
        case 'morocco':
          phone = contactData.morocco?.phone || null;
          whatsapp = contactData.morocco?.whatsapp || null;
          break;
        default:
          phone = contactData.other?.phone || null;
          whatsapp = contactData.other?.whatsapp || null;
          break;
      }

      setPhoneNumber(phone);
      setWhatsappNumber(whatsapp);
    }
  }, [location, contactData]);

  const handlePhoneClick = () => {
    trackButtonClick('bottom-nav-phone')
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`
    } else {
      // Fallback to header data or default
      const fallbackPhone = headerData?.contact?.phone || '+212XXXXXXXXX'
      window.location.href = `tel:${fallbackPhone}`
    }
  }

  const handleWhatsAppClick = () => {
    trackButtonClick('bottom-nav-whatsapp')
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank')
    } else {
      // Fallback to header data or default
      const fallbackWhatsApp = headerData?.contact?.phone?.replace(/\D/g, '') || '212XXXXXXXXX'
      window.open(`https://wa.me/${fallbackWhatsApp}`, '_blank')
    }
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
          className="flex-1 px-4 py-3 font-medium text-gray-600 transition-all duration-200 hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-secondary)] flex flex-col items-center gap-1 active:scale-95"
        >
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs font-medium">Cas Client</span>
        </Link>
      </div>
    </div>
  )
} 