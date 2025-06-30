import React from 'react';
import HubSpotPageClient from './HubSpotPageClient';
import type { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('hubspot');
  return generateSEOMetadata(seoData, 'HubSpot CRM au Maroc - Partenaire Platinum | Black Swan Technology', 'Expert HubSpot CRM au Maroc. Implémentation, formation et support HubSpot. Partenaire Platinum avec 5+ ans d\'expérience.');
}

export default function HubSpotPage() {
  return <HubSpotPageClient />
} 