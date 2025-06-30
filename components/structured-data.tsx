export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Blackswan Technology",
    "url": "https://blackswantechnology.ma",
    "logo": "https://blackswantechnology.ma/bst.png",
    "description": "Expert Odoo ERP et HubSpot CRM au Maroc. Partenaire Officiel Odoo et Platinum HubSpot avec 5+ ans d'expérience.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Casablanca",
      "addressCountry": "MA",
      "addressRegion": "Casablanca-Settat"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-6-XX-XX-XX-XX",
      "contactType": "customer service",
      "email": "contact@blackswantechnology.ma"
    },
    "sameAs": [
      "https://www.linkedin.com/company/blackswantechnology",
      "https://www.facebook.com/blackswantechnology",
      "https://twitter.com/blackswantech"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Odoo et HubSpot",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Implémentation Odoo ERP",
            "description": "Implémentation complète d'Odoo ERP pour entreprises marocaines"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Implémentation HubSpot CRM",
            "description": "Implémentation HubSpot CRM avec formation et support"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Migration Odoo",
            "description": "Migration sécurisée vers Odoo avec préservation des données"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Formation HubSpot",
            "description": "Formation certifiée HubSpot pour équipes commerciales et marketing"
          }
        }
      ]
    },
    "award": [
      "Partenaire Officiel Odoo",
      "Partenaire Platinum HubSpot",
      "ISO 27001",
      "GDPR Compliant"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Maroc"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Casablanca, Maroc"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 