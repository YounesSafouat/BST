import type { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('contact');
  return generateSEOMetadata(seoData, 'Contact - Black Swan Technology', 'Contactez Black Swan Technology pour discuter de votre projet de transformation digitale. Nos experts Odoo et HubSpot sont là pour vous accompagner.');
}

export default function ContactPage() {
  return <ContactPageClient />;
} 