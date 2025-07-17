import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PricingSection() {
     const plans = [
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
               cta: "Obtenir un devis"
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
               cta: "Planifier un échange"
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
               cta: "Discutons ensemble"
          }
     ];

     return (
          <section id="pricing" className="py-20 bg-[var(--odoo-purple-light)]">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         className="text-center mb-16"
                    >
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TARIFS & ACCOMPAGNEMENT</div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              Un partenariat, pas seulement une prestation
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Nos packs d'accompagnement sont conçus pour s'adapter à votre taille et vos ambitions.
                         </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                         {plans.map((plan, index) => (
                              <motion.div
                                   key={index}
                                   initial={{ opacity: 0, y: 30 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   viewport={{ once: true }}
                                   transition={{ delay: index * 0.1 }}
                                   className="h-full"
                              >
                                   <Card className={`h-full border-2 rounded-2xl transition-all duration-300 flex flex-col ${index === 1
                                        ? 'border-[var(--color-main)] shadow-2xl bg-white scale-105'
                                        : 'border-transparent bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl'
                                        }`}>
                                        <CardHeader className="p-8 flex-shrink-0">
                                             <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-2">{plan.name}</h3>
                                             <p className="text-gray-600 text-sm mb-4 h-12 flex items-center">{plan.description}</p>
                                             <div className="space-y-1">
                                                  <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                                                  <div className="text-sm text-gray-500">{plan.estimation}</div>
                                             </div>
                                        </CardHeader>

                                        <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                                             <ul className="space-y-4 mb-8 flex-grow">
                                                  {plan.features.map((feature, idx) => (
                                                       <li key={idx} className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
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
                                                       const el = document.querySelector('#contact');
                                                       if (el) el.scrollIntoView({ behavior: 'smooth' });
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
               </div>
          </section>
     );
}