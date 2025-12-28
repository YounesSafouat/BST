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

import React, { useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, Users, Clock, Star } from 'lucide-react';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';

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
     // Use singleton geolocation service
     const { region: detectedRegion, loading: locationLoading, data: locationData } = useGeolocationSingleton();


     const getPartnershipImage = (): string => {
          // Simple: read localStorage and check country code
          const cachedData = localStorage.getItem('bst_geolocation_data');
          const isMorocco = cachedData ? JSON.parse(cachedData).data?.countryCode === 'MA' : false;
          
          if (isMorocco) {
               return partnershipData?.image || "/images/team.jpeg";
          } else {
               return partnershipData?.imageOtherCountries || partnershipData?.image || "/images/team.jpeg";
          }
     };

     const getCurrentRegion = (): string => {
          // Read directly from localStorage
          try {
               const cachedData = localStorage.getItem('bst_geolocation_data');
               if (cachedData) {
                    const parsed = JSON.parse(cachedData);
                    return parsed.data?.countryCode === 'MA' ? 'morocco' : 'international';
               }
          } catch (error) {
               console.warn('Failed to read geolocation from localStorage:', error);
          }
          return 'international';
     };

     // State to track the image URL and force re-render when localStorage changes
     const [imageUrl, setImageUrl] = useState<string>('');
     const [isMorocco, setIsMorocco] = useState<boolean>(false);

     // Read localStorage and set image based on country code
     React.useEffect(() => {
          const cachedData = localStorage.getItem('bst_geolocation_data');
          if (cachedData) {
               const parsed = JSON.parse(cachedData);
               const countryCode = parsed.data?.countryCode;
               const isMoroccoCountry = countryCode === 'MA';
               
               setIsMorocco(isMoroccoCountry);
               
               if (isMoroccoCountry) {
                    // Morocco: show team photo
                    setImageUrl(partnershipData?.image || "/images/team.jpeg");
               } else {
                    // Other countries: show BST logo
                    setImageUrl(partnershipData?.imageOtherCountries || partnershipData?.image || "/images/team.jpeg");
               }
               
              
          }
     }, [partnershipData]);

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

     if (locationLoading) {
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
                         <h2 
                              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                              dangerouslySetInnerHTML={{ __html: 'BlackSwan Technology ' }}
                         />
                         <p 
                              className="text-lg text-gray-600 max-w-3xl mx-auto"
                              dangerouslySetInnerHTML={{ __html: partnershipData?.subdescription || 'Une équipe de consultants certifiés, passionnés par l\'accompagnement de nos clients dans leur transformation digitale.' }}
                         />
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                         {/* Left Side - Image */}
                         <div className="relative w-full md:w-1/2 flex justify-center group">
                              <div className={`overflow-hidden w-full max-w-lg transform transition-all duration-700 hover:scale-105 hover:-rotate-1 ${isMorocco
                                   ? 'rounded-2xl shadow-xl hover:shadow-2xl'
                                   : 'rounded-none shadow-none hover:shadow-none'
                                   }`}>
                                   <div className="relative overflow-hidden">
                                        <img
                                             key={`agency-image-${isMorocco ? 'morocco' : 'other'}`}
                                             src={imageUrl}
                                             alt="Notre équipe"
                                             className="object-cover w-full h-72 md:h-80 transition-transform duration-700 group-hover:scale-110"
                                             onError={(e) => {
                                                  e.currentTarget.src = "/images/team.jpeg";
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
                                   partnershipData.features.map((feature, index) => {
                                        // Map feature titles to H3 headings based on PDF structure
                                        const h3Mapping: { [key: string]: string } = {
                                             'Notre mission': 'Notre mission',
                                             'Pourquoi nous choisir ?': 'Pourquoi nous choisir ?',
                                             'Notre méthode': 'Notre méthode',
                                             'Notre équipe Odoo': 'Notre équipe Odoo',
                                             'Nous recrutons': 'Nous recrutons'
                                        };
                                        const h3Title = h3Mapping[feature.title] || feature.title;
                                        return (
                                             <div key={index} className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                                  ? 'rounded-xl shadow'
                                                  : 'rounded-none shadow-none'
                                                  }`}>
                                                  {renderIcon(feature.icon)}
                                                  <div>
                                                       <h3 
                                                            className="font-bold text-lg text-gray-900"
                                                            dangerouslySetInnerHTML={{ __html: h3Title }}
                                                       />
                                                       <div 
                                                            className="text-gray-500 text-sm"
                                                            dangerouslySetInnerHTML={{ __html: feature.description }}
                                                       />
                                                  </div>
                                             </div>
                                        );
                                   })
                              ) : (
                                   <>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <BadgeCheck className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <h3 className="font-bold text-lg text-gray-900">Notre mission</h3>
                                                  <div className="text-gray-500 text-sm">Partenaire Silver Odoo</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Users className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <h3 className="font-bold text-lg text-gray-900">Pourquoi nous choisir ?</h3>
                                                  <div className="text-gray-500 text-sm">100% de nos consultants sont certifiés Odoo</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Clock className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <h3 className="font-bold text-lg text-gray-900">Notre méthode</h3>
                                                  <div className="text-gray-500 text-sm">Réponse garantie sous 4h en journée</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Star className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <h3 className="font-bold text-lg text-gray-900">Notre équipe Odoo</h3>
                                                  <div className="text-gray-500 text-sm">99% de satisfaction client sur tous nos projets</div>
                                             </div>
                                        </div>
                                        <div className={`bg-white p-6 flex items-start gap-4 ${isMorocco
                                             ? 'rounded-xl shadow'
                                             : 'rounded-none shadow-none'
                                             }`}>
                                             <Users className="w-8 h-8 text-[var(--color-secondary)]" />
                                             <div>
                                                  <h3 className="font-bold text-lg text-gray-900">Nous recrutons</h3>
                                                  <div className="text-gray-500 text-sm">Rejoignez notre équipe de consultants certifiés</div>
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
