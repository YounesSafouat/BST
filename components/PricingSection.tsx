import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { getUserLocation, getRegionFromCountry } from "@/lib/geolocation";

interface PricingSectionProps {
     pricingData?: {
          headline?: string;
          subheadline?: string;
          description?: string;
          plans?: Array<{
               name: string;
               description: string;
               price: string;
               estimation: string;
               features: string[];
               cta: string;
               targetRegions?: string[];
          }>;
     };
}

export default function PricingSection({ pricingData }: PricingSectionProps) {
     const [location, setLocation] = useState<any>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const detectLocation = async () => {
               try {
                    console.log("Detecting location for pricing section...");
                    const userLocation = await getUserLocation();
                    console.log("User location detected:", userLocation);
                    setLocation(userLocation);
               } catch (error) {
                    console.error("Error detecting location:", error);
               } finally {
                    setLoading(false);
               }
          };

          detectLocation();
     }, []);

     // Filter plans based on user location
     const filteredPlans = pricingData?.plans?.filter(plan => {
          if (!location || !location.countryCode) return true;

          const region = getRegionFromCountry(location.countryCode);
          console.log("Detected region:", region);

          if (!plan.targetRegions) return true;

          // Show plans that match the user's region OR show international plans only if user is not from Morocco or France
          if (region === 'morocco' || region === 'france') {
               return plan.targetRegions.includes(region);
          } else {
               // For international users, show international plans
               return plan.targetRegions.includes('international');
          }
     }) || [];

     if (loading) {
          return (
               <section id="pricing" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                              <div className="animate-pulse">
                                   <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                                   <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
                                   <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
                              </div>
                         </div>
                    </div>
               </section>
          );
     }

     return (
          <section id="pricing" className="min-h-screen flex items-center bg-[var(--color-main)]">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         className="text-center mb-16"
                    >
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              {pricingData?.headline || "Tarifs & Accompagnement"}
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                              {pricingData?.subheadline || "Un partenariat, pas seulement une prestation"}
                         </h2>
                         <p className="text-lg text-white max-w-3xl mx-auto">
                              {pricingData?.description || "Nos packs d'accompagnement sont conçus pour s'adapter à votre taille et vos ambitions."}
                         </p>

                    </motion.div>

                    {filteredPlans.length === 0 ? (
                         <div className="text-center py-12">
                              <p className="text-gray-600 text-lg">Aucun tarif disponible pour votre région.</p>
                              <p className="text-sm text-gray-500 mt-2">Détecté: {location?.countryCode || 'Non détecté'}</p>
                         </div>
                    ) : (
                         <div className="grid md:grid-cols-3 gap-8">
                              {filteredPlans.map((plan, index) => (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="h-full"
                                   >
                                        <Card className={`h-full border-2 rounded-2xl transition-all duration-300 flex flex-col ${index === 1
                                             ? 'border-[var(--color-secondary)] shadow-2xl bg-white scale-105'
                                             : 'border-transparent bg-white backdrop-blur-sm shadow-lg hover:shadow-xl'
                                             }`}>
                                             <CardHeader className="p-8 flex-shrink-0">
                                                  <h3 className="text-xl font-extrabold text-[var(--color-main)] mb-2">{plan.name}</h3>
                                                  <p className="text-gray-600 text-sm mb-4 h-12 flex items-center">{plan.description}</p>
                                                  <div className="space-y-1">
                                                       <div className="text-2xl font-extrabold text-[var(--color-secondary)]">{plan.price}</div>
                                                       <div className="text-sm text-gray-500">{plan.estimation}</div>
                                                       <div className="text-xs text-gray-400 italic">* Prix hors taxes</div>
                                                  </div>
                                             </CardHeader>

                                             <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                                                  <ul className="space-y-4 mb-8 flex-grow">
                                                       {plan.features?.map((feature: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-3">
                                                                 <CheckCircle className="w-5 h-5 text-[var(--color-main)] mt-0.5 flex-shrink-0" />
                                                                 <span className="text-gray-700 text-sm">{feature}</span>
                                                            </li>
                                                       ))}
                                                  </ul>

                                                  <Button
                                                       className={`w-full py-3 font-semibold group rounded-full ${index === 1
                                                            ? 'bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white'
                                                            : 'bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white'
                                                            }`}
                                                       onClick={() => {
                                                            const contactSection = document.querySelector('#contact');
                                                            if (contactSection) {
                                                                 contactSection.scrollIntoView({ behavior: 'smooth' });
                                                            }
                                                       }}
                                                  >
                                                       {plan.cta}
                                                       <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                  </Button>
                                             </CardContent>
                                        </Card>
                                   </motion.div>
                              ))}
                         </div>
                    )}

                    {/* Tax notice */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.5 }}
                         className="text-center mt-12"
                    >
                         <p className="text-sm text-white/80 italic">
                              * Tous les prix affichés sont hors taxes (HT). La TVA applicable sera ajoutée selon la réglementation en vigueur.
                         </p>
                    </motion.div>
               </div>
          </section>
     );
}