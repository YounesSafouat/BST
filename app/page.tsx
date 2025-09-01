/**
 * page.tsx (Homepage)
 * 
 * Main homepage of the website. This is the landing page that introduces
 * Black Swan Technology's services and expertise in Odoo ERP and HubSpot CRM.
 * It serves as the primary entry point for visitors and potential clients.
 * 
 * WHERE IT'S USED:
 * - Main homepage route (/)
 * - First page visitors see when they visit the website
 * - Entry point for lead generation and conversions
 * 
 * KEY FEATURES:
 * - Dynamic SEO metadata generation
 * - Hero section with main value proposition
 * - Services overview and company benefits
 * - Contact form for lead generation
 * - Customer testimonials and case studies
 * - Company statistics and achievements
 * - Regional content adaptation
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js App Router with dynamic metadata
 * - Implements SEO optimization with dynamic data
 * - Renders HomePage component with all sections
 * - Forces dynamic rendering for real-time content
 * - Integrates with SEO library for metadata generation
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import dynamicImport from "next/dynamic";
import HomePage from '../components/home/HomePage';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('home');
  return generateSEOMetadata(
    seoData,
    'Black Swan Technology - Partenaires Officiels Odoo & HubSpot',
    'Transformez votre entreprise avec nos solutions Odoo ERP et HubSpot CRM. Experts en transformation digitale au Maroc.'
  );
}

export default HomePage;
