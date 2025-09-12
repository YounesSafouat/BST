"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import MotherboardEffect from "@/components/motherboard-effect"

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
}

interface ClientDetailPageProps {
     slug: string
}

// Custom component to render client content with proper HTML styling (similar to BlogContent)
const ClientContent = ({ content }: { content: string }) => {
     return (
          <>
               <style jsx>{`
                    .client-content {
                         line-height: 1.7;
                         color: #374151;
                    }
                    .client-content h1 {
                         font-size: 2rem;
                         font-weight: bold;
                         color: #111827;
                         margin: 2rem 0 1rem 0;
                         line-height: 1.2;
                    }
                    .client-content h2 {
                         font-size: 1.5rem;
                         font-weight: bold;
                         color: #374151;
                         margin: 1.5rem 0 1rem 0;
                         line-height: 1.3;
                    }
                    .client-content h3 {
                         font-size: 1.25rem;
                         font-weight: bold;
                         color: #4b5563;
                         margin: 1rem 0 0.5rem 0;
                         line-height: 1.4;
                    }
                    .client-content p {
                         margin: 1rem 0;
                         line-height: 1.7;
                    }
                    .client-content ul, .client-content ol {
                         margin: 1rem 0;
                         padding-left: 2rem;
                    }
                    .client-content li {
                         margin: 0.5rem 0;
                    }
                    .client-content strong {
                         font-weight: bold;
                         color: #111827;
                    }
                    .client-content em {
                         font-style: italic;
                         color: #4b5563;
                    }
                    .client-content img {
                         max-width: 100%;
                         height: auto;
                         border-radius: 8px;
                         margin: 1rem 0;
                    }
                    .client-content a {
                         color: #2563eb;
                         text-decoration: underline;
                    }
                    .client-content a:hover {
                         color: #1d4ed8;
                    }
                    .client-content blockquote {
                         border-left: 4px solid #3b82f6;
                         padding-left: 1rem;
                         margin: 1rem 0;
                         font-style: italic;
                         background-color: #f9fafb;
                         padding: 1rem;
                         border-radius: 0 8px 8px 0;
                    }
                    .client-content code {
                         background-color: #f3f4f6;
                         padding: 0.25rem 0.5rem;
                         border-radius: 4px;
                         font-family: monospace;
                         font-size: 0.875rem;
                    }
                    .client-content pre {
                         background-color: #1f2937;
                         color: #f9fafb;
                         padding: 1rem;
                         border-radius: 8px;
                         overflow-x: auto;
                         margin: 1rem 0;
                    }
                    .client-content pre code {
                         background: none;
                         padding: 0;
                         color: inherit;
                    }
                    .client-content table {
                         width: 100%;
                         border-collapse: collapse;
                         margin: 1rem 0;
                         border: 1px solid #d1d5db;
                         border-radius: 8px;
                         overflow: hidden;
                    }
                    .client-content th {
                         background-color: #f9fafb;
                         padding: 0.75rem;
                         text-align: left;
                         font-weight: bold;
                         border-right: 1px solid #d1d5db;
                    }
                    .client-content td {
                         padding: 0.75rem;
                         border-right: 1px solid #d1d5db;
                         border-bottom: 1px solid #d1d5db;
                    }
                    .client-content tr:last-child td {
                         border-bottom: none;
                    }
                    .client-content th:last-child,
                    .client-content td:last-child {
                         border-right: none;
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

export default function ClientDetailPageV4({ slug }: ClientDetailPageProps) {
     const [clientData, setClientData] = useState<ClientCase | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)

     useEffect(() => {
          const fetchClientData = async () => {
               try {
                    setLoading(true)
                    const response = await fetch(`/api/content?type=clients-page`)
                    if (!response.ok) {
                         throw new Error('Failed to fetch client data')
                    }
                    const data = await response.json()
                    const page = Array.isArray(data) ? data.find(item => item.type === 'clients-page') : data
                    const clientCases = page?.content?.clientCases || []
                    const client = clientCases.find((c: ClientCase) => c.slug === slug)

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

     // Loading state
     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-main)]"></div>
                         <p className="mt-4 text-gray-600">Chargement...</p>
                    </div>
               </div>
          )
     }

     // Error state
     if (error || !clientData) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                         <h1 className="text-2xl font-bold text-gray-900 mb-4">Cas client non trouvé</h1>
                         <p className="text-gray-600 mb-8">{error || 'Ce cas client n\'existe pas.'}</p>
                         <Link href="/cas-client">
                              <Button variant="outline">
                                   <ArrowLeft className="w-4 h-4 mr-2" />
                                   Retour aux cas clients
                              </Button>
                         </Link>
                    </div>
               </div>
          )
     }

     return (
          <div className="min-h-screen relative">
               {/* Background Effect */}
               <MotherboardEffect />

               {/* Header */}
               <header className="bg-white px-8 py-4 relative z-10">
                    <Link href="/cas-client">
                         <Button variant="ghost" className="text-gray-900 hover:bg-gray-100">
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Retour aux cas clients
                         </Button>
                    </Link>
               </header>

               {/* Hero Section - Mobile Responsive */}
               <section className="bg-[var(--color-main)] text-white py-12 md:py-20 relative z-10">
                    <div className="container mx-auto px-4 md:px-16">
                         {/* Desktop: 2 columns with video, Mobile: 1 column without video */}
                         <div className="hidden md:grid md:grid-cols-2 gap-20 items-center">
                              {/* Left Content */}
                              <div className="space-y-8">
                                   <div className="inline-block px-6 py-3 bg-[var(--color-secondary)] text-white text-base font-medium rounded-lg">
                                        Cas client
                                   </div>

                                   <h1 className="text-6xl font-bold leading-tight">
                                        {clientData.headline}
                                   </h1>

                                   <Button className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white px-8 py-4 font-medium text-lg">
                                        <Download className="w-5 h-5 mr-3" />
                                        Télécharger le Cas Client
                                   </Button>
                              </div>

                              {/* Right Video - Desktop Only */}
                              <div>
                                   <div className="relative aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
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
                                                  width={900}
                                                  height={675}
                                                  className="w-full h-full object-cover"
                                             />
                                        ) : (
                                             <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                  <div className="text-center text-gray-400">
                                                       <Play className="w-28 h-28 mx-auto mb-6" />
                                                       <p className="text-xl font-medium">Aucune vidéo disponible</p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>

                         {/* Mobile: Single column without video */}
                         <div className="md:hidden text-center space-y-8">
                              <div className="inline-block px-6 py-3 bg-[var(--color-secondary)] text-white text-base font-medium rounded-lg">
                                   Cas client
                              </div>

                              <h1 className="text-4xl font-bold leading-tight">
                                   {clientData.headline}
                              </h1>

                              <Button className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white px-8 py-4 font-medium text-lg">
                                   <Download className="w-5 h-5 mr-3" />
                                   Télécharger le Cas Client
                              </Button>
                         </div>
                    </div>
               </section>

               {/* Bottom Section - Responsive Layout */}
               <div className="bg-white py-8 md:py-16 px-4 md:px-20 relative z-10">
                    {/* Desktop Layout */}
                    <div className="hidden md:block max-w-7xl mx-auto">
                         <div className="flex gap-20">
                              {/* Left Sidebar - Desktop */}
                              <div className="">
                                   <div className="bg-[var(--color-main)] rounded-2xl w-56 px-6 py-8 flex-shrink-0">
                                        {/* Logo and Company Name */}
                                        <div className="mb-8 text-center">
                                             <div className="mb-4">
                                                  <Image
                                                       src={clientData.logo}
                                                       alt={clientData.name}
                                                       width={100}
                                                       height={100}
                                                       className="object-contain mx-auto"
                                                  />
                                             </div>
                                             <h2 className="text-white font-bold text-sm leading-tight">{clientData.name}</h2>
                                        </div>

                                        {/* Client Details */}
                                        <div className="space-y-6">
                                             <div>
                                                  <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                       Secteur
                                                  </h3>
                                                  <p className="text-white text-sm">
                                                       {clientData.sector}
                                                  </p>
                                             </div>

                                             <div>
                                                  <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                       Taille
                                                  </h3>
                                                  <div className="text-white text-sm font-bold">
                                                       {clientData.size}+ employés
                                                  </div>
                                             </div>

                                             <div>
                                                  <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                       Solution
                                                  </h3>
                                                  <p className="text-white text-sm">
                                                       {clientData.solution}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Right Content - Desktop */}
                              <div className="flex-1 max-w-4xl">
                                   {/* Render Dynamic Content Sections */}
                                   {clientData.contentSections?.map((section, index) => (
                                        <div key={index} className="mb-16">
                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                  {section.title}
                                             </h2>

                                             {section.image ? (
                                                  // Layout with image
                                                  <div className="grid grid-cols-2 gap-12">
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
                                                  // Full-width content without image
                                                  <div className="max-w-none blog-content">
                                                       <ClientContent content={section.content} />
                                                  </div>
                                             )}
                                        </div>
                                   ))}

                                   {/* Fallback content if no sections defined */}
                                   {(!clientData.contentSections || clientData.contentSections.length === 0) && (
                                        <div className="mb-16">
                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                  À propos de {clientData.name}
                                             </h2>
                                             <div className="blog-content">
                                                  <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">{clientData.summary || 'Aucun contenu disponible pour ce cas client.'}</p>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden max-w-2xl mx-auto">
                         {/* Sidebar in Middle - Mobile */}
                         <div className="flex justify-center mb-8">
                              <div className="bg-[var(--color-main)] rounded-2xl w-64 px-6 py-8">
                                   {/* Logo and Company Name */}
                                   <div className="mb-8 text-center">
                                        <div className="mb-4">
                                             <Image
                                                  src={clientData.logo}
                                                  alt={clientData.name}
                                                  width={80}
                                                  height={80}
                                                  className="object-contain mx-auto"
                                             />
                                        </div>
                                        <h2 className="text-white font-bold text-sm leading-tight">{clientData.name}</h2>
                                   </div>

                                   {/* Client Details */}
                                   <div className="space-y-6">
                                        <div>
                                             <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                  Secteur
                                             </h3>
                                             <p className="text-white text-sm">
                                                  {clientData.sector}
                                             </p>
                                        </div>

                                        <div>
                                             <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                  Taille
                                             </h3>
                                             <div className="text-white text-sm font-bold">
                                                  {clientData.size}+ employés
                                             </div>
                                        </div>

                                        <div>
                                             <h3 className="text-[var(--color-secondary)] font-bold text-sm mb-2">
                                                  Solution
                                             </h3>
                                             <p className="text-white text-sm">
                                                  {clientData.solution}
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Content Below - Mobile */}
                         <div>
                              {/* Render Dynamic Content Sections */}
                              {clientData.contentSections?.map((section, index) => (
                                   <div key={index} className="mb-12">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                             {section.title}
                                        </h2>

                                        {section.image && (
                                             <div className="mb-6">
                                                  <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
                                                       <Image
                                                            src={section.image}
                                                            alt={section.imageAlt || section.title}
                                                            width={400}
                                                            height={300}
                                                            className="w-full h-full object-cover"
                                                       />
                                                  </div>
                                             </div>
                                        )}

                                        <div className="blog-content">
                                             <ClientContent content={section.content} />
                                        </div>
                                   </div>
                              ))}

                              {/* Fallback content if no sections defined */}
                              {(!clientData.contentSections || clientData.contentSections.length === 0) && (
                                   <div className="mb-12">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                             À propos de {clientData.name}
                                        </h2>
                                        <div className="blog-content">
                                             <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">{clientData.summary || 'Aucun contenu disponible pour ce cas client.'}</p>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     )
}