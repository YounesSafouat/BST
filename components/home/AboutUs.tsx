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
  Star,
  Quote
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--color-main)]/5 to-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - HubSpot Style */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        
        {/* Enhanced Design Motifs Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large flowing shapes */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-[var(--color-main)]/15 via-[var(--color-main)]/10 to-[var(--color-secondary)]/5 rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute -bottom-20 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--color-secondary)]/20 via-[var(--color-main)]/15 to-[var(--color-secondary)]/10 rounded-full blur-2xl transform -rotate-45"></div>
          
          {/* Smaller accent shapes */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-[var(--color-main)]/30 to-[var(--color-secondary)]/20 rounded-full blur-xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-gradient-to-l from-[var(--color-secondary)]/25 to-[var(--color-main)]/15 rounded-full blur-xl transform -rotate-12"></div>
          
          {/* Organic flowing shapes */}
          <div className="absolute top-1/2 left-10 w-40 h-96 bg-gradient-to-b from-[var(--color-main)]/20 to-transparent rounded-full blur-2xl transform -rotate-12"></div>
          <div className="absolute top-20 right-20 w-32 h-80 bg-gradient-to-b from-[var(--color-secondary)]/15 to-transparent rounded-full blur-xl transform rotate-45"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* BST Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <Image
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST_favIcone_big-removebg-preview.png"
                alt="BlackSwan Technology"
                width={200}
                height={200}
                className="h-24 w-auto mx-auto mb-6"
                priority
              />
            </motion.div>
            
            {/* Partner Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-[var(--color-main)]/10 border border-[var(--color-main)]/20 text-[var(--color-main)] px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            >
              <Award className="w-3 h-3 text-[var(--color-main)]" />
              PARTENAIRE OFFICIEL ODOO & HUBSPOT PLATINUM
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Du{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main)]">
                Chaos
              </span>
              {" "}à la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]">
                Transformation
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              L'histoire de comment nous avons transformé notre propre entreprise 
              et pourquoi nous aidons maintenant les autres à faire de même.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12"
            >
              <Button
                onClick={() => {
                  const nextSection = document.querySelector('#story');
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] hover:from-[var(--color-secondary)] hover:to-[var(--color-main)] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg mx-auto group"
              >
                Découvrir Notre Histoire
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-main)] mb-1">100+</div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-main)] mb-1">3+</div>
                <div className="text-sm text-gray-600">Années</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-main)] mb-1">50+</div>
                <div className="text-sm text-gray-600">Projets</div>
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
      
       {/* Mission Statement - Enhanced Design */}
       <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
         
         {/* Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
           <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[var(--color-main)]/3 to-[var(--color-secondary)]/3 rounded-full blur-2xl"></div>
         </div>

         <div className="relative z-10 max-w-5xl mx-auto px-6">
           
           {/* Mission Quote Card */}
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="relative mb-16"
           >
             {/* Main Quote Card */}
             <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 overflow-hidden">
               
               {/* Decorative Elements */}
               <div className="absolute top-6 left-6 w-4 h-4 bg-[var(--color-main)]/20 rounded-full"></div>
               <div className="absolute top-8 right-8 w-6 h-6 bg-[var(--color-secondary)]/20 rounded-full"></div>
               <div className="absolute bottom-6 left-8 w-3 h-3 bg-[var(--color-main)]/30 rounded-full"></div>
               <div className="absolute bottom-8 right-6 w-5 h-5 bg-[var(--color-secondary)]/30 rounded-full"></div>
               
               {/* Quote Icon */}
               <div className="absolute top-8 left-8">
                 <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                   <Quote className="w-6 h-6 text-white" />
                 </div>
               </div>
               
               {/* Quote Text */}
               <div className="ml-16">
                 <blockquote className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
                   Notre mission ?{" "}
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)]">
                     Vous éviter de vivre ce que nous avons vécu
                   </span>
                   , et vous faire gagner le temps que nous avons perdu.
                 </blockquote>
                 
                 {/* Author */}
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                     <span className="text-white font-bold text-lg">W</span>
                   </div>
                   <div>
                     <div className="font-semibold text-gray-900">Warren</div>
                     <div className="text-sm text-gray-600">CEO</div>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>

           {/* Supporting Text */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             viewport={{ once: true }}
             className="text-center"
           >
             <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
               <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
                 C'est exactement cette expérience qui fait notre force aujourd'hui.{" "}
                 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)]">
                   Nos solutions ne sortent pas d'un manuel théorique
                 </span>
                 , elles naissent de notre vécu.
               </p>
             </div>
           </motion.div>

           {/* Visual Elements */}
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             viewport={{ once: true }}
             className="flex justify-center mt-12"
           >
             <div className="flex items-center gap-8">
               <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-main)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                 <Lightbulb className="w-8 h-8 text-white" />
               </div>
               <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-main)] to-[var(--color-secondary)] rounded-full"></div>
               <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-main)] rounded-full flex items-center justify-center">
                 <Rocket className="w-8 h-8 text-white" />
               </div>
             </div>
           </motion.div>
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