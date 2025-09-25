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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ClientDetailPageProps {
     slug: string
}

export default function ClientDetailPage({ slug }: ClientDetailPageProps) {
     const [activeTab, setActiveTab] = useState("overview")
     const [currentImageIndex, setCurrentImageIndex] = useState(0)
     const [isPlaying, setIsPlaying] = useState(false)

     // Mock data - this will be replaced with dynamic data later
     const clientData = {
          name: "TechCorp Solutions",
          logo: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
          sector: "Technologie",
          solution: "hubspot",
          summary: "Transformation digitale complète avec HubSpot CRM pour optimiser les processus de vente et marketing.",
          description: "TechCorp Solutions a choisi notre expertise pour moderniser son approche client avec HubSpot CRM. Cette transformation a permis d'augmenter significativement leur efficacité commerciale et leur satisfaction client.",
          projectStats: [
               { label: "ROI atteint", value: "+250%" },
               { label: "Taux de conversion", value: "+180%" },
               { label: "Temps de réponse", value: "-60%" },
               { label: "Satisfaction client", value: "98%" }
          ],
          timeline: [
               {
                    date: "Janvier 2024",
                    title: "Analyse des besoins",
                    description: "Audit complet des processus existants et identification des opportunités d'amélioration."
               },
               {
                    date: "Février 2024",
                    title: "Configuration HubSpot",
                    description: "Mise en place de la plateforme CRM avec personnalisation selon les besoins spécifiques."
               },
               {
                    date: "Mars 2024",
                    title: "Formation des équipes",
                    description: "Formation complète des utilisateurs et mise en place des bonnes pratiques."
               },
               {
                    date: "Avril 2024",
                    title: "Déploiement et optimisation",
                    description: "Lancement en production avec suivi et ajustements continus."
               }
          ],
          team: [
               {
                    name: "Marie Dubois",
                    role: "Chef de projet",
                    avatar: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
               },
               {
                    name: "Pierre Martin",
                    role: "Développeur HubSpot",
                    avatar: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
               },
               {
                    name: "Sophie Laurent",
                    role: "Consultante CRM",
                    avatar: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
               }
          ],
          testimonial: {
               text: "La transformation avec HubSpot a révolutionné notre approche client. Les résultats dépassent nos attentes et notre équipe est plus efficace que jamais.",
               author: "Jean Dupont",
               position: "Directeur Commercial, TechCorp Solutions",
               avatar: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
          },
          gallery: [
               "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
               "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
               "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
               "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
          ]
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
          <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
               {/* Animated Background */}
               <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,41,59,0.05),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.03),transparent_50%)]"></div>
               </div>

               {/* Header */}
               <header className="relative z-10 pt-8 pb-6 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                         <div className="flex items-center gap-4 mb-8">
                              <Link href="/cas-client">
                                   <Button variant="ghost" className="text-gray-900 hover:bg-gray-100">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Retour aux cas clients
                                   </Button>
                              </Link>
                         </div>

                         {/* Client Header */}
                         <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-12">
                              <div className="flex items-center gap-6">
                                   <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gray-100 border border-gray-300">
                                        <Image
                                             src={clientData.logo}
                                             alt={clientData.name}
                                             width={60}
                                             height={60}
                                             className="object-contain"
                                        />
                                   </div>
                                   <div>
                                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                             {clientData.name}
                                        </h1>
                                        <div className="flex items-center gap-4">
                                             <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white bg-[var(--color-main)]">
                                                  {clientData.solution === 'hubspot' ? 'HubSpot' :
                                                       clientData.solution === 'odoo' ? 'Odoo' :
                                                            clientData.solution === 'both' ? 'Hybride' : clientData.sector}
                                             </div>
                                             <div className="flex items-center gap-2 text-gray-500">
                                                  <Building className="w-4 h-4" />
                                                  <span>{clientData.sector}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Sticky Navigation */}
                         <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                              <div className="flex items-center gap-1 py-4">
                                   {tabs.map((tab) => {
                                        const IconComponent = tab.icon
                                        return (
                                             <button
                                                  key={tab.id}
                                                  onClick={() => setActiveTab(tab.id)}
                                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                                       ? "bg-[var(--color-main)] text-white"
                                                       : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                                       }`}
                                             >
                                                  <IconComponent className="w-4 h-4" />
                                                  {tab.label}
                                             </button>
                                        )
                                   })}
                              </div>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="relative z-10 px-6 lg:px-8 pb-20">
                    <div className="max-w-7xl mx-auto">
                         {/* Overview Tab */}
                         {activeTab === "overview" && (
                              <div className="space-y-12">
                                   {/* Hero Section */}
                                   <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div>
                                             <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-main)]/20 border border-[var(--color-main)]/30 mb-6 backdrop-blur-sm">
                                                  <div className="w-2 h-2 bg-[var(--color-main)] rounded-full mr-3 animate-pulse"></div>
                                                  <span className="text-sm font-bold text-[var(--color-main)] tracking-wider uppercase">ÉTUDE DE CAS</span>
                                             </div>
                                             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                                  Transformation digitale avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)]">HubSpot</span>
                                             </h2>
                                             <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                                  {clientData.description}
                                             </p>
                                             <div className="flex items-center gap-4">
                                                  <Button className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white">
                                                       Voir le projet
                                                       <ExternalLink className="ml-2 w-4 h-4" />
                                                  </Button>
                                                  <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                                                       <Play className="mr-2 w-4 h-4" />
                                                       Voir la démo
                                                  </Button>
                                             </div>
                                        </div>

                                        {/* Image Gallery */}
                                        <div className="relative">
                                             <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 overflow-hidden">
                                                  <Image
                                                       src={clientData.gallery[currentImageIndex]}
                                                       alt={`${clientData.name} - Image ${currentImageIndex + 1}`}
                                                       width={600}
                                                       height={400}
                                                       className="w-full h-80 object-cover"
                                                  />
                                                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>

                                                  {/* Gallery Navigation */}
                                                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                                       <div className="flex items-center gap-2">
                                                            {clientData.gallery.map((_, index) => (
                                                                 <button
                                                                      key={index}
                                                                      onClick={() => setCurrentImageIndex(index)}
                                                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? "bg-[var(--color-main)]" : "bg-gray-500"
                                                                           }`}
                                                                      aria-label={`Voir l'image ${index + 1}`}
                                                                 />
                                                            ))}
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <button
                                                                 onClick={prevImage}
                                                                 className="p-2 bg-white/50 rounded-full text-gray-900 hover:bg-white/70 transition-colors"
                                                                 aria-label="Image précédente"
                                                            >
                                                                 <ChevronLeft className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                 onClick={nextImage}
                                                                 className="p-2 bg-white/50 rounded-full text-gray-900 hover:bg-white/70 transition-colors"
                                                                 aria-label="Image suivante"
                                                            >
                                                                 <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </section>

                                   {/* Stats Section */}
                                   <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {clientData.projectStats.map((stat, index) => (
                                             <div
                                                  key={stat.label}
                                                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 text-center"
                                                  style={{ animationDelay: `${index * 100}ms` }}
                                             >
                                                  <div className="text-3xl font-bold text-[var(--color-main)] mb-2">
                                                       {stat.value}
                                                  </div>
                                                  <div className="text-sm text-gray-500">
                                                       {stat.label}
                                                  </div>
                                             </div>
                                        ))}
                                   </section>

                                   {/* Testimonial */}
                                   <section className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
                                        <div className="flex items-start gap-6">
                                             <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-300 flex items-center justify-center flex-shrink-0">
                                                  <Image
                                                       src={clientData.testimonial.avatar}
                                                       alt={clientData.testimonial.author}
                                                       width={48}
                                                       height={48}
                                                       className="object-contain"
                                                  />
                                             </div>
                                             <div>
                                                  <blockquote className="text-lg text-gray-600 mb-4 leading-relaxed">
                                                       "{clientData.testimonial.text}"
                                                  </blockquote>
                                                  <div>
                                                       <div className="font-bold text-gray-900">{clientData.testimonial.author}</div>
                                                       <div className="text-sm text-gray-500">{clientData.testimonial.position}</div>
                                                  </div>
                                             </div>
                                        </div>
                                   </section>
                              </div>
                         )}

                         {/* Timeline Tab */}
                         {activeTab === "timeline" && (
                              <div className="space-y-8">
                                   <h2 className="text-3xl font-bold text-gray-900 mb-8">Timeline du Projet</h2>
                                   <div className="space-y-6">
                                        {clientData.timeline.map((item, index) => (
                                             <div
                                                  key={index}
                                                  className="flex items-start gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200"
                                             >
                                                  <div className="w-12 h-12 bg-[var(--color-main)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                       <Calendar className="w-6 h-6 text-[var(--color-main)]" />
                                                  </div>
                                                  <div>
                                                       <div className="text-sm text-[var(--color-main)] font-bold mb-1">
                                                            {item.date}
                                                       </div>
                                                       <h3 className="text-xl font-bold text-gray-900 mb-2">
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
                                   <h2 className="text-3xl font-bold text-gray-900 mb-8">Notre Équipe</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {clientData.team.map((member, index) => (
                                             <div
                                                  key={index}
                                                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 text-center"
                                             >
                                                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-300 flex items-center justify-center mx-auto mb-4">
                                                       <Image
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            width={60}
                                                            height={60}
                                                            className="object-contain"
                                                       />
                                                  </div>
                                                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                       {member.name}
                                                  </h3>
                                                  <p className="text-sm text-gray-500">
                                                       {member.role}
                                                  </p>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}

                         {/* Results Tab */}
                         {activeTab === "results" && (
                              <div className="space-y-8">
                                   <h2 className="text-3xl font-bold text-gray-900 mb-8">Résultats Obtenus</h2>
                                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                             {clientData.projectStats.map((stat, index) => (
                                                  <div
                                                       key={stat.label}
                                                       className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6"
                                                  >
                                                       <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-lg font-bold text-gray-900">
                                                                 {stat.label}
                                                            </h3>
                                                            <div className="w-8 h-8 bg-[var(--color-main)]/20 rounded-lg flex items-center justify-center">
                                                                 <TrendingUp className="w-4 h-4 text-[var(--color-main)]" />
                                                            </div>
                                                       </div>
                                                       <div className="text-3xl font-bold text-[var(--color-main)]">
                                                            {stat.value}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                                             <h3 className="text-lg font-bold text-gray-900 mb-4">Impact Global</h3>
                                             <div className="space-y-4">
                                                  <div className="flex items-center gap-3">
                                                       <CheckCircle className="w-5 h-5 text-green-400" />
                                                       <span className="text-gray-600">Processus automatisés</span>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <CheckCircle className="w-5 h-5 text-green-400" />
                                                       <span className="text-gray-600">Équipes formées</span>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <CheckCircle className="w-5 h-5 text-green-400" />
                                                       <span className="text-gray-600">ROI optimisé</span>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <CheckCircle className="w-5 h-5 text-green-400" />
                                                       <span className="text-gray-600">Satisfaction client maximale</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </div>
               </main>
          </div>
     )
}