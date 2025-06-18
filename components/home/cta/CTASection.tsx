"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Globe } from "lucide-react"
import Image from "next/image"

interface Location {
  icon?: string
  title: string
  subtitle: string
  imageUrl?: string
}

interface Action {
  text: string
  icon?: string
  link: string
}

interface CTASectionProps {
  data?: {
    title?: string
    description?: string
    content?: {
      intro?: string
      actions?: Action[]
      locations?: Location[]
      gifUrl?: string
    }
  }
}

export default function CTASection({ data }: CTASectionProps) {
  // Default values if data is undefined
  const title = data?.title || "ÉPILOGUE : VOTRE HISTOIRE"
  const description = data?.description || "Prêt à Écrire Votre Légende ?"
  const intro = data?.content?.intro || "Chaque grande transformation commence par une conversation. Commençons la vôtre."
  const actions = data?.content?.actions || [
    { text: "Commencer", icon: "arrow-right", link: "/contact" },
    { text: "Planifier un appel", icon: "phone", link: "/contact" }
  ]
  const locations = data?.content?.locations || [
    { title: "Casablanca", subtitle: "Siège Social", icon: "globe" },
    { title: "Maroc", subtitle: "Pays", icon: "globe" }
  ]
  const gifUrl = data?.content?.gifUrl || undefined

  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-gray-300 mb-8">{description}</p>
          <p className="text-lg text-gray-400">{intro}</p>
        </div>

        {/* GIF Section (replaces iframe) */}
        {gifUrl && (
          <div className="flex justify-center mb-16">
            <Image
              src={gifUrl}
              alt="CTA Animation"
              width={400}
              height={250}
              className="rounded-xl shadow-lg object-contain"
              unoptimized // for GIFs
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          {actions.map((action, index) => (
          <Button
              key={index}
            variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              asChild
            >
              <a href={action.link}>
                {action.text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
          </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <div className="w-16 h-16 bg-black/40 rounded-xl flex items-center justify-center">
                {location.imageUrl ? (
                  <Image
                    src={location.imageUrl}
                    alt={location.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <Globe className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{location.title}</h3>
                <p className="text-gray-400">{location.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 