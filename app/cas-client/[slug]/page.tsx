import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Target,
  Award,
  Rocket,
  Quote,
  ExternalLink,
  Phone,
  RefreshCw,
  Shield,
  Gauge,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default async function ClientPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/content?type=clients-page`, { cache: "no-store" })
  const data = await res.json()
  const page = Array.isArray(data) ? data[0] : data
  const client = page?.content?.clientCases?.find((c: any) => c.slug === params.slug)

  if (!client) return notFound()

  // Helper for project stats icons
  const statIcons: Record<string, any> = {
    "Temps de migration": Clock,
    "Version cible": RefreshCw,
    "Utilisateurs migrés": Users,
    "ROI atteint": TrendingUp,
  }

  // Key metrics for results section (from DB if present)
  const keyMetrics = client.keyMetrics || []

  return (
    <>
      <div className="min-h-screen bg-white">
        <title>Cas Client {client.name} | Blackswantechnology</title>
        <section className="relative pt-48 md:pt-56 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <a href="/cas-client" className="hover:text-black transition-colors">
                Cas Client
              </a>
              <span>/</span>
              <span className="text-black">{client.name}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ff5c35]/10 border border-[#ff5c35]/20">
                  <div className="w-2 h-2 bg-[#ff5c35] rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-[#ff5c35] tracking-wide">{client.migration}</span>
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
                    <span className="text-[#ff5c35]">{client.name}</span>
                    <span className="block text-3xl md:text-4xl text-gray-600 font-normal mt-2">
                      {client.headline}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">{client.summary}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#ff5c35] text-white hover:bg-[#ff5c35]/90 px-8 py-4 rounded-xl group">
                    Voir les Résultats
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {client.website && (
                    <Button size="lg" variant="outline" className="border-2 border-gray-200 px-8 py-4 rounded-xl">
                      <ExternalLink className="mr-2 w-5 h-5" />
                      Visiter {client.name}
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#ff5c35] rounded-t-3xl"></div>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gray-50">
                    {client.logo ? (
                      <img
                        src={client.logo.startsWith('http') ? client.logo : `/logos/${client.logo}`}
                        alt={client.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-[#ff5c35] rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{client.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">{client.name}</h3>
                      <p className="text-gray-600">{client.headline}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                      <div>
                        <div className="text-sm text-gray-500">Secteur</div>
                        <div className="font-semibold text-black">{client.sector}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Taille</div>
                        <div className="font-semibold text-black">{client.size}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Migration</div>
                        <div className="font-semibold text-[#ff5c35]">{client.migration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Localisation</div>
                        <div className="font-semibold text-black">{client.location || "Casablanca"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Stats */}
                {client.floatingStats && (
                  <div className="absolute -bottom-6 -right-6 bg-black text-white p-6 rounded-2xl shadow-xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#ff5c35]">{client.floatingStats.value}</div>
                      <div className="text-sm text-gray-300">{client.floatingStats.label}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Project Stats */}
            {client.projectStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                {client.projectStats.map((stat: any, index: number) => {
                  const Icon = statIcons[stat.label] || CheckCircle
                  return (
                    <div
                      key={index}
                      className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-[#ff5c35]" />
                      </div>
                      <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Challenge Section */}
        {client.challenges && (
          <section className="py-20 px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-gray-200 mb-8 shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 tracking-wide">LES DÉFIS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Limitations d'<span className="text-gray-400">Odoo 15</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  L'ancienne version d'Odoo limitait la croissance de {client.name} avec des contraintes techniques et fonctionnelles majeures.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {client.challenges.map((challenge: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                      <Target className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">{challenge.title}</h3>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    <div className="text-red-600 font-semibold text-sm">{challenge.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Solution Section */}
        {client.solutions && (
          <section className="py-20 px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-[#ff5c35]/10 border border-[#ff5c35]/20 mb-8">
                  <div className="w-2 h-2 bg-[#ff5c35] rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-[#ff5c35] tracking-wide">LA SOLUTION</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Migration vers <span className="text-[#ff5c35]">Odoo 18</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Migration complète vers Odoo 18 avec nouvelles fonctionnalités et performances optimisées.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {client.solutions.map((solution: any, index: number) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#ff5c35]/30 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-xl flex items-center justify-center group-hover:bg-[#ff5c35] group-hover:scale-110 transition-all duration-300">
                        <RefreshCw className="w-6 h-6 text-[#ff5c35] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black mb-2">{solution.module}</h3>
                        <p className="text-gray-600 mb-4">{solution.description}</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-semibold text-sm">{solution.benefit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {keyMetrics.length > 0 && (
          <section className="py-20 px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-50 border border-green-200 mb-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 tracking-wide">RÉSULTATS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Impact <span className="text-green-600">Transformateur</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  La migration vers Odoo 18 a dépassé toutes les attentes de performance et d'efficacité.
                </p>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {keyMetrics.map((result: any, index: number) => {
                  const Icon = result.icon || Gauge
                  return (
                    <div
                      key={index}
                      className="text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-4xl font-bold text-green-600 mb-2">{result.metric}</div>
                      <div className="text-gray-600">{result.label}</div>
                    </div>
                  )
                })}
              </div>
              {/* Testimonial */}
              {client.testimonial && (
                <div className="bg-[#ff5c35] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <Quote className="w-12 h-12 text-white/60 mb-6" />
                    <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8">
                      {client.testimonial.quote}
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{client.testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{client.testimonial.author}</div>
                        <div className="text-white/80">{client.testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  )
} 