"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { getUserLocation, getRegionFromCountry } from '@/lib/geolocation'

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
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<any>(null);
  const [footerContent, setFooterContent] = useState<any>(null);

  // Detect location using the same logic as pricing section
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const userLocation = await getUserLocation();
        setLocation(userLocation);
      } catch (error) {
        console.error("Error detecting location for footer:", error);
      } finally {
        setLoading(false);
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
    if (!location || !contactData) {
      return null;
    }

    const region = getRegionFromCountry(location.countryCode);

    let selectedData;
    switch (region) {
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
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleLinkClick = (url: string) => {
    // Check if it's an external route (starts with /)
    if (url.startsWith('/')) {
      // For external routes like /blog, /about, etc.
      window.location.href = url;
    } else {
      // For internal anchor links like #hero, #contact, etc.
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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
                placeholder={newsletter?.placeholder || "Votre email"}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white h-12 w-full sm:w-80 md:w-96"
              />
              <Button
                className="bg-white text-[var(--color-secondary)] hover:bg-white/90 h-12 px-6 whitespace-nowrap"
                onClick={handleNewsletterSubmit}
              >
                {newsletter?.buttonText || "S'abonner"}
              </Button>
            </div>

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
                      <a href={`tel:${regionalContact.phone}`} className="hover:text-white transition-colors">
                        {regionalContact.phone}
                      </a>
                    </div>
                  )}
                  {regionalContact.email && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]" />
                      <a href={`mailto:${regionalContact.email}`} className="hover:text-white transition-colors">
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
                    onClick={() => handleLinkClick(link.url)}
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
            {legal?.links && Array.isArray(legal.links) && legal.links.map((link: any, index: number) => (
              <a key={index} href={link.url} className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}