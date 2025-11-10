"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Main Heading */}
            <div className="mb-6 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-secondary)] leading-tight">
                <span className="block">Oups</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">Cette Page</span>
                <span className="block">est Partie.</span>
              </h1>
            </div>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-md mx-auto lg:mx-0">
              Vous avez peut-être mal tapé l'adresse ou la page a peut-être été déplacée.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                asChild
                className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)]/10 px-6 sm:px-8 py-3 rounded-xl transition-all duration-200 group"
              >
                <Link href="/blog">
                  <Search className="w-5 h-5 mr-2" />
                  Parcourir le contenu
                </Link>
              </Button>
            </div>

            {/* Additional Help */}
            <div className="text-sm text-slate-500">
              <p>Besoin d'aide ? <Link href="/#contact" className="text-[var(--color-main)] hover:underline">Contactez notre équipe de support</Link></p>
            </div>
          </div>

          {/* Right Side - Visual Elements */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-xl lg:max-w-3xl xl:max-w-4xl">
              {/* Vector Illustration - Much Larger */}
              <div className="relative w-full h-96 sm:h-[28rem] lg:h-[36rem] xl:h-[40rem]">
                <Image
                  src="https://res.cloudinary.com/dwob2hfin/image/upload/v1762787690/bst-migration/yat6d4edc55mlvmym8v6.svg"
                  alt="404 Error Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* 404 Numbers - Positioned separately, not overlapping */}
              <div className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 z-20">
                <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[var(--color-secondary)] leading-none drop-shadow-lg">
                  404
                </div>
              </div>

              {/* Floating Animation Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-[var(--color-main)]/20 rounded-full animate-bounce"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-[var(--color-main)]/30 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-12 right-6 w-2 h-2 bg-[var(--color-main)]/40 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Footer with Logo */}
        <div className="mt-8 lg:mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Image
              src="https://res.cloudinary.com/dwob2hfin/image/upload/v1762787674/bst-migration/cpaezmhlolmxstzeamjp.png"
              alt="BlackSwan Technology"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
            <span className="hidden sm:inline">BlackSwan Technology - Solutions de Transformation Digitale</span>
            <span className="sm:hidden">BlackSwan Technology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
