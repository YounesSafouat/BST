"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CasClientContactForm from "./CasClientContactForm"
import { ArrowLeft, ArrowRight, Play, Calendar, Users, Building, Target, TrendingUp, CheckCircle, Star, Quote, ExternalLink, Share2, Clock, MapPin, Award, Zap, BarChart3, X, Linkedin, Copy, Pause, Volume2, VolumeX, Maximize2, Grid3X3, List, Plus, Minus, ChevronDown, Edit, Eye, Save, Trash2, ArrowUp, ArrowDown, Headphones, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/components/home/Loader"
import { useRouter } from "next/navigation"

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'trending-up': TrendingUp,
    'bar-chart-3': BarChart3,
    'check-circle': CheckCircle,
    'target': Target,
    'users': Users,
    'building': Building,
    'clock': Clock,
    'calendar': Calendar,
    'award': Award,
    'zap': Zap,
    'star': Star,
    'quote': Quote,
    'external-link': ExternalLink,
    'grid-3x3': Grid3X3,
    'list': List,
    'map-pin': MapPin,
    'play': Play,
    'pause': Pause,
    'volume-2': Volume2,
    'volume-x': VolumeX,
    'maximize-2': Maximize2,
    'copy': Copy,
    'edit': Edit,
    'eye': Eye,
    'save': Save,
    'trash-2': Trash2,
    'arrow-up': ArrowUp,
    'arrow-down': ArrowDown,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'plus': Plus,
    'minus': Minus,
    'x': X,
    'chevron-down': ChevronDown,
    'headphones': Headphones
  }
  return iconMap[iconName] || TrendingUp // Default to TrendingUp if icon not found
}

// Extended interface for CMS-managed client cases
interface ClientCase {
     slug: string
     name: string
     headline: string
     summary: string
     company: {
          logo: string
     size: string
          sector: string
          location?: string
          website?: string
     }
     project: {
     solution: string
          customSolution?: string
          duration: string
          teamSize: string
          budget?: string
          status: string
     }
     media: {
          coverImage: string
          heroVideo?: string
          heroVideoThumbnail?: string
          gallery?: Array<{
               url: string
               alt: string
               caption?: string
          }>
     }
     contentBlocks: Array<{
          id: string
          type: string
          order: number
          title?: string
          content?: string
          sectionBadge?: string
          sectionBadgeIcon?: string
          imageUrl?: string
          imageAlt?: string
          imagePosition?: 'left' | 'right'
          sectionImageUrl?: string
          sectionImageAlt?: string
          videoUrl?: string
          videoThumbnail?: string
          stats?: Array<{
          label: string
          value: string
               description?: string
          icon?: string
     }>
          cards?: Array<{
               title: string
               description: string
               icon?: string
               imageUrl?: string
     }>
     testimonial?: {
          quote: string
               author: {
                    name: string
          role: string
          company: string
                    avatar?: string
               }
               rating?: number
               videoUrl?: string
          }
          cta?: {
               text: string
               url: string
               style: 'primary' | 'secondary' | 'outline'
          }
     }>
     seo?: {
          title?: string
          description?: string
          keywords?: string[]
          ogImage?: string
     }
     testimonial?: {
          quote: string
          author: {
               name: string
               role: string
               company: string
               avatar?: string
          }
          rating?: number
          videoUrl?: string
     }
     quickStats?: Array<{
          label: string
          value: string
          icon?: string
          description?: string
     }>
     sidebarInfo?: Array<{
          key: string
          value: string
          icon?: string
          order?: number
     }>
     tags?: string[]
     featured: boolean
     published: boolean
     createdAt: string
     updatedAt: string
     publishedAt?: string
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

export default function ClientDetailPage({ slug }: ClientDetailPageProps) {
     const [clientData, setClientData] = useState<ClientCase | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [activeSection, setActiveSection] = useState(0)
     const [isVideoPlaying, setIsVideoPlaying] = useState(false)
     const [isVideoMuted, setIsVideoMuted] = useState(true)
     const [videoProgress, setVideoProgress] = useState(0)
     const [videoCurrentTime, setVideoCurrentTime] = useState(0)
     const [videoDuration, setVideoDuration] = useState(0)
     const [showSharePopup, setShowSharePopup] = useState(false)
     const [copied, setCopied] = useState(false)
     const videoRef = useRef<HTMLVideoElement | null>(null)
     const router = useRouter()
     useEffect(() => {
          const fetchClientData = async () => {
               try {
                    setLoading(true)
                    console.log('Fetching client data for slug:', slug)
                    const response = await fetch(`/api/cas-client/${slug}`)
                    if (!response.ok) {
                         throw new Error('Failed to fetch client data')
                    }
                    const client = await response.json()
                    
                    // Debug: Check if client has the expected structure
                    if (client) {
                         console.log('Client structure:', {
                              hasContentBlocks: !!client.contentBlocks,
                              contentBlocksLength: client.contentBlocks?.length,
                              hasCompany: !!client.company,
                              hasProject: !!client.project,
                              hasMedia: !!client.media,
                              hasQuickStats: !!client.quickStats
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


     // Handle contact scroll to form
     const handleContactClick = () => {
          const contactForm = document.getElementById('contact-form-section')
          if (contactForm) {
               contactForm.scrollIntoView({ behavior: 'smooth' })
          }
     }

     // Video control functions
     const togglePlay = () => {
          if (videoRef.current) {
               if (isVideoPlaying) {
                    videoRef.current.pause()
               } else {
                    videoRef.current.play()
               }
          }
     }

     const toggleMute = () => {
          if (videoRef.current) {
               videoRef.current.muted = !isVideoMuted
               setIsVideoMuted(!isVideoMuted)
          }
     }

     const handleTimeUpdate = () => {
          if (videoRef.current) {
               const currentTime = videoRef.current.currentTime
               const duration = videoRef.current.duration
               setVideoCurrentTime(currentTime)
               setVideoProgress((currentTime / duration) * 100)
          }
     }

     const handleLoadedMetadata = () => {
          if (videoRef.current) {
               setVideoDuration(videoRef.current.duration)
          }
     }

     const handleVideoEnded = () => {
          setIsVideoPlaying(false)
          setVideoProgress(0)
          setVideoCurrentTime(0)
     }

     const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
          if (videoRef.current) {
               const rect = e.currentTarget.getBoundingClientRect()
               const clickX = e.clientX - rect.left
               const width = rect.width
               const percentage = clickX / width
               const newTime = percentage * videoDuration
               videoRef.current.currentTime = newTime
               setVideoCurrentTime(newTime)
               setVideoProgress(percentage * 100)
          }
     }

     const openFullscreen = () => {
          if (videoRef.current) {
               if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen()
               } else if ((videoRef.current as any).webkitRequestFullscreen) {
                    (videoRef.current as any).webkitRequestFullscreen()
               } else if ((videoRef.current as any).msRequestFullscreen) {
                    (videoRef.current as any).msRequestFullscreen()
               }
          }
     }

     const formatTime = (time: number) => {
          const minutes = Math.floor(time / 60)
          const seconds = Math.floor(time % 60)
          return `${minutes}:${seconds.toString().padStart(2, '0')}`
     }

     // Loading state
     if (loading) {
          return <Loader />
     }

     // Error state
     if (error || !clientData) {
          console.log('Error or no client data:', { error, clientData, slug })
          return (
               <div className="min-h-screen flex items-center justify-center">
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
          <div className="min-h-screen pt-20 md:pt-10">
               {/* Enhanced Header */}
               <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-1">
                         <div className="flex items-center justify-start">
                              <Link href="/cas-client">
                                   <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100/50 hover:text-[var(--color-main)] transition-all duration-300 h-8 px-3">
                                        <ArrowLeft className="w-3 h-3 mr-1" />
                                        Retour aux cas clients
                                   </Button>
                              </Link>
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

                    <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:py-8">
                         <div className="grid lg:grid-cols-2 gap-16 items-center">
                              {/* Left Content */}
                              <motion.div
                                   initial={{ opacity: 0, x: -50 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8 }}
                                   className="space-y-8"
                              >
                                   <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                        {clientData.headline}
                                   </h1>

                                   <p className="text-xl text-gray-600 leading-relaxed">
                                        {clientData.summary}
                                   </p>

                                    <div className="flex justify-start">
                                        <Button
                                             size="sm"
                                             className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 text-base font-semibold group rounded-full h-16 shadow-lg hover:shadow-xl transition-all duration-300"
                                             onClick={handleContactClick}
                                        >
                                             <Presentation className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                                             Demander une démonstration
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
                                   <div className="relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
                                         {clientData.media.heroVideo ? (
                                              <div
                                                   className="w-full h-full relative group"
                                                   onClick={(e) => {
                                                        // Only toggle if clicking on the container, not on buttons
                                                        if (e.target === e.currentTarget || e.target === videoRef.current) {
                                                             togglePlay();
                                                        }
                                                   }}
                                              >
                                                   <video
                                                        ref={videoRef}
                                                        src={clientData.media.heroVideo}
                                                        poster={clientData.media.heroVideoThumbnail || clientData.media.coverImage}
                                                        className="w-full h-full object-cover"
                                                        onTimeUpdate={handleTimeUpdate}
                                                        onLoadedMetadata={handleLoadedMetadata}
                                                        onEnded={handleVideoEnded}
                                                        onPlay={() => setIsVideoPlaying(true)}
                                                        onPause={() => setIsVideoPlaying(false)}
                                                        muted={isVideoMuted}
                                                   />

                                                   {/* Video Controls Overlay */}
                                                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                        {/* Play/Pause Button */}
                                                        <button
                                                             onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  togglePlay();
                                                             }}
                                                             className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 transform scale-100"
                                                        >
                                                             {isVideoPlaying ? (
                                                                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" />
                                                             ) : (
                                                                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 ml-0.5 sm:ml-1" />
                                                             )}
                                                        </button>

                                                        {/* Fullscreen Button */}
                                                        <button
                                                             onClick={openFullscreen}
                                                             className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                             title="Plein écran"
                                                             aria-label="Ouvrir la vidéo en plein écran"
                                                        >
                                                             <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                        </button>
                                                   </div>

                                                   {/* Bottom Controls */}
                                                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {/* Progress Bar */}
                                                        <div
                                                             className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-2"
                                                             onClick={handleProgressClick}
                                                        >
                                                             <div
                                                                  className="h-full bg-white rounded-full transition-all duration-100"
                                                                  style={{ width: `${videoProgress}%` }}
                                                             />
                                                        </div>

                                                        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                                                             <span>{formatTime(videoCurrentTime)}</span>
                                                             <div className="flex items-center gap-2">
                                                                  <button
                                                                       onClick={toggleMute}
                                                                       className="hover:bg-white hover:bg-opacity-20 p-1 rounded"
                                                                  >
                                                                       {isVideoMuted ? (
                                                                            <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                       ) : (
                                                                            <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                       )}
                                                                  </button>
                                                                  <span className="text-gray-300">/</span>
                                                                  <span>{formatTime(videoDuration)}</span>
                                                             </div>
                                                        </div>
                                                   </div>
                                              </div>
                                         ) : clientData.media.coverImage ? (
                                             <Image
                                                  src={clientData.media.coverImage}
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
                                   </div>
                              </motion.div>
                         </div>
                    </div>
               </section>

                {/* Content Section - Matching Your Design */}
               <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-6">
                         {/* First Block: Sidebar + Text Content */}
                         <div className="flex flex-col lg:flex-row gap-12 mb-16">
                              {/* Company Info Sidebar */}
                              <motion.div
                                   initial={{ opacity: 0, y: 50 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.8, delay: 0.4 }}
                                    className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-20 lg:self-start"
                              >
                                   {/* Company Card - Enhanced */}
                                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                                        <div className="text-center mb-8">
                                             <div className="w-56 h-56 mx-auto mb-6 flex items-center justify-center">
                                                  <Image
                                                       src={clientData.company.logo}
                                                       alt={clientData.name}
                                                       width={224}
                                                       height={224}
                                                       className="object-contain"
                                                  />
                                             </div>
                                        </div>

                                         <div className="space-y-6">
                                              {/* Dynamic Sidebar Info - Customizable from CMS */}
                                              {clientData.sidebarInfo && clientData.sidebarInfo.length > 0 ? (
                                                   clientData.sidebarInfo.sort((a, b) => (a.order || 0) - (b.order || 0)).map((info, index) => {
                                                        const IconComponent = getIconComponent(info.icon || 'building');
                                                        return (
                                                             <div key={index} className="flex items-center gap-3">
                                                                  <IconComponent className="w-5 h-5 text-[var(--color-main)] flex-shrink-0" />
                                                                  <div className="min-w-0">
                                                                       <p className="text-sm text-gray-500">{info.key}</p>
                                                                       <p className="font-medium text-gray-900">{info.value}</p>
                                                                  </div>
                                                             </div>
                                                        );
                                                   })
                                              ) : (
                                                   <div className="text-center py-8 text-gray-500">
                                                        <p className="text-sm">Aucune information disponible</p>
                                                        <p className="text-xs mt-1">Ajoutez des informations dans le CMS</p>
                                                   </div>
                                              )}


                                              {/* Contact CTA */}
                                              <div className="pt-6">
                                                  <Button 
                                                       className="w-full bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white"
                                                        onClick={handleContactClick}
                                                  >
                                                        <Presentation className="w-4 h-4 mr-2" />
                                                        Nous contacter
                                                  </Button>
                                              </div>
                                        </div>
                                   </div>
                              </motion.div>

                               {/* Text Content - Only text-only blocks here */}
                              <div className="flex-1">
                                    {clientData.contentBlocks?.sort((a, b) => a.order - b.order).filter(block => 
                                         block.type === 'text-only'
                                    ).map((block, index) => (
                                         <div key={block.id || index} className="mb-16">
                                              {block.title && (
                                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                        {block.title}
                                             </h2>
                                              )}

                                              {/* Text Only Block */}
                                              {block.content && (
                                                  <div className="max-w-none blog-content">
                                                        <ClientContent content={block.content} />
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>

                          {/* Second Block: Dynamic Full-width Sections */}
                         <div className="mb-16">
                               {clientData.contentBlocks?.sort((a, b) => a.order - b.order).filter(block => 
                                    block.type === 'text-image-left' || block.type === 'text-image-right' ||
                                    block.type === 'image-stats-left' || block.type === 'image-stats-right' || 
                                    block.type === 'text-stats' || block.type === 'cards-layout' || 
                                    block.type === 'video' || block.type === 'testimonial' || block.type === 'contact-form' || block.type === 'cta'
                               ).map((block, index) => (
                                    <div key={`full-${block.id || index}`} className="w-full mb-16">
                                         {/* Text + Image Left Block - Enhanced Section */}
                                         {block.type === 'text-image-left' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                                                       {/* Image Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: -50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8 }}
                                                            viewport={{ once: true }}
                                                            className="order-2 lg:order-1"
                                                       >
                                                            <div className="relative group">
                                                                 {block.imageUrl ? (
                                                                      <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                                                                           <Image
                                                                                src={block.imageUrl}
                                                                                alt={block.imageAlt || block.title || 'Image'}
                                                                                width={600}
                                                                                height={450}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                                                                           <div className="text-center text-gray-500">
                                                                                <Building className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                                                <p className="text-lg font-medium">Image du projet</p>
                                                                                <p className="text-sm">{clientData.name}</p>
                                                                           </div>
                                                                      </div>
                                                                 )}
                                                                 
                                                                 {/* Decorative Elements */}
                                                                 <div className="absolute -top-4 -left-4 w-8 h-8 bg-[var(--color-main)]/20 rounded-full"></div>
                                                                 <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[var(--color-secondary)]/20 rounded-full"></div>
                                                            </div>
                                                       </motion.div>

                                                       {/* Content Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: 50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                            className="order-1 lg:order-2"
                                                       >
                                                            <div className="space-y-8">

                                                                 {/* Title */}
                                                                 {block.title && (
                                                                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                                                           {block.title}
                                                                      </h2>
                                                                 )}

                                                                 {/* Content */}
                                                                 {block.content && (
                                                                      <div className="blog-content text-lg leading-relaxed">
                                                                           <ClientContent content={block.content} />
                                                                      </div>
                                                                 )}

                                                            </div>
                                                       </motion.div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Text + Image Right Block - Enhanced Section */}
                                         {block.type === 'text-image-right' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             {/* Background Pattern */}
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                                                       {/* Content Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: -50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8 }}
                                                            viewport={{ once: true }}
                                                       >
                                                            <div className="space-y-8">

                                                                 {/* Title */}
                                                                 {block.title && (
                                                                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                                                           {block.title}
                                                                      </h2>
                                                                 )}

                                                                 {/* Content */}
                                                                 {block.content && (
                                                                      <div className="blog-content text-lg leading-relaxed">
                                                                           <ClientContent content={block.content} />
                                                                      </div>
                                                                 )}

                                                            </div>
                                                       </motion.div>

                                                       {/* Image Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: 50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                       >
                                                            <div className="relative group">
                                                                 {block.imageUrl ? (
                                                                      <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                                                                           <Image
                                                                                src={block.imageUrl}
                                                                                alt={block.imageAlt || block.title || 'Image'}
                                                                                width={600}
                                                                                height={450}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                                                                           <div className="text-center text-gray-500">
                                                                                <TrendingUp className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                                                <p className="text-lg font-medium">Image du projet</p>
                                                                                <p className="text-sm">{clientData.name}</p>
                                                                           </div>
                                                                      </div>
                                                                 )}
                                                                 
                                                                 {/* Decorative Elements */}
                                                                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--color-secondary)]/20 rounded-full"></div>
                                                                 <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[var(--color-main)]/20 rounded-full"></div>
                                                            </div>
                                                       </motion.div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Image + Stats Left Block - Enhanced Statistics Section */}
                                         {block.type === 'image-stats-left' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             {/* Background Pattern */}
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                                                       {/* Image Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: -50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8 }}
                                                            viewport={{ once: true }}
                                                            className="order-2 lg:order-1"
                                                       >
                                                            <div className="relative group">
                                                                 {block.imageUrl ? (
                                                                      <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                                                                           <Image
                                                                                src={block.imageUrl}
                                                                                alt={block.imageAlt || block.title || 'Image'}
                                                                                width={600}
                                                                                height={450}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                                                                           <div className="text-center text-gray-500">
                                                                                <BarChart3 className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                                                <p className="text-lg font-medium">Image du projet</p>
                                                                                <p className="text-sm">{clientData.name}</p>
                                                                           </div>
                                                                      </div>
                                                                 )}
                                                                 
                                                                 {/* Decorative Elements */}
                                                                 <div className="absolute -top-4 -left-4 w-8 h-8 bg-[var(--color-main)]/20 rounded-full"></div>
                                                                 <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[var(--color-secondary)]/20 rounded-full"></div>
                                                            </div>
                                                       </motion.div>

                                                       {/* Stats Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: 50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                            className="order-1 lg:order-2"
                                                       >
                                                            <div className="space-y-8">

                                                                 {/* Title */}
                                                                 {block.title && (
                                                                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                                                           {block.title}
                                                                      </h2>
                                                                 )}

                                                                 {/* Content */}
                                                                 {block.content && (
                                                                      <div className="blog-content text-lg leading-relaxed mb-8">
                                                                           <ClientContent content={block.content} />
                                                                      </div>
                                                                 )}

                                                                 {/* Enhanced Stats */}
                                                                 {block.stats && block.stats.length > 0 && (
                                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                           {block.stats.map((stat, statIndex) => (
                                                                                <motion.div
                                                                                     key={statIndex}
                                                                                     initial={{ opacity: 0, y: 20 }}
                                                                                     whileInView={{ opacity: 1, y: 0 }}
                                                                                     transition={{ duration: 0.6, delay: statIndex * 0.1 }}
                                                                                     viewport={{ once: true }}
                                                                                     className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group text-center"
                                                                                >
                                                                                     <div className="space-y-4">
                                                                                          {/* Icon */}
                                                                                          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                                                               {(() => {
                                                                                                    const IconComponent = getIconComponent(stat.icon || 'trending-up')
                                                                                                    return <IconComponent className="w-8 h-8 text-white" />
                                                                                               })()}
                                                                                          </div>
                                                                                          
                                                                                          {/* Value */}
                                                                                          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                                                                          
                                                                                          {/* Label */}
                                                                                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                                                                     </div>
                                                                                </motion.div>
                                                                           ))}
                                                                      </div>
                                                                 )}

                                                            </div>
                                                       </motion.div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Image + Stats Right Block - Enhanced Statistics Section */}
                                         {block.type === 'image-stats-right' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             {/* Background Pattern */}
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                                                       {/* Stats Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: -50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8 }}
                                                            viewport={{ once: true }}
                                                       >
                                                            <div className="space-y-8">

                                                                 {/* Title */}
                                                                 {block.title && (
                                                                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                                                           {block.title}
                                                                      </h2>
                                                                 )}

                                                                 {/* Content */}
                                                                 {block.content && (
                                                                      <div className="blog-content text-lg leading-relaxed mb-8">
                                                                           <ClientContent content={block.content} />
                                                                      </div>
                                                                 )}

                                                                 {/* Enhanced Stats */}
                                                                 {block.stats && block.stats.length > 0 && (
                                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                           {block.stats.map((stat, statIndex) => (
                                                                                <motion.div
                                                                                     key={statIndex}
                                                                                     initial={{ opacity: 0, y: 20 }}
                                                                                     whileInView={{ opacity: 1, y: 0 }}
                                                                                     transition={{ duration: 0.6, delay: statIndex * 0.1 }}
                                                                                     viewport={{ once: true }}
                                                                                     className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group text-center"
                                                                                >
                                                                                     <div className="space-y-4">
                                                                                          {/* Icon */}
                                                                                          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                                                               {(() => {
                                                                                                    const IconComponent = getIconComponent(stat.icon || 'trending-up')
                                                                                                    return <IconComponent className="w-8 h-8 text-white" />
                                                                                               })()}
                                                                                          </div>
                                                                                          
                                                                                          {/* Value */}
                                                                                          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                                                                          
                                                                                          {/* Label */}
                                                                                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                                                                     </div>
                                                                                </motion.div>
                                                                           ))}
                                                                      </div>
                                                                 )}

                                                            </div>
                                                       </motion.div>

                                                       {/* Image Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: 50 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                       >
                                                            <div className="relative group">
                                                                 {block.imageUrl ? (
                                                                      <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                                                                           <Image
                                                                                src={block.imageUrl}
                                                                                alt={block.imageAlt || block.title || 'Image'}
                                                                                width={600}
                                                                                height={450}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                                                                           <div className="text-center text-gray-500">
                                                                                <TrendingUp className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                                                <p className="text-lg font-medium">Résultats</p>
                                                                                <p className="text-sm">{clientData.name}</p>
                                                                           </div>
                                                                      </div>
                                                                 )}
                                                                 
                                                                 {/* Decorative Elements */}
                                                                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--color-secondary)]/20 rounded-full"></div>
                                                                 <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[var(--color-main)]/20 rounded-full"></div>
                                                            </div>
                                                       </motion.div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Text + Stats Block - Enhanced Metrics Section */}
                                         {block.type === 'text-stats' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             {/* Background Pattern */}
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="text-center mb-16">

                                                       {/* Title */}
                                                       {block.title && (
                                                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                                                                 {block.title}
                                                             </h2>
                                                       )}

                                                       {/* Content */}
                                                       {block.content && (
                                                            <div className="blog-content text-lg leading-relaxed max-w-4xl mx-auto mb-12">
                                                                 <ClientContent content={block.content} />
                                                            </div>
                                                       )}
                                                  </div>

                                                  {/* Enhanced Stats Grid */}
                                                  {block.stats && block.stats.length > 0 && (
                                                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {block.stats.map((stat, statIndex) => (
                                                                 <motion.div
                                                                      key={statIndex}
                                                                      initial={{ opacity: 0, y: 30 }}
                                                                      whileInView={{ opacity: 1, y: 0 }}
                                                                      transition={{ duration: 0.6, delay: statIndex * 0.1 }}
                                                                      viewport={{ once: true }}
                                                                      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group text-center"
                                                                 >
                                                                      <div className="space-y-4">
                                                                           {/* Icon */}
                                                                           <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                                                {(() => {
                                                                                     const IconComponent = getIconComponent(stat.icon || 'trending-up')
                                                                                     return <IconComponent className="w-8 h-8 text-white" />
                                                                                })()}
                                                                           </div>

                                                                           {/* Value */}
                                                                           <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>

                                                                           {/* Label */}
                                                                           <div className="text-lg text-gray-600 font-medium">{stat.label}</div>

                                                                      </div>
                                                                 </motion.div>
                                                            ))}
                                                       </div>
                                                  )}

                                                  {/* Decorative Line */}
                                                  <div className="flex justify-center mt-16">
                                                       <div className="w-32 h-1 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] rounded-full"></div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Cards Layout Block - Enhanced Service Showcase Section */}
                                         {block.type === 'cards-layout' && (
                                        <section className="relative py-16 md:py-24 overflow-hidden">
                                             {/* Background Pattern */}
                                             <div className="absolute inset-0">
                                                  <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
                                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-main)]/3 rounded-full blur-3xl"></div>
                                             </div>

                                             <div className="relative z-10 max-w-7xl mx-auto px-6">
                                                  <div className="text-center mb-16">

                                                       {/* Title */}
                                                       {block.title && (
                                                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                                                                 {block.title}
                                                             </h2>
                                                       )}

                                                       {/* Content */}
                                                       {block.content && (
                                                            <div className="blog-content text-lg leading-relaxed max-w-4xl mx-auto mb-12">
                                                                 <ClientContent content={block.content} />
                                                            </div>
                                                       )}
                                                  </div>

                                                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                                                       {/* Cards Section */}
                                                       <div className="space-y-6">
                                                            {block.cards && block.cards.length > 0 && (
                                                                 block.cards.map((card, cardIndex) => (
                                                                      <motion.div
                                                                           key={cardIndex}
                                                                           initial={{ opacity: 0, x: -30 }}
                                                                           whileInView={{ opacity: 1, x: 0 }}
                                                                           transition={{ duration: 0.6, delay: cardIndex * 0.1 }}
                                                                           viewport={{ once: true }}
                                                                           className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                                                                      >
                                                                           <div className="flex items-start gap-4">
                                                                                {/* Icon */}
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                                                     {(() => {
                                                                                          const IconComponent = getIconComponent(card.icon || 'check-circle')
                                                                                          return <IconComponent className="w-6 h-6 text-white" />
                                                                                     })()}
                                                                                </div>

                                                                                {/* Content */}
                                                                                <div className="flex-1">
                                                                                     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-main)] transition-colors duration-300">{card.title}</h3>
                                                                                     <p className="text-gray-700 leading-relaxed">{card.description}</p>
                                                                                </div>
                                                                           </div>
                                                                      </motion.div>
                                                                 ))
                                                            )}
                                                       </div>
                                                       
                                                       {/* Image Section */}
                                                       <motion.div
                                                            initial={{ opacity: 0, x: 30 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                            className="flex items-center justify-center"
                                                       >
                                                            <div className="relative group">
                                                                 {block.sectionImageUrl ? (
                                                                      <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                                                                           <Image
                                                                                src={block.sectionImageUrl}
                                                                                alt={block.sectionImageAlt || block.title || 'Image du projet'}
                                                                                width={600}
                                                                                height={450}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200/50">
                                                                           <div className="text-center text-gray-500">
                                                                                <Building className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                                                                <p className="text-lg font-medium">Image du projet</p>
                                                                                <p className="text-sm">{clientData.name}</p>
                                                                           </div>
                                                                      </div>
                                                                 )}
                                                                 
                                                                 {/* Decorative Elements */}
                                                                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--color-main)]/20 rounded-full"></div>
                                                                 <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[var(--color-secondary)]/20 rounded-full"></div>
                                                            </div>
                                                       </motion.div>
                                                  </div>

                                                  {/* Decorative Line */}
                                                  <div className="flex justify-center mt-16">
                                                       <div className="w-32 h-1 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] rounded-full"></div>
                                                  </div>
                                             </div>
                                        </section>
                                         )}

                                         {/* Video Block */}
                                         {block.type === 'video' && block.videoUrl && (
                                              <div>
                                                   {block.title && (
                                                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.title}</h2>
                                                   )}
                                                   {block.content && (
                                                        <div className="blog-content mb-6">
                                                             <ClientContent content={block.content} />
                                                        </div>
                                                   )}
                                                   <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                                                        <iframe
                                                             className="w-full h-full"
                                                             src={getYouTubeEmbedUrl(block.videoUrl)}
                                                             title={block.title || 'Vidéo'}
                                                             frameBorder="0"
                                                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                             allowFullScreen
                                                        />
                                                   </div>
                                              </div>
                                         )}

                                         {/* Testimonial Block */}
                                         {block.type === 'testimonial' && block.testimonial && (
                                              <section className="relative py-12 md:py-16 lg:py-24 overflow-hidden">
                                                   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                                        {block.title && (
                                                             <div className="text-center mb-8 md:mb-12">
                                                                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{block.title}</h2>
                                                             </div>
                                                        )}
                                                        
                                                        <div className="bg-white border-2 border-gray-200 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden shadow-lg">
                                                             <div className="relative z-10">
                                                                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
                                                                       <div className="flex-shrink-0 mx-auto sm:mx-0">
                                                                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-gray-300">
                                                                                 <AvatarImage 
                                                                                      src={block.testimonial.author.avatar} 
                                                                                      alt={block.testimonial.author.name}
                                                                                 />
                                                                                 <AvatarFallback className="bg-gray-100 text-gray-700 text-xl sm:text-2xl md:text-3xl font-bold border border-gray-200 shadow-lg">
                                                                                      {block.testimonial.author.name.charAt(0).toUpperCase()}
                                                                                 </AvatarFallback>
                                                                            </Avatar>
                                                                       </div>
                                                                       
                                                                       <div className="flex-1 text-center sm:text-left">
                                                                            <div className="mb-4 sm:mb-6 sm:pl-0 md:pl-6">
                                                                                 <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-3 sm:mb-4 mx-auto sm:mx-0" />
                                                                                 <blockquote className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                                                                                      "{block.testimonial.quote}"
                                                                                 </blockquote>
                                                                            </div>
                                                                            
                                                                            <div className="text-sm sm:text-base text-gray-600">
                                                                                 <p className="font-semibold text-gray-900 text-base sm:text-lg">{block.testimonial.author.name}</p>
                                                                                 <p className="text-gray-600">{block.testimonial.author.role} • {block.testimonial.author.company}</p>
                                                                                 {block.testimonial.rating && (
                                                                                      <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                                                                                           {[...Array(5)].map((_, i) => (
                                                                                                <Star 
                                                                                                     key={i} 
                                                                                                     className={`w-4 h-4 sm:w-5 sm:h-5 ${i < (block.testimonial?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                                                                                />
                                                                                           ))}
                                                                                      </div>
                                                                                 )}
                                                                            </div>
                                                                       </div>
                                                                  </div>
                                                             </div>
                                                        </div>
                                                   </div>
                                              </section>
                                         )}
                                         
                                         {/* Contact Form Block */}
                                         {block.type === 'contact-form' && (
                                              <div id="contact-form-section" className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] sm:w-auto sm:left-auto sm:right-auto sm:-ml-0 sm:-mr-0">
                                                   <CasClientContactForm 
                                                        clientName={clientData.name || 'ce client'} 
                                                        clientSlug={clientData.slug || ''} 
                                                        blockData={{
                                                             title: block.title,
                                                             content: block.content
                                                        }}
                                                   />
                                              </div>
                                         )}
                                         
                                         {/* CTA Block */}
                                         {block.type === 'cta' && block.cta && (
                                              <div className="text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                                   {block.title && (
                                                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.title}</h2>
                                                   )}
                                                   {block.content && (
                                                        <div className="mb-6 text-gray-700">
                                                             <ClientContent content={block.content} />
                                                        </div>
                                                   )}
                                                   <Button
                                                        className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                                        onClick={() => block.cta?.url && window.open(block.cta.url, '_blank')}
                                                   >
                                                        {block.cta?.text}
                                                        <ArrowRight className="w-5 h-5 ml-2" />
                                                   </Button>
                                              </div>
                                         )}
                                    </div>
                               ))}
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
