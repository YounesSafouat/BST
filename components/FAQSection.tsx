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
               answer: "Absolument ! Odoo propose une architecture modulaire ultra-flexible qui s'adapte parfaitement à tous les secteurs d'activité : industrie, services, BTP, distribution, éducation, santé, et bien d'autres. Chez BlackswanTechnology, nous créons des solutions verticales sur mesure qui intègrent les spécificités métier de votre secteur pour maximiser votre productivité."
          },
          {
               question: "Comment se déroule un projet d'intégration Odoo avec BlackswanTechnology ?",
               answer: "Chez BlackswanTechnology, nous suivons une méthodologie éprouvée en 4 phases : cadrage détaillé de vos besoins, déploiement progressif, formation personnalisée de vos équipes, et support continu. Chaque étape est supervisée par nos experts certifiés Odoo pour garantir une mise en œuvre sans accroc et un ROI optimal."
          },
          {
               question: "Quels sont les délais moyens d'un projet d'intégration ?",
               answer: "Nos délais varient selon la complexité : pour un projet standard avec une équipe de taille humaine, comptez 6 à 16 semaines. Pour des projets plus complexes multi-services, les délais s'étendent de 12 à 22 semaines. Notre approche agile vous permet de voir des résultats concrets dès les premières semaines avec des livrables à chaque sprint."
          },
          {
               question: "Puis-je héberger Odoo sur le cloud ?",
               answer: "Bien sûr ! BlackswanTechnology propose un hébergement cloud managé de haute qualité via notre plateforme dédiée. Nous garantissons une haute disponibilité, des sauvegardes quotidiennes automatisées, et un monitoring 24/7 pour assurer la continuité de vos activités."
          },
          {
               question: "Proposez-vous une formation à l'utilisation d'Odoo ?",
               answer: "Oui, la formation est un élément clé de notre accompagnement ! Chaque projet inclut des sessions de formation personnalisées adaptées à vos processus métier. Nos experts BlackswanTechnology accompagnent vos équipes pour une prise en main rapide et efficace, garantissant l'autonomie de vos utilisateurs."
          },
          {
               question: "Comment se passe le support après la mise en production ?",
               answer: "Chez BlackswanTechnology, votre succès ne s'arrête pas à la mise en production ! Nous assurons un support technique et fonctionnel complet avec des SLA définis et respectés. Vous bénéficiez d'un accompagnement continu - vous n'êtes jamais seul, même après la mise en ligne de votre solution Odoo."
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