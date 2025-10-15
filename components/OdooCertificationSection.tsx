"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Award, Shield, Users } from 'lucide-react';

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
          ]
     };

     // Use CMS data if available, otherwise fallback to default data
     const data = certificationData || fallbackData;




     return (
          <section id="expertise" className={`py-16 bg-[var(--color-teal-light)] relative ${className}`}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                         <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                              dangerouslySetInnerHTML={{ __html: data.subheadline }}
                         />
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="tracking-widest text-xl text-[var(--color-secondary)] font-bold mb-2"
                              dangerouslySetInnerHTML={{ __html: data.headline }}
                         />
                         
                    </div>

                    {/* Main Certification Card */}
                    <motion.div
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.3 }}
                         className="mb-12"
                    >
                         <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-shadow relative overflow-hidden">
                              <div className="grid lg:grid-cols-2 gap-12 items-start justify-items-center relative z-10">

                                   {/* Left Side - Images Card */}
                                   <div className="flex justify-center items-center relative h-full">
                                        <div className="bg-white rounded-2xl p-8 relative overflow-hidden w-full max-w-5xl h-96 flex items-center justify-center mt-20">

                                             <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                                                  {/* Odoo Silver Partner Logo SVG */}
                                                  <div className="w-48 h-24 flex items-center justify-center">
                                                       <Image
                                                            src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/oodo-silver-partner-logo.svg"
                                                            alt="Odoo Silver Partner Logo"
                                                            width={192}
                                                            height={96}
                                                            className="object-contain"
                                                       />
                                                  </div>

                                                  {/* Certification PNG */}
                                                  <div className="w-48 h-48 flex items-center justify-center">
                                                       <Image
                                                            src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/certification.png"
                                                            alt="Odoo Certification"
                                                            width={192}
                                                            height={192}
                                                            className="object-contain"
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Right Side - Content */}
                                   <div className="space-y-6 flex flex-col justify-center h-full">
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
                                                       <div key={index} className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                                                            <IconComponent className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                 <div 
                                                                      className="font-semibold text-gray-900"
                                                                      dangerouslySetInnerHTML={{ __html: feature.title }}
                                                                 />
                                                                 <div 
                                                                      className="text-sm text-gray-600"
                                                                      dangerouslySetInnerHTML={{ __html: feature.description }}
                                                                 />
                                                            </div>
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div >
               </div >
          </section >
     );
} 