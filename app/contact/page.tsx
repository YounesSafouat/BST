"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface ContactFormField {
  label: string
  placeholder: string
  required: boolean
  type?: string
  options?: string[]
}

interface ContactFormContent {
  title: string
  subtitle: string
  fields: {
    name: ContactFormField
    email: ContactFormField
    phone: ContactFormField
    company: ContactFormField
    subject: ContactFormField
    message: ContactFormField
  }
  submitButton: {
    text: string
    loadingText: string
  }
  successMessage: string
  errorMessage: string
}

interface ContactContent {
  title: string
  description: string
  content: {
    section: string
    subtitle: string
    contactForm: ContactFormContent
  }
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState<ContactContent | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?type=contact")
        const data = await response.json()
        if (data && data.length > 0) {
          setContent(data[0])
        }
      } catch (error) {
        console.error("Error fetching contact content:", error)
      }
    }
    fetchContent()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      toast.success(content?.content.contactForm.successMessage || "Message envoyé avec succès!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast.error(content?.content.contactForm.errorMessage || "Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-black text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-2xl mx-auto">
            {content.content.subtitle}
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Informations de Contact</h2>
              <p className="text-gray-600 mb-8">
                N'hésitez pas à nous contacter pour toute question ou demande
                d'information. Notre équipe est à votre disposition.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-[#ff5c35]/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">contact@blackswantechnology.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-[#714b67]/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#714b67]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-gray-600">+212 5XX-XXXXXX</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-gray-600">
                    Casablanca, Maroc
                    <br />
                    Zone Industrielle
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-3">{content.content.contactForm.title}</h2>
            <p className="text-gray-600 mb-8">{content.content.contactForm.subtitle}</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                {content.content.contactForm.fields.name && (
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.content.contactForm.fields.name.label}
                      {content.content.contactForm.fields.name.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {content.content.contactForm.fields.name.type === 'select' ? (
                      <select
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={content.content.contactForm.fields.name.required}
                      >
                        <option value="">{content.content.contactForm.fields.name.placeholder}</option>
                        {content.content.contactForm.fields.name.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : content.content.contactForm.fields.name.type === 'radio' ? (
                      <div className="space-y-2">
                        {content.content.contactForm.fields.name.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="name"
                              value={option}
                              checked={formData.name === option}
                              onChange={handleChange}
                              required={content.content.contactForm.fields.name.required}
                            />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : content.content.contactForm.fields.name.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="name"
                          checked={formData.name === 'true'}
                          onChange={(e) => handleChange({
                            target: {
                              name: 'name',
                              value: e.target.checked ? 'true' : 'false'
                            }
                          } as any)}
                          required={content.content.contactForm.fields.name.required}
                        />
                        <label>{content.content.contactForm.fields.name.placeholder}</label>
                      </div>
                    ) : content.content.contactForm.fields.name.type === 'textarea' ? (
                      <Textarea
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={content.content.contactForm.fields.name.placeholder}
                        required={content.content.contactForm.fields.name.required}
                      />
                    ) : (
                <Input
                        type={content.content.contactForm.fields.name.type || "text"}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                        placeholder={content.content.contactForm.fields.name.placeholder}
                        required={content.content.contactForm.fields.name.required}
                />
                    )}
              </div>
                )}

                {/* Email Field */}
                {content.content.contactForm.fields.email && (
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.content.contactForm.fields.email.label}
                      {content.content.contactForm.fields.email.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {content.content.contactForm.fields.email.type === 'select' ? (
                      <select
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={content.content.contactForm.fields.email.required}
                      >
                        <option value="">{content.content.contactForm.fields.email.placeholder}</option>
                        {content.content.contactForm.fields.email.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : content.content.contactForm.fields.email.type === 'radio' ? (
                      <div className="space-y-2">
                        {content.content.contactForm.fields.email.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="email"
                              value={option}
                              checked={formData.email === option}
                              onChange={handleChange}
                              required={content.content.contactForm.fields.email.required}
                            />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : content.content.contactForm.fields.email.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="email"
                          checked={formData.email === 'true'}
                          onChange={(e) => handleChange({
                            target: {
                              name: 'email',
                              value: e.target.checked ? 'true' : 'false'
                            }
                          } as any)}
                          required={content.content.contactForm.fields.email.required}
                        />
                        <label>{content.content.contactForm.fields.email.placeholder}</label>
                      </div>
                    ) : content.content.contactForm.fields.email.type === 'textarea' ? (
                      <Textarea
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={content.content.contactForm.fields.email.placeholder}
                        required={content.content.contactForm.fields.email.required}
                      />
                    ) : (
                <Input
                        type={content.content.contactForm.fields.email.type || "email"}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                        placeholder={content.content.contactForm.fields.email.placeholder}
                        required={content.content.contactForm.fields.email.required}
                />
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone Field */}
                {content.content.contactForm.fields.phone && (
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.content.contactForm.fields.phone.label}
                      {content.content.contactForm.fields.phone.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {content.content.contactForm.fields.phone.type === 'select' ? (
                      <select
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={content.content.contactForm.fields.phone.required}
                      >
                        <option value="">{content.content.contactForm.fields.phone.placeholder}</option>
                        {content.content.contactForm.fields.phone.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : content.content.contactForm.fields.phone.type === 'radio' ? (
                      <div className="space-y-2">
                        {content.content.contactForm.fields.phone.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="phone"
                              value={option}
                              checked={formData.phone === option}
                              onChange={handleChange}
                              required={content.content.contactForm.fields.phone.required}
                            />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : content.content.contactForm.fields.phone.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="phone"
                          checked={formData.phone === 'true'}
                          onChange={(e) => handleChange({
                            target: {
                              name: 'phone',
                              value: e.target.checked ? 'true' : 'false'
                            }
                          } as any)}
                          required={content.content.contactForm.fields.phone.required}
                        />
                        <label>{content.content.contactForm.fields.phone.placeholder}</label>
                      </div>
                    ) : content.content.contactForm.fields.phone.type === 'textarea' ? (
                      <Textarea
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={content.content.contactForm.fields.phone.placeholder}
                        required={content.content.contactForm.fields.phone.required}
                      />
                    ) : (
                <Input
                        type={content.content.contactForm.fields.phone.type || "tel"}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                        placeholder={content.content.contactForm.fields.phone.placeholder}
                        required={content.content.contactForm.fields.phone.required}
                />
                    )}
              </div>
                )}

                {/* Company Field */}
                {content.content.contactForm.fields.company && (
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.content.contactForm.fields.company.label}
                      {content.content.contactForm.fields.company.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {content.content.contactForm.fields.company.type === 'select' ? (
                      <select
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={content.content.contactForm.fields.company.required}
                      >
                        <option value="">{content.content.contactForm.fields.company.placeholder}</option>
                        {content.content.contactForm.fields.company.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : content.content.contactForm.fields.company.type === 'radio' ? (
                      <div className="space-y-2">
                        {content.content.contactForm.fields.company.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="company"
                              value={option}
                              checked={formData.company === option}
                              onChange={handleChange}
                              required={content.content.contactForm.fields.company.required}
                            />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : content.content.contactForm.fields.company.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="company"
                          checked={formData.company === 'true'}
                          onChange={(e) => handleChange({
                            target: {
                              name: 'company',
                              value: e.target.checked ? 'true' : 'false'
                            }
                          } as any)}
                          required={content.content.contactForm.fields.company.required}
                        />
                        <label>{content.content.contactForm.fields.company.placeholder}</label>
                      </div>
                    ) : content.content.contactForm.fields.company.type === 'textarea' ? (
                      <Textarea
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={content.content.contactForm.fields.company.placeholder}
                        required={content.content.contactForm.fields.company.required}
                      />
                    ) : (
                <Input
                        type={content.content.contactForm.fields.company.type || "text"}
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                        placeholder={content.content.contactForm.fields.company.placeholder}
                        required={content.content.contactForm.fields.company.required}
                />
                    )}
                  </div>
                )}
              </div>

              {/* Subject Field */}
              {content.content.contactForm.fields.subject && (
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.content.contactForm.fields.subject.label}
                    {content.content.contactForm.fields.subject.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {content.content.contactForm.fields.subject.type === 'select' ? (
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={content.content.contactForm.fields.subject.required}
                    >
                      <option value="">{content.content.contactForm.fields.subject.placeholder}</option>
                      {content.content.contactForm.fields.subject.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : content.content.contactForm.fields.subject.type === 'radio' ? (
                    <div className="space-y-2">
                      {content.content.contactForm.fields.subject.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="subject"
                            value={option}
                            checked={formData.subject === option}
                            onChange={handleChange}
                            required={content.content.contactForm.fields.subject.required}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  ) : content.content.contactForm.fields.subject.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="subject"
                        checked={formData.subject === 'true'}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'subject',
                            value: e.target.checked ? 'true' : 'false'
                          }
                        } as any)}
                        required={content.content.contactForm.fields.subject.required}
                      />
                      <label>{content.content.contactForm.fields.subject.placeholder}</label>
                    </div>
                  ) : content.content.contactForm.fields.subject.type === 'textarea' ? (
                    <Textarea
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={content.content.contactForm.fields.subject.placeholder}
                      required={content.content.contactForm.fields.subject.required}
                    />
                  ) : (
                    <Input
                      type={content.content.contactForm.fields.subject.type || "text"}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={content.content.contactForm.fields.subject.placeholder}
                      required={content.content.contactForm.fields.subject.required}
                    />
                  )}
                </div>
              )}

              {/* Message Field */}
              {content.content.contactForm.fields.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.content.contactForm.fields.message.label}
                    {content.content.contactForm.fields.message.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
                  {content.content.contactForm.fields.message.type === 'select' ? (
                    <select
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={content.content.contactForm.fields.message.required}
                    >
                      <option value="">{content.content.contactForm.fields.message.placeholder}</option>
                      {content.content.contactForm.fields.message.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : content.content.contactForm.fields.message.type === 'radio' ? (
                    <div className="space-y-2">
                      {content.content.contactForm.fields.message.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="message"
                            value={option}
                            checked={formData.message === option}
                            onChange={handleChange}
                            required={content.content.contactForm.fields.message.required}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  ) : content.content.contactForm.fields.message.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="message"
                        checked={formData.message === 'true'}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'message',
                            value: e.target.checked ? 'true' : 'false'
                          }
                        } as any)}
                        required={content.content.contactForm.fields.message.required}
                      />
                      <label>{content.content.contactForm.fields.message.placeholder}</label>
                    </div>
                  ) : content.content.contactForm.fields.message.type === 'textarea' ? (
                <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={content.content.contactForm.fields.message.placeholder}
                      required={content.content.contactForm.fields.message.required}
                      className="h-32"
                    />
                  ) : (
                    <Input
                      type={content.content.contactForm.fields.message.type || "text"}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                      placeholder={content.content.contactForm.fields.message.placeholder}
                      required={content.content.contactForm.fields.message.required}
                />
                  )}
              </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {content.content.contactForm.submitButton.loadingText}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {content.content.contactForm.submitButton.text}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[400px] bg-gray-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.349834365842!2d-7.6187!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNycwNy4zIlc!5e0!3m2!1sfr!2sma!4v1635000000000!5m2!1sfr!2sma"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
} 