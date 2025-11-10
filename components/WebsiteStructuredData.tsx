"use client";

import { useEffect, useState } from 'react';

interface StructuredData {
  businessName: string;
  websiteUrl: string;
}

export default function WebsiteStructuredData() {
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStructuredData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/structured-data');
        if (response.ok) {
          const data = await response.json();
          setStructuredData({
            businessName: data.businessName || 'Blackswan Technology',
            websiteUrl: data.websiteUrl || 'https://agence-blackswan.com'
          });
        }
      } catch (error) {
        console.error('Error fetching structured data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStructuredData();
  }, []);

  if (loading || !structuredData) {
    return null;
  }

  const baseUrl = structuredData.websiteUrl || 'https://agence-blackswan.com';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": structuredData.businessName,
    "url": baseUrl,
    "description": "Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Expert en transformation digitale et implémentation ERP/CRM.",
    "publisher": {
      "@type": "Organization",
      "name": structuredData.businessName,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/bst.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "url": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Cas clients",
          "url": `${baseUrl}/cas-client`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Rendez-vous",
          "url": `${baseUrl}/rendez-vous`
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cas clients",
        "item": `${baseUrl}/cas-client`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Rendez-vous",
        "item": `${baseUrl}/rendez-vous`
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": structuredData.businessName,
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/bst.png`,
      "width": 512,
      "height": 512
    },
    "description": "Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Expert en transformation digitale et implémentation ERP/CRM.",
    "sameAs": [
      "https://www.linkedin.com/company/blackswan-technology"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "MA",
      "availableLanguage": ["French", "English", "Arabic"]
    },
    "knowsAbout": ["Odoo ERP", "HubSpot CRM", "Digital Transformation", "ERP Implementation", "CRM Integration"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MA",
      "addressLocality": "Casablanca"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}

