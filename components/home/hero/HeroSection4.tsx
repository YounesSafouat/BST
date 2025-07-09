import { useState, useEffect } from "react"
import { 
  Calendar, 
  Play, 
  ArrowRight, 
  Zap, 
  Workflow, 
  TrendingUp, 
  Users2, 
  Settings, 
  BarChart3, 
  CheckCircle, 
  ArrowUpRight, 
  Database 
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection4() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFlow, setActiveFlow] = useState(0)

  const dataFlows = [
    { from: "Commandes", to: "Contacts", delay: 0 },
    { from: "Clients", to: "Deals", delay: 1000 },
    { from: "Produits", to: "Marketing", delay: 2000 },
    { from: "Factures", to: "Analytics", delay: 3000 }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % dataFlows.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-white overflow-hidden mt-10">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(113,75,103,0.05)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,122,89,0.05)_0%,transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-screen py-20">
          
          {/* Left Column - Content */}
          <div className={`lg:col-span-6 space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Intégrations en temps réel</span>
              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">LIVE</div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[0.95] tracking-tight">
                Connectez
                <span className="block mt-2">
                  <span style={{ color: 'var(--color-secondary)' }}>Odoo</span>
                  <span className="text-gray-400 mx-4">×</span>
                  <span style={{ color: 'var(--color-main)' }}>HubSpot</span>
                </span>
                <span className="block text-gray-600 text-4xl lg:text-5xl xl:text-6xl mt-4">
                  sans effort
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed font-light">
                Synchronisation bidirectionnelle, automatisation intelligente et reporting unifié. 
                Transformez vos données en avantage concurrentiel.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, text: "Sync temps réel", color: "text-yellow-600" },
                { icon: Workflow, text: "Automatisation", color: "text-blue-600" },
                { icon: TrendingUp, text: "ROI mesurable", color: "text-green-600" },
                { icon: Users2, text: "Support expert", color: "text-purple-600" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl transition-all duration-500 delay-${index * 100} hover:bg-white hover:shadow-sm ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="group w-[18em] bg-[var(--color-main)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-black)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                  style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                >
                  Planifier une démo
                  <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  className="group w-[18em] bg-transparent text-[var(--color-main)] border-2 border-[var(--color-main)] px-4 py-2 rounded-lg hover:bg-[var(--color-main)] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                  style={{ fontFamily: 'var(--font-family), Inter, sans-serif' }}
                >
                  Voir les cas d'usage
                  <ArrowRight className="ml-5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Entreprises connectées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime garanti</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">&lt;5min</div>
                  <div className="text-sm text-gray-600">Temps de sync</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Integration Visual */}
          <div className={`lg:col-span-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative max-w-lg mx-auto">
              
              {/* Main Integration Dashboard */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Dashboard Header */}
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 ml-2">Integration Hub</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Integration Flow */}
                <div className="p-8 space-y-8">
                  
                  {/* Odoo Section */}
                  <div className="relative">
                    <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 bg-gradient-to-r from-purple-50/50 to-white hover:shadow-md transition-all duration-300">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
                        <Settings className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">Odoo ERP</div>
                        <div className="text-sm text-gray-600">Gestion d'entreprise complète</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Données</div>
                        <div className="font-bold text-gray-900">2.4k</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Flow Animation */}
                  <div className="relative flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full"></div>
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 animate-ping opacity-30"></div>
                        </div>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full"></div>
                      </div>
                      <div className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        {dataFlows[activeFlow].from} → {dataFlows[activeFlow].to}
                      </div>
                    </div>
                  </div>

                  {/* HubSpot Section */}
                  <div className="relative">
                    <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 bg-gradient-to-r from-orange-50/50 to-white hover:shadow-md transition-all duration-300">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-main)' }}>
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">HubSpot CRM</div>
                        <div className="text-sm text-gray-600">Marketing & Ventes</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Contacts</div>
                        <div className="font-bold text-gray-900">1.8k</div>
                      </div>
                    </div>
                  </div>

                  {/* Sync Status */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-emerald-900">Synchronisation active</div>
                        <div className="text-sm text-emerald-700">Dernière sync: il y a 30 secondes</div>
                      </div>
                      <div className="text-emerald-600">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Efficacité</div>
                    <div className="font-bold text-gray-900">+340%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Données sync</div>
                    <div className="font-bold text-gray-900">4.2k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}