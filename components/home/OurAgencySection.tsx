/**
 * OurAgencySection.tsx
 * 
 * Component for the "Our Agency" section that displays company information,
 * team image, and key features/benefits. This section showcases Black Swan
 * Technology as a trusted partner with certified expertise.
 * 
 * WHERE IT'S USED:
 * - HomePage component - Displays company information and features
 * - Can be reused in other pages that need agency information
 * 
 * KEY FEATURES:
 * - Dynamic content from partnership data
 * - Regional image selection based on user location
 * - Responsive two-column layout
 * - Interactive hover effects
 * - Fallback content when data is unavailable
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript
 * - Implements responsive design with Tailwind CSS
 * - Integrates with geolocation for regional content
 * - Uses Next.js Image component for optimization
 * - Supports dynamic icon rendering
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BadgeCheck, Users, Clock, Star } from 'lucide-react';
import { getUserLocation, getRegionFromCountry } from '@/lib/geolocation';

interface PartnershipData {
     headline?: string;
     description?: string;
     subdescription?: string;
     image?: string;
     imageOtherCountries?: string;
     features?: Array<{
          title: string;
          description: string;
          icon: string;
     }>;
}

interface OurAgencySectionProps {
     partnershipData?: PartnershipData;
     userRegion?: string;
}

const OurAgencySection: React.FC<OurAgencySectionProps> = ({
     partnershipData,
     userRegion = 'international'
}) => {
     const [location, setLocation] = useState<any>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const detectLocation = async () => {
               try {
                    const userLocation = await getUserLocation();
                    setLocation(userLocation);
               } catch (error) {
                    console.error("Error detecting location:", error);
               } finally {
                    setLoading(false);
               }
          };

          detectLocation();
     }, []);

     const getPartnershipImage = (): string => {
          // Use the passed userRegion if available, otherwise detect from location
          let region = userRegion;

          if (!userRegion && location?.countryCode) {
               region = getRegionFromCountry(location.countryCode);
          }

          // Check if user is in Morocco
          if (region === 'morocco') {
               // Use the main image field for Morocco
               return partnershipData?.image || "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg";
          } else {
               // For all other countries, use the imageOtherCountries field if available
               return partnershipData?.imageOtherCountries || partnershipData?.image || "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg";
          }
     };

     const getCurrentRegion = (): string => {
          // Use the passed userRegion if available, otherwise detect from location
          if (userRegion) {
               return userRegion;
          }

          if (location?.countryCode) {
               return getRegionFromCountry(location.countryCode);
          }

          return 'international';
     };

     const isMorocco = getCurrentRegion() === 'morocco';

     const renderIcon = (iconName: string) => {
          switch (iconName) {
               case 'BadgeCheck':
                    return <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />;
               case 'Users':
                    return <Users className="w-8 h-8 text-[var(--color-secondary)]" />;
               case 'Clock':
                    return <Clock className="w-8 h-8 text-[var(--color-secondary)]" />;
               case 'Star':
                    return <Star className="w-8 h-8 text-[var(--color-secondary)]" />;
               default:
                    return <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />;
          }
     };

     if (loading) {
          return (
               <section className="py-20 bg-white relative z-10" id="team">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                              <div className="animate-pulse">
                                   <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                                   <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
                                   <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
                              </div>
                         </div>
                         <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                              <div className="w-full md:w-1/2">
                                   <div className="animate-pulse bg-gray-300 rounded-2xl h-72 md:h-80"></div>
                              </div>
                              <div className="w-full md:w-1/2 space-y-6">
                                   {[...Array(4)].map((_, i) => (
                                        <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-20"></div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </section>
          );
     }

     return (
          <section className="py-20 bg-white relative z-10" id="team">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              Blackswan technology
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              {partnershipData?.headline || 'Plus qu\'un intégrateur, un partenaire de confiance.'}
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              {partnershipData?.subdescription || 'Une équipe de consultants certifiés, passionnés par l\'accompagnement de nos clients dans leur transformation digitale.'}
                         </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                         {/* Left Side - Image */}
                         <div className="relative w-full md:w-1/2 flex justify-center group">
                              <div className={`overflow-hidden w-full max-w-lg transform transition-all duration-700 hover:scale-105 hover:-rotate-1 ${isMorocco
                                   ? 'rounded-2xl shadow-xl hover:shadow-2xl'
                                   : 'rounded-none shadow-none hover:shadow-none'
                                   }`}>
                                   <div className="relative overflow-hidden">
                                        <Image
                                             src={getPartnershipImage()}
                                             alt="Notre équipe"
                                             width={600}
                                             height={350}
                                             className="object-cover w-full h-72 md:h-80 transition-transform duration-700 group-hover:scale-110"
                                             onError={(e) => {
                                                  e.currentTarget.src = "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg";
                                             }}
                                        />
                                        {/* Subtle border glow */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-secondary)]/30 transition-all duration-500"></div>
                                   </div>
                              </div>
                         </div>

                         {/* Right Side - Features */}
                         <div className="w-full md:w-1/2 flex flex-col gap-6">
                              {partnershipData?.features ? (
                                   partnershipData.features.map((feature, index) => (
                                        <div key={index} className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             {renderIcon(feature.icon)}
                                             <div>
                                                  <div className="font-bold text-lg text-gray-900">{feature.title}</div>
                                                  <div className="text-gray-500 text-sm">{feature.description}</div>
                                             </div>
                                        </div>
                                   ))
                              ) : (
                                   <>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <div className="font-bold text-lg text-gray-900">Partenaire Silver Odoo</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Users className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <div className="font-bold text-lg text-gray-900">Équipe certifiée</div>
                                                  <div className="text-gray-500 text-sm">100% de nos consultants sont certifiés Odoo</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Clock className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <div className="font-bold text-lg text-gray-900">Support réactif</div>
                                                  <div className="text-gray-500 text-sm">Réponse garantie sous 4h en journée</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Star className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <div className="font-bold text-lg text-gray-900">Excellence reconnue</div>
                                                  <div className="text-gray-500 text-sm">99% de satisfaction client sur tous nos projets</div>
                                             </div>
                                        </div>
                                   </>
                              )}
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default OurAgencySection;
