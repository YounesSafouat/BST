/**
 * page.tsx (Thank You Page)
 * 
 * Thank you page that displays after successful form submission or action completion.
 * This page confirms user actions and provides next steps or additional information.
 * 
 * WHERE IT'S USED:
 * - Thank you page route (/merci)
 * - Redirect destination after form submissions
 * - Confirmation page for completed actions
 * 
 * KEY FEATURES:
 * - Success confirmation message
 * - Next steps guidance
 * - Call-to-action buttons
 * - Contact information
 * - Social proof elements
 * 
 * TECHNICAL DETAILS:
 * - Uses Next.js App Router with dynamic metadata
 * - Implements SEO optimization
 * - Renders ThankYouPage component
 * - Forces dynamic rendering for real-time content
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import { Metadata } from 'next';
import { getSEOData, generateMetadata as generateSEOMetadata } from '@/lib/seo';
import dynamicImport from "next/dynamic";
import { ThankYouPageLight } from '@/components/ThankYouPage';
import { ThankYouPageDark } from '@/components/ThankYouPage';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData('thank-you');
  return generateSEOMetadata(
    seoData,
    'Merci - BlackSwan Technology',
    'Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais.'
  );
}

export default ThankYouPageLight;
