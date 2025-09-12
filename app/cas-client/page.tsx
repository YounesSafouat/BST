import type { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import CasClient from "../../cas-client-v2"
import PageVisibilityGuard from '@/components/PageVisibilityGuard';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('clients');
  return generateSEOMetadata(seoData, 'Cas Clients - Black Swan Technology | Études de Cas et Réussites', 'Découvrez nos études de cas clients et leurs réussites avec nos solutions Odoo et HubSpot. Témoignages et résultats concrets.');
}

export default function Page() {
  return (
    <PageVisibilityGuard pageName="casClient">
      <CasClient />
    </PageVisibilityGuard>
  );
}
