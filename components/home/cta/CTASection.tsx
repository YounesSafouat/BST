"use client"

import { Button } from "@/components/ui/button"
import { ContentSection, CTAContent } from "@/app/types/content"
import { ArrowRight, Globe } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import AnimatedScrollArrow from "../AnimatedScrollArrow"

export default function CTASection({ cta }: { cta: ContentSection }) {
  const content = cta.content as CTAContent;
  const title = cta.title || "ÉPILOGUE : VOTRE HISTOIRE"
  const description = cta.description || "Prêt à Écrire Votre Légende ?"
  const intro = content.intro || "Chaque grande transformation commence par une conversation. Commençons la vôtre."
  const actions = content.actions || []
  const locations = content.locations || []
  const gifUrl = (cta.content as any).gifUrl || undefined; // Assuming gifUrl might exist in untyped content
  const router = useRouter()

  const handleContactClick = async (actionLabel: string) => {
    router.push('/contact')
  }

  return (
    <>
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
              onClick={() => handleContactClick(action.label)}
            >
              {action.label}
              <ArrowRight className="ml-2 w-5 h-5" />
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
                    <Globe className="w-8 h-8 text-white" />
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
      <AnimatedScrollArrow />
    </>
  )
} 