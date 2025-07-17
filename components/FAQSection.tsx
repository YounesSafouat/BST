"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
     question: string;
     answer: string;
}

const FAQSection = () => {
     const [openItems, setOpenItems] = useState<number[]>([]);

     const faqs: FAQItem[] = [
          {
               question: "Qu'est-ce qu'Odoo et pourquoi l'utiliser ?",
               answer: "Odoo est une suite d'applications business open-source qui couvre tous les besoins de votre entreprise : CRM, comptabilité, gestion de projet, e-commerce, et bien plus. Elle offre une solution intégrée, personnalisable et évolutive pour optimiser vos processus métier."
          },
          {
               question: "Combien de temps faut-il pour implémenter Odoo ?",
               answer: "Le délai d'implémentation varie selon la complexité de votre projet et le nombre de modules. En moyenne, une implémentation complète prend entre 4 à 12 semaines. Nous commençons par une phase de consultation pour définir vos besoins précis."
          },
          {
               question: "Odoo est-il adapté aux petites entreprises ?",
               answer: "Absolument ! Odoo propose des solutions adaptées à tous les types d'entreprises. Pour les PME, nous recommandons de commencer par les modules essentiels (CRM, comptabilité, vente) et d'étendre progressivement selon vos besoins."
          },
          {
               question: "Quels sont les coûts d'une implémentation Odoo ?",
               answer: "Nos tarifs varient selon vos besoins. Nous proposons des packages d'accompagnement à partir de 2 500€/mois incluant la configuration, la formation et le support. Contactez-nous pour un devis personnalisé."
          },
          {
               question: "Proposez-vous une formation pour nos équipes ?",
               answer: "Oui, la formation de vos équipes fait partie intégrante de nos services. Nous organisons des sessions de formation sur mesure pour chaque module et adaptons le contenu aux rôles de vos collaborateurs."
          },
          {
               question: "Odoo peut-il s'intégrer avec nos outils existants ?",
               answer: "Odoo offre de nombreuses possibilités d'intégration via des API et des connecteurs. Nous pouvons l'intégrer avec vos outils actuels (comptabilité, e-commerce, outils marketing) pour une transition en douceur."
          },
          {
               question: "Quel support proposez-vous après l'implémentation ?",
               answer: "Nous offrons un support réactif avec une réponse garantie sous 4h en journée. Nos packages incluent la maintenance, les mises à jour, l'optimisation continue et l'accompagnement pour de nouveaux modules."
          },
          {
               question: "Odoo est-il sécurisé pour nos données ?",
               answer: "Odoo respecte les standards de sécurité les plus élevés (ISO 27001, GDPR). Vos données sont hébergées sur des serveurs sécurisés avec sauvegarde automatique. Nous vous accompagnons également dans la mise en conformité RGPD."
          }
     ];

     const toggleItem = (index: number) => {
          setOpenItems(prev =>
               prev.includes(index)
                    ? prev.filter(item => item !== index)
                    : [...prev, index]
          );
     };

     return (
          <section className="py-20 bg-white">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">
                              QUESTIONS FRÉQUENTES
                         </div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              Tout savoir sur Odoo
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Découvrez les réponses aux questions les plus courantes sur l'implémentation Odoo
                         </p>
                    </div>

                    <div className="space-y-4">
                         {faqs.map((faq, index) => (
                              <div
                                   key={index}
                                   className="border border-gray-200 rounded-lg overflow-hidden"
                              >
                                   <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                   >
                                        <span className="font-semibold text-gray-900 pr-4">
                                             {faq.question}
                                        </span>
                                        {openItems.includes(index) ? (
                                             <ChevronUp className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                                        ) : (
                                             <ChevronDown className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                                        )}
                                   </button>

                                   {openItems.includes(index) && (
                                        <div className="px-6 pb-4 bg-gray-50">
                                             <p className="text-gray-700 leading-relaxed">
                                                  {faq.answer}
                                             </p>
                                        </div>
                                   )}
                              </div>
                         ))}
                    </div>

                    <div className="text-center mt-12">
                         <p className="text-gray-600 mb-4">
                              Vous ne trouvez pas la réponse à votre question ?
                         </p>
                         <button className="inline-flex items-center px-6 py-3 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:bg-[var(--color-secondary)]/90 transition-colors duration-300">
                              Contactez-nous
                              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                         </button>
                    </div>
               </div>
          </section>
     );
};

export default FAQSection; 