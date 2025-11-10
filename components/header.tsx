/**
 * header.tsx
 * 
 * Main website header component with dynamic content and regional contact information.
 * This header automatically adapts to user location and displays region-specific
 * contact details, navigation menu, and call-to-action buttons.
 * 
 * WHERE IT'S USED:
 * - All pages via layout.tsx - Global header across the entire website
 * - Automatically included in every page through the root layout
 * 
 * KEY FEATURES:
 * - Dynamic content loading from CMS API
 * - Automatic region detection and contact info adaptation
 * - Mobile-responsive navigation menu with hamburger toggle
 * - Regional phone numbers and WhatsApp contacts
 * - Smooth animations and transitions using framer-motion
 * - Button click analytics tracking
 * - Page visibility detection for performance optimization
 * - Automatic language/region adaptation based on user location
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js client-side rendering for dynamic content
 * - Integrates with geolocation API for region detection
 * - Fetches header content from /api/content endpoint
 * - Implements responsive design with Tailwind CSS
 * - Uses framer-motion for smooth animations
 * - Tracks user interactions for analytics
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useRouter } from 'next/navigation';
import { useButtonAnalytics } from '@/hooks/use-analytics';
import MegaMenu from './MegaMenu';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

export default function Header({ scrollY, isLoaded }: { scrollY: number; isLoaded: boolean }) {
  const router = useRouter();
  const [contactData, setContactData] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<any>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [megaMenuTimeout, setMegaMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  
  
  const { isPageVisible } = usePageVisibility();
  const { trackButtonClick } = useButtonAnalytics();
  const { region: userRegion, loading: locationLoading, isFromCache } = useGeolocationSingleton();

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
          console.error('Failed to fetch contact data for header:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contact data for header:', error);
      }
    };

    fetchContactData();
  }, []);

  // Update WhatsApp number based on detected region
  useEffect(() => {
    if (userRegion && contactData) {
      let number: string | null = null;
      switch (userRegion) {
        case 'france':
          number = contactData.france?.whatsapp || null;
          break;
        case 'morocco':
          number = contactData.morocco?.whatsapp || null;
          break;
        default:
          number = contactData.other?.whatsapp || null;
          break;
      }
      setWhatsappNumber(number);
    }
  }, [userRegion, contactData]);

  const isScrolled = scrollY > 0;

  // Use CMS navigation data or fallback to default
  const navigation = headerData?.navigation?.main?.sort((a: any, b: any) => a.order - b.order) || [
    { name: 'Solutions', href: '#services', type: 'section', order: 1 },
    { name: 'Tarifs', href: '#pricing', type: 'section', order: 2 },
    { name: 'Blog', href: '/blog', type: 'page', order: 3 },
    { 
      name: 'Nos clients', 
      href: '/cas-client', 
      type: 'page', 
      order: 4,
      hasSubmenu: true,
      submenu: [],
      megaMenu: {
        type: 'client-cases' as const,
        title: 'Découvrez tous nos cas d\'usage',
        description: 'Nous aidons nos clients dans différents secteurs et sur différentes problématiques',
        featuredCases: [],
        ctaButton: {
          text: 'Tous nos cas clients',
          href: '/cas-client'
        }
      }
    },
    { name: 'Notre Agence', href: '#about', type: 'section', order: 5 },
    { name: 'Témoignages', href: '#testimonials', type: 'section', order: 6 },
    { name: 'Contact', href: '#contact', type: 'section', order: 7 }
  ];

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
      '8': 'h-8',
      '10': 'h-10',
      '12': 'h-12',
      '14': 'h-14',
      '16': 'h-16',
      '20': 'h-20',
      '24': 'h-24',
      '32': 'h-32'
    };
    return sizeMap[size] || 'h-10';
  };

  const handleNavigationClick = (item: any) => {
    console.log('Navigation clicked:', item);
    console.log('Current pathname:', window.location.pathname);
    
    // Determine navigation type from href if type is not set
    const href = item.href || '';
    const isPage = item.type === 'page' || href.startsWith('/');
    const isSection = item.type === 'section' || href.startsWith('#') || href.startsWith('/#');
    
    if (isPage && !isSection) {
      // Handle page navigation
      if (href.startsWith('/')) {
        router.push(href);
      } else {
        console.warn('Invalid page URL:', href);
      }
    } else if (isSection) {
      // Handle section scrolling
      console.log('Attempting to scroll to section:', href);
      // Extract the hash part
      const hash = href.includes('#') ? href.substring(href.indexOf('#')) : href;
      scrollToSection(hash);
    } else {
      console.warn('Unknown navigation type:', item.type, 'href:', href);
    }
  };

  const scrollToSection = (href: string) => {
    console.log('scrollToSection called with:', href, 'Current path:', window.location.pathname);
    
    // Check if we're on the home page
    if (window.location.pathname === '/') {
      // On home page, scroll to section
      const element = document.querySelector(href);
      console.log('Element found on homepage:', element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        console.log('Successfully scrolled to section on homepage:', href);
      } else {
        console.warn('Section not found on homepage:', href);
      }
    } else {
      // Not on home page, navigate to home page with hash
      console.log('Not on homepage, navigating to:', `/${href}`);
      router.push(`/${href}`);

      // Wait for navigation to complete and DOM to be ready, then scroll to section
      let retryCount = 0;
      const maxRetries = 50; // Further increased retries for dashboard navigation

      const waitForSection = () => {
        const element = document.querySelector(href);
        console.log(`Retry ${retryCount}: Looking for element ${href}, found:`, element);
        
        if (element) {
          // Section found, scroll to it
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Successfully scrolled to section after navigation:', href);
        } else if (retryCount < maxRetries) {
          // Section not found yet, wait a bit more and try again
          retryCount++;
          setTimeout(waitForSection, 150); // Increased delay for dashboard navigation
        } else {
          // Max retries reached, scroll to top as fallback
          console.warn(`Section ${href} not found after ${maxRetries} retries, scrolling to top`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      // Start waiting for the section with a longer initial delay for dashboard navigation
      setTimeout(waitForSection, 1000); // Increased initial delay for dashboard
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[var(--color-main)] ${isScrolled
        ? 'shadow-lg border-b border-white/20'
        : 'shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex justify-between items-center py-4"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <img
              src="https://res.cloudinary.com/dwob2hfin/image/upload/v1762788652/blackswantechnology_20white-3_kohnph.svg"
              alt={headerData?.logo?.alt || "BlackSwan"}
              className={getLogoSizeClass(headerData?.logo?.size || '8')}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
              >
                <button
                  onClick={() => handleNavigationClick(item)}
                  onMouseEnter={() => {
                    if (megaMenuTimeout) {
                      clearTimeout(megaMenuTimeout);
                      setMegaMenuTimeout(null);
                    }
                    if (item.megaMenu) {
                      setActiveMegaMenu(item.name);
                    } else {
                      setActiveMegaMenu(null);
                    }
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setActiveMegaMenu(null), 300);
                    setMegaMenuTimeout(timeout);
                  }}
                  className="text-white hover:text-[var(--color-secondary)] transition-colors duration-200 font-medium text-sm relative flex items-center gap-1 py-2"
                >
                  {item.name}
                  {/* Mega menu indicator */}
                  {item.megaMenu && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {/* Regular submenu dropdown */}
                {item.hasSubmenu && (item as any).submenu && !item.megaMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      {(item as any).submenu.map((subItem: any) => (
                        <button
                          key={subItem.name}
                          onClick={() => handleNavigationClick(subItem)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <div className="font-medium">{subItem.name}</div>
                          {subItem.description && (
                            <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Contact Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 bg-green-500 hover:bg-green-600 text-white h-10 px-3 transition-all duration-300 hover:scale-110 rounded-full"
              onClick={() => {
                whatsappNumber && window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank');
                trackButtonClick('whatsapp_number');
              }}
              disabled={!whatsappNumber}
            >
              <WhatsAppIcon className="w-4 h-4" />
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="bg-[var(--color-secondary)] hover:bg-white hover:text-[var(--color-main)] text-white px-5 text-sm h-11 rounded-full"
                data-iclosed-link="https://app.iclosed.io/e/warrenblackswan/rendez-vous-avec-warren-blackswan"
                data-embed-type="popup"
              >
                <span className="font-semibold">Parler à un expert</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Mega Menu */}
      {navigation.find(item => item.name === activeMegaMenu)?.megaMenu && (
        <div 
          className="absolute top-full left-0 w-full"
          onMouseEnter={() => {
            if (megaMenuTimeout) {
              clearTimeout(megaMenuTimeout);
              setMegaMenuTimeout(null);
            }
          }}
          onMouseLeave={() => {
            setActiveMegaMenu(null);
          }}
        >
          <MegaMenu 
            data={navigation.find(item => item.name === activeMegaMenu)!.megaMenu!}
            isVisible={!!activeMegaMenu}
            onMouseLeave={() => setActiveMegaMenu(null)}
          />
        </div>
      )}

    </motion.header>
  );
}
