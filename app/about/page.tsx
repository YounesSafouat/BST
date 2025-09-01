/**
 * page.tsx (About Page)
 * 
 * About page that introduces Black Swan Technology, our story, values, and mission.
 * This page helps build trust and credibility with potential clients by showcasing
 * our expertise, team, and company culture.
 * 
 * WHERE IT'S USED:
 * - About page route (/about)
 * - Company information and team introduction
 * - Trust building and credibility establishment
 * 
 * KEY FEATURES:
 * - Dynamic SEO metadata generation
 * - Company story and mission presentation
 * - Team member profiles and expertise
 * - Company values and culture
 * - Page visibility tracking for analytics
 * - Contact form integration
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js App Router with dynamic metadata
 * - Implements SEO optimization with dynamic data
 * - Renders AboutPageClient component
 * - Includes PageVisibilityGuard for analytics
 * - Forces dynamic rendering for real-time content
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import type { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';
import PageVisibilityGuard from '@/components/PageVisibilityGuard';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('about');
  return generateSEOMetadata(seoData, 'À Propos - Black Swan Technology', 'Découvrez l\'histoire de Black Swan Technology, nos valeurs et notre mission d\'accompagner les entreprises dans leur transformation digitale.');
}

export default function AboutPage() {
  return (
    <PageVisibilityGuard pageName="about">
      <AboutPageClient />
    </PageVisibilityGuard>
  );
}
