"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
     ArrowLeft,
     ArrowRight,
     Building,
     Calendar,
     CheckCircle,
     Clock,
     ExternalLink,
     Eye,
     Heart,
     MapPin,
     Star,
     TrendingUp,
     Users,
     Award,
     Zap,
     Target,
     BarChart3,
     Play,
     Pause,
     Volume2,
     VolumeX,
     ChevronLeft,
     ChevronRight,
     Sparkles,
     Rocket,
     Hexagon,
     Triangle,
     Circle,
     Square,
     ArrowUpRight,
     Globe,
     Mail,
     Phone,
     MessageSquare,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ClientDetailPageProps {
     slug: string
}

export default function ClientDetailPageV3({ slug }: ClientDetailPageProps) {
     const [activeTab, setActiveTab] = useState("overview")
     const [currentImageIndex, setCurrentImageIndex] = useState(0)

     // Mock data - this will be replaced with dynamic data later
     const clientData = {
          name: "TechCorp Solutions",
          logo: "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
          sector: "Technologie",
          solution: "hubspot",
          summary: "Transformation digitale complète avec HubSpot CRM pour optimiser les processus de vente et marketing.",
          description: "TechCorp Solutions a choisi notre expertise pour moderniser son approche client avec HubSpot CRM. Cette transformation a permis d'augmenter significativement leur efficacité commerciale et leur satisfaction client.",
          projectStats: [
               { label: "ROI atteint", value: "+250%", icon: TrendingUp },
               { label: "Taux de conversion", value: "+180%", icon: Target },
               { label: "Temps de réponse", value: "-60%", icon: Clock },
               { label: "Satisfaction client", value: "98%", icon: Star }
          ],
          timeline: [
               {
                    date: "Janvier 2024",
                    title: "Analyse des besoins",
                    description: "Audit complet des processus existants et identification des opportunités d'amélioration.",
                    status: "completed"
               },
               {
                    date: "Février 2024",
                    title: "Configuration HubSpot",
                    description: "Mise en place de la plateforme CRM avec personnalisation selon les besoins spécifiques.",
                    status: "completed"
               },
               {
                    date: "Mars 2024",
                    title: "Formation des équipes",
                    description: "Formation complète des utilisateurs et mise en place des bonnes pratiques.",
                    status: "completed"
               },
               {
                    date: "Avril 2024",
                    title: "Déploiement et optimisation",
                    description: "Lancement en production avec suivi et ajustements continus.",
                    status: "completed"
               }
          ],
          team: [
               {
                    name: "Marie Dubois",
                    role: "Chef de projet",
                    avatar: "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
                    expertise: ["Project Management", "HubSpot", "CRM Strategy"]
               },
               {
                    name: "Pierre Martin",
                    role: "Développeur HubSpot",
                    avatar: "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
                    expertise: ["HubSpot Development", "API Integration", "Custom Workflows"]
               },
               {
                    name: "Sophie Laurent",
                    role: "Consultante CRM",
                    avatar: "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
                    expertise: ["CRM Strategy", "Sales Process", "Training"]
               }
          ],
          testimonial: {
               text: "La transformation avec HubSpot a révolutionné notre approche client. Les résultats dépassent nos attentes et notre équipe est plus efficace que jamais.",
               author: "Jean Dupont",
               position: "Directeur Commercial, TechCorp Solutions",
               avatar: "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
               rating: 5
          },
          gallery: [
               "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
               "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
               "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80",
               "https://res.cloudinary.com/dwob2hfin/raw/upload/v1762787732/bst-migration/o8lhhzmztbeazzaosy80"
          ],
          contact: {
               website: "https://techcorp-solutions.com",
               email: "contact@techcorp-solutions.com",
               phone: "+33 1 23 45 67 89"
          }
     }

     const tabs = [
          { id: "overview", label: "Vue d'ensemble", icon: Eye },
          { id: "timeline", label: "Timeline", icon: Calendar },
          { id: "team", label: "Équipe", icon: Users },
          { id: "results", label: "Résultats", icon: BarChart3 }
     ]

     const nextImage = () => {
          setCurrentImageIndex((prev) => (prev + 1) % clientData.gallery.length)
     }

     const prevImage = () => {
          setCurrentImageIndex((prev) => (prev - 1 + clientData.gallery.length) % clientData.gallery.length)
     }

     return (
          <div className="min-h-screen bg-gray-50">
               {/* Header */}
               <header className="bg-white border-b border-gray-200 mt-10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                         <div className="flex items-center justify-between h-20">
                              <div className="flex items-center gap-4">
                                   <Link href="/cas-client">
                                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                             <ArrowLeft className="w-4 h-4 mr-2" />
                                             Retour
                                        </Button>
                                   </Link>
                                   <div className="h-6 w-px bg-gray-300"></div>
                                   <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                             <Image
                                                  src={clientData.logo}
                                                  alt={clientData.name}
                                                  width={24}
                                                  height={24}
                                                  className="object-contain"
                                             />
                                        </div>
                                        <div>
                                             <h1 className="text-lg font-semibold text-gray-900">{clientData.name}</h1>
                                             <p className="text-sm text-gray-500">{clientData.sector}</p>
                                        </div>
                                   </div>
                              </div>
                              <div className="flex items-center gap-2">
                                   <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white bg-[var(--color-main)]">
                                        {clientData.solution === 'hubspot' ? 'HubSpot' :
                                             clientData.solution === 'odoo' ? 'Odoo' :
                                                  clientData.solution === 'both' ? 'Hybride' : clientData.sector}
                                   </div>
                              </div>
                         </div>

                         {/* Navigation Tabs */}
                         <nav className="flex space-x-8 border-t border-gray-200">
                              {tabs.map((tab) => {
                                   const IconComponent = tab.icon
                                   return (
                                        <button
                                             key={tab.id}
                                             onClick={() => setActiveTab(tab.id)}
                                             className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                  ? "border-[var(--color-main)] text-[var(--color-main)]"
                                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                  }`}
                                        >
                                             <IconComponent className="w-4 h-4" />
                                             {tab.label}
                                        </button>
                                   )
                              })}
                         </nav>
                    </div>
               </header>

               {/* Main Content */}
               <main className="max-w-7xl mx-auto  lg:px-8 py-8 ">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                         <div className="space-y-12">
                              {/* Hero Section */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                   <div className="space-y-6">
                                        <div>
                                             <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                                  Transformation digitale avec HubSpot
                                             </h2>
                                             <p className="text-lg text-gray-600 leading-relaxed">
                                                  {clientData.description}
                                             </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                             <Button className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
                                                  Voir le projet
                                                  <ArrowUpRight className="ml-2 w-4 h-4" />
                                             </Button>
                                             <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                                  <Play className="mr-2 w-4 h-4" />
                                                  Voir la démo
                                             </Button>
                                        </div>
                                        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                                  <Globe className="w-4 h-4" />
                                                  <a href={clientData.contact.website} className="hover:text-[var(--color-main)]">
                                                       Site web
                                                  </a>
                                             </div>
                                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                                  <Mail className="w-4 h-4" />
                                                  <a href={`mailto:${clientData.contact.email}`} className="hover:text-[var(--color-main)]">
                                                       Email
                                                  </a>
                                             </div>
                                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                                  <Phone className="w-4 h-4" />
                                                  <a href={`tel:${clientData.contact.phone}`} className="hover:text-[var(--color-main)]">
                                                       Téléphone
                                                  </a>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Image Gallery */}
                                   <div className="relative">
                                        <div className="aspect-video bg-white rounded-xl border border-gray-200 overflow-hidden">
                                             <Image
                                                  src={clientData.gallery[currentImageIndex]}
                                                  alt={`${clientData.name} - Image ${currentImageIndex + 1}`}
                                                  width={600}
                                                  height={400}
                                                  className="w-full h-full object-cover"
                                             />
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                  {clientData.gallery.map((_, index) => (
                                                       <button
                                                            key={index}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                                                 }`}
                                                       />
                                                  ))}
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <button
                                                       onClick={prevImage}
                                                       className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                                                  >
                                                       <ChevronLeft className="w-4 h-4" />
                                                  </button>
                                                  <button
                                                       onClick={nextImage}
                                                       className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                                                  >
                                                       <ChevronRight className="w-4 h-4" />
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                   {clientData.projectStats.map((stat, index) => {
                                        const IconComponent = stat.icon
                                        return (
                                             <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                                                  <div className="flex items-center gap-3 mb-3">
                                                       <div className="w-8 h-8 bg-[var(--color-main)]/10 rounded-lg flex items-center justify-center">
                                                            <IconComponent className="w-4 h-4 text-[var(--color-main)]" />
                                                       </div>
                                                       <div className="text-sm text-gray-500">{stat.label}</div>
                                                  </div>
                                                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                             </div>
                                        )
                                   })}
                              </div>

                              {/* Testimonial */}
                              <div className="bg-white rounded-xl border border-gray-200 p-8">
                                   <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                             <Image
                                                  src={clientData.testimonial.avatar}
                                                  alt={clientData.testimonial.author}
                                                  width={40}
                                                  height={40}
                                                  className="object-contain"
                                             />
                                        </div>
                                        <div className="flex-1">
                                             <div className="flex items-center gap-1 mb-3">
                                                  {[...Array(clientData.testimonial.rating)].map((_, i) => (
                                                       <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                  ))}
                                             </div>
                                             <blockquote className="text-gray-700 mb-4 leading-relaxed">
                                                  "{clientData.testimonial.text}"
                                             </blockquote>
                                             <div>
                                                  <div className="font-semibold text-gray-900">{clientData.testimonial.author}</div>
                                                  <div className="text-sm text-gray-500">{clientData.testimonial.position}</div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === "timeline" && (
                         <div className="space-y-8">
                              <h2 className="text-2xl font-bold text-gray-900">Timeline du Projet</h2>
                              <div className="space-y-6">
                                   {clientData.timeline.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                             <div className="flex flex-col items-center">
                                                  <div className="w-10 h-10 bg-[var(--color-main)] rounded-full flex items-center justify-center">
                                                       <CheckCircle className="w-5 h-5 text-white" />
                                                  </div>
                                                  {index < clientData.timeline.length - 1 && (
                                                       <div className="w-px h-16 bg-gray-200 mt-2"></div>
                                                  )}
                                             </div>
                                             <div className="flex-1 pb-8">
                                                  <div className="text-sm text-[var(--color-main)] font-medium mb-1">
                                                       {item.date}
                                                  </div>
                                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                       {item.title}
                                                  </h3>
                                                  <p className="text-gray-600 leading-relaxed">
                                                       {item.description}
                                                  </p>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === "team" && (
                         <div className="space-y-8">
                              <h2 className="text-2xl font-bold text-gray-900">Notre Équipe</h2>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   {clientData.team.map((member, index) => (
                                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                                             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                                  <Image
                                                       src={member.avatar}
                                                       alt={member.name}
                                                       width={48}
                                                       height={48}
                                                       className="object-contain"
                                                  />
                                             </div>
                                             <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                  {member.name}
                                             </h3>
                                             <p className="text-sm text-gray-500 mb-4">
                                                  {member.role}
                                             </p>
                                             <div className="flex flex-wrap gap-2 justify-center">
                                                  {member.expertise.map((skill, skillIndex) => (
                                                       <span
                                                            key={skillIndex}
                                                            className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-md"
                                                       >
                                                            {skill}
                                                       </span>
                                                  ))}
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === "results" && (
                         <div className="space-y-8">
                              <h2 className="text-2xl font-bold text-gray-900">Résultats Obtenus</h2>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                   <div className="space-y-6">
                                        {clientData.projectStats.map((stat, index) => {
                                             const IconComponent = stat.icon
                                             return (
                                                  <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                                                       <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                 {stat.label}
                                                            </h3>
                                                            <div className="w-8 h-8 bg-[var(--color-main)]/10 rounded-lg flex items-center justify-center">
                                                                 <IconComponent className="w-4 h-4 text-[var(--color-main)]" />
                                                            </div>
                                                       </div>
                                                       <div className="text-3xl font-bold text-[var(--color-main)]">
                                                            {stat.value}
                                                       </div>
                                                  </div>
                                             )
                                        })}
                                   </div>
                                   <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Impact Global</h3>
                                        <div className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                                  <span className="text-gray-700">Processus automatisés</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                                  <span className="text-gray-700">Équipes formées</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                                  <span className="text-gray-700">ROI optimisé</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                                  <span className="text-gray-700">Satisfaction client maximale</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}
               </main>
          </div>
     )
}
