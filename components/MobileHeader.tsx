"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import { useGlobalLoader } from "@/components/LoaderProvider"
import { useRouter } from "next/navigation"
import { useButtonAnalytics } from '@/hooks/use-analytics'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from "framer-motion"
import { getUserLocation, getRegionFromCountry } from '@/lib/geolocation'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [location, setLocation] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const { showLoader, hideLoader } = useGlobalLoader()
  const router = useRouter()
  const { trackButtonClick } = useButtonAnalytics()

  // Detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const userLocation = await getUserLocation();
        setLocation(userLocation);
      } catch (error) {
        console.error("Error detecting location for mobile header:", error);
      }
    };

    detectLocation();
  }, []);

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
        } else {
          console.error('Failed to fetch contact data for mobile header:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contact data for mobile header:', error);
      }
    };

    fetchContactData();
  }, []);

  // Update WhatsApp number based on detected region
  useEffect(() => {
    if (location && contactData) {
      const region = getRegionFromCountry(location.countryCode);

      let whatsapp: string | null = null;
      let phone: string | null = null;

      switch (region) {
        case 'france':
          whatsapp = contactData.france?.whatsapp || null;
          phone = contactData.france?.phone || null;
          break;
        case 'morocco':
          whatsapp = contactData.morocco?.whatsapp || null;
          phone = contactData.morocco?.phone || null;
          break;
        default:
          whatsapp = contactData.other?.whatsapp || null;
          phone = contactData.other?.phone || null;
          break;
      }
      setWhatsappNumber(whatsapp);
      setPhoneNumber(phone);
    }
  }, [location, contactData]);

  const navigation = [
    { name: 'Solutions', href: '#modules' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Notre Agence', href: '#team' },
    { name: 'Témoignages', href: '#testimonials' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST%20black.svg" alt="BlackSwan" className="h-8" />
          </div>

          {/* Contact Actions */}
          <div className="flex items-center gap-3 ml-auto mr-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-gray-700 hover:text-[var(--color-main)] h-8 px-2"
              onClick={() => {
                if (phoneNumber) {
                  window.open(`tel:${phoneNumber}`)
                } else {
                  // Fallback to default number
                  window.open('tel:+212783699603')
                }
              }}
            >
              <Phone className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 bg-green-500 hover:bg-green-600 text-white h-8 w-8 p-0 transition-all duration-300 hover:scale-110 rounded-full"
              onClick={() => whatsappNumber && window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank')}
              disabled={!whatsappNumber}
            >
              <WhatsAppIcon className="w-3 h-3" />
            </Button>
          </div>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-t"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Prendre RDV Button - Prominent at top */}
              <div className="pb-4 border-b border-gray-200">
                <Button
                  onClick={() => {
                    scrollToSection('#contact');
                    trackButtonClick('mobile_header_rdv_button');
                  }}
                  className="w-full bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Prendre RDV
                </Button>
              </div>

              {/* Navigation Items */}
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-gray-600 hover:text-[var(--color-main)] transition-colors font-medium py-2"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
} 