const mongoose = require('mongoose');
let Content;

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
  await mongoose.connect(MONGODB_URI);

  // ES module/CommonJS interop
  Content = require('../models/Content');
  if (Content.default) Content = Content.default;

  // Remove all blog-page content
  await Content.deleteMany({ type: 'blog-page' });

  await Content.create({
    type: 'blog-page',
    title: 'Blog',
    description: "Découvrez nos derniers articles, guides pratiques et études de cas sur Odoo ERP, HubSpot CRM et la transformation digitale.",
    content: {
      hero: {
        badge: "NOTRE BLOG",
        heading: "Insights & Expertise",
        headingGradient: ["#714b67", "#ff5c35"],
        subheading: "Découvrez nos derniers articles, guides pratiques et études de cas sur Odoo ERP, HubSpot CRM et la transformation digitale."
      },
      search: {
        placeholder: "Rechercher un article..."
      },
      featured: {
        label: "Article à la Une",
        seeAll: "Voir tous les articles"
      },
      categories: {
        label: "Catégories",
        items: [
          { name: "Tous" },
          { name: "Odoo ERP" },
          { name: "HubSpot CRM" },
          { name: "Transformation Digitale" },
          { name: "Études de Cas" },
          { name: "Tutoriels" }
        ]
      },
      popular: {
        label: "Articles Populaires"
      },
      newsletter: {
        label: "Newsletter",
        description: "Recevez nos derniers articles et conseils directement dans votre boîte mail.",
        placeholder: "Votre email",
        subscribe: "S'abonner"
      },
      filters: {
        sortBy: "Trier par:",
        options: ["Plus récents", "Plus populaires", "Plus lus"]
      },
      empty: {
        title: "Aucun article trouvé",
        description: "Essayez de modifier vos critères de recherche."
      },
      pagination: {
        previous: "Précédent",
        next: "Suivant"
      },
      cta: {
        heading: "Vous avez des questions sur nos solutions Odoo ou HubSpot ?",
        subheading: "Nos experts sont disponibles pour vous accompagner dans votre transformation digitale.",
        contact: "Contacter un Expert",
        services: "Voir nos Services"
      },
      post: {
        readTimeSuffix: "de lecture",
        authorLabel: "par",
        readButton: "Lire l'article",
        readShort: "Lire"
      },
      blogPosts: [
        {
          slug: "odoo-15-to-18-migration",
          title: "Comment migrer d'Odoo 15 vers Odoo 18 sans perdre vos données",
          excerpt: "Découvrez notre méthodologie éprouvée pour migrer votre ERP Odoo vers la dernière version tout en préservant l'intégrité de vos données.",
          category: "Odoo ERP",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Expert Odoo",
          date: "12 juin 2025",
          readTime: "8 min",
          featured: true,
          body: "<p>Tout le contenu HTML ou Markdown ici...</p>"
        },
        {
          slug: "hubspot-automation-tips",
          title: "5 automatisations HubSpot qui vont révolutionner votre marketing",
          excerpt: "Explorez les workflows d'automatisation les plus puissants de HubSpot pour optimiser vos campagnes marketing et augmenter vos conversions.",
          category: "HubSpot CRM",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Spécialiste Marketing",
          date: "5 juin 2025",
          readTime: "6 min",
          body: "<p>Contenu complet de l'article...</p>"
        },
        {
          slug: "odoo-hubspot-integration",
          title: "Intégration Odoo-HubSpot : le guide complet",
          excerpt: "Comment connecter votre ERP Odoo avec votre CRM HubSpot pour créer un écosystème digital parfaitement synchronisé.",
          category: "Transformation Digitale",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Architecte Solutions",
          date: "28 mai 2025",
          readTime: "12 min",
          body: "<p>Contenu complet de l'article...</p>"
        },
        {
          slug: "worqbox-case-study",
          title: "Comment Worqbox a optimisé sa logistique avec Odoo 18",
          excerpt: "Étude de cas détaillée sur la transformation digitale de Worqbox et les résultats obtenus après la migration vers Odoo 18.",
          category: "Études de Cas",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Chef de Projet",
          date: "20 mai 2025",
          readTime: "10 min",
          body: "<p>Contenu complet de l'article...</p>"
        },
        {
          slug: "hubspot-dashboard-kpis",
          title: "Les KPIs essentiels à suivre dans votre dashboard HubSpot",
          excerpt: "Guide pratique pour configurer un tableau de bord HubSpot efficace avec les indicateurs clés de performance qui comptent vraiment.",
          category: "HubSpot CRM",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Analyste CRM",
          date: "15 mai 2025",
          readTime: "7 min",
          body: "<p>Contenu complet de l'article...</p>"
        },
        {
          slug: "odoo-analytical-accounting",
          title: "Comment configurer la comptabilité analytique dans Odoo",
          excerpt: "Tutoriel pas à pas pour mettre en place une comptabilité analytique performante dans Odoo et optimiser votre reporting financier.",
          category: "Tutoriels",
          image: "/placeholder.svg?height=600&width=800",
          author: "Younes SAFOUAT",
          authorRole: "Consultante Odoo",
          date: "8 mai 2025",
          readTime: "9 min",
          body: "<p>Contenu complet de l'article...</p>"
        }
      ]
    },
    metadata: { order: 1 },
    isActive: true
  });

  console.log('Seeded blog page with all static text and blog posts!');
  process.exit();
}

main(); 