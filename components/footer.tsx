"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

// Icon mapping object
const IconMap = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin
}

export default function Footer() {
  const [footerContent, setFooterContent] = useState<any>(null)

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

  const handleNewsletterSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <img src={companyInfo?.logo?.image || "/bst.png"} alt={companyInfo?.logo?.alt || "Black Swan Technology"} className="w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-secondary)] rounded-full"></div>
              </div>
              <span className="text-lg font-bold tracking-tight">{companyInfo?.logo?.alt || "Black Swan Technology"}</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">{companyInfo?.description || "Votre partenaire digital de confiance"}</p>
            <div className="space-y-3">
              {companyInfo?.contact && Object.entries(companyInfo.contact).map(([key, value]: [string, any]) => {
                const Icon = IconMap[value.icon as keyof typeof IconMap];
                return (
                  <div key={key} className="flex items-center gap-3 text-sm text-gray-300">
                    {Icon && <Icon className="w-5 h-5 text-[var(--color-secondary)]" />}
                    <span>{value.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{quickLinks?.title || "Liens rapides"}</h4>
            <ul className="space-y-3">
              {quickLinks.links && Array.isArray(quickLinks.links) && quickLinks.links.map((link: any, index: number) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full"></div>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">{services?.title || "Services"}</h4>
            <ul className="space-y-3">
              {services.links && Array.isArray(services.links) && services.links.map((service: any, index: number) => (
                <li key={index}>
                  <a
                    href={service.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full"></div>
                    {service.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-6">{"Suivez-nous"}</h4>
            <div className="flex gap-4 mb-8">
              {Object.entries(social).map(([key, value]) => {
                if (!value || typeof value !== 'object' || !('url' in value && 'icon' in value && 'color' in value)) return null;
                const network = value as { icon: string; color: string; url: string };
                const iconKey = network.icon || key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
                const Icon = IconMap[iconKey as keyof typeof IconMap];
                const colorMap: any = {
                  Facebook: 'var(--color-secondary)',
                  Twitter: 'var(--color-secondary)',
                  Linkedin: 'var(--color-secondary)',
                  Instagram: 'var(--color-secondary)',
                  Youtube: 'var(--color-secondary)',
                };
                const bgColor = network.color || colorMap[iconKey] || 'var(--color-main)';
                return (
                  <a
                    key={key}
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                    style={{ backgroundColor: bgColor }}
                  >
                    {Icon && <Icon className="w-5 h-5 text-white" />}
                  </a>
                );
              })}
            </div>

            <h4 className="text-lg font-bold mb-4">{certifications?.title || 'Certifications'}</h4>
            <div className="flex flex-wrap gap-3">
              {certifications?.badges && Array.isArray(certifications.badges) && certifications.badges.map((cert: string, index: number) => (
                <span key={index} className="bg-gray-800 text-xs text-gray-300 px-3 py-1.5 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">{legal?.copyright || "© 2024 Black Swan Technology. Tous droits réservés."}</p>
          <div className="flex gap-6">
            {legal?.links && Array.isArray(legal.links) && legal.links.map((link: any, index: number) => (
              <a key={index} href={link.url} className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
