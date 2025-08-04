"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Star, Award, Shield } from 'lucide-react';

interface OdooCertificationSectionProps {
     title?: string;
     subtitle?: string;
     description?: string;
     className?: string;
}

export default function OdooCertificationSection({
     title = "Certifications Odoo",
     subtitle = "Expertise reconnue",
     description = "Notre expertise certifiée sur les dernières versions d'Odoo vous garantit des implémentations de qualité professionnelle.",
     className = ""
}: OdooCertificationSectionProps) {
     return (
          <section className={`py-24 bg-white relative ${className}`}>
               <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2"
                         >
                              {subtitle}
                         </motion.div>
                         <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
                         >
                              {title}
                         </motion.h2>
                         <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="text-lg text-gray-600 max-w-2xl mx-auto"
                         >
                              {description}
                         </motion.p>
                    </div>

                    {/* Main Certification Display */}
                    <motion.div
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.3 }}
                         className="mb-20"
                    >
                         <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 border border-gray-100">
                              <div className="grid lg:grid-cols-2 gap-12 items-center">
                                   {/* Left: Badge */}
                                   <div className="flex justify-center lg:justify-start">
                                        <div className="relative">
                                             <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] rounded-2xl blur-2xl opacity-20"></div>
                                             <Image
                                                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/silver-badge-odoo.png"
                                                  alt="Odoo Silver Partner Badge"
                                                  width={400}
                                                  height={400}
                                                  className="relative w-80 h-80 md:w-96 md:h-96 object-contain"
                                             />
                                        </div>
                                   </div>

                                   {/* Right: Content */}
                                   <div className="text-center lg:text-left">
                                        <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                                             Odoo Silver Partner
                                        </h3>
                                        <p className="text-lg text-gray-600 mb-8">
                                             Certification officielle pour l'implémentation et la formation Odoo
                                        </p>

                                        {/* Certificate */}
                                        <div className="flex justify-center lg:justify-start">
                                             <Image
                                                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odoo%20certificate.svg"
                                                  alt="Odoo Certificate"
                                                  width={500}
                                                  height={250}
                                                  className="w-80 h-40 md:w-96 md:h-48 lg:w-[500px] lg:h-[250px] object-contain"
                                             />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div>
               </div>
          </section>
     );
} 