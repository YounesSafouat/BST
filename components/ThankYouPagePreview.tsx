/**
 * ThankYouPagePreview.tsx
 * 
 * Preview component to demonstrate the thank you page design
 * without needing to run the full application.
 */

"use client"

import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Clock, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThankYouPagePreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Merci pour votre demande !
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Votre demande a été transmise avec succès à notre équipe d'experts. 
              Nous vous contacterons dans les plus brefs délais pour discuter de vos besoins.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-8">
                Prochaines étapes
              </h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <Card className="border-l-4 border-l-[var(--color-main)] hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--color-main)] rounded-full flex items-center justify-center text-white">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[var(--color-secondary)]">
                          Confirmation par email
                        </CardTitle>
                        <div className="text-sm text-[var(--color-main)] font-semibold">
                          Immédiat
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      Vous recevrez un email de confirmation dans les prochaines minutes.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="border-l-4 border-l-[var(--color-main)] hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--color-main)] rounded-full flex items-center justify-center text-white">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[var(--color-secondary)]">
                          Analyse de votre demande
                        </CardTitle>
                        <div className="text-sm text-[var(--color-main)] font-semibold">
                          Sous 24h
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      Notre équipe analysera vos besoins et préparera une proposition personnalisée.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="border-l-4 border-l-[var(--color-main)] hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--color-main)] rounded-full flex items-center justify-center text-white">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[var(--color-secondary)]">
                          Prise de contact
                        </CardTitle>
                        <div className="text-sm text-[var(--color-main)] font-semibold">
                          Sous 48h
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      Un expert vous contactera pour planifier un appel de découverte.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Contact Info & Additional Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-8"
            >
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-6">
                  Besoin d'aide immédiate ?
                </h3>
                
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[var(--color-main)]" />
                        <span className="text-gray-700">+212 5XX XXX XXX</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[var(--color-main)]" />
                        <span className="text-gray-700">contact@blackswantechnology.com</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Actions */}
              <div>
                <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-6">
                  Continuez votre découverte
                </h3>
                
                <div className="space-y-4">
                  {/* Action 1 */}
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[var(--color-main)] rounded-full flex items-center justify-center text-white group-hover:bg-[var(--color-secondary)] transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-secondary)] mb-2">
                            Découvrir nos cas clients
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            Explorez les réussites de nos clients dans différents secteurs.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white"
                          >
                            Voir nos cas clients
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action 2 */}
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[var(--color-main)] rounded-full flex items-center justify-center text-white group-hover:bg-[var(--color-secondary)] transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-secondary)] mb-2">
                            Planifier un appel
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            Réservez directement un créneau avec un de nos experts.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white"
                          >
                            Prendre rendez-vous
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Back to Home CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-16"
          >
            <Button className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-3 text-lg font-semibold rounded-full">
              Retour à l'accueil
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
