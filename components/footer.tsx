/**
 * footer.tsx
 * 
 * Main website footer component with dynamic content, regional contact information,
 * and comprehensive site navigation. This footer automatically adapts to user
 * location and displays region-specific contact details and services.
 * 
 * WHERE IT'S USED:
 * - All pages via layout.tsx - Global footer across the entire website
 * - Automatically included in every page through the root layout
 * 
 * KEY FEATURES:
 * - Dynamic content loading from CMS API
 * - Automatic region detection and contact info adaptation
 * - Newsletter subscription functionality
 * - Social media links and company information
 * - Quick links to important pages and services
 * - Regional contact details (phone, email, address)
 * - Certification badges and legal links
 * - Mobile-responsive design with proper spacing
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js client-side rendering for dynamic content
 * - Integrates with geolocation API for region detection
 * - Fetches footer content from /api/content endpoint
 * - Implements responsive design with Tailwind CSS
 * - Button click analytics tracking for user interactions
 * - Automatic content fallbacks for missing data
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'
import { useRouter } from 'next/navigation'
import { useButtonAnalytics } from '@/hooks/use-analytics'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

// Icon mapping object
const IconMap = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  WhatsApp: WhatsAppIcon,
  Mail,
  Phone,
  MapPin
}

export default function Footer() {
  const router = useRouter();
  const [contactData, setContactData] = useState<any>(null);
  const [footerContent, setFooterContent] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState<string>('');
  const { trackButtonClick } = useButtonAnalytics();
  const { region: userRegion, loading: locationLoading, isFromCache } = useGeolocationSingleton();

  // Fetch regional contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content/settings');
        if (response.ok) {
          const data = await response.json();
          
          if (data?.content?.regionalContact) {
            setContactData(data.content.regionalContact);
            
          } else {
            console.log('Footer - No regional contact data found in response');
          }
        } else {
          console.error('Footer - Settings API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contact data for footer:', error);
      }
    };

    fetchContactData();
  }, []);

  // Fetch footer content
  useEffect(() => {
    fetch("/api/content?type=footer")
      .then(res => res.json())
      .then(data => {
        // Find the object with type === "footer"
        const footerObj = Array.isArray(data)
          ? data.find(item => item.type === "footer")
          : data;
        setFooterContent(footerObj?.content);
      })
      .catch(error => {
        console.error('Error fetching footer content:', error);
        setFooterContent(null);
      });
  }, []);

  if (!footerContent) return null;

  const {
    newsletter = {},
    companyInfo = {},
    quickLinks = { links: [] },
    services = { links: [] },
    social = {},
    certifications = { badges: [] },
    legal = { links: [] }
  } = footerContent;

  // Get regional contact info
  const getRegionalContactInfo = () => {
   
    
    if (!userRegion || !contactData) {
     
      return null;
    }

    let selectedData;
    switch (userRegion) {
      case 'france':
        selectedData = contactData.france;
        break;
      case 'morocco':
        selectedData = contactData.morocco;
        break;
      default:
        selectedData = contactData.other;
        break;
    }

   
    return selectedData;
  };

  const regionalContact = getRegionalContactInfo();

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');
    trackButtonClick('newsletter_submit');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message);
        setNewsletterEmail(''); // Clear the input
        trackButtonClick('newsletter_success');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Une erreur est survenue');
        trackButtonClick('newsletter_error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      setNewsletterMessage('Une erreur est survenue lors de l\'abonnement');
      trackButtonClick('newsletter_error');
    }
  }

  const handleLinkClick = (url: string) => {
    // Check if it's an external route (starts with /)
    if (url.startsWith('/')) {
      // For external routes like /blog, /about, etc.
      router.push(url);
    } else {
      // For internal anchor links like #hero, #contact, etc.
      // Check if we're on the home page
      if (window.location.pathname === '/') {
        const element = document.querySelector(url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Not on home page, navigate to home page first, then scroll to section
        router.push('/');

        // Wait for navigation to complete and DOM to be ready, then scroll to section
        let retryCount = 0;
        const maxRetries = 20; // Maximum 1 second of retries (20 * 50ms)

        const waitForSection = () => {
          const element = document.querySelector(url);
          if (element) {
            // Section found, scroll to it
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (retryCount < maxRetries) {
            // Section not found yet, wait a bit more and try again
            retryCount++;
            setTimeout(waitForSection, 50);
          } else {
            // Max retries reached, scroll to top as fallback
            console.warn(`Section ${url} not found after ${maxRetries} retries`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };

        // Start waiting for the section with a longer initial delay
        setTimeout(waitForSection, 500);
      }
    }
  }

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="bg-[var(--color-secondary)] rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-secondary)] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-secondary)] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{newsletter?.title || "Restez informé"}</h3>
              <p className="text-white/80">{newsletter?.description || "Recevez nos dernières actualités"}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={newsletter?.placeholder || "Votre email"}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white h-12 w-full sm:w-80 md:w-96"
                disabled={newsletterStatus === 'loading'}
              />
              <Button
                className="bg-white text-[var(--color-secondary)] hover:bg-white/90 h-12 px-6 whitespace-nowrap disabled:opacity-50"
                onClick={handleNewsletterSubmit}
                disabled={newsletterStatus === 'loading' || !newsletterEmail}
              >
                {newsletterStatus === 'loading' ? 'Abonnement...' : (newsletter?.buttonText || "S'abonner")}
              </Button>
            </div>

            {/* Newsletter Status Messages */}
            {newsletterMessage && (
              <div className={`mt-4 text-sm ${
                newsletterStatus === 'success' ? 'text-green-200' : 
                newsletterStatus === 'error' ? 'text-red-200' : 
                'text-white/80'
              }`}>
                {newsletterMessage}
              </div>
            )}

          </div>
        </div>

        {/* secondary Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="relative">
                <img src={companyInfo?.logo?.image || "/bst.png"} alt={companyInfo?.logo?.alt || "Black Swan Technology"} className="h-12 sm:h-16 w-auto" />
              </div>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm">{companyInfo?.description || "Votre partenaire digital de confiance"}</p>
            <div className="space-y-2 sm:space-y-3">
              {regionalContact ? (
                <>
                  {regionalContact.phone && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]" />
                      <a
                        href={`tel:${regionalContact.phone}`}
                        className="hover:text-white transition-colors"
                        onClick={() => trackButtonClick('footer_phone')}
                      >
                        {regionalContact.phone}
                      </a>
                    </div>
                  )}
                  {regionalContact.email && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]" />
                      <a
                        href={`mailto:${regionalContact.email}`}
                        className="hover:text-white transition-colors"
                        onClick={() => trackButtonClick('footer_email')}
                      >
                        {regionalContact.email}
                      </a>
                    </div>
                  )}
                  {regionalContact.whatsapp && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                      <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]" />
                      <a
                        href={`https://wa.me/${regionalContact.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        onClick={() => trackButtonClick('footer_whatsapp')}
                      >
                        {regionalContact.whatsapp}
                      </a>
                    </div>
                  )}
                  {regionalContact.address && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]" />
                      <span>{regionalContact.address}</span>
                    </div>
                  )}
                </>
              ) : (
                // Show loading or message if no regional data available
                <div className="text-xs sm:text-sm text-gray-400">
                  Informations de contact en cours de configuration...
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">{quickLinks?.title || "Liens rapides"}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.links && Array.isArray(quickLinks.links) && quickLinks.links.map((link: any, index: number) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      handleLinkClick(link.url);
                      trackButtonClick(`footer_link_${link.text.toLowerCase().replace(/\s+/g, '_')}`);
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm w-full text-left"
                  >
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--color-secondary)] rounded-full"></div>
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">{"Suivez-nous"}</h4>
            <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
              {Object.entries(social).map(([key, value]) => {
                if (!value || typeof value !== 'object' || !('url' in value && 'icon' in value && 'color' in value)) return null;
                const network = value as { icon: string; color: string; url: string };
                let iconKey = network.icon || key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
                let Icon = IconMap[iconKey as keyof typeof IconMap];

                // Fallback for WhatsApp icon if not found
                if (!Icon && (iconKey === 'WhatsApp' || key.toLowerCase() === 'whatsapp')) {
                  Icon = IconMap['WhatsApp'];
                  iconKey = 'WhatsApp';
                }

                const colorMap: any = {
                  Facebook: 'var(--color-secondary)',
                  Twitter: 'var(--color-secondary)',
                  Linkedin: 'var(--color-secondary)',
                  Instagram: 'var(--color-secondary)',
                  Youtube: 'var(--color-secondary)',
                  WhatsApp: '#25d366', // WhatsApp green color
                };
                const bgColor = network.color || colorMap[iconKey] || 'var(--color-main)';

                return (
                  <a
                    key={key}
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                    style={{ backgroundColor: bgColor }}
                  >
                    {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                  </a>
                );
              })}
            </div>

            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{certifications?.title || 'Certifications'}</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {certifications?.badges && Array.isArray(certifications.badges) && certifications.badges.map((cert: string, index: number) => (
                <span key={index} className="bg-gray-800 text-xs text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-xs sm:text-sm mb-4 md:mb-0">{legal?.copyright || "© 2024 Black Swan Technology. Tous droits réservés."}</p>
          <div className="flex gap-4 sm:gap-6">
            <button
              onClick={() => handleLinkClick('/politique-confidentialite')}
              className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors duration-200"
            >
              Politique de confidentialité
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
