"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Award, Shield, Users, ChevronUp, ChevronDown } from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap: { [key: string]: React.ComponentType<any> } = {
     CheckCircle,
     Award,
     Shield,
     Users,
};

interface CertificationFeature {
     title: string;
     description: string;
     icon: string;
}

interface CertificationData {
     headline: string;
     subheadline: string;
     description: string;
     partnerTitle: string;
     partnerDescription: string;
     features: CertificationFeature[];
     certificationImages?: { src: string; alt: string }[]; // Added for CMS data
}

interface OdooCertificationSectionProps {
     certificationData?: CertificationData;
     className?: string;
}

/* SECTION: Odoo Certification - OdooCertificationSection */
export default function OdooCertificationSection({
     certificationData,
     className = ""
}: OdooCertificationSectionProps) {
     // State for managing current image index
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('down');

     // Fallback data when no CMS data is provided
     const fallbackData: CertificationData = {
          headline: "Certifications Odoo",
          subheadline: "Expertise reconnue",
          description: "Notre expertise certifiée sur les dernières versions d'Odoo vous garantit des implémentations de qualité professionnelle.",
          partnerTitle: "Odoo Silver Partner",
          partnerDescription: "Certification officielle pour l'implémentation et la formation Odoo. Notre statut de partenaire Silver confirme notre expertise reconnue et notre engagement envers l'excellence.",
          features: [
               {
                    title: "Certification officielle",
                    description: "Reconnue par Odoo SA",
                    icon: "CheckCircle"
               },
               {
                    title: "Équipe certifiée",
                    description: "Consultants experts",
                    icon: "Users"
               },
               {
                    title: "Support premium",
                    description: "Accès prioritaire",
                    icon: "Shield"
               },
               {
                    title: "Garantie qualité",
                    description: "Standards Odoo",
                    icon: "Award"
               }
          ],
          certificationImages: [
               {
                    src: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/CERTIFICATE.png",
                    alt: "Odoo Certification Certificate"
               },
               {
                    src: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/Blog%205/blog%205%20(1).png",
                    alt: "Odoo Silver Partner Badge"
               },
               {
                    src: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odoo.png",
                    alt: "Odoo Official Partner"
               }
          ]
     };

     // Use CMS data if available, otherwise fallback to default data
     const data = certificationData || fallbackData;

     // Array of certification images
     const certificationImages = data.certificationImages || [];

     // Navigation functions
     const goToNextImage = () => {
          setAnimationDirection('down');
          setCurrentImageIndex((prev) =>
               prev === certificationImages.length - 1 ? 0 : prev + 1
          );
     };

     const goToPreviousImage = () => {
          setAnimationDirection('up');
          setCurrentImageIndex((prev) =>
               prev === 0 ? certificationImages.length - 1 : prev - 1
          );
     };

     return (
          <section id="expertise" className={`py-16 bg-[var(--color-teal-light)] relative ${className}`}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2"
                         >
                              {data.subheadline}
                         </motion.div>
                         <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                         >
                              {data.headline}
                         </motion.h2>
                         <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="text-lg text-gray-600 max-w-2xl mx-auto"
                         >
                              {data.description}
                         </motion.p>
                    </div>

                    {/* Main Certification Card */}
                    <motion.div
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.3 }}
                         className="mb-12"
                    >
                         <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow">
                              <div className="grid lg:grid-cols-2 gap-12 items-center">

                                   {/* Left Side - Certificate Image with Navigation */}
                                   <div className="flex justify-center lg:justify-start relative">
                                        {/* Navigation Buttons - Left Side (Both Mobile and Desktop) */}
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-3">
                                             <button
                                                  onClick={goToPreviousImage}
                                                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110"
                                                  aria-label="Previous image"
                                             >
                                                  <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-secondary)]" />
                                             </button>
                                             <button
                                                  onClick={goToNextImage}
                                                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110"
                                                  aria-label="Next image"
                                             >
                                                  <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-secondary)]" />
                                             </button>
                                        </div>

                                        {/* Image Container */}
                                        <div className="relative w-full h-80 lg:h-96">
                                             <AnimatePresence mode="wait">
                                                  <motion.div
                                                       key={currentImageIndex}
                                                       initial={{ opacity: 0, y: animationDirection === 'up' ? -50 : 50 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       exit={{ opacity: 0, y: animationDirection === 'up' ? 50 : -50 }}
                                                       transition={{ duration: 0.5, ease: "easeInOut" }}
                                                       className="w-full h-full flex items-center justify-center"
                                                  >
                                                       <Image
                                                            src={certificationImages[currentImageIndex].src}
                                                            alt={certificationImages[currentImageIndex].alt}
                                                            fill
                                                            className="object-contain rounded-tl-2xl rounded-bl-2xl"
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                       />
                                                  </motion.div>
                                             </AnimatePresence>

                                             {/* Image Counter Indicator */}
                                             <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                                  <span className="text-white text-sm font-medium">
                                                       {currentImageIndex + 1} / {certificationImages.length}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Right Side - Content */}
                                   <div className="space-y-6">
                                        <div>
                                             <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                                  {data.partnerTitle}
                                             </h3>
                                             <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                                  {data.partnerDescription}
                                             </p>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {data.features.map((feature, index) => {
                                                  const IconComponent = iconMap[feature.icon] || CheckCircle;
                                                  return (
                                                       <div key={index} className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                                                            <IconComponent className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                 <div className="font-semibold text-gray-900">{feature.title}</div>
                                                                 <div className="text-sm text-gray-600">{feature.description}</div>
                                                            </div>
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div>
               </div>
          </section>
     );
} 