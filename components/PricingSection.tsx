import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { getUserLocation, getRegionFromCountry, getLocalizedPricing, getLocalizedCurrency, type Region } from "@/lib/geolocation";

interface PricingData {
     headline: string;
     subheadline: string;
     description?: string;
     plans: Array<{
          name: string;
          description: string;
          price: string;
          estimation: string;
          features: string[];
          cta: string;
          targetRegions?: string[]; // New field for region targeting
     }>;
}

interface PricingSectionProps {
     pricingData?: PricingData;
}

export default function PricingSection({ pricingData }: PricingSectionProps) {
     const [pricingContent, setPricingContent] = useState<PricingData | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [userRegion, setUserRegion] = useState<Region>('international');
     const [locationLoading, setLocationLoading] = useState(true);

     useEffect(() => {
          const detectUserLocation = async () => {
               try {
                    // Log device information for debugging
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    console.log('Pricing Section - Device detection:', {
                         userAgent: navigator.userAgent,
                         isMobile: isMobile,
                         platform: navigator.platform,
                         language: navigator.language,
                         screenSize: `${window.screen.width}x${window.screen.height}`,
                         viewport: `${window.innerWidth}x${window.innerHeight}`
                    });

                    const location = await getUserLocation();
                    if (location) {
                         const region = getRegionFromCountry(location.countryCode);
                         setUserRegion(region);
                         console.log('Pricing Section - User location detected:', location, 'Region:', region);
                    } else {
                         console.log('Pricing Section - No location detected, using default region');
                    }
               } catch (error) {
                    console.error('Pricing Section - Error detecting user location:', error);
               } finally {
                    setLocationLoading(false);
               }
          };

          detectUserLocation();
     }, []);

     useEffect(() => {
          const fetchPricingData = async () => {
               try {
                    // If pricingData is passed as prop, use it
                    if (pricingData) {
                         setPricingContent(pricingData);
                         setIsLoading(false);
                         return;
                    }

                    // Otherwise, fetch from API
                    const response = await fetch('/api/content/odoo', {
                         cache: 'no-store'
                    });

                    if (response.ok) {
                         const data = await response.json();
                         if (data && data.pricing) {
                              setPricingContent(data.pricing);
                         }
                    }
               } catch (error) {
                    console.error('Error fetching pricing data:', error);
               } finally {
                    setIsLoading(false);
               }
          };

          fetchPricingData();
     }, [pricingData]);

     // Fallback data if no data is available
     const fallbackPlans = [
          {
               name: "Pack Démarrage",
               description: "Idéal pour débuter avec Odoo rapidement et efficacement.",
               price: "À partir de 1 500€",
               estimation: "~25 heures d'accompagnement",
               features: [
                    "Audit détaillé de vos besoins",
                    "Configuration de base Odoo",
                    "Formation initiale équipe",
                    "Support au démarrage (30j)",
                    "Documentation personnalisée"
               ],
               cta: "Obtenir un devis",
               targetRegions: ['france', 'morocco', 'international']
          },
          {
               name: "Pack Croissance",
               description: "Solution complète pour les entreprises en développement.",
               price: "À partir de 5 000€",
               estimation: "~100 heures d'accompagnement",
               features: [
                    "Tous les avantages du pack Démarrage",
                    "Développements spécifiques",
                    "Intégration modules avancés",
                    "Formation approfondie des équipes",
                    "Accompagnement mensuel (6 mois)"
               ],
               cta: "Planifier un échange",
               targetRegions: ['france', 'morocco', 'international']
          },
          {
               name: "Pack Sur Mesure",
               description: "Accompagnement personnalisé selon vos besoins spécifiques.",
               price: "Devis personnalisé",
               estimation: "Volume d'heures adapté",
               features: [
                    "Analyse approfondie de vos processus",
                    "Solution 100% personnalisée",
                    "Support prioritaire dédié",
                    "Consultant attitré à votre projet",
                    "Suivi stratégique long terme"
               ],
               cta: "Contactez-nous",
               targetRegions: ['france', 'morocco', 'international']
          }
     ];

     const plans = pricingContent?.plans || fallbackPlans;
     const headline = pricingContent?.headline || "Tarifs & Accompagnement";
     const subheadline = pricingContent?.subheadline || "Des solutions adaptées à votre budget et vos objectifs";
     const description = pricingContent?.description || "Choisissez le pack qui correspond le mieux à vos besoins et commencez votre transformation digitale dès aujourd'hui.";

     // Filter plans based on user region
     const filteredPlans = plans.filter(plan => {
          console.log('Checking plan:', plan.name, 'targetRegions:', plan.targetRegions, 'userRegion:', userRegion);

          // If no targetRegions specified, show to all regions (this is the key fix)
          if (!plan.targetRegions || plan.targetRegions.length === 0) {
               console.log('Plan has no targetRegions, showing to all:', plan.name);
               return true;
          }

          // Check if plan is available for user's region
          const isAvailable = plan.targetRegions.includes(userRegion) || plan.targetRegions.includes('all');
          console.log('Plan availability for', userRegion, ':', isAvailable, plan.name);

          return isAvailable;
     });

     // If no plans are filtered, show all plans (temporary fix for API data issues)
     const finalPlans = filteredPlans.length > 0 ? filteredPlans : plans;
     console.log('Final plans count:', finalPlans.length, 'for region:', userRegion);
     console.log('All plans:', plans.map(p => ({ name: p.name, targetRegions: p.targetRegions })));

     const getRegionDisplayName = (region: Region): string => {
          switch (region) {
               case 'france':
                    return 'France';
               case 'morocco':
                    return 'Maroc';
               case 'international':
                    return 'International';
               default:
                    return 'International';
          }
     };

     if (isLoading) {
          return (
               <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                              <div className="animate-pulse">
                                   <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                                   <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
                              </div>
                         </div>
                    </div>
               </section>
          );
     }

     return (
          <section className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    <div className="text-center mb-12">
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              {headline}
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              {subheadline}
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              {description}
                         </p>

                         {/* Region indicator for debugging */}
                         {!locationLoading && (
                              <div className="mt-4 text-sm text-gray-500">
                                   Tarifs affichés pour : <span className="font-semibold text-[var(--color-secondary)]">{getRegionDisplayName(userRegion)}</span>
                              </div>
                         )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                         {finalPlans.map((plan, index) => {
                              const localizedPrice = getLocalizedPricing(userRegion, plan.price);
                              const currency = getLocalizedCurrency(userRegion);

                              return (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                   >
                                        <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-[var(--color-secondary)] group">
                                             <CardHeader className="text-center pb-4">
                                                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
                                                       {plan.name}
                                                  </h3>
                                                  <p className="text-gray-600 text-sm leading-relaxed">
                                                       {plan.description}
                                                  </p>
                                                  <div className="mt-4">
                                                       <div className="text-3xl font-bold text-[var(--color-secondary)] mb-1">
                                                            {localizedPrice}
                                                       </div>
                                                       <div className="text-sm text-gray-500">
                                                            {plan.estimation}
                                                       </div>
                                                  </div>
                                             </CardHeader>
                                             <CardContent className="pt-0">
                                                  <ul className="space-y-3 mb-8">
                                                       {plan.features.map((feature, featureIndex) => (
                                                            <li key={featureIndex} className="flex items-start">
                                                                 <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] mr-3 mt-0.5 flex-shrink-0" />
                                                                 <span className="text-gray-700 text-sm">{feature}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                                  <Button className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white group-hover:scale-105 transition-transform duration-200">
                                                       {plan.cta}
                                                       <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                  </Button>
                                             </CardContent>
                                        </Card>
                                   </motion.div>
                              );
                         })}
                    </div>

                    {/* No plans available message */}
                    {finalPlans.length === 0 && (
                         <div className="text-center py-12">
                              <p className="text-gray-500 text-lg">
                                   Aucun tarif disponible pour votre région actuellement.
                              </p>
                              <p className="text-gray-400 text-sm mt-2">
                                   Contactez-nous pour un devis personnalisé.
                              </p>
                         </div>
                    )}
               </div>
          </section>
     );
}