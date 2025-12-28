/**
 * FAQSection.tsx
 * 
 * FAQ section component that displays frequently asked questions with
 * expandable/collapsible functionality. This component provides answers
 * to common questions about services and company offerings.
 * 
 * WHERE IT'S USED:
 * - Homepage (/components/home/HomePage.tsx) - FAQ section display
 * - About page and other pages that need FAQ information
 * - Customer support and information provision
 * 
 * KEY FEATURES:
 * - Expandable/collapsible FAQ items
 * - Dynamic content loading from props or fallback data
 * - Smooth animations for item transitions
 * - Responsive design with mobile optimization
 * - Interactive question/answer interface
 * - Fallback content when no data provided
 * - Clean and organized information display
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements state management for open/closed items
 * - Uses framer-motion for smooth animations
 * - Responsive design with Tailwind CSS
 * - Implements toggle functionality for FAQ items
 * - Fallback data system for content availability
 * - Clean component architecture with proper interfaces
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQItem {
     question: string;
     answer: string;
}

interface FAQData {
     headline: string;
     description: string;
     subdescription?: string;
     items: FAQItem[];
}

interface FAQSectionProps {
     faqData?: FAQData;
}

const FAQSection = ({ faqData }: FAQSectionProps) => {
     const [openItems, setOpenItems] = useState<number[]>([]);

     // Fallback data if no data is provided
     const fallbackFaqs: FAQItem[] = [
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

     const faqs = faqData?.items || fallbackFaqs;
     const headline = faqData?.headline || 'QUESTIONS FRÉQUENTES';
     const description = faqData?.description || 'Tout savoir sur Odoo';
     const subdescription = faqData?.subdescription || 'Découvrez les réponses aux questions les plus courantes sur l\'implémentation Odoo';

     const toggleItem = (index: number) => {
          setOpenItems(prev =>
               prev.includes(index)
                    ? prev.filter(item => item !== index)
                    : [...prev, index]
          );
     };

     return (
          <section className="py-12 sm:py-16 md:py-20 bg-white">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                         <h2 
                              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                              dangerouslySetInnerHTML={{ __html: 'Tout savoir sur Odoo' }}
                         />
                         <p 
                              className="text-lg text-gray-600 max-w-3xl mx-auto"
                              dangerouslySetInnerHTML={{ __html: subdescription }}
                         />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                         {faqs.map((faq, index) => (
                              <div
                                   key={index}
                                   className="border border-gray-200 hover:border-[var(--color-secondary)] rounded-2xl overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                              >
                                   <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                   >
                                        <h3 
                                             className="font-semibold text-gray-900 pr-2 sm:pr-4 text-sm sm:text-base"
                                             dangerouslySetInnerHTML={{ __html: faq.question }}
                                        />
                                        {openItems.includes(index) ? (
                                             <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)] flex-shrink-0" />
                                        ) : (
                                             <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)] flex-shrink-0" />
                                        )}
                                   </button>

                                   {openItems.includes(index) && (
                                        <div className="px-4 sm:px-6 pb-3 sm:pb-4 bg-gray-50">
                                             <p 
                                                  className="text-gray-700 leading-relaxed text-sm sm:text-base"
                                                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                                             />
                                        </div>
                                   )}
                              </div>
                         ))}
                    </div>

                    <div className="text-center mt-8 sm:mt-12">
                         <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                              Vous ne trouvez pas la réponse à votre question ?
                         </p>
                         <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                         >
                              <button
                                   onClick={() => {
                                        const contactSection = document.getElementById('contact');
                                        if (contactSection) {
                                             contactSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                   }}
                                   aria-label="Contactez-nous"
                                   className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] hover:from-[var(--color-secondary)] hover:to-[var(--color-main)] text-white font-semibold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                              >
                                   <span>Contactez-nous</span>
                                   <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                                   <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              </button>
                         </motion.div>
                    </div>
               </div>
          </section>
     );
};

export default FAQSection; 