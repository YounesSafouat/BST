"use client";

import React, { useState, useEffect } from 'react';
import { getRegionFromCountry } from '@/lib/geolocation';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';

export default function TestGeolocationPage() {
     const [testimonials, setTestimonials] = useState<any[]>([]);
     const { data: locationData, loading, region: userRegion } = useGeolocationSingleton();

     useEffect(() => {
          if (userRegion) {
               fetchTestimonials();
          }
     }, [userRegion]);

     const fetchTestimonials = async () => {
          try {
               const response = await fetch(`/api/testimonials?region=${userRegion}`);
               if (response.ok) {
                    const data = await response.json();
                    setTestimonials(data);
               }
          } catch (error) {
               console.error('Error fetching testimonials:', error);
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-main)] mx-auto"></div>
                         <p className="mt-4 text-gray-600">Détection de votre localisation...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-50 py-12">
               <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                         Test de Géolocalisation et Filtrage Régional
                    </h1>

                    {/* Location Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                         <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Informations de Localisation</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <p className="text-sm text-gray-600">Région détectée:</p>
                                   <p className="text-lg font-medium text-[var(--color-main)]">
                                        {userRegion === 'france' ? '🇫🇷 France' :
                                             userRegion === 'morocco' ? '🇲🇦 Maroc' :
                                                  userRegion === 'international' ? '🌍 International' : userRegion}
                                   </p>
                              </div>
                              {locationData && (
                                   <div>
                                        <p className="text-sm text-gray-600">Pays:</p>
                                        <p className="text-lg font-medium">{locationData.country}</p>
                                        <p className="text-sm text-gray-600">Code pays:</p>
                                        <p className="text-sm font-medium">{locationData.countryCode}</p>
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Testimonials for Current Region */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-semibold text-gray-900 mb-4">
                              💬 Témoignages disponibles pour votre région
                         </h2>
                         {testimonials.length === 0 ? (
                              <div className="text-center py-8">
                                   <p className="text-gray-500">Aucun témoignage disponible pour votre région ({userRegion})</p>
                                   <p className="text-sm text-gray-400 mt-2">
                                        Cela peut signifier que les témoignages ne sont pas encore configurés ou qu'aucun ne cible votre région.
                                   </p>
                              </div>
                         ) : (
                              <div className="space-y-4">
                                   <p className="text-sm text-gray-600 mb-4">
                                        {testimonials.length} témoignage(s) trouvé(s) pour la région: {userRegion}
                                   </p>
                                   {testimonials.map((testimonial, index) => (
                                        <div key={testimonial._id || index} className="border border-gray-200 rounded-lg p-4">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex-1">
                                                       <p className="font-medium text-gray-900">{testimonial.author}</p>
                                                       <p className="text-sm text-gray-600">{testimonial.role}</p>
                                                       <p className="text-gray-700 mt-2 italic">"{testimonial.text}"</p>
                                                  </div>
                                                  <div className="ml-4">
                                                       <div className="flex flex-wrap gap-1">
                                                            {testimonial.targetRegions?.map((region: string) => (
                                                                 <span
                                                                      key={region}
                                                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                                 >
                                                                      {region === 'all' ? '🌍 Toutes' :
                                                                           region === 'france' ? '🇫🇷 France' :
                                                                                region === 'morocco' ? '🇲🇦 Maroc' :
                                                                                     region === 'international' ? '🌍 International' : region}
                                                                 </span>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 rounded-lg p-6 mt-8">
                         <h3 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ Comment ça fonctionne</h3>
                         <ul className="text-blue-800 space-y-2 text-sm">
                              <li>• <strong>Géolocalisation automatique:</strong> Votre région est détectée automatiquement via votre adresse IP</li>
                              <li>• <strong>Filtrage intelligent:</strong> Seuls les témoignages ciblant votre région (ou "toutes les régions") sont affichés</li>
                              <li>• <strong>Configuration CMS:</strong> Les administrateurs peuvent configurer le ciblage régional pour chaque témoignage</li>
                              <li>• <strong>Sections cachées:</strong> Si aucun contenu n'est disponible pour votre région, les sections correspondantes sont masquées</li>
                         </ul>
                    </div>

                    {/* Test Different Regions */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Tester différentes régions</h3>
                         <p className="text-sm text-gray-600 mb-4">
                              La région est détectée automatiquement. Pour tester différentes régions, utilisez un VPN ou changez votre localisation.
                         </p>
                         <div className="flex flex-wrap gap-2">
                              {['france', 'morocco', 'international'].map((region) => (
                                   <div
                                        key={region}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${userRegion === region
                                             ? 'bg-[var(--color-main)] text-white'
                                             : 'bg-gray-100 text-gray-700'
                                             }`}
                                   >
                                        {region === 'france' ? '🇫🇷 France' :
                                             region === 'morocco' ? '🇲🇦 Maroc' : '🌍 International'}
                                        {userRegion === region && ' (Actuel)'}
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}


