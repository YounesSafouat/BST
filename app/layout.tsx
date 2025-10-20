/**
 * layout.tsx
 * 
 * Root layout component for the entire Next.js application. This is the main
 * wrapper that provides global context, providers, and structure for all pages.
 * It includes SEO metadata, performance monitoring, and global components.
 * 
 * WHERE IT'S USED:
 * - Automatically wraps ALL pages in the application
 * - Required by Next.js App Router architecture
 * - Cannot be bypassed or disabled
 * 
 * KEY FEATURES:
 * - Global SEO metadata and Open Graph tags
 * - Performance monitoring and analytics
 * - Theme provider for dark/light mode
 * - Loading animations and route transitions
 * - Structured data for search engines
 * - Google Business Profile integration
 * - Favicon and meta tag management
 * - Global CSS and font optimization
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js App Router with TypeScript
 * - Implements comprehensive SEO metadata
 * - Includes performance monitoring components
 * - Provides global context providers
 * - Handles font loading optimization
 * - Implements structured data for SEO
 * - Supports internationalization (French locale)
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/layout-wrapper'
import { LoaderProvider, LoaderRouteListener } from '@/components/LoaderProvider'
import EnhancedStructuredData from '@/components/enhanced-structured-data'
import GoogleBusinessProfile from '@/components/GoogleBusinessProfile'
import { ThemeProvider } from '@/components/theme-provider'
import FaviconProvider from '@/components/FaviconProvider'
import SnippetsInjector from '@/components/SnippetsInjector'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import Analytics from '@/components/analytics'

export const metadata: Metadata = {
  title: {
    default: 'Blackswan Technology - Partenaire Officiel Odoo & HubSpot au Maroc',
    template: '%s | Blackswan Technology'
  },
  description: 'Expert Odoo ERP et HubSpot CRM au Maroc. Implémentation, intégration et formation. Partenaire Platinum HubSpot et Partenaire Officiel Odoo. Solutions sur mesure pour entreprises marocaines.',
  keywords: [
    'agence blackswan maroc',
    'agence blackswan technology maroc',
    'agence digitale maroc',
    'agence odoo maroc',
    'agence hubspot maroc',
    'Odoo ERP Maroc',
    'HubSpot CRM Maroc',
    'Intégration Odoo',
    'Implémentation HubSpot',
    'Partenaire Odoo Maroc',
    'Partenaire HubSpot Maroc',
    'ERP Odoo Casablanca',
    'CRM HubSpot Casablanca',
    'Migration Odoo',
    'Formation HubSpot',
    'Consultant Odoo',
    'Expert HubSpot',
    'Développement Odoo',
    'Automatisation HubSpot',
    'Transformation digitale Maroc'
  ],
  authors: [{ name: 'Blackswan Technology' }],
  creator: 'Blackswan Technology',
  publisher: 'Blackswan Technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://agence-blackswan.com"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: 'Blackswan Technology - Expert Odoo ERP & HubSpot CRM au Maroc',
    description: 'Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Implémentation, intégration et formation sur mesure pour votre transformation digitale.',
    siteName: 'Blackswan Technology',
    images: [
      {
        url: 'https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/bst.png',
        width: 1200,
        height: 630,
        alt: 'Blackswan Technology - Expert Odoo & HubSpot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blackswan Technology - Expert Odoo ERP & HubSpot CRM',
    description: 'Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Solutions sur mesure pour votre transformation digitale.',
    images: ['https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/bst.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '-1nA_9mXSq4HQbclHCPYAHNjSdpGwbCjR-qbVQrstyQ',
    yandex: 'ad9c44fd82c550c8',
  },
  other: {
    'geo.region': 'MA',
    'geo.country': 'Morocco',
    'geo.placename': 'Casablanca',
    'ICBM': '33.5731, -7.5898',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Optimized font loading - only essential fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://144151551.fs1.hubspotusercontent-eu1.net" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href="/fonts/Neon.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Neon 80s';
              src: url('/fonts/Neon.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
        <EnhancedStructuredData />
        <GoogleBusinessProfile />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BlackSwan Tech" />
        <link rel="icon" href="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST-Favicon.webp" type="image/webp" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="geo.region" content="MA" />
        <meta name="geo.country" content="Morocco" />
        <meta name="geo.placename" content="Casablanca" />
        <meta name="ICBM" content="33.5731, -7.5898" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <!-- iClosed Lift Widget begin -->
    <script type="text/javascript" src="https://app.iclosed.io/assets/widget.js" data-cta-widget="jTns5HA-XDnN" async></script>
<!-- iClosed Lift Widget end -->
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <FaviconProvider />
        <ThemeProvider>
          <LoaderProvider>
            <LoaderRouteListener />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <SnippetsInjector />
            <PerformanceMonitor />
            <Analytics />
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
