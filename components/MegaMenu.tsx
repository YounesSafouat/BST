/**
 * MegaMenu.tsx
 * 
 * Mega menu component for header navigation with client case showcase.
 * Shows featured client cases and call-to-action when hovering over navigation items.
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturedCase {
  id: string;
  name: string;
  slug: string;
  image: string;
  excerpt: string;
}

interface MegaMenuData {
  type: 'client-cases';
  title: string;
  description: string;
  featuredCases: FeaturedCase[];
  ctaButton: {
    text: string;
    href: string;
  };
}

interface MegaMenuProps {
  data: MegaMenuData;
  isVisible: boolean;
  onMouseLeave?: () => void;
}

export default function MegaMenu({ data, isVisible, onMouseLeave }: MegaMenuProps) {
  if (!isVisible || !data) {
    return null;
  }

  return (
    <div className="w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden mega-menu-content" onMouseLeave={onMouseLeave}>
          <div className="p-8">
            {/* Featured Cases */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h3>
              <p className="text-gray-600">{data.description}</p>
            </div>
            
            {data.featuredCases.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {data.featuredCases.map((clientCase) => (
                    <Card key={clientCase.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-lg overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/cas-client/${clientCase.slug}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={clientCase.image}
                              alt={clientCase.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                // Fallback to placeholder if image fails
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <h4 className="text-white font-bold text-xl mb-3">{clientCase.name}</h4>
                              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">{clientCase.excerpt}</p>
                            </div>
                            <div className="absolute top-4 right-4">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                                <ArrowRight className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* CTA Button - Voir tous nos projets */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <Button
                    asChild
                    className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Link href="/cas-client" className="flex items-center gap-2">
                      Voir tous nos projets
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Les cas clients seront ajoutés via le CMS</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
