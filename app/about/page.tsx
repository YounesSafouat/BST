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
