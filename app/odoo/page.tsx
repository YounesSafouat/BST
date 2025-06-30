import type { Metadata } from 'next'
import OdooPageNew from "@/components/odoo/OdooPageNew";
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('odoo');
  return generateSEOMetadata(seoData, 'Odoo ERP au Maroc - Partenaire Officiel | Black Swan Technology', 'Expert Odoo ERP au Maroc. Implémentation, migration et développement Odoo. Partenaire Officiel avec 5+ ans d\'expérience.');
}

export default function OdooPage() {
  return <OdooPageNew />;
} 