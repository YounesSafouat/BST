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
               question: "Odoo est-il adapté à mon secteur d'activité ?",
               answer: "Oui, Odoo propose une architecture modulaire qui permet une adaptation fine à tous les secteurs : industrie, services, BTP, distribution, éducation, santé, etc. Nos solutions verticales sont conçues pour intégrer les besoins spécifiques de chaque métier."
          },
          {
               question: "Comment se déroule un projet d'intégration Odoo avec Blackswantechnology ?",
               answer: "Nous suivons une méthodologie structurée : cadrage, déploiement, formation, support. Chaque étape est encadrée par nos experts fonctionnels et techniques pour assurer une mise en œuvre fluide."
          },
          {
               question: "Odoo est-il compatible avec la comptabilité marocaine ?",
               answer: "Oui. Nous déployons Odoo avec un module comptable entièrement conforme aux normes marocaines (Plan Comptable Marocain, déclarations fiscales, TVA, etc.)."
          },
          {
               question: "Quels sont les délais moyens d'un projet d'intégration ?",
               answer: "Pour un projet standard, avec peu d'adaptations et une équipe à taille humaine, la durée moyenne est de 6 à 16 semaines. Pour des projets plus complexes, impliquant plusieurs services ou un haut niveau d'intégration, les délais varient entre 12 et 22 semaines, grâce à notre approche agile qui permet d'avancer par étapes avec des livrables concrets à chaque sprint."
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