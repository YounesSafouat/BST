import { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import dynamic from "next/dynamic";
const AcceuilPage = dynamic(() => import("./components/acceuil-page"), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('home');
  return generateSEOMetadata(
    seoData,
    'Black Swan Technology - Partenaires Officiels Odoo & HubSpot',
    'Transformez votre entreprise avec nos solutions Odoo ERP et HubSpot CRM. Experts en transformation digitale au Maroc.'
  );
}

export default function Page() {
  return <AcceuilPage />;
}
