import React from 'react';
import { Settings, Clock, Wrench } from 'lucide-react';
import MaintenanceRefreshButton from '@/components/maintenance-refresh-button';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-grey-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Static Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Logo/Brand */}
          <div className="mb-12">
            <div className="mb-6">
              <img 
                src="https://res.cloudinary.com/dwob2hfin/image/upload/v1762787688/bst-migration/vyrhkhe2kfx2hzifp9m3.png" 
                alt="BST - Business Solutions & Technology" 
                className="h-32 w-auto object-contain mx-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Nous digitalisons votre entreprise de A à Z
            </h1>
          </div>

          {/* Maintenance Status */}
          <div className="mb-12">
            <h2 className="text-6xl font-bold text-white mb-6">
              Site en Maintenance
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Nous effectuons actuellement des améliorations sur notre site pour vous offrir une meilleure expérience.
            </p>
            <div className="flex items-center justify-center gap-3 text-yellow-400 mb-8">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-medium">Nous serons de retour très bientôt</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* What's happening */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Que se passe-t-il ?
              </h3>
              <p className="text-gray-300 mb-6">
                Notre équipe technique travaille actuellement sur des améliorations importantes pour optimiser les performances et ajouter de nouvelles fonctionnalités.
              </p>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Amélioration des performances</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Nouvelles fonctionnalités</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Optimisation de la sécurité</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Besoin d'aide urgente ?
              </h3>
              <p className="text-gray-300 mb-6">
                Si vous avez besoin d'assistance immédiate, n'hésitez pas à nous contacter.
              </p>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    📧
                  </div>
                  <span className="font-medium">contact-ma@blackswantechnology.fr</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    📞
                  </div>
                  <span className="font-medium">+212 5 22 22 22 22</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white mb-2">Note pour les administrateurs</h4>
                <p className="text-blue-200">
                  Pour désactiver le mode maintenance, connectez-vous au dashboard et allez dans 
                  <span className="font-medium"> Paramètres → Général → Mode maintenance</span>
                </p>
              </div>
            </div>
          </div>

          {/* Manual refresh button */}
          <MaintenanceRefreshButton />
        </div>
      </div>
    </div>
  );
} 