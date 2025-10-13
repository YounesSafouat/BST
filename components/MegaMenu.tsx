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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side - Featured Cases */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h3>
                  <p className="text-gray-600">{data.description}</p>
                </div>
                
                {data.featuredCases.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Les cas clients seront ajoutés via le CMS</p>
                  </div>
                )}
              </div>

              {/* Right Side - Black CTA Card */}
              <div className="lg:col-span-1">
                <Card className="h-full bg-gray-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="mb-8">
                        <Image
                          src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/blackswantechnology%20white-3.svg"
                          alt="BlackSwan Technology"
                          width={140}
                          height={140}
                          className="mx-auto mb-6"
                        />
                      </div>
                      
                     
                      
                      <Button
                        asChild
                        className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Link href={data.ctaButton.href} className="flex items-center gap-2">
                          {data.ctaButton.text}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
