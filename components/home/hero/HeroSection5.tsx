import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ArrowRight, Calendar, Play, Zap, Settings, BarChart3, CheckCircle } from "lucide-react"

export default function HeroSection5() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSync, setActiveSync] = useState(0)

  const syncSteps = [
    "Connexion établie",
    "Synchronisation des contacts",
    "Mise à jour des deals",
    "Données synchronisées"
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveSync((prev) => (prev + 1) % syncSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen bg-white flex items-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Intégration active</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connectez
                <br />
                <span style={{ color: '#714B67' }}>Odoo</span>
                <span className="text-gray-300 mx-3">+</span>
                <span style={{ color: '#FF7A59' }}>HubSpot</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                Synchronisation automatique de vos données. 
                Configuration en 5 minutes.
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="px-6 py-3 rounded-xl font-medium"
                style={{ backgroundColor: '#714B67' }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Démo gratuite
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-3 rounded-xl font-medium border-gray-200"
              >
                <Play className="w-4 h-4 mr-2" />
                Voir comment ça marche
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-500">Entreprises</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2min</div>
                <div className="text-sm text-gray-500">Sync temps</div>
              </div>
            </div>
          </div>

          {/* Right Column - Terminal */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm ml-2">Integration Console</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 space-y-4 font-mono text-sm">
                
                {/* Odoo Connection */}
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#714B67' }}>
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Odoo ERP</div>
                    <div className="text-gray-400 text-xs">Connected</div>
                  </div>
                  <div className="text-green-400">●</div>
                </div>

                {/* Sync Status */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>{syncSteps[activeSync]}</span>
                  </div>
                </div>

                {/* HubSpot Connection */}
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF7A59' }}>
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">HubSpot CRM</div>
                    <div className="text-gray-400 text-xs">Connected</div>
                  </div>
                  <div className="text-green-400">●</div>
                </div>

                {/* Success Message */}
                <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-xs">Sync completed successfully</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}