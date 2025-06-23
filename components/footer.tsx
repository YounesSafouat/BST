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
        const content = Array.isArray(data) ? data[0] : data;
        setFooterContent(content?.content);
      })
      .catch(error => {
        console.error('Error fetching footer content:', error);
        setFooterContent(null);
      });
  }, []);

  if (!footerContent) return null;

  const { newsletter, companyInfo, quickLinks, services, social, certifications, legal } = footerContent;

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="bg-[#ff5c35] rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7c55] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff7c55] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{newsletter.title}</h3>
              <p className="text-white/80">{newsletter.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder={newsletter.placeholder}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white h-12"
              />
              <Button className="bg-white text-[#ff5c35] hover:bg-white/90 h-12 px-6 whitespace-nowrap">
                {newsletter.buttonText}
              </Button>
            </div>
            <p className="text-xs mt-2 text-white/70">{newsletter.disclaimer}</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <img src={companyInfo.logo.image} alt={companyInfo.logo.alt} className="w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff5c35] rounded-full"></div>
              </div>
              <span className="text-lg font-bold tracking-tight">{companyInfo.logo.alt}</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">{companyInfo.description}</p>
            <div className="space-y-3">
              {Object.entries(companyInfo.contact).map(([key, value]: [string, any]) => {
                const Icon = IconMap[value.icon as keyof typeof IconMap];
                return (
                  <div key={key} className="flex items-center gap-3 text-sm text-gray-300">
                    {Icon && <Icon className="w-5 h-5 text-[#ff5c35]" />}
                    <span>{value.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{quickLinks.title}</h4>
            <ul className="space-y-3">
              {quickLinks.links.map((link: any, index: number) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-[#ff5c35] rounded-full"></div>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">{services.title}</h4>
            <ul className="space-y-3">
              {services.links.map((service: any, index: number) => (
                <li key={index}>
                  <a
                    href={service.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-[#714b67] rounded-full"></div>
                    {service.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-6">{social.title}</h4>
            <div className="flex gap-4 mb-8">
              {social.networks.map((network: any, index: number) => {
                const Icon = IconMap[network.icon as keyof typeof IconMap];
                return (
                  <a
                    key={index}
                    href={network.url}
                    className={`${network.color} w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200`}
                  >
                    {Icon && <Icon className="w-5 h-5 text-white" />}
                  </a>
                );
              })}
            </div>

            <h4 className="text-lg font-bold mb-4">{certifications.title}</h4>
            <div className="flex flex-wrap gap-3">
              {certifications.badges.map((cert: string, index: number) => (
                <span key={index} className="bg-gray-800 text-xs text-gray-300 px-3 py-1.5 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">{legal.copyright}</p>
          <div className="flex gap-6">
            {legal.links.map((link: any, index: number) => (
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
