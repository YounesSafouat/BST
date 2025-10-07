/**
 * CasClientContactForm.tsx
 * 
 * Contact form component specifically designed for CAS client pages.
 * This form includes client source tracking to identify which client
 * the visitor came from, helping with lead attribution and analytics.
 * 
 * WHERE IT'S USED:
 * - CAS client detail pages (/cas-client/[slug])
 * - Below testimonial sections for lead generation
 * 
 * KEY FEATURES:
 * - Client source tracking (which client they came from)
 * - Different design from homepage contact form
 * - Lead attribution for better analytics
 * - Form validation and submission
 * - Integration with existing contact API
 * 
 * TECHNICAL DETAILS:
 * - Uses shadcn UI components for consistency
 * - Integrates with existing form submission logic
 * - Tracks client source for analytics
 * - Responsive design with Tailwind CSS
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Phone, User, Building, MessageSquare, ArrowRight, CheckCircle, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CountryCodeSelector from "../CountryCodeSelector"

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

interface CasClientContactFormProps {
  clientName: string
  clientSlug: string
  blockData?: {
    title?: string
    content?: string
  }
}

export default function CasClientContactForm({ clientName, clientSlug, blockData }: CasClientContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    briefDescription: `Intéressé par notre travail avec ${clientName}`,
    clientSource: clientSlug // Track which client they came from
  })
  
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦'
  })
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }
    
    if (!formData.briefDescription.trim()) {
      newErrors.briefDescription = 'La description est requise'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Generate brief description for CAS client inquiry
      const generateBriefDescription = () => {
        return `**Demande de contact depuis un cas client :**\n\n` +
               `🎯 **Client d'intérêt :** ${clientName}\n` +
               `📄 **Page visitée :** /cas-client/${clientSlug}\n` +
               `💼 **Type de demande :** ${formData.briefDescription}\n` +
               `📅 **Date :** ${new Date().toLocaleDateString('fr-FR')}\n` +
               `⏰ **Heure :** ${new Date().toLocaleTimeString('fr-FR')}\n\n` +
               `**Message du client :**\n${formData.message || 'Aucun message supplémentaire'}`;
      };

      // Add client source information to the form data
      const submissionData = {
        ...formData,
        phone: `${selectedCountry.dialCode} ${formData.phone}`,
        source: 'cas-client',
        clientName: clientName,
        clientSlug: clientSlug,
        formType: 'client-inquiry',
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        brief_description: generateBriefDescription(),
        clientSource: formData.clientSource
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Message envoyé avec succès!",
          description: "Nous vous recontacterons dans les plus brefs délais.",
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          briefDescription: `Intéressé par notre travail avec ${clientName}`,
          clientSource: clientSlug
        })
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Message envoyé avec succès!
              </h3>
              <p className="text-gray-600 mb-6">
                Merci pour votre intérêt pour notre travail avec {clientName}. 
                Notre équipe vous recontactera dans les plus brefs délais.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Envoyer un autre message
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[var(--color-main)] rounded-none sm:rounded-xl md:rounded-2xl mx-0 sm:mx-4 md:mx-6 shadow-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-2">
              {blockData?.title || `Intéressé par notre travail avec ${clientName}?`}
            </h2>
           
          </div>

          {/* Form */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className={`h-10 sm:h-11 md:h-12 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className={`h-10 sm:h-11 md:h-12 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    Téléphone *
                  </label>
                  <div className="flex space-x-2">
                    <CountryCodeSelector
                      selectedCountry={selectedCountry}
                      onCountryChange={(country) => setSelectedCountry(country)}
                    />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="6 12 34 56 78"
                      className={`flex-1 h-10 sm:h-11 md:h-12 ${errors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                    Entreprise
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Votre entreprise"
                    className="h-10 sm:h-11 md:h-12"
                  />
                </div>
              </div>


              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre projet, vos besoins ou posez-nous vos questions..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent resize-vertical text-sm sm:text-base"
                />
              </div>

              {/* Hidden field for client source */}
              <input type="hidden" name="clientSource" value={formData.clientSource} />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-[var(--color-main)] hover:bg-gray-100 h-10 sm:h-12 md:h-14 text-sm sm:text-base font-semibold rounded-full group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Demander une démonstration
                    </>
                  )}
                </Button>
              </div>

              {/* Note about client source */}
              <div className="text-center px-2">
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  En envoyant ce message, vous confirmez votre intérêt pour nos services suite à la découverte de notre travail avec {clientName}.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
