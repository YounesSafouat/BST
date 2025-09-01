"use client";

import { useEffect, useState } from 'react';

interface StructuredData {
     businessName: string;
     alternateNames: string[];
     description: string;
     foundingDate: string;
     websiteUrl: string;
     logo: string;
     businessImage: string;
     address: {
          streetAddress: string;
          addressLocality: string;
          addressRegion: string;
          postalCode: string;
          addressCountry: string;
     };
     geo: {
          latitude: number;
          longitude: number;
     };
     telephone: string;
     email: string;
     businessHours: {
          [key: string]: {
               isOpen: boolean;
               opens: string;
               closes: string;
          };
     };
     contactPoints: Array<{
          telephone: string;
          contactType: string;
          areaServed: string;
          availableLanguage: string[];
          hoursAvailable: {
               dayOfWeek: string[];
               opens: string;
               closes: string;
          };
     }>;
     socialMedia: {
          linkedin: string;
          facebook: string;
          twitter: string;
          instagram: string;
     };
     serviceAreas: Array<{
          type: string;
          name: string;
     }>;
     services: Array<{
          name: string;
          description: string;
          category: string;
     }>;
     priceRange: string;
     paymentAccepted: string[];
     currenciesAccepted: string[];
     knowsAbout: string[];
     schemaType: string;
     pageConfigurations: {
          [key: string]: {
               enabled: boolean;
               schemaType: string;
          };
     };
     googleBusinessProfile: {
          verificationCode: string;
          isVerified: boolean;
          businessCategory: string;
          attributes: string[];
     };
}

export default function GoogleBusinessProfile() {
     const [structuredData, setStructuredData] = useState<StructuredData | null>(null);

     useEffect(() => {
          // Fetch structured data from database
          const fetchStructuredData = async () => {
               try {
                    const response = await fetch('/api/structured-data');
                    if (response.ok) {
                         const data = await response.json();
                         setStructuredData(data);
                    }
               } catch (error) {
                    console.error('Error fetching structured data:', error);
               }
          };

          fetchStructuredData();
     }, []);

     useEffect(() => {
          if (!structuredData) return;

          // Add Google Business Profile verification meta tag if verification code exists
          if (structuredData.googleBusinessProfile.verificationCode) {
               const meta = document.createElement('meta');
               meta.name = 'google-site-verification';
               meta.content = structuredData.googleBusinessProfile.verificationCode;
               document.head.appendChild(meta);

               return () => {
                    // Cleanup
                    if (document.head.contains(meta)) {
                         document.head.removeChild(meta);
                    }
               };
          }
     }, [structuredData]);

     // This component doesn't render anything visible
     return null;
}
