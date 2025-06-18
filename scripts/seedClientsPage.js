const mongoose = require('mongoose');
let Content;

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
  await mongoose.connect(MONGODB_URI);

  // ES module/CommonJS interop
  Content = require('../models/Content');
  if (Content.default) Content = Content.default;

  // Remove all clients-page content
  await Content.deleteMany({ type: 'clients-page' });

  await Content.create({
    type: 'clients-page',
    title: 'Cas Clients',
    description: "Découvrez nos études de cas clients et leurs réussites avec nos solutions digitales.",
    content: {
      hero: {
        badge: "CAS CLIENT",
        heading: "Histoires de Transformation",
        subheading: "Découvrez comment nos clients ont transformé leur entreprise grâce à Odoo, HubSpot et notre accompagnement sur-mesure."
      },
      search: {
        placeholder: "Rechercher un client ou un secteur..."
      },
      featured: {
        label: "Cas à la Une",
        seeAll: "Voir tous les cas clients"
      },
      categories: {
        label: "Secteurs",
        items: [
          { name: "Tous" },
          { name: "Technologie" },
          { name: "Manufacturing" },
          { name: "Services" },
          { name: "Retail" },
          { name: "Finance" },
          { name: "Logistique" }
        ]
      },
      popular: {
        label: "Cas Populaires"
      },
      filters: [
        {
          key: "sortBy",
          label: "Trier par",
          options: [
            { value: "recent", label: "Plus récents" },
            { value: "popular", label: "Plus populaires" },
            { value: "results", label: "Plus de résultats" }
          ]
        },
        {
          key: "sector",
          label: "Secteur",
          options: [
            { value: "all", label: "Tous" },
            { value: "tech", label: "Technologie" },
            { value: "manufacturing", label: "Manufacturing" },
            { value: "services", label: "Services" },
            { value: "retail", label: "Retail" },
            { value: "finance", label: "Finance" },
            { value: "logistique", label: "Logistique" }
          ]
        },
        {
          key: "solution",
          label: "Solution",
          options: [
            { value: "all", label: "Toutes" },
            { value: "hubspot", label: "HubSpot CRM" },
            { value: "odoo", label: "Odoo ERP" },
            { value: "other", label: "Autres" }
          ]
        }
      ],
      empty: {
        title: "Aucun cas client trouvé",
        description: "Essayez de modifier vos critères de recherche."
      },
      pagination: {
        previous: "Précédent",
        next: "Suivant"
      },
      cta: {
        heading: "Prêt à écrire votre propre histoire de transformation ?",
        subheading: "Contactez-nous pour démarrer votre projet digital avec nos experts.",
        contact: "Contacter un Expert",
        services: "Voir nos Services"
      },
      clientCases: [
        {
          slug: "worqbox-case-study",
          name: "Worqbox",
          headline: "Migration Réussie vers Odoo 18",
          summary: "Comment nous avons migré Worqbox d'Odoo 15 vers Odoo 18, modernisant leur infrastructure ERP et générant un ROI de 180% en moins de 6 mois.",
          sector: "Logistique",
          size: "50+ employés",
          migration: "Odoo 15 → 18",
          logo: "WQ",
          featured: true,
          projectStats: [
            { label: "Temps de migration", value: "3 mois" },
            { label: "Version cible", value: "Odoo 18" },
            { label: "Utilisateurs migrés", value: "45" },
            { label: "ROI atteint", value: "+180%" }
          ],
          challenges: [
            {
              title: "Odoo 15 obsolète",
              description: "Version ancienne avec limitations fonctionnelles et sécuritaires",
              impact: "Manque de nouvelles fonctionnalités et risques"
            },
            {
              title: "Performance dégradée",
              description: "Lenteurs système et bugs fréquents",
              impact: "Perte de productivité quotidienne"
            },
            {
              title: "Maintenance complexe",
              description: "Support limité et mises à jour impossibles",
              impact: "Coûts de maintenance élevés"
            }
          ],
          solutions: [
            {
              module: "Migration Odoo 18",
              description: "Mise à niveau complète avec nouvelles fonctionnalités",
              benefit: "Performance améliorée de 85%"
            },
            {
              module: "Interface modernisée",
              description: "Nouvelle UX/UI intuitive et responsive",
              benefit: "Adoption utilisateur facilitée"
            },
            {
              module: "Sécurité renforcée",
              description: "Derniers standards de sécurité et conformité",
              benefit: "Protection des données optimale"
            },
            {
              module: "Nouvelles fonctionnalités",
              description: "Accès aux dernières innovations Odoo 18",
              benefit: "Avantage concurrentiel maintenu"
            }
          ]
        }
        // Ajoutez d'autres cas clients ici si besoin
      ]
    },
    metadata: { order: 1 },
    isActive: true
  });

  console.log('Seeded clients page with all static text and client cases!');
  process.exit();
}

main(); 