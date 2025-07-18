
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Phone, Mail, Calendar, CheckCircle, Award, Zap, Shield } from "lucide-react";

export default function ContactSection() {
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

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsSubmitting(true);
          setSubmitError('');

          console.log('Form submission started');
          console.log('Environment check:', {
               NODE_ENV: process.env.NODE_ENV,
               NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
               window_location: typeof window !== 'undefined' ? window.location.origin : 'server-side'
          });

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
                         console.log('Using test endpoint as fallback');
                    } catch (testError) {
                         console.error('Test endpoint also failed:', testError);
                         throw fetchError;
                    }
               }

               if (response.ok) {
                    const result = await response.json();
                    console.log('Contact form submitted successfully:', result);
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
          <section id="contact" className="py-20 bg-[var(--odoo-purple-light)]">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         className="text-center mb-16"
                    >
                         <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">TRANSFORMONS ENSEMBLE</div>
                         <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                              Prêt à révolutionner votre entreprise ?
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              <span className="font-semibold text-[var(--color-secondary)]">+112 entreprises nous font confiance.</span> Rejoignez-les et découvrez pourquoi Odoo change la donne.
                         </p>
                    </motion.div>

                    <div className="max-w-6xl mx-auto">
                         <Card className="border-none shadow-2xl bg-white rounded-2xl overflow-hidden">
                              <div className="grid lg:grid-cols-2">
                                   {/* Form Side */}
                                   <div className="p-8 md:p-12">
                                        <div className="mb-8">
                                             <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                  Parlons de votre projet
                                             </h3>
                                             <p className="text-gray-600">
                                                  Échangeons sur vos défis et explorons ensemble comment Odoo peut transformer votre entreprise.
                                             </p>
                                        </div>

                                        {!isSubmitted ? (
                                             <form onSubmit={handleSubmit} className="space-y-5">
                                                  <div className="grid grid-cols-2 gap-4">
                                                       <div>
                                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Prénom & Nom *</Label>
                                                            <Input
                                                                 id="name"
                                                                 value={formData.name}
                                                                 onChange={(e) => handleInputChange('name', e.target.value)}
                                                                 placeholder="John Dupont"
                                                                 required
                                                                 className="mt-1 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label htmlFor="company" className="text-sm font-medium text-gray-700">Entreprise *</Label>
                                                            <Input
                                                                 id="company"
                                                                 value={formData.company}
                                                                 onChange={(e) => handleInputChange('company', e.target.value)}
                                                                 placeholder="Ma Super Entreprise"
                                                                 required
                                                                 className="mt-1 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
                                                            />
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                                                       <Input
                                                            id="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                            placeholder="john@monentreprise.com"
                                                            required
                                                            className="mt-1 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone</Label>
                                                       <Input
                                                            id="phone"
                                                            value={formData.phone}
                                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                                            placeholder="01 23 45 67 89"
                                                            className="mt-1 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label htmlFor="message" className="text-sm font-medium text-gray-700">Votre vision</Label>
                                                       <Textarea
                                                            id="message"
                                                            value={formData.message}
                                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                                            placeholder="Décrivez-nous vos ambitions : gains de temps, automatisation, croissance... Nous sommes là pour vous accompagner !"
                                                            rows={4}
                                                            className="mt-1 border-gray-300 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]"
                                                       />
                                                  </div>
                                                  <Button
                                                       type="submit"
                                                       disabled={isSubmitting}
                                                       className="w-full bg-[var(--color-main)] hover:bg-[var(--color-secondary)] py-4 text-lg font-semibold rounded-full group disabled:opacity-50"
                                                  >
                                                       {isSubmitting ? (
                                                            <>
                                                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                                 Envoi en cours...
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                                                 Lancer ma transformation
                                                            </>
                                                       )}
                                                  </Button>

                                                  {submitError && (
                                                       <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                                                            {submitError}
                                                       </div>
                                                  )}

                                                  <p className="text-xs text-gray-500 text-center">
                                                       Réponse garantie sous 4h en journée • Échange sans engagement
                                                  </p>
                                             </form>
                                        ) : (
                                             <motion.div
                                                  initial={{ opacity: 0, scale: 0.8 }}
                                                  animate={{ opacity: 1, scale: 1 }}
                                                  className="text-center py-8"
                                             >
                                                  <CheckCircle className="w-16 h-16 text-[var(--color-secondary)] mx-auto mb-4" />
                                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                       🚀 C'est parti !
                                                  </h3>
                                                  <p className="text-gray-600 mb-4">
                                                       Votre demande a été enregistrée avec succès dans notre CRM.
                                                  </p>
                                                  <p className="text-gray-600">
                                                       Un de nos experts Odoo vous recontacte dans les 4h pour échanger sur votre projet.
                                                  </p>
                                             </motion.div>
                                        )}
                                   </div>

                                   {/* Benefits Side */}
                                   <div className="bg-[var(--color-main)] p-8 md:p-12 text-white">
                                        <h3 className="text-2xl font-bold mb-8">Ce qui vous attend :</h3>
                                        <div className="space-y-6 mb-8">
                                             {benefits.map((benefit, index) => (
                                                  <motion.div
                                                       key={index}
                                                       initial={{ opacity: 0, x: 20 }}
                                                       whileInView={{ opacity: 1, x: 0 }}
                                                       viewport={{ once: true }}
                                                       transition={{ delay: index * 0.1 }}
                                                       className="flex gap-4"
                                                  >
                                                       <div className="flex-shrink-0">
                                                            <benefit.icon className="w-6 h-6 text-[var(--color-secondary)]" />
                                                       </div>
                                                       <div>
                                                            <h4 className="font-semibold mb-1">{benefit.title}</h4>
                                                            <p className="text-purple-100 text-sm leading-relaxed">{benefit.description}</p>
                                                       </div>
                                                  </motion.div>
                                             ))}
                                        </div>

                                        <div className="bg-white/10 rounded-xl p-6 mb-8">
                                             <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                  <CheckCircle className="w-5 h-5 text-[var(--color-secondary)]" />
                                                  Consultation Stratégique Offerte
                                             </h4>
                                             <p className="text-purple-100 text-sm mb-4">
                                                  Recevez une analyse de vos besoins et une feuille de route claire pour votre transformation digitale, sans aucun engagement.
                                             </p>
                                        </div>

                                        <div className="pt-6 border-t border-white/20">
                                             <h4 className="font-semibold mb-4">Contact direct</h4>
                                             <div className="space-y-3">
                                                  <a href="tel:+33123456789" className="flex items-center gap-3 group hover:text-white/80 transition-colors">
                                                       <Phone className="w-5 h-5" />
                                                       <span>01 23 45 67 89</span>
                                                  </a>
                                                  <a href="mailto:contact@blackswan.fr" className="flex items-center gap-3 group hover:text-white/80 transition-colors">
                                                       <Mail className="w-5 h-5" />
                                                       <span>contact@blackswan.fr</span>
                                                  </a>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </Card>
                    </div>
               </div>
          </section>
     );
}