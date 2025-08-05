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
