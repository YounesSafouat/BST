"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { X, Phone, Mail, User, Building, MessageSquare, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import CountryCodeSelector from '@/components/CountryCodeSelector'
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'
import { useFormSubmit, StandardFormData } from '@/hooks/use-form-submit'

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
  clientName?: string
  clientSlug?: string
}

export default function ContactPopup({ isOpen, onClose, clientName, clientSlug }: ContactPopupProps) {
  const { submitForm } = useFormSubmit()
  const { toast } = useToast()
  const { data: locationData } = useGeolocationSingleton()
  
  const countryCode = locationData?.countryCode || 'MA'
  const countryName = locationData?.country || 'Morocco'
  const city = locationData?.city || ''

  // Helper functions for country data
  const getDialCode = (code: string) => {
    const dialCodes: { [key: string]: string } = {
      'MA': '+212', 'FR': '+33', 'US': '+1', 'CA': '+1', 'BE': '+32', 'CH': '+41',
      'DZ': '+213', 'TN': '+216', 'EG': '+20', 'SN': '+221', 'CI': '+225'
    }
    return dialCodes[code] || '+212'
  }

  const getFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'MA': '🇲🇦', 'FR': '🇫🇷', 'US': '🇺🇸', 'CA': '🇨🇦', 'BE': '🇧🇪', 'CH': '🇨🇭',
      'DZ': '🇩🇿', 'TN': '🇹🇳', 'EG': '🇪🇬', 'SN': '🇸🇳', 'CI': '🇨🇮'
    }
    return flags[code] || '🇲🇦'
  }
  
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    lastname: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    countryCode: countryCode || 'MA'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update country code when geolocation changes
  useEffect(() => {
    if (countryCode) {
      setFormData(prev => ({ ...prev, countryCode }))
    }
  }, [countryCode])

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Format phone number based on country
  const formatPhoneNumber = (phone: string, countryCode: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Country-specific formatting
    switch (countryCode) {
      case 'MA': // Morocco
        if (cleaned.length <= 10) {
          return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
        }
        break
      case 'FR': // France
        if (cleaned.length <= 10) {
          return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
        }
        break
      case 'DZ': // Algeria
        if (cleaned.length <= 9) {
          return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
        }
        break
      case 'TN': // Tunisia
        if (cleaned.length <= 8) {
          return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')
        }
        break
      default:
        return cleaned
    }
    
    return cleaned
  }

  // Handle phone number input
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, formData.countryCode)
    handleInputChange('phone', formatted)
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Split name into firstname and lastname
      const nameParts = formData.name.trim().split(' ')
      const firstname = nameParts[0] || ''
      const lastname = nameParts.slice(1).join(' ') || ''

      const standardFormData: StandardFormData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }

      const additionalData = {
        countryCode: formData.countryCode,
        countryName: countryName || '',
        city: city || '',
        source: 'cas-client',
        page: clientSlug || 'cas-client',
        submitted_at: new Date().toISOString(),
        firstname,
        lastname,
        brief_description: `Contact depuis la page cas client${clientName ? ` - ${clientName}` : ''}`
      }

      const result = await submitForm(
        standardFormData,
        additionalData,
        '/api/contact',
        'cas_client_contact'
      )

      if (result.success) {
        toast({
          title: "Message envoyé avec succès!",
          description: "Nous vous contacterons dans les plus brefs délais.",
        })
        
        // Reset form
        setFormData({
          name: '',
          firstname: '',
          lastname: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          countryCode: countryCode || 'MA'
        })
        
        onClose()
      } else {
        throw new Error('Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Nous Contacter
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {clientName ? `À propos de ${clientName}` : 'Parlons de votre projet'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom complet *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom complet"
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Entreprise
                  </Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nom de votre entreprise"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Téléphone *
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <CountryCodeSelector
                      selectedCountry={{
                        code: formData.countryCode,
                        name: countryName,
                        dialCode: getDialCode(formData.countryCode),
                        flag: getFlag(formData.countryCode)
                      }}
                      onCountryChange={(country) => handleInputChange('countryCode', country.code)}
                    />
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="Numéro de téléphone"
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </Label>
                  <div className="relative mt-1">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Décrivez votre projet ou vos besoins..."
                      rows={4}
                      className={`pl-10 ${errors.message ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
