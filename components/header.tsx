import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Calendar, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ scrollY, isLoaded }: { scrollY: number; isLoaded: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isScrolled = scrollY > 50;

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
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST%20black.svg" alt="BlackSwan" className="h-10" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-[var(--color-main)] transition-colors duration-200 font-medium text-sm"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Contact Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-gray-700 hover:text-[var(--color-main)] h-8 px-2"
              onClick={() => window.open('tel:+212783699603')}
            >
              <Phone className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-gray-700 hover:text-[var(--odoo-accent)] h-8 px-2"
              onClick={() => window.open('https://wa.me/212783699603', '_blank')}
            >
              <MessageCircle className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] gap-1 rounded-full px-3 text-xs h-8"
              onClick={() => window.open('https://meetings-eu1.hubspot.com/yraissi', '_blank')}
            >
              Prendre RDV
              <Calendar className="w-3 h-3" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-gray-700 hover:text-[var(--color-main)] transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button
                  className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] gap-2 justify-center"
                  onClick={() => window.open('https://meetings-eu1.hubspot.com/yraissi', '_blank')}
                >
                  Prendre RDV
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}