/**
 * MobileHeader.tsx
 * 
 * Mobile header component that provides navigation and contact functionality
 * for mobile devices. This component includes responsive design, regional
 * contact information, and smooth navigation features.
 * 
 * WHERE IT'S USED:
 * - Root layout (/app/layout.tsx) - Mobile navigation header
 * - Automatically included in every page through the root layout
 * - Only visible on mobile devices (hidden on desktop)
 * 
 * KEY FEATURES:
 * - Responsive mobile navigation with hamburger menu
 * - Regional contact information (phone, WhatsApp)
 * - Dynamic logo and branding from CMS
 * - Smooth scrolling to page sections
 * - Meeting scheduling integration
 * - Location-based contact number selection
 * - Analytics tracking for user interactions
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements framer-motion for smooth animations
 * - Integrates with geolocation API for regional content
 * - Fetches header and contact data from CMS APIs
 * - Handles navigation between pages and sections
 * - Uses Next.js router for page navigation
 * - Implements responsive design with Tailwind CSS
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useGlobalLoader } from "@/components/LoaderProvider"
import { useRouter } from "next/navigation"
import { useButtonAnalytics } from '@/hooks/use-analytics'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from "framer-motion"
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [contactData, setContactData] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<any>(null);
  const { showLoader, hideLoader } = useGlobalLoader()
  const router = useRouter()
  const { trackButtonClick } = useButtonAnalytics()
  const { region: userRegion, loading: locationLoading } = useGeolocationSingleton();

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isScrolled = scrollY > 0;

  // Fetch header data from CMS
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch('/api/content?type=header');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const headerContent = data.find(item => item.type === 'header');
            if (headerContent && headerContent.content) {
              setHeaderData(headerContent.content);
            }
          }
        } else {
          console.error('Failed to fetch header data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };

    fetchHeaderData();
  }, []);

  // Fetch regional contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content?type=settings');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const settingsContent = data.find(item => item.type === 'settings');
            if (settingsContent && settingsContent.content?.regionalContact) {
              setContactData(settingsContent.content.regionalContact);
            }
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
    if (userRegion && contactData) {
      let whatsapp: string | null = null;

      switch (userRegion) {
        case 'france':
          whatsapp = contactData.france?.whatsapp || null;
          break;
        case 'morocco':
          whatsapp = contactData.morocco?.whatsapp || null;
          break;
        default:
          whatsapp = contactData.other?.whatsapp || null;
          break;
      }
      setWhatsappNumber(whatsapp);
    }
  }, [userRegion, contactData]);

  // Get meeting link based on detected region
  const getMeetingLink = () => {
    if (userRegion && contactData) {
      switch (userRegion) {
        case 'france':
          return contactData.france?.meetingLink;
        case 'morocco':
          return contactData.morocco?.meetingLink;
        default:
          return contactData.other?.meetingLink;
      }
    }
    // Fallback to Morocco if no location detected
    return contactData?.morocco?.meetingLink;
  };

  const meetingLink = getMeetingLink();

  // Function to get logo size class
  const getLogoSizeClass = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      '6': 'h-6',
      '8': 'h-8',
      '10': 'h-10',
      '12': 'h-12',
      '14': 'h-14',
      '16': 'h-16',
      '20': 'h-20',
      '24': 'h-24',
      '32': 'h-32'
    };
    return sizeMap[size] || 'h-8';
  };

  // Use CMS navigation data or fallback to default
  const navigation = headerData?.navigation?.main || [
    { name: 'Solutions', href: '#modules' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Notre Agence', href: '#team' },
    { name: 'Témoignages', href: '#testimonials' },
  ];

  const handleNavigationClick = (item: any) => {
    const href = item.href || '';
    const isPage = item.type === 'page' || (href.startsWith('/') && !href.startsWith('/#'));
    const isSection = item.type === 'section' || href.startsWith('#') || href.startsWith('/#');
    
    if (isPage && !isSection) {
      // Navigate to page
      router.push(href);
      setIsMenuOpen(false);
    } else if (isSection) {
      // Extract hash and scroll to section
      const hash = href.includes('#') ? href.substring(href.indexOf('#')) : href;
      scrollToSection(hash);
    }
  };

  const scrollToSection = (href: string) => {
    // Check if we're on the home page
    if (window.location.pathname === '/') {
      // On home page, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      // Not on home page, navigate to home page with hash
      router.push(`/${href}`);
      setIsMenuOpen(false);

      // Wait for navigation to complete and DOM to be ready, then scroll to section
      let retryCount = 0;
      const maxRetries = 30; // Increased retries for better reliability

      const waitForSection = () => {
        const element = document.querySelector(href);
        if (element) {
          // Section found, scroll to it
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Successfully scrolled to section:', href);
        } else if (retryCount < maxRetries) {
          // Section not found yet, wait a bit more and try again
          retryCount++;
          setTimeout(waitForSection, 100); // Increased delay for better reliability
        } else {
          // Max retries reached, scroll to top as fallback
          console.warn(`Section ${href} not found after ${maxRetries} retries`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      // Start waiting for the section with a longer initial delay
      setTimeout(waitForSection, 800); // Increased initial delay
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 md:hidden transition-all duration-300 bg-[var(--color-main)] ${isScrolled
        ? 'shadow-lg border-b border-white/20'
        : 'shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <img
              src="/images/logo-white.svg"
              alt={headerData?.logo?.alt || "BlackSwan"}
              className={getLogoSizeClass(headerData?.logo?.size || '6')}
            />
          </div>

          {/* Contact Actions */}
          <div className="flex items-center gap-3 ml-auto mr-4">
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
            className="h-10 w-10 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="!w-6 !h-6 !stroke-[2.5] !text-white" /> : <Menu className="!w-6 !h-6 !stroke-[2.5] !text-white" />}
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
              {/* Parler à un expert Button - Prominent at top */}
              <div className="pb-4 border-b border-gray-200">
                <Button
                  data-iclosed-link="https://app.iclosed.io/e/warrenblackswan/rendez-vous-avec-warren-blackswan"
                  data-embed-type="popup"
                  className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-main)] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Parler à un expert
                </Button>
              </div>

              {/* Navigation Items */}
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
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