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

export default function EnhancedStructuredData() {
     const [pageType, setPageType] = useState<string>('home');
     const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          // Détecter le type de page actuelle
          const path = window.location.pathname;
          if (path.includes('/blog/')) {
               setPageType('blog-post');
          } else if (path.includes('/blog')) {
               setPageType('blog');
          } else if (path.includes('/hubspot')) {
               setPageType('hubspot-service');
          } else if (path.includes('/odoo')) {
               setPageType('odoo-service');
          } else if (path.includes('/contact')) {
               setPageType('contact');
          } else if (path.includes('/about')) {
               setPageType('about');
          } else {
               setPageType('home');
          }
     }, []);

     useEffect(() => {
          // Fetch structured data from database
          const fetchStructuredData = async () => {
               try {
                    setLoading(true);
                    const response = await fetch('/api/structured-data');
                    if (response.ok) {
                         const data = await response.json();
                         setStructuredData(data);
                    }
               } catch (error) {
                    console.error('Error fetching structured data:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchStructuredData();
     }, []);

     const generateStructuredData = () => {
          if (!structuredData || loading) {
               // Return default data while loading or if no data
               return {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "BlackSwan Technology",
                    "url": "https://agence-blackswan.com",
                    "description": "Partenaire Officiel Odoo et Platinum HubSpot au Maroc"
               };
          }

          // Convert business hours to schema format
          const openingHoursSpecification = Object.entries(structuredData.businessHours)
               .filter(([_, hours]) => hours.isOpen)
               .map(([day, hours]) => ({
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
                    "opens": hours.opens,
                    "closes": hours.closes
               }));

          // Convert contact points to schema format
          const contactPoints = structuredData.contactPoints.map(cp => ({
               "@type": "ContactPoint",
               "telephone": cp.telephone,
               "contactType": cp.contactType,
               "areaServed": cp.areaServed,
               "availableLanguage": cp.availableLanguage,
               "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": cp.hoursAvailable.dayOfWeek,
                    "opens": cp.hoursAvailable.opens,
                    "closes": cp.hoursAvailable.closes
               }
          }));

          // Convert social media to sameAs format
          const sameAs = Object.values(structuredData.socialMedia)
               .filter(url => url && url.trim() !== '');

          // Convert service areas to schema format
          const areaServed = structuredData.serviceAreas.map(area => ({
               "@type": area.type,
               "name": area.name
          }));

          // Convert services to offer catalog
          const hasOfferCatalog = {
               "@type": "OfferCatalog",
               "name": "Services de transformation digitale",
               "itemListElement": structuredData.services.map(service => ({
                    "@type": "Offer",
                    "itemOffered": {
                         "@type": "Service",
                         "name": service.name,
                         "description": service.description
                    }
               }))
          };

          // Base LocalBusiness data
          const localBusinessData = {
               "@context": "https://schema.org",
               "@type": "LocalBusiness",
               "name": structuredData.businessName,
               "alternateName": structuredData.alternateNames,
               "url": structuredData.websiteUrl,
               "logo": structuredData.logo,
               "image": structuredData.businessImage || structuredData.logo,
               "description": structuredData.description,
               "foundingDate": structuredData.foundingDate,
               "address": {
                    "@type": "PostalAddress",
                    "streetAddress": structuredData.address.streetAddress,
                    "addressLocality": structuredData.address.addressLocality,
                    "addressRegion": structuredData.address.addressRegion,
                    "postalCode": structuredData.address.postalCode,
                    "addressCountry": structuredData.address.addressCountry
               },
               "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": structuredData.geo.latitude,
                    "longitude": structuredData.geo.longitude
               },
               "telephone": structuredData.telephone,
               "email": structuredData.email,
               "openingHours": openingHoursSpecification.map(hours =>
                    `${hours.dayOfWeek.slice(0, 2)} ${hours.opens}-${hours.closes}`
               ),
               "openingHoursSpecification": openingHoursSpecification,
               "contactPoint": contactPoints,
               "sameAs": sameAs,
               "serviceArea": {
                    "@type": "Country",
                    "name": "Morocco"
               },
               "areaServed": areaServed,
               "hasOfferCatalog": hasOfferCatalog,
               "priceRange": structuredData.priceRange,
               "paymentAccepted": structuredData.paymentAccepted,
               "currenciesAccepted": structuredData.currenciesAccepted,
               "knowsAbout": structuredData.knowsAbout
          };

          // Base Organization data
          const organizationData = {
               "@context": "https://schema.org",
               "@type": "Organization",
               "name": structuredData.businessName,
               "alternateName": structuredData.alternateNames,
               "url": structuredData.websiteUrl,
               "logo": structuredData.logo,
               "image": structuredData.businessImage || structuredData.logo,
               "description": structuredData.description,
               "foundingDate": structuredData.foundingDate,
               "foundingLocation": {
                    "@type": "Place",
                    "address": {
                         "@type": "PostalAddress",
                         "addressCountry": structuredData.address.addressCountry,
                         "addressLocality": structuredData.address.addressLocality,
                         "addressRegion": structuredData.address.addressRegion
                    }
               },
               "address": {
                    "@type": "PostalAddress",
                    "streetAddress": structuredData.address.streetAddress,
                    "addressLocality": structuredData.address.addressLocality,
                    "addressRegion": structuredData.address.addressRegion,
                    "postalCode": structuredData.address.postalCode,
                    "addressCountry": structuredData.address.addressCountry
               },
               "contactPoint": contactPoints,
               "sameAs": sameAs,
               "serviceArea": {
                    "@type": "Country",
                    "name": "Morocco"
               },
               "areaServed": areaServed,
               "hasOfferCatalog": hasOfferCatalog
          };

          // Check if page configuration is enabled and get schema type
          const pageConfig = structuredData.pageConfigurations[pageType];
          if (!pageConfig || !pageConfig.enabled) {
               return organizationData;
          }

          // Return specific schema type based on page configuration
          if (pageConfig.schemaType === 'LocalBusiness') {
               return localBusinessData;
          } else if (pageConfig.schemaType === 'Service') {
               return {
                    ...localBusinessData,
                    "@type": "Service",
                    "provider": localBusinessData,
                    "serviceType": pageType === 'hubspot-service' ? "HubSpot CRM Integration" : "Odoo ERP Implementation",
                    "areaServed": {
                         "@type": "Country",
                         "name": "Morocco"
                    },
                    "hasOfferCatalog": {
                         "@type": "OfferCatalog",
                         "name": pageType === 'hubspot-service' ? "Services HubSpot" : "Services Odoo",
                         "itemListElement": [
                              {
                                   "@type": "Offer",
                                   "itemOffered": {
                                        "@type": "Service",
                                        "name": pageType === 'hubspot-service' ? "Implémentation HubSpot" : "Implémentation Odoo",
                                        "description": pageType === 'hubspot-service'
                                             ? "Implémentation complète de HubSpot CRM pour votre entreprise"
                                             : "Implémentation complète de Odoo ERP pour votre entreprise"
                                   }
                              },
                              {
                                   "@type": "Offer",
                                   "itemOffered": {
                                        "@type": "Service",
                                        "name": pageType === 'hubspot-service' ? "Formation HubSpot" : "Formation Odoo",
                                        "description": pageType === 'hubspot-service'
                                             ? "Formation complète de vos équipes sur HubSpot"
                                             : "Formation complète de vos équipes sur Odoo"
                                   }
                              }
                         ]
                    }
               };
          } else {
               return organizationData;
          }
     };

     const structuredDataOutput = generateStructuredData();

     return (
          <script
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataOutput) }}
          />
     );
} 