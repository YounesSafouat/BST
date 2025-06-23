import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/layout-wrapper'

export const metadata: Metadata = {
  title: 'Blackswan Technology',
  description: 'Partenaire Officiel Odoo & HubSpot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
