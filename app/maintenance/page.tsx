"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Settings, Clock } from 'lucide-react';
import MaintenanceRefreshButton from '@/components/maintenance-refresh-button';

export default function MaintenancePage() {
  useEffect(() => {
    // Ensure iClosed widget script is loaded
    if (typeof window !== 'undefined' && !(window as any).iclosedWidgetLoaded) {
      const script = document.createElement('script');
      script.src = 'https://app.iclosed.io/assets/widget.js';
      script.async = true;
      script.onload = () => {
        (window as any).iclosedWidgetLoaded = true;
      };
      document.body.appendChild(script);
    }
  }, []);
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
            <div className="mb-6 flex justify-center">
              <Image 
                src="/images/logo-white.svg" 
                alt="BST - Business Solutions & Technology" 
                width={200}
                height={128}
                className="h-32 w-auto object-contain"
                priority
                unoptimized
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
          
            {/* What's happening */}
         
            {/* Contact Form - iClosed Widget */}
            <script type="text/javascript" src="https://app.iclosed.io/assets/widget.js" data-cta-widget="jTns5HA-XDnN" async></script>
        <script type="text/javascript" src="https://app.iclosed.io/assets/widget.js" async></script> 
        <script type="text/javascript" src="https://app.iclosed.io/assets/widget.js" async></script> 
                         <div className="mt-6">
                <div className="iclosed-widget" data-url="https://app.iclosed.io/e/warrenblackswan/rendez-vous-avec-warren-blackswan" title="Rendez-vous avec Warren" style={{ width: '100%', minHeight: '500px' }}></div>
              </div>
          
          

         

          {/* Manual refresh button */}
          <MaintenanceRefreshButton />
        </div>
      </div>
    </div>
  );
} 