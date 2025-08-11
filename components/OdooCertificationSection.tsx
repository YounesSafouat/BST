"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Award, Shield, Users } from 'lucide-react';

interface OdooCertificationSectionProps {
     title?: string;
     subtitle?: string;
     description?: string;
     className?: string;
}

/* SECTION: Odoo Certification - OdooCertificationSection */
export default function OdooCertificationSection({
     title = "Certifications Odoo",
     subtitle = "Expertise reconnue",
     description = "Notre expertise certifiée sur les dernières versions d'Odoo vous garantit des implémentations de qualité professionnelle.",
     className = ""
}: OdooCertificationSectionProps) {
     return (
          <section className={`py-16 bg-[var(--color-teal-light)] relative ${className}`}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
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

                    {/* Main Certification Card */}
                    <motion.div
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.3 }}
                         className="mb-12"
                    >
                         <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow">
                              <div className="grid lg:grid-cols-2 gap-12 items-center">

                                   {/* Left Side - Just the Silver Badge */}
                                   <div className="flex justify-center lg:justify-start">
                                        <div className="relative">
                                             <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] rounded-2xl blur-2xl opacity-20"></div>
                                             <Image
                                                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/silver-badge-odoo.png"
                                                  alt="Odoo Silver Partner Badge"
                                                  width={280}
                                                  height={280}
                                                  className="relative w-56 h-56 md:w-64 md:h-64 object-contain"
                                             />
                                        </div>
                                   </div>

                                   {/* Right Side - Content */}
                                   <div className="space-y-6">
                                        <div>
                                             <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                                  Odoo Silver Partner
                                             </h3>
                                             <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                                  Certification officielle pour l'implémentation et la formation Odoo.
                                                  Notre statut de partenaire Silver confirme notre expertise reconnue
                                                  et notre engagement envers l'excellence.
                                             </p>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                                                  <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                  <div>
                                                       <div className="font-semibold text-gray-900">Certification officielle</div>
                                                       <div className="text-sm text-gray-600">Reconnue par Odoo SA</div>
                                                  </div>
                                             </div>
                                             <div className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                                                  <Users className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                  <div>
                                                       <div className="font-semibold text-gray-900">Équipe certifiée</div>
                                                       <div className="text-sm text-gray-600">Consultants experts</div>
                                                  </div>
                                             </div>
                                             <div className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                                                  <Shield className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                  <div>
                                                       <div className="font-semibold text-gray-900">Support premium</div>
                                                       <div className="text-sm text-gray-600">Accès prioritaire</div>
                                                  </div>
                                             </div>
                                             <div className="flex items-start gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                                                  <Award className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                                                  <div>
                                                       <div className="font-semibold text-gray-900">Garantie qualité</div>
                                                       <div className="text-sm text-gray-600">Standards Odoo</div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.5 }}
                    >
                         <div className="grid md:grid-cols-3 gap-6">
                              {[
                                   { value: "3 ans", label: "d'expertise Odoo", icon: Award },
                                   { value: "99%", label: "Satisfaction client", icon: CheckCircle },
                                   { value: "100%", label: "Équipe certifiée", icon: Shield }
                              ].map((stat, index) => (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                   >
                                        <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                             <stat.icon className="w-6 h-6 text-[var(--color-secondary)]" />
                                        </div>
                                        <div className="text-3xl font-bold text-[var(--color-secondary)] mb-2">{stat.value}</div>
                                        <div className="text-gray-700 font-medium">{stat.label}</div>
                                   </motion.div>
                              ))}
                         </div>
                    </motion.div>
               </div>
          </section>
     );
} 