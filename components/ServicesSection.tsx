/**
 * ServicesSection.tsx
 * 
 * Services section component that displays company services and expertise
 * with interactive features and dynamic content loading. This component
 * showcases the company's core services with visual elements and CTAs.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - Services showcase section
 * - About page and other pages that need services display
 * - Company expertise and service offerings presentation
 * 
 * KEY FEATURES:
 * - Dynamic service data loading from CMS or fallback data
 * - Interactive service selection with visual feedback
 * - Service descriptions with relevant images
 * - Call-to-action buttons for each service
 * - Responsive design with mobile optimization
 * - Smooth animations and transitions
 * - Service categorization and organization
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements framer-motion for animations
 * - Dynamic icon mapping for service icons
 * - Fallback data when CMS content is unavailable
 * - Uses Tailwind CSS for responsive design
 * - Implements state management for active service
 * - Smooth scrolling to contact section
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Link2,
  GraduationCap,
  Headphones,
  SearchCheck,
  Lightbulb,
  ArrowRight
} from "lucide-react";

interface Service {
  icon: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
}

interface ServicesData {
  headline: string;
  subheadline: string;
  description: string;
  services: Service[];
  defaultButtonText?: string;
}

interface ServicesSectionProps {
  servicesData?: ServicesData;
}

// Icon mapping for dynamic icon rendering
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Settings,
  Link2,
  GraduationCap,
  Headphones,
  SearchCheck,
  Lightbulb,
};

// Fallback data when no CMS data is provided
const fallbackServices: Service[] = [
  {
    icon: "Settings",
    title: "Implémentation",
    description: "Nous déployons Odoo sur mesure en l'adaptant à vos processus. Migration de données sécurisée et mise en production sans friction.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80&fit=crop",
    buttonText: "Démarrer un projet"
  },
  {
    icon: "Link2",
    title: "Intégration",
    description: "Connectez Odoo à votre écosystème existant (CRM, e-commerce, outils métier) pour une synchronisation temps réel et des processus unifiés.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&fit=crop",
    buttonText: "Intégrer maintenant"
  },
  {
    icon: "GraduationCap",
    title: "Formation",
    description: "Nous formons vos équipes via des sessions personnalisées pour garantir une adoption rapide et une maîtrise parfaite de votre nouvel environnement Odoo.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&fit=crop",
    buttonText: "Réserver une formation"
  },
  {
    icon: "Headphones",
    title: "Support & Maintenance",
    description: "Bénéficiez d'une assistance technique réactive et d'une maintenance préventive pour garantir la performance et la pérennité de votre système.",
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80&fit=crop",
    buttonText: "Obtenir du support"
  },
  {
    icon: "SearchCheck",
    title: "Audit & Optimisation",
    description: "Nos experts analysent vos processus actuels pour identifier les goulots d'étranglement et définir un plan d'action pour maximiser votre ROI.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop",
    buttonText: "Planifier un audit"
  },
  {
    icon: "Lightbulb",
    title: "Conseil Stratégique",
    description: "Nous vous accompagnons dans la définition de votre feuille de route digitale pour faire de la technologie un véritable levier de croissance.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&fit=crop",
    buttonText: "Demander conseil"
  }
];

export default function ServicesSection({ servicesData }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState(0);

  // Debug: Log the received data
  console.log('ServicesSection - servicesData:', servicesData);
  console.log('ServicesSection - servicesData?.services:', servicesData?.services);
  console.log('ServicesSection - servicesData?.defaultButtonText:', servicesData?.defaultButtonText);

  // Use CMS data if available, otherwise fallback to default data
  const services = servicesData?.services || fallbackServices;
  const headline = servicesData?.headline || "Nos Expertises";
  const subheadline = servicesData?.subheadline || "Plus qu'un intégrateur, un partenaire de croissance";
  const description = servicesData?.description || "De l'audit stratégique à la maintenance continue, notre expertise couvre tous les aspects de votre transformation digitale pour un succès garanti.";
  const defaultButtonText = servicesData?.defaultButtonText || "Discutons-en";

  // Debug: Log the final values
  console.log('ServicesSection - final services:', services);
  console.log('ServicesSection - final defaultButtonText:', defaultButtonText);
  console.log('ServicesSection - active service buttonText:', services[activeService]?.buttonText);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
            {headline}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            {subheadline}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Settings;
              return (
                <button
                  key={service.title}
                  onClick={() => setActiveService(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 relative ${activeService === index
                    ? "bg-[var(--color-secondary)] text-white shadow-lg"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <IconComponent
                      className={`w-6 h-6 transition-colors ${activeService === index
                        ? 'text-[var(--color-main)]'
                        : 'text-[var(--color-secondary)]'
                        }`}
                    />
                    <span className="font-semibold text-lg">{service.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 relative h-[450px] lg:h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Background Image */}
                <img
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-4">{services[activeService].title}</h3>
                  <p className="text-lg text-gray-200 mb-6 max-w-lg">
                    {services[activeService].description}
                  </p>
                  <Button
                    size="lg"
                    className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white font-semibold group"
                    onClick={scrollToContact}
                  >
                    {services[activeService].buttonText || defaultButtonText}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
