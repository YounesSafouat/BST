/**
 * page.tsx (Blog Page)
 * 
 * Blog page that displays articles, guides, and case studies about Odoo, HubSpot,
 * ERP, CRM, and digital transformation. This page serves as a knowledge hub
 * and helps with SEO by providing valuable content to visitors.
 * 
 * WHERE IT'S USED:
 * - Blog page route (/blog)
 * - Content marketing and knowledge sharing
 * - SEO optimization through valuable content
 * 
 * KEY FEATURES:
 * - Dynamic SEO metadata generation
 * - Blog post listing and categorization
 * - Search and filtering capabilities
 * - Related articles suggestions
 * - Page visibility tracking for analytics
 * - SEO-optimized content structure
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js App Router with dynamic metadata
 * - Implements SEO optimization with dynamic data
 * - Renders BlogPage component
 * - Includes PageVisibilityGuard for analytics
 * - Forces dynamic rendering for real-time content
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import type { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import BlogPage from "@/components/BlogPage";
import PageVisibilityGuard from '@/components/PageVisibilityGuard';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('blog');
  return generateSEOMetadata(seoData, 'Blog - Conseils Odoo, HubSpot & Transformation Digitale', 'Découvrez nos articles, guides et études de cas sur Odoo, HubSpot, ERP, CRM et la transformation digitale au Maroc.');
}

export default function Page() {
  return (
    <PageVisibilityGuard pageName="blog">
      <BlogPage />
    </PageVisibilityGuard>
  );
}
