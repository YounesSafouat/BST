
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Phone, Mail, Calendar, CheckCircle, Award, Zap, Shield } from "lucide-react";
import RegionalContactInfo from "./RegionalContactInfo";

interface ContactData {
     headline: string;
     description: string;
     subdescription?: string;
     formTitle: string;
     formDescription: string;
     benefits: Array<{
          title: string;
          description: string;
          icon: string;
     }>;
     consultation: {
          title: string;
          description: string;
     };
     contactInfo: {
          phone: string;
          email: string;
     };
     guarantee: string;
}

interface ContactSectionProps {
     contactData?: ContactData;
}

export default function ContactSection({ contactData }: ContactSectionProps) {
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          needs: ''
     });
     const [isSubmitted, setIsSubmitted] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [submitError, setSubmitError] = useState('');

     // Fallback data if no data is provided
     const fallbackContactData: ContactData = {
          headline: "TRANSFORMONS ENSEMBLE",
          description: "Prêt à révolutionner votre entreprise ?",
          subdescription: "+112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne.",
          formTitle: "Parlons de votre projet",
          formDescription: "Échangeons sur vos défis et explorons ensemble comment Odoo peut transformer votre entreprise.",
          benefits: [
               {
                    title: "Partenaire Silver Officiel",
                    description: "Certification garantissant notre expertise technique reconnue par Odoo",
                    icon: "Award"
               },
               {
                    title: "Transformation Express",
                    description: "Digitalisez vos processus en quelques semaines, pas en mois",
                    icon: "Zap"
               },
               {
                    title: "Accompagnement Sécurisé",
                    description: "De l'audit stratégique à la mise en production, nous restons à vos côtés",
                    icon: "Shield"
               }
          ],
          consultation: {
               title: "Consultation Stratégique Offerte",
               description: "Recevez une analyse de vos besoins et une feuille de route claire pour votre transformation digitale, sans aucun engagement."
          },
          contactInfo: {
               phone: "",
               email: ""
          },
          guarantee: "Réponse garantie sous 4h en journée • Échange sans engagement"
     };

     const data = contactData || fallbackContactData;

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsSubmitting(true);
          setSubmitError('');



          try {
               // Prepare the data for submission
               const submissionData = {
                    ...formData,
                    // Add source information for tracking
                    source: 'odoo_page_contact',
                    page: 'odoo',
                    submitted_at: new Date().toISOString()
               };

               // Use relative URL for better compatibility with different environments
               let response;
               try {
                    response = await fetch(`/api/contact`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(submissionData),
                    });
               } catch (fetchError) {
                    console.error('Fetch error:', fetchError);
                    // Try test endpoint as fallback
                    try {
                         response = await fetch(`/api/test-contact`, {
                              method: 'POST',
                              headers: {
                                   'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(submissionData),
                         });

                    } catch (testError) {
                         console.error('Test endpoint also failed:', testError);
                         throw fetchError;
                    }
               }

               if (response.ok) {
                    const result = await response.json();

                    setIsSubmitted(true);

                    // Reset form after successful submission
                    setTimeout(() => {
                         setIsSubmitted(false);
                         setFormData({
                              name: '',
                              email: '',
                              company: '',
                              phone: '',
                              message: '',
                              needs: ''
                         });
                    }, 5000);
               } else {
                    const errorData = await response.json();
                    console.error('Form submission failed:', errorData);
                    setSubmitError(`Erreur serveur: ${errorData.error || 'Une erreur s\'est produite. Veuillez réessayer.'}`);
               }
          } catch (error) {
               console.error('Error submitting form:', error);
               setSubmitError('Une erreur s\'est produite. Veuillez réessayer.');
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleInputChange = (field: string, value: string) => {
          setFormData(prev => ({
               ...prev,
               [field]: value
          }));
     };

     const benefits = [
          {
               icon: Award,
               title: "Partenaire Silver Officiel",
               description: "Certification garantissant notre expertise technique reconnue par Odoo"
          },
          {
               icon: Zap,
               title: "Transformation Express",
               description: "Digitalisez vos processus en quelques semaines, pas en mois"
          },
          {
               icon: Shield,
               title: "Accompagnement Sécurisé",
               description: "De l'audit stratégique à la mise en production, nous restons à vos côtés"
          }
     ];

     return (
          <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-[var(--odoo-purple-light)]">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         className="text-center mb-12 sm:mb-16"
                    >
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">{data.headline}</div>
                         <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">{data.description}</h2>
                         <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{data.subdescription}</p>
                    </motion.div>

                    <div className="max-w-6xl mx-auto">
                         <Card className="border-none shadow-2xl bg-white rounded-2xl overflow-hidden">
                              <div className="grid grid-cols-1 lg:grid-cols-2">
                                   {/* Form Side */}
                                   <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                                        <div className="mb-4 sm:mb-6 md:mb-8">
                                             <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{data.formTitle}</h3>
                                             <p className="text-sm sm:text-base text-gray-600">{data.formDescription}</p>
                                        </div>

                                        {!isSubmitted ? (
                                             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                                  <div className="space-y-3 sm:space-y-4">
                                                       <div>
                                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">Prénom & Nom *</Label>
                                                            <Input
                                                                 id="name"
                                                                 value={formData.name}
                                                                 onChange={(e) => handleInputChange('name', e.target.value)}
                                                                 placeholder="John Dupont"
                                                                 required
                                                                 className="w-full h-11 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)] text-sm sm:text-base"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label htmlFor="company" className="text-sm font-medium text-gray-700 mb-2 block">Entreprise *</Label>
                                                            <Input
                                                                 id="company"
                                                                 value={formData.company}
                                                                 onChange={(e) => handleInputChange('company', e.target.value)}
                                                                 placeholder="Ma Super Entreprise"
                                                                 required
                                                                 className="w-full h-11 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)] text-sm sm:text-base"
                                                            />
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email *</Label>
                                                       <Input
                                                            id="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                            placeholder="john@monentreprise.com"
                                                            required
                                                            className="w-full h-11 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)] text-sm sm:text-base"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">Téléphone</Label>
                                                       <Input
                                                            id="phone"
                                                            value={formData.phone}
                                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                                            placeholder="01 23 45 67 89"
                                                            className="w-full h-11 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)] text-sm sm:text-base"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">Votre vision</Label>
                                                       <Textarea
                                                            id="message"
                                                            value={formData.message}
                                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                                            placeholder="Décrivez-nous vos ambitions : gains de temps, automatisation, croissance... Nous sommes là pour vous accompagner !"
                                                            rows={4}
                                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)] text-sm sm:text-base resize-none"
                                                       />
                                                  </div>
                                                  <Button
                                                       type="submit"
                                                       disabled={isSubmitting}
                                                       className="w-full bg-[var(--color-main)] hover:bg-[var(--color-secondary)] h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-full group disabled:opacity-50"
                                                  >
                                                       {isSubmitting ? (
                                                            <>
                                                                 <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                                                                 Envoi en cours...
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                                                 Commencer ma transformation
                                                            </>
                                                       )}
                                                  </Button>

                                                  {submitError && (
                                                       <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                                                            {submitError}
                                                       </div>
                                                  )}

                                                  <p className="text-xs text-gray-500 text-center">
                                                       {data.guarantee}
                                                  </p>
                                             </form>
                                        ) : (
                                             <motion.div
                                                  initial={{ opacity: 0, scale: 0.8 }}
                                                  animate={{ opacity: 1, scale: 1 }}
                                                  className="text-center py-6 sm:py-8"
                                             >
                                                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--color-secondary)] mx-auto mb-3 sm:mb-4" />
                                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                                       🚀 C'est parti !
                                                  </h3>
                                                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                                       Votre demande a été enregistrée avec succès dans notre CRM.
                                                  </p>
                                                  <p className="text-sm sm:text-base text-gray-600">
                                                       Un de nos experts Odoo vous recontacte dans les 4h pour échanger sur votre projet.
                                                  </p>
                                             </motion.div>
                                        )}
                                   </div>

                                   {/* Benefits Side */}
                                   <div className="bg-[var(--color-main)] p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8">Ce qui vous attend :</h3>
                                        <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
                                             {data.benefits.map((benefit, index) => (
                                                  <motion.div
                                                       key={index}
                                                       initial={{ opacity: 0, x: 20 }}
                                                       whileInView={{ opacity: 1, x: 0 }}
                                                       viewport={{ once: true }}
                                                       transition={{ delay: index * 0.1 }}
                                                       className="flex gap-2 sm:gap-3 md:gap-4"
                                                  >
                                                       <div className="flex-shrink-0">
                                                            {benefit.icon === 'Award' && <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--color-secondary)]" />}
                                                            {benefit.icon === 'Zap' && <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--color-secondary)]" />}
                                                            {benefit.icon === 'Shield' && <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--color-secondary)]" />}
                                                       </div>
                                                       <div>
                                                            <h4 className="font-semibold mb-1 text-sm sm:text-base">{benefit.title}</h4>
                                                            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
                                                       </div>
                                                  </motion.div>
                                             ))}
                                        </div>

                                        <div className="bg-white/10 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
                                             <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[var(--color-secondary)]" />
                                                  {data.consultation.title}
                                             </h4>
                                             <p className="text-purple-100 text-xs sm:text-sm mb-3 sm:mb-4">
                                                  {data.consultation.description}
                                             </p>
                                        </div>

                                        <div className="pt-3 sm:pt-4 md:pt-6 border-t border-white/20">
                                             <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact direct</h4>
                                             <RegionalContactInfo className="text-white" />
                                        </div>
                                   </div>
                              </div>
                         </Card>
                    </div>
               </div>
          </section>
     );
}