/**
 * AboutUs.tsx
 * 
 * Visually engaging About Us component with interactive storytelling.
 * Features dynamic animations, visual elements, and engaging interactions.
 * 
 * @author younes safouat
 * @version 9.0.0 - Visual Storytelling Edition
 * @since 2025
 */

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Users,
  Award,
  Crown,
  Target,
  Lightbulb,
  Rocket,
  Heart,
  TrendingUp,
  Zap,
  Star
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function AboutUs() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const router = useRouter()

  const handleContactClick = () => {
    router.push('/#contact')
  }

  const transformationSteps = [
    {
      icon: Lightbulb,
      title: "Analyse",
      description: "Nous identifions vos points de friction"
    },
    {
      icon: Rocket,
      title: "Implémentation", 
      description: "Déploiement progressif et sécurisé"
    },
    {
      icon: Users,
      title: "Formation",
      description: "Vos équipes maîtrisent leurs outils"
    },
    {
      icon: TrendingUp,
      title: "Résultats",
      description: "Transformation mesurable et durable"
    }
  ]

  const stats = [
    { number: "3+", label: "Années", detail: "D'expertise terrain", icon: Award },
    { number: "100+", label: "Clients", detail: "Entreprises transformées", icon: Users },
    { number: "50+", label: "Projets", detail: "Implémentations réussies", icon: Target },
    { number: "24h", label: "Réponse", detail: "Garantie de réactivité", icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Simple Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-white via-gray-50/30 to-white" />

      {/* Hero with Large Logo */}
      <section className="pt-8 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[800px]">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-[var(--color-main)] border-[var(--color-main)]">
                🏆 Partenaire Officiel Odoo & HubSpot Platinum
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Du <span className="text-[var(--color-main)]">Chaos</span>
                <br />
                à la <span className="text-[var(--color-secondary)]">Transformation</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                L'histoire de comment nous avons transformé notre propre entreprise 
                et pourquoi nous aidons maintenant les autres à faire de même.
              </p>
              
              <Button
                onClick={() => {
                  const nextSection = document.querySelector('#story');
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 text-lg font-semibold rounded-full group"
              >
                Découvrir Notre Histoire
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Right: Extra Large Logo taking full space */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-full min-h-[700px] flex items-center justify-center"
            >
              <div className="relative w-full h-full max-w-2xl max-h-2xl">
                <Image
                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST%20favIcone%20big.png"
                  alt="BlackSwan Technology Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section id="story" className="py-20 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment nous <span className="text-[var(--color-main)]">Transformons</span> votre Entreprise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus simple et éprouvé en 4 étapes
            </p>
          </motion.div>

          {/* Simple Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transformationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-[var(--color-main)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-[var(--color-main)]" />
                      </div>
                      <div className="w-8 h-8 bg-[var(--color-main)] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Les <span className="text-[var(--color-main)]">Chiffres</span> de Notre Impact
            </h2>
            <p className="text-lg text-gray-600">
              Chaque statistique raconte l'histoire d'une entreprise transformée
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", bounce: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setHoveredStat(index)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <Card className={`text-center p-8 transition-all duration-300 cursor-pointer ${
                    hoveredStat === index 
                      ? 'scale-110 shadow-2xl border-[var(--color-main)] bg-[var(--color-main)]/5' 
                      : 'hover:scale-105 hover:shadow-xl border-gray-200'
                  }`}>
                    <Icon className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
                      hoveredStat === index ? 'text-[var(--color-main)]' : 'text-gray-400'
                    }`} />
                    <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      hoveredStat === index ? 'text-[var(--color-main)]' : 'text-[var(--color-secondary)]'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                    
                    <AnimatePresence>
                      {hoveredStat === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-xs text-gray-600 mt-2"
                        >
                          {stat.detail}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Story Section */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
            >
            {/* Timeline Story Design */}
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <Image
                    src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/bst.png"
                    alt="BlackSwan Technology"
                    width={80}
                    height={80}
                    className="mx-auto mb-6"
                  />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Notre Histoire
                  </h2>
                  <p className="text-xl text-gray-600">
                    De l'entreprise en difficulté à votre partenaire de transformation
                  </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-12">
                    {/* Step 1: The Problem */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="relative flex items-center"
                    >
                      <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                      <div className="ml-16 md:ml-0 md:w-1/2 md:pr-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                          <div className="text-sm text-red-500 font-semibold mb-2">Le Chaos</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Nous étions à votre place</h3>
                          <p className="text-gray-600 leading-relaxed">
                            Dizaines de fichiers Excel, clients perdus par manque de suivi, 
                            nuits blanches à rattraper les erreurs. Nous vivions le chaos quotidien.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 2: The Realization */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="relative flex items-center md:flex-row-reverse"
                    >
                      <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                      <div className="ml-16 md:ml-0 md:w-1/2 md:pl-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                          <div className="text-sm text-yellow-600 font-semibold mb-2">Le Déclic</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Il doit y avoir une solution</h3>
                          <p className="text-gray-600 leading-relaxed">
                            Le jour où nous avons décidé que ça suffisait. Qu'il devait exister 
                            une meilleure façon de travailler, plus organisée, plus efficace.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 3: The Solution */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="relative flex items-center"
                    >
                      <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-[var(--color-main)] rounded-full border-4 border-white shadow-lg z-10"></div>
                      <div className="ml-16 md:ml-0 md:w-1/2 md:pr-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                          <div className="text-sm text-[var(--color-main)] font-semibold mb-2">La Transformation</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Odoo + HubSpot = Révolution</h3>
                          <p className="text-gray-600 leading-relaxed">
                            Nous avons découvert et implémenté les solutions qui ont transformé 
                            notre entreprise. Fini le chaos, place à l'efficacité.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Step 4: The Mission */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="relative flex items-center md:flex-row-reverse"
                    >
                      <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                      <div className="ml-16 md:ml-0 md:w-1/2 md:pl-8">
                        <div className="bg-[var(--color-main)] p-6 rounded-lg shadow-lg text-white">
                          <div className="text-sm text-white/80 font-semibold mb-2">Notre Mission</div>
                          <h3 className="text-xl font-bold mb-3">BlackSwan Technology</h3>
                          <p className="leading-relaxed">
                            Vous éviter de vivre ce qu'on a vécu. Vous faire gagner le temps qu'on a perdu. 
                            Transformer votre chaos en système organisé et efficace.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[var(--color-main)]">
              <p className="font-semibold text-[var(--color-secondary)] italic">
                "Notre mission ? Vous éviter de vivre ce que nous avons vécu, 
                et vous faire gagner le temps que nous avons perdu."
              </p>
            </div>
            
            <p>
              C'est exactement cette expérience qui fait notre force aujourd'hui. 
              <span className="font-bold text-[var(--color-main)]">Nos solutions ne sortent pas d'un manuel théorique</span>, 
              elles naissent de notre vécu.
            </p>
          </div>
        </div>
      </section>

      {/* Results Showcase */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Ce que nos clients obtiennent vraiment
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-[var(--color-main)] mb-2">-80%</div>
                <p className="text-gray-700 font-semibold">Temps administratif</p>
                <p className="text-sm text-gray-600 mt-2">Fini les heures perdues sur Excel</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-[var(--color-main)] mb-2">+150%</div>
                <p className="text-gray-700 font-semibold">Efficacité commerciale</p>
                <p className="text-sm text-gray-600 mt-2">Vos équipes vendent plus et mieux</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-[var(--color-main)] mb-2">+200%</div>
                <p className="text-gray-700 font-semibold">Visibilité business</p>
                <p className="text-sm text-gray-600 mt-2">Vous pilotez enfin à vue</p>
              </div>
            </div>

            {/* Simple CTA */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Prêt à transformer votre entreprise ?
              </h3>
              <p className="text-gray-600 mb-6">
                Parlons de votre situation en 30 minutes
              </p>
              
              <Button
                onClick={handleContactClick}
                size="lg"
                className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Demander un audit gratuit
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Gratuit • Sans engagement • Réponse rapide
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}