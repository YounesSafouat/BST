"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Calendar, Users, Building, Target, TrendingUp, CheckCircle, Star, Quote, ExternalLink, Share2, Clock, MapPin, Award, Zap, BarChart3, X, Linkedin, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/components/home/Loader"
import { useRouter } from "next/navigation"

// Extended interface for CMS-managed client cases
interface ClientCase {
     slug: string
     name: string
     headline: string
     summary: string
     sector: string
     size: string
     location: string
     solution: string
     migration?: string
     logo: string
     videoUrl?: string
     videoTitle?: string
     heroImage?: string
     contentSections: {
          title: string
          content: string // HTML content like blog
          image?: string
          imageAlt?: string
     }[]
     featured: boolean
     projectStats?: Array<{
          label: string
          value: string
          icon?: string
     }>
     testimonial?: {
          quote: string
          author: string
          role: string
          company: string
     }
     challenges?: Array<{
          title: string
          description: string
          impact: string
     }>
     solutions?: Array<{
          module: string
          description: string
          benefit: string
     }>
     results?: Array<{
          metric: string
          value: string
          description: string
     }>
}

interface ClientDetailPageProps {
     slug: string
}

// Enhanced content renderer with better styling
const ClientContent = ({ content }: { content: string }) => {
     return (
          <>
               <style jsx>{`
                    .client-content {
                         line-height: 1.8;
                         color: #374151;
                         font-size: 16px;
                    }
                    .client-content h1 {
                         font-size: 2.5rem;
                         font-weight: 700;
                         color: #111827;
                         margin: 3rem 0 1.5rem 0;
                         line-height: 1.2;
                         background: linear-gradient(135deg, var(--color-main), var(--color-secondary));
                         -webkit-background-clip: text;
                         -webkit-text-fill-color: transparent;
                         background-clip: text;
                    }
                    .client-content h2 {
                         font-size: 2rem;
                         font-weight: 600;
                         color: #1f2937;
                         margin: 2.5rem 0 1rem 0;
                         line-height: 1.3;
                         position: relative;
                         padding-left: 1rem;
                    }
                    .client-content h2::before {
                         content: '';
                         position: absolute;
                         left: 0;
                         top: 50%;
                         transform: translateY(-50%);
                         width: 4px;
                         height: 100%;
                         background: linear-gradient(135deg, var(--color-main), var(--color-secondary));
                         border-radius: 2px;
                    }
                    .client-content h3 {
                         font-size: 1.5rem;
                         font-weight: 600;
                         color: #374151;
                         margin: 2rem 0 0.75rem 0;
                         line-height: 1.4;
                    }
                    .client-content p {
                         margin: 1.5rem 0;
                         line-height: 1.8;
                         color: #4b5563;
                    }
                    .client-content ul, .client-content ol {
                         margin: 1.5rem 0;
                         padding-left: 2rem;
                    }
                    .client-content li {
                         margin: 0.75rem 0;
                         position: relative;
                    }
                    .client-content ul li::marker {
                         color: var(--color-main);
                         font-weight: bold;
                    }
                    .client-content strong {
                         font-weight: 600;
                         color: #111827;
                    }
                    .client-content em {
                         font-style: italic;
                         color: #6b7280;
                    }
                    .client-content img {
                         max-width: 100%;
                         height: auto;
                         border-radius: 12px;
                         margin: 2rem 0;
                         box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                         transition: transform 0.3s ease;
                    }
                    .client-content img:hover {
                         transform: scale(1.02);
                    }
                    .client-content a {
                         color: var(--color-main);
                         text-decoration: none;
                         font-weight: 500;
                         border-bottom: 2px solid transparent;
                         transition: all 0.3s ease;
                    }
                    .client-content a:hover {
                         color: var(--color-secondary);
                         border-bottom-color: var(--color-secondary);
                    }
                    .client-content blockquote {
                         border-left: 4px solid var(--color-main);
                         padding: 1.5rem 2rem;
                         margin: 2rem 0;
                         font-style: italic;
                         background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                         border-radius: 0 12px 12px 0;
                         position: relative;
                    }
                    .client-content blockquote::before {
                         content: '"';
                         font-size: 4rem;
                         color: var(--color-main);
                         position: absolute;
                         top: -10px;
                         left: 20px;
                         opacity: 0.3;
                    }
                    .client-content code {
                         background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                         padding: 0.25rem 0.5rem;
                         border-radius: 6px;
                         font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                         font-size: 0.875rem;
                         color: var(--color-secondary);
                         border: 1px solid #e5e7eb;
                    }
                    .client-content pre {
                         background: linear-gradient(135deg, #1f2937, #111827);
                         color: #f9fafb;
                         padding: 2rem;
                         border-radius: 12px;
                         overflow-x: auto;
                         margin: 2rem 0;
                         font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                         font-size: 0.875rem;
                         line-height: 1.6;
                         box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
                     }
                     .client-content pre code {
                         background: none;
                         padding: 0;
                         color: inherit;
                         border: none;
                     }
                     .client-content table {
                         width: 100%;
                         border-collapse: collapse;
                         margin: 2rem 0;
                         border-radius: 12px;
                         overflow: hidden;
                         box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                     }
                     .client-content th {
                         background: linear-gradient(135deg, var(--color-main), var(--color-secondary));
                         color: white;
                         padding: 1rem;
                         text-align: left;
                         font-weight: 600;
                         font-size: 0.875rem;
                         text-transform: uppercase;
                         letter-spacing: 0.05em;
                     }
                     .client-content td {
                         padding: 1rem;
                         border-bottom: 1px solid #e5e7eb;
                         color: #374151;
                     }
                     .client-content tr:nth-child(even) {
                         background-color: #f9fafb;
                     }
                     .client-content tr:last-child td {
                         border-bottom: none;
                     }
               `}</style>
               <div
                    className="client-content"
                    dangerouslySetInnerHTML={{ __html: content }}
               />
          </>
     )
}

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string => {
     if (!url) return url;

     // Already an embed URL
     if (url.includes('youtube.com/embed/')) {
          return url;
     }

     // Extract video ID from various YouTube URL formats
     let videoId = '';

     // youtu.be format: https://youtu.be/VIDEO_ID
     if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
     }
     // youtube.com/watch format: https://www.youtube.com/watch?v=VIDEO_ID
     else if (url.includes('youtube.com/watch')) {
          const urlParams = new URLSearchParams(url.split('?')[1] || '');
          videoId = urlParams.get('v') || '';
     }
     // youtube.com/v/ format: https://www.youtube.com/v/VIDEO_ID
     else if (url.includes('youtube.com/v/')) {
          videoId = url.split('youtube.com/v/')[1].split('?')[0].split('&')[0];
     }

     // Return embed URL if we found a video ID
     if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
     }

     // Return original URL if we couldn't parse it
     return url;
};

export default function ClientDetailPageV5({ slug }: ClientDetailPageProps) {
     const [clientData, setClientData] = useState<ClientCase | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [activeSection, setActiveSection] = useState(0)
     const [isVideoPlaying, setIsVideoPlaying] = useState(false)
     const [showSharePopup, setShowSharePopup] = useState(false)
     const [copied, setCopied] = useState(false)
     const router = useRouter()
     useEffect(() => {
          const fetchClientData = async () => {
               try {
                    setLoading(true)
                    console.log('Fetching client data for slug:', slug)
                    const response = await fetch(`/api/content?type=clients-page`)
                    if (!response.ok) {
                         throw new Error('Failed to fetch client data')
                    }
                    const data = await response.json()
                    
                    const page = Array.isArray(data) ? data.find(item => item.type === 'clients-page') : data
                   
                    const clientCases = page?.content?.clientCases || []
                    
                    const client = clientCases.find((c: ClientCase) => c.slug === slug)
                   
                    
                    // Debug: Check if client has the expected structure
                    if (client) {
                         console.log('Client structure:', {
                              hasContentSections: !!client.contentSections,
                              contentSectionsLength: client.contentSections?.length,
                              hasChallenges: !!client.challenges,
                              hasSolutions: !!client.solutions,
                              hasProjectStats: !!client.projectStats
                         })
                    }

                    if (!client) {
                         setError('Client case not found')
                         return
                    }

                    setClientData(client)
               } catch (err) {
                    setError('Error loading client data')
                    console.error('Error fetching client data:', err)
               } finally {
                    setLoading(false)
               }
          }

          fetchClientData()
     }, [slug])

     // Share functions
     const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
     const shareText = `${clientData?.headline || clientData?.name} - BlackSwan Technology`

     const shareOnWhatsApp = () => {
          const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
          window.open(url, '_blank')
     }

     const shareOnLinkedIn = () => {
          const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
          window.open(url, '_blank')
     }

     const copyLink = async () => {
          try {
               await navigator.clipboard.writeText(shareUrl)
               setCopied(true)
               setTimeout(() => setCopied(false), 2000)
          } catch (err) {
               console.error('Failed to copy link:', err)
          }
     }


     // Handle contact redirect
     const handleContactRedirect = () => {
          router.push('/#contact')
     }

     // Loading state
     if (loading) {
          return <Loader />
     }

     // Error state
     if (error || !clientData) {
          console.log('Error or no client data:', { error, clientData, slug })
          return (
               <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-center max-w-md mx-auto px-6">
                         <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <X className="w-12 h-12 text-red-500" />
                         </div>
                         <h1 className="text-3xl font-bold text-gray-900 mb-4">Cas client non trouvé</h1>
                         <p className="text-gray-600 mb-8 text-lg">{error || 'Ce cas client n\'existe pas.'}</p>
                         <p className="text-sm text-gray-500 mb-4">Slug: {slug}</p>
                         <Link href="/cas-client">
                              <Button className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-8 py-4 text-lg font-medium">
                                   <ArrowLeft className="w-5 h-5 mr-2" />
                                   Retour aux cas clients
                              </Button>
                         </Link>
                    </div>
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 mt-10">
               {/* Enhanced Header */}
               <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                         <div className="flex items-center justify-between">
                              <Link href="/cas-client">
                                   <Button variant="ghost" className="text-gray-700 hover:bg-gray-100/50 hover:text-[var(--color-main)] transition-all duration-300">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Retour aux cas clients
                                   </Button>
                              </Link>
                              
                              <div className="flex items-center gap-3">
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setShowSharePopup(true)}
                                   >
                                        <Share2 className="w-4 h-4 mr-2" /> Partager
                                   </Button>
                              </div>
                         </div>
                    </div>
               </header>

               {/* Enhanced Hero Section */}
               <section className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-main)]/5 via-transparent to-[var(--color-secondary)]/5"></div>
                    <div className="absolute inset-0">
                         <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
                         <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
                         <div className="grid lg:grid-cols-2 gap-16 items-center">
                              {/* Left Content */}
                              <motion.div
                                   initial={{ opacity: 0, x: -50 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8 }}
                                   className="space-y-8"
                              >
                                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-main)]/10 border border-[var(--color-main)]/20 rounded-full text-[var(--color-main)] text-sm font-medium">
                                        <Award className="w-4 h-4" />
                                        Cas client
                                   </div>

                                   <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                        {clientData.headline}
                                   </h1>

                                   <p className="text-xl text-gray-600 leading-relaxed">
                                        {clientData.summary}
                                   </p>

                                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button
                                             size="sm"
                                             className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 text-base font-semibold group rounded-full h-16 shadow-lg hover:shadow-xl transition-all duration-300"
                                             onClick={handleContactRedirect}
                                        >
                                             <Users className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                                             Nous Contacter
                                        </Button>
                                        <Button
                                             size="sm"
                                             variant="outline"
                                             className="px-8 py-4 text-base font-semibold border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white rounded-full h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                                             onClick={handleContactRedirect}
                                        >
                                             <Calendar className="w-5 h-5 mr-3" />
                                             Planifier un appel
                                        </Button>
                                   </div>
                              </motion.div>

                              {/* Right Video/Image */}
                              <motion.div
                                   initial={{ opacity: 0, x: 50 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8, delay: 0.2 }}
                                   className="relative"
                              >
                                   <div className="relative aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
                                        {clientData.videoUrl ? (
                                             <iframe
                                                  className="w-full h-full"
                                                  src={getYouTubeEmbedUrl(clientData.videoUrl)}
                                                  title={clientData.videoTitle || clientData.headline}
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                             />
                                        ) : clientData.heroImage ? (
                                             <Image
                                                  src={clientData.heroImage}
                                                  alt={clientData.name}
                                                  width={800}
                                                  height={500}
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                             />
                                        ) : (
                                             <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                  <div className="text-center text-gray-400">
                                                       <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                       <p className="text-lg font-medium">Aucune vidéo disponible</p>
                                                  </div>
                                             </div>
                                        )}
                                        
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                             <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                  <Play className="w-8 h-8 text-white ml-1" />
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
                         </div>
                    </div>
               </section>

               {/* Content Section - Flexbox Layout like your example */}
               <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-6">
                         {/* First Block: Sidebar + Text Content */}
                         <div className="flex flex-col lg:flex-row gap-12 mb-16">
                              {/* Company Info Sidebar */}
                              <motion.div
                                   initial={{ opacity: 0, y: 50 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.8, delay: 0.4 }}
                                   className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:h-screen"
                              >
                                   {/* Company Card - Enhanced */}
                                   <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 h-full flex flex-col">
                                        <div className="text-center mb-8">
                                             <div className="w-24 h-24 mx-auto mb-6 rounded-xl bg-gray-50 flex items-center justify-center">
                                                  <Image
                                                       src={clientData.logo}
                                                       alt={clientData.name}
                                                       width={70}
                                                       height={70}
                                                       className="object-contain"
                                                  />
                                             </div>
                                             <h3 className="text-xl font-bold text-gray-900 mb-2">{clientData.name}</h3>
                                             <p className="text-sm text-gray-600">{clientData.headline}</p>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                             <div className="space-y-6 flex-1">
                                                  <div className="flex items-center gap-3">
                                                       <Building className="w-5 h-5 text-[var(--color-main)]" />
                                                       <div>
                                                            <p className="text-sm text-gray-500">Secteur</p>
                                                            <p className="font-medium text-gray-900">{clientData.sector}</p>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center gap-3">
                                                       <Users className="w-5 h-5 text-[var(--color-main)]" />
                                                       <div>
                                                            <p className="text-sm text-gray-500">Taille</p>
                                                            <p className="font-medium text-gray-900">{clientData.size}+ employés</p>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center gap-3">
                                                       <Target className="w-5 h-5 text-[var(--color-main)]" />
                                                       <div>
                                                            <p className="text-sm text-gray-500">Solution</p>
                                                            <p className="font-medium text-gray-900">{clientData.solution}</p>
                                                       </div>
                                                  </div>

                                                  {clientData.migration && (
                                                       <div className="flex items-center gap-3">
                                                            <TrendingUp className="w-5 h-5 text-[var(--color-main)]" />
                                                            <div>
                                                                 <p className="text-sm text-gray-500">Migration</p>
                                                                 <p className="font-medium text-gray-900">{clientData.migration}</p>
                                                            </div>
                                                       </div>
                                                  )}

                                                  {clientData.location && (
                                                       <div className="flex items-center gap-3">
                                                            <MapPin className="w-5 h-5 text-[var(--color-main)]" />
                                                            <div>
                                                                 <p className="text-sm text-gray-500">Localisation</p>
                                                                 <p className="font-medium text-gray-900">{clientData.location}</p>
                                                            </div>
                                                       </div>
                                                  )}

                                                  {/* Project Summary */}
                                                  <div className="border-t border-gray-200 pt-6">
                                                       <h4 className="text-sm font-semibold text-gray-900 mb-3">Résumé du Projet</h4>
                                                       <p className="text-sm text-gray-600 leading-relaxed">
                                                            {clientData.summary}
                                                       </p>
                                                  </div>

                                                  {/* Project Stats */}
                                                  {clientData.projectStats && clientData.projectStats.length > 0 && (
                                                       <div className="border-t border-gray-200 pt-6">
                                                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Statistiques</h4>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                 {clientData.projectStats.slice(0, 2).map((stat, index) => (
                                                                      <div key={index} className="text-center p-3 bg-[var(--color-main)]/5 rounded-lg">
                                                                           <div className="text-lg font-bold text-[var(--color-main)]">{stat.value}</div>
                                                                           <div className="text-xs text-gray-600">{stat.label}</div>
                                                                      </div>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Contact CTA - Sticky to bottom */}
                                             <div className="border-t border-gray-200 pt-6 mt-auto">
                                                  <Button 
                                                       className="w-full bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white"
                                                       onClick={handleContactRedirect}
                                                  >
                                                       <Calendar className="w-4 h-4 mr-2" />
                                                       Planifier un appel
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Text Content - Original CMS content */}
                              <div className="flex-1">
                                   {clientData.contentSections?.map((section, index) => (
                                        <div key={index} className="mb-16">
                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                  {section.title}
                                             </h2>

                                             {section.image ? (
                                                  <div className="grid md:grid-cols-2 gap-12">
                                                       <div>
                                                            <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
                                                                 <Image
                                                                      src={section.image}
                                                                      alt={section.imageAlt || section.title}
                                                                      width={300}
                                                                      height={225}
                                                                      className="w-full h-full object-cover"
                                                                 />
                                                            </div>
                                                       </div>
                                                       <div className="blog-content">
                                                            <ClientContent content={section.content} />
                                                       </div>
                                                  </div>
                                             ) : (
                                                  <div className="max-w-none blog-content">
                                                       <ClientContent content={section.content} />
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* Second Block: Images with Text Sections */}
                         <div className="mb-16">

                                   {/* Alternating Text/Image Sections */}
                                   
                                   {/* Section 1: Text Right, Image Left */}
                                   <div className="mb-16">
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                             <div className="order-2 md:order-1">
                                                  <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
                                                       <div className="text-center text-gray-500">
                                                            <Building className="w-16 h-16 mx-auto mb-4" />
                                                            <p className="text-lg font-medium">Image du projet</p>
                                                            <p className="text-sm">{clientData.name}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="order-1 md:order-2">
                                                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Approche</h2>
                                                  <p className="text-lg text-gray-700 mb-6">
                                                       Nous avons développé une approche méthodique pour accompagner {clientData.name} dans sa transformation digitale, en nous concentrant sur l'efficacité opérationnelle et l'optimisation des processus.
                                                  </p>
                                                  <ul className="space-y-3 text-gray-700">
                                                       <li className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-[var(--color-main)] mt-1 flex-shrink-0" />
                                                            <span>Analyse approfondie des besoins métier</span>
                                                       </li>
                                                       <li className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-[var(--color-main)] mt-1 flex-shrink-0" />
                                                            <span>Planification détaillée de la migration</span>
                                                       </li>
                                                       <li className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-[var(--color-main)] mt-1 flex-shrink-0" />
                                                            <span>Formation complète des équipes</span>
                                                       </li>
                                                  </ul>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Section 2: Text Left, Image Right */}
                                   <div className="mb-16">
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                             <div>
                                                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Résultats Obtenus</h2>
                                                  <p className="text-lg text-gray-700 mb-6">
                                                       La collaboration avec {clientData.name} a permis d'atteindre des résultats significatifs, avec une amélioration notable de l'efficacité opérationnelle et une meilleure gestion des processus métier.
                                                  </p>
                                                  <div className="grid grid-cols-2 gap-4">
                                                       <div className="text-center p-4 bg-[var(--color-main)]/10 rounded-lg">
                                                            <div className="text-2xl font-bold text-[var(--color-main)] mb-1">+85%</div>
                                                            <div className="text-sm text-gray-600">Performance</div>
                                                       </div>
                                                       <div className="text-center p-4 bg-[var(--color-main)]/10 rounded-lg">
                                                            <div className="text-2xl font-bold text-[var(--color-main)] mb-1">-60%</div>
                                                            <div className="text-sm text-gray-600">Temps perdu</div>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div>
                                                  <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
                                                       <div className="text-center text-gray-500">
                                                            <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                                                            <p className="text-lg font-medium">Résultats</p>
                                                            <p className="text-sm">{clientData.name}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Section 3: Text Right, Image Left */}
                                   <div className="mb-16">
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                             <div className="order-2 md:order-1">
                                                  <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
                                                       <div className="text-center text-gray-500">
                                                            <Users className="w-16 h-16 mx-auto mb-4" />
                                                            <p className="text-lg font-medium">Formation</p>
                                                            <p className="text-sm">{clientData.name}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="order-1 md:order-2">
                                                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Formation & Accompagnement</h2>
                                                  <p className="text-lg text-gray-700 mb-6">
                                                       L'accompagnement de {clientData.name} ne s'est pas limité à la migration technique. Nous avons mis en place un programme de formation complet pour garantir l'autonomie des équipes.
                                                  </p>
                                                  <div className="space-y-4">
                                                       <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 bg-[var(--color-main)] rounded-full"></div>
                                                            <span className="text-gray-700">Sessions de formation personnalisées</span>
                                                       </div>
                                                       <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 bg-[var(--color-main)] rounded-full"></div>
                                                            <span className="text-gray-700">Documentation technique complète</span>
                                                       </div>
                                                       <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 bg-[var(--color-main)] rounded-full"></div>
                                                            <span className="text-gray-700">Support post-migration</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Section 4: Text Left, Image Right */}
                                   <div className="mb-16">
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                             <div>
                                                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Impact & Transformation</h2>
                                                  <p className="text-lg text-gray-700 mb-6">
                                                       La transformation digitale de {clientData.name} a eu un impact significatif sur l'ensemble de l'organisation, créant une base solide pour la croissance future.
                                                  </p>
                                                  <div className="bg-gradient-to-r from-[var(--color-main)]/10 to-[var(--color-secondary)]/10 rounded-xl p-6">
                                                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Bénéfices Clés</h3>
                                                       <div className="grid grid-cols-1 gap-3">
                                                            <div className="flex justify-between items-center">
                                                                 <span className="text-gray-700">Efficacité opérationnelle</span>
                                                                 <span className="font-bold text-[var(--color-main)]">+90%</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                 <span className="text-gray-700">Satisfaction client</span>
                                                                 <span className="font-bold text-[var(--color-main)]">+75%</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                 <span className="text-gray-700">Réduction des erreurs</span>
                                                                 <span className="font-bold text-[var(--color-main)]">-80%</span>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div>
                                                  <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
                                                       <div className="text-center text-gray-500">
                                                            <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                                                            <p className="text-lg font-medium">Impact</p>
                                                            <p className="text-sm">{clientData.name}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                         </div>

                         {/* Third Block: Last Sections */}
                         <div>
                                   {/* Pourquoi Blackswan a été choisi - Added at bottom */}
                                   <div className="mb-16">
                                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                             <h2 className="text-3xl font-bold text-gray-900 mb-6">Pourquoi Blackswan a été choisi ?</h2>
                                             <p className="text-lg text-gray-700 mb-8">
                                                  Blackswan Technology a été choisi par {clientData.name} pour un accompagnement complet :
                                             </p>
                                             
                                             <div className="space-y-6">
                                                  <div>
                                                       <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie & Financement</h3>
                                                       <p className="text-gray-700">
                                                            Élaboration de business plans et decks investisseurs, menant à l'obtention de subventions cruciales pour la croissance de l'entreprise.
                                                       </p>
                                                  </div>
                                                  
                                                  <div>
                                                       <h3 className="text-xl font-bold text-gray-900 mb-3">Digitalisation</h3>
                                                       <p className="text-gray-700">
                                                            Une expertise reconnue dans la refonte et amélioration continue d'ERP optimisant l'expérience client et soutenant une forte croissance.
                                                       </p>
                                                  </div>
                                             </div>
                                             
                                             <p className="text-lg text-gray-700 mt-6 font-medium">
                                                  Nous avons posé les bases de leur succès futur.
                                             </p>
                                        </div>
                                   </div>

                                   {/* Le Livrable - Added at bottom */}
                                   <div className="mb-16">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Le Livrable</h2>
                                        
                                        <div className="grid md:grid-cols-2 gap-8">
                                             <div className="space-y-6">
                                                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                                       <h3 className="text-xl font-bold text-gray-900 mb-3">Migration Odoo Complète</h3>
                                                       <p className="text-gray-700">
                                                            Une migration complète d'Odoo {clientData.migration?.split('→')[0]?.trim()} vers Odoo {clientData.migration?.split('→')[1]?.trim()}, incluant la formation des équipes et l'optimisation des processus métier.
                                                       </p>
                                                  </div>
                                                  
                                                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                                       <h3 className="text-xl font-bold text-gray-900 mb-3">Formation Personnalisée</h3>
                                                       <p className="text-gray-700">
                                                            Sessions de formation adaptées aux besoins spécifiques de {clientData.name}, garantissant une adoption rapide et efficace des nouvelles fonctionnalités.
                                                       </p>
                                                  </div>
                                                  
                                                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                                       <h3 className="text-xl font-bold text-gray-900 mb-3">Support & Accompagnement</h3>
                                                       <p className="text-gray-700">
                                                            Un accompagnement continu post-migration pour assurer la stabilité du système et l'optimisation continue des performances.
                                                       </p>
                                                  </div>
                                             </div>
                                             
                                             <div className="flex items-center justify-center">
                                                  <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                                                       <div className="text-center text-gray-500">
                                                            <Building className="w-16 h-16 mx-auto mb-4" />
                                                            <p className="text-lg font-medium">Image du projet</p>
                                                            <p className="text-sm">{clientData.name}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                         </div>
                    </div>
               </section>

               {/* Share Popup */}
               <AnimatePresence>
                    {showSharePopup && (
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                              onClick={() => setShowSharePopup(false)}
                         >
                              <motion.div
                                   initial={{ scale: 0.9, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0.9, opacity: 0 }}
                                   className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                                   onClick={(e) => e.stopPropagation()}
                              >
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">Partager ce cas client</h3>
                                        <button
                                             onClick={() => setShowSharePopup(false)}
                                             aria-label="Fermer le popup de partage"
                                             className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                        >
                                             <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                   </div>

                                   <div className="space-y-6">
                                        {/* Share via social media */}
                                        <div>
                                             <p className="text-sm text-gray-600 mb-4">Partager via</p>
                                             <div className="flex items-center gap-3">
                                                  {/* WhatsApp */}
                                                  <button
                                                       onClick={shareOnWhatsApp}
                                                       className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                                                       aria-label="Partager sur WhatsApp"
                                                  >
                                                       <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                       </svg>
                                                  </button>

                                                  {/* LinkedIn */}
                                                  <button
                                                       onClick={shareOnLinkedIn}
                                                       className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                                                       aria-label="Partager sur LinkedIn"
                                                  >
                                                       <Linkedin className="w-6 h-6 text-white" />
                                                  </button>
                                             </div>
                                        </div>

                                        {/* Copy link section */}
                                        <div>
                                             <p className="text-sm text-gray-600 mb-3">Ou copier le lien</p>
                                             <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                  </svg>
                                                  <input
                                                       type="text"
                                                       value={shareUrl}
                                                       readOnly
                                                       aria-label="URL du cas client à partager"
                                                       className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                                                  />
                                                  <button
                                                       onClick={copyLink}
                                                       className="px-4 py-2 bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white text-sm font-medium rounded-lg transition-colors"
                                                  >
                                                       {copied ? 'Copié !' : 'Copier'}
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
                         </motion.div>
                    )}
               </AnimatePresence>

          </div>
     )
}
