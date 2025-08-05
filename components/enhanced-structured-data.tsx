"use client";

import { useEffect, useState } from 'react';

export default function EnhancedStructuredData() {
     const [pageType, setPageType] = useState<string>('home');

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

     const generateStructuredData = () => {
          const baseData = {
               "@context": "https://schema.org",
               "@type": "Organization",
               "name": "BlackSwan Technology",
               "alternateName": "BlackSwan Tech",
                               "url": "https://agence-blackswan.com",
               "logo": "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST%20black.svg",
               "description": "Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Experts en transformation digitale, implémentation et intégration ERP/CRM.",
               "foundingDate": "2022",
               "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "MA",
                    "addressLocality": "Casablanca",
                    "addressRegion": "Casablanca-Settat"
               },
               "contactPoint": [
                    {
                         "@type": "ContactPoint",
                         "telephone": "+212-522-XXX-XXX",
                         "contactType": "customer service",
                         "areaServed": "MA",
                         "availableLanguage": ["French", "Arabic", "English"]
                    }
               ],
               "sameAs": [
                    "https://www.linkedin.com/company/blackswan-technology",
                    "https://www.facebook.com/blackswantech",
                    "https://twitter.com/blackswantech"
               ],
               "serviceArea": {
                    "@type": "Country",
                    "name": "Morocco"
               },
               "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Services de transformation digitale",
                    "itemListElement": [
                         {
                              "@type": "Offer",
                              "itemOffered": {
                                   "@type": "Service",
                                   "name": "Implémentation Odoo ERP",
                                   "description": "Implémentation complète de solutions Odoo ERP pour entreprises marocaines"
                              }
                         },
                         {
                              "@type": "Offer",
                              "itemOffered": {
                                   "@type": "Service",
                                   "name": "Intégration HubSpot CRM",
                                   "description": "Intégration et optimisation HubSpot CRM pour maximiser vos ventes"
                              }
                         }
                    ]
               }
          };

          // Ajouter des données spécifiques selon le type de page
          if (pageType === 'hubspot-service' || pageType === 'odoo-service') {
               return {
                    ...baseData,
                    "@type": "Service",
                    "provider": baseData,
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
          }

          if (pageType === 'contact') {
               return {
                    ...baseData,
                    "contactPoint": [
                         {
                              "@type": "ContactPoint",
                              "telephone": "+212-522-XXX-XXX",
                              "contactType": "customer service",
                              "areaServed": "MA",
                              "availableLanguage": ["French", "Arabic", "English"],
                              "hoursAvailable": {
                                   "@type": "OpeningHoursSpecification",
                                   "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                                   "opens": "09:00",
                                   "closes": "18:00"
                              }
                         }
                    ]
               };
          }

          return baseData;
     };

     const structuredData = generateStructuredData();

     return (
          <script
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
     );
} 