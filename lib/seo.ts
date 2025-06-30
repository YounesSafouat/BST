import connectDB from './mongodb';
import SEO from '@/models/SEO';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  hreflang?: Array<{ language: string; url: string }>;
  structuredData?: any;
}

export async function getSEOData(page: string, language: string = 'fr'): Promise<SEOData | null> {
  try {
    await connectDB();
    
    const seoData = await SEO.findOne({ 
      page, 
      language, 
      isActive: true 
    });
    
    if (!seoData) {
      return null;
    }
    
    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      ogTitle: seoData.ogTitle,
      ogDescription: seoData.ogDescription,
      ogImage: seoData.ogImage,
      canonical: seoData.canonical,
      hreflang: seoData.hreflang,
      structuredData: seoData.structuredData
    };
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
}

export function generateMetadata(seoData: SEOData | null, defaultTitle?: string, defaultDescription?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blackswantechnology.com';
  
  return {
    title: seoData?.title || defaultTitle || 'Black Swan Technology',
    description: seoData?.description || defaultDescription || 'Experts en transformation digitale avec Odoo et HubSpot au Maroc',
    keywords: seoData?.keywords || 'Odoo, HubSpot, transformation digitale, ERP, CRM, Maroc',
    openGraph: {
      title: seoData?.ogTitle || seoData?.title || defaultTitle,
      description: seoData?.ogDescription || seoData?.description || defaultDescription,
      images: seoData?.ogImage ? [{ url: `${baseUrl}${seoData.ogImage}` }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.ogTitle || seoData?.title || defaultTitle,
      description: seoData?.ogDescription || seoData?.description || defaultDescription,
      images: seoData?.ogImage ? [`${baseUrl}${seoData.ogImage}`] : [],
    },
    alternates: {
      canonical: seoData?.canonical ? `${baseUrl}${seoData.canonical}` : baseUrl,
    },
  };
} 