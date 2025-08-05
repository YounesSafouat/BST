import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/layout-wrapper'
import { LoaderProvider, LoaderRouteListener } from '@/components/LoaderProvider'
import StructuredData from '@/components/structured-data'
import { ThemeProvider } from '@/components/theme-provider'
import FaviconProvider from '@/components/FaviconProvider'

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
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@100;300;400;700;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Source+Sans+Pro:wght@200;300;400;600;700;900&family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <StructuredData />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BlackSwan Tech" />
        <link rel="icon" href="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST-Favicon.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST-Favicon.webp" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <FaviconProvider />
        <ThemeProvider>
          <LoaderProvider>
            <LoaderRouteListener />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
