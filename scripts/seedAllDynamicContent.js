const mongoose = require('mongoose');
let Content;

async function seedAllDynamicContent() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
  await mongoose.connect(MONGODB_URI);

  // Fix for ES module/CommonJS interop
  Content = require('../models/Content');
  if (Content.default) Content = Content.default;

  console.log('🚀 Starting to seed all dynamic content...');

  // Remove all existing content
  await Content.deleteMany({});
  console.log('✅ Cleared existing content');

  // 1. Header Content
  await Content.create({
    type: 'header',
    title: 'Header Navigation',
    description: 'Header navigation and dropdown menus',
    content: {
      logo: {
        image: "/bst.png",
        alt: "Black Swan Technology"
      },
      navigation: {
        main: [
          { label: "Accueil", url: "/", icon: "Home", isActive: true },
          { label: "À Propos", url: "/about", icon: "Users", isActive: true },
          { label: "Services", url: "/services", icon: "Briefcase", isActive: true },
          { label: "Cas Clients", url: "/cas-client", icon: "Building", isActive: true },
          { label: "Blog", url: "/blog", icon: "FileText", isActive: true },
          { label: "Contact", url: "/contact", icon: "Phone", isActive: true }
        ],
        hubspot: {
          title: "Solutions HubSpot",
          subtitle: "Plateforme CRM et Marketing Complète",
          badge: "★ Partenaire Platinum",
          crmItems: [
            { icon: "TrendingUp", title: "Sales Hub", description: "Automatisation des ventes" },
            { icon: "Mail", title: "Marketing Hub", description: "Email marketing avancé" },
            { icon: "HeadphonesIcon", title: "Service Hub", description: "Support client professionnel" }
          ],
          serviceItems: [
            { icon: "Target", title: "Audit HubSpot", description: "Évaluation complète" },
            { icon: "Rocket", title: "Implémentation", description: "Configuration sur mesure" },
            { icon: "GraduationCap", title: "Formation", description: "Équipes certifiées" }
          ],
          isActive: true
        },
        odoo: {
          title: "Solutions Odoo",
          subtitle: "ERP Complet et Modulaire",
          badge: "★ Partenaire Officiel",
          modules: [
            { icon: "Building", title: "CRM", description: "Gestion de la relation client" },
            { icon: "ShoppingCart", title: "Ventes", description: "Gestion des ventes" },
            { icon: "Database", title: "Inventaire", description: "Gestion des stocks" }
          ],
          services: [
            { icon: "Target", title: "Audit Odoo", description: "Évaluation complète" },
            { icon: "Rocket", title: "Implémentation", description: "Configuration sur mesure" },
            { icon: "GraduationCap", title: "Formation", description: "Équipes certifiées" }
          ],
          isActive: true
        }
      },
      contact: {
        phone: "+212 6 12 34 56 78",
        email: "contact@blackswantechnology.ma",
        address: "Casablanca, Maroc"
      },
      cta: {
        text: "Prendre RDV",
        url: "/contact",
        isActive: true
      }
    },
    isActive: true,
    metadata: { order: 1 }
  });
  console.log('✅ Header content seeded');

  // 2. Footer Content
  await Content.create({
    type: 'footer',
    title: 'Footer',
    description: 'Pied de page du site',
    content: {
      newsletter: {
        title: 'Restez à la pointe de l\'innovation',
        description: 'Recevez nos dernières actualités, études de cas et conseils d\'experts directement dans votre boîte mail.',
        placeholder: 'Votre email professionnel',
        buttonText: 'S\'inscrire',
        disclaimer: 'En vous inscrivant, vous acceptez notre politique de confidentialité.'
      },
      companyInfo: {
        logo: {
          image: '/bst.png',
          alt: 'Blackswantechnology'
        },
        description: 'Nous transformons les entreprises marocaines grâce à des solutions digitales innovantes et sur mesure.',
        contact: {
          address: {
            icon: 'MapPin',
            text: 'Twin Center, Casablanca, Maroc'
          },
          phone: {
            icon: 'Phone',
            text: '+212 6 XX XX XX XX'
          },
          email: {
            icon: 'Mail',
            text: 'contact@blackswantechnology.ma'
          }
        }
      },
      quickLinks: {
        title: 'Liens Rapides',
        links: [
          { text: 'Accueil', url: '/' },
          { text: 'Services', url: '/services' },
          { text: 'À Propos', url: '/about' },
          { text: 'Témoignages', url: '/testimonials' },
          { text: 'Blog', url: '/blog' },
          { text: 'Carrières', url: '/careers' },
          { text: 'Contact', url: '/contact' }
        ]
      },
      services: {
        title: 'Nos Services',
        links: [
          { text: 'HubSpot CRM', url: '/hubspot' },
          { text: 'Odoo ERP', url: '/odoo' },
          { text: 'Intégration API', url: '/api-integration' },
          { text: 'Développement Web', url: '/web-development' },
          { text: 'Marketing Digital', url: '/digital-marketing' },
          { text: 'Formation & Support', url: '/training' },
          { text: 'Audit Digital', url: '/audit' }
        ]
      },
      social: {
        title: 'Suivez-nous',
        networks: [
          { name: 'Facebook', icon: 'Facebook', url: '#', color: 'bg-blue-600' },
          { name: 'Twitter', icon: 'Twitter', url: '#', color: 'bg-sky-500' },
          { name: 'LinkedIn', icon: 'Linkedin', url: '#', color: 'bg-blue-700' },
          { name: 'Instagram', icon: 'Instagram', url: '#', color: 'bg-pink-600' }
        ]
      },
      certifications: {
        title: 'Certifications',
        badges: ['HubSpot Platinum', 'Odoo Partner', 'ISO 27001', 'GDPR Compliant']
      },
      legal: {
        copyright: '© 2025 Blackswantechnology. Tous droits réservés.',
        links: [
          { text: 'Politique de confidentialité', url: '/privacy' },
          { text: 'Conditions d\'utilisation', url: '/terms' },
          { text: 'Mentions légales', url: '/legal' }
        ]
      }
    },
    isActive: true,
    metadata: { order: 99 }
  });
  console.log('✅ Footer content seeded');

  // 3. About Content
  await Content.create({
    type: 'about',
    title: 'À Propos de Black Swan Technology',
    description: 'Découvrez notre équipe, nos valeurs et notre mission',
    content: {
      hero: {
        title: 'Nous Sommes',
        subtitle: 'Les Visionnaires',
        description: 'qui transforment le Maroc digital',
        stats: [
          { title: '6 années d\'excellence', description: 'Depuis 2019', icon: 'Clock' },
          { title: '100% passion marocaine', description: 'Expertise locale', icon: 'Heart' },
          { title: 'Innovation continue', description: 'Technologies de pointe', icon: 'Rocket' }
        ]
      },
      team: {
        title: 'L\'Humain au Cœur',
        subtitle: 'NOTRE ÉQUIPE',
        description: 'Derrière chaque ligne de code, chaque intégration réussie, il y a des passionnés qui croient en la puissance transformatrice de la technologie.',
        members: [
          {
            name: 'Ahmed Mansouri',
            role: 'CEO & Fondateur',
            description: 'Visionnaire de la transformation digitale au Maroc',
            avatar: 'AM',
            icon: 'Crown'
          },
          {
            name: 'Salma Benali',
            role: 'CTO',
            description: 'Experte en architecture technique et innovation',
            avatar: 'SB',
            icon: 'Code'
          },
          {
            name: 'Youssef Kadiri',
            role: 'Directeur Commercial',
            description: 'Spécialiste en solutions CRM et ERP',
            avatar: 'YK',
            icon: 'Target'
          },
          {
            name: 'Fatima Zahra',
            role: 'Lead Developer',
            description: 'Passionnée de développement et d\'intégration',
            avatar: 'FZ',
            icon: 'Zap'
          }
        ]
      },
      values: {
        title: 'Nos Valeurs Fondamentales',
        subtitle: 'NOS PRINCIPES',
        description: 'Des principes qui guident chacune de nos actions et décisions.',
        items: [
          { title: 'Excellence', description: 'Nous visons l\'excellence dans chaque projet, chaque ligne de code, chaque interaction client.', icon: 'Star' },
          { title: 'Innovation', description: 'Nous repoussons constamment les limites de la technologie pour créer des solutions innovantes.', icon: 'Lightbulb' },
          { title: 'Collaboration', description: 'Nous croyons en la puissance du travail d\'équipe et de la collaboration avec nos clients.', icon: 'Users' },
          { title: 'Intégrité', description: 'Nous agissons avec honnêteté, transparence et éthique dans toutes nos relations.', icon: 'Shield' },
          { title: 'Passion', description: 'Notre passion pour la technologie et l\'innovation nous pousse à toujours faire mieux.', icon: 'Heart' },
          { title: 'Impact', description: 'Nous créons un impact positif sur les entreprises et la société marocaine.', icon: 'Globe' }
        ]
      },
      mission: {
        title: 'Transformer le Maroc Digital',
        subtitle: 'NOTRE MISSION',
        description: 'Notre mission est d\'accompagner les entreprises marocaines dans leur transformation digitale en leur offrant des solutions innovantes, sur mesure et performantes.',
        cta: { text: 'Découvrir Notre Mission', url: '/contact' }
      }
    },
    isActive: true,
    metadata: { order: 1 }
  });
  console.log('✅ About content seeded');

  // 4. Contact Content
  await Content.create({
    type: 'contact',
    title: 'Contactez-nous',
    description: 'Nous sommes là pour vous aider à transformer votre entreprise',
    content: {
      hero: {
        title: 'Contactez-nous',
        subtitle: 'Nous sommes là pour vous aider à transformer votre entreprise avec nos solutions digitales sur mesure.',
        description: 'Découvrez comment nous pouvons vous accompagner dans votre transformation digitale.'
      },
      projectTypes: {
        integration: {
          header: 'Intégration Odoo-HubSpot',
          text: "Optimisez vos processus métier grâce à une intégration complète entre Odoo et HubSpot. Nos experts vous accompagnent pour connecter vos outils et automatiser vos flux de travail."
        },
        migration: {
          header: 'Migration ERP',
          text: "Migrez vos données et processus vers un nouvel ERP en toute sécurité. Nous assurons une transition fluide et sans perte d'information."
        },
        consulting: {
          header: 'Conseil Digital',
          text: "Bénéficiez de notre expertise pour accélérer votre transformation digitale et améliorer vos performances."
        },
        formation: {
          header: 'Formation',
          text: "Formez vos équipes aux outils digitaux pour garantir l'adoption et la réussite de vos projets."
        },
        autre: {
          header: 'Autre projet',
          text: "Décrivez-nous votre projet, nous vous proposerons une solution sur-mesure adaptée à vos besoins."
        }
      },
      form: {
        title: 'Envoyez-nous un message',
        subtitle: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.',
        fields: {
          firstName: { label: 'Prénom', placeholder: 'Votre prénom', required: true },
          lastName: { label: 'Nom', placeholder: 'Votre nom', required: true },
          email: { label: 'Email', placeholder: 'votre@email.com', required: true },
          phone: { label: 'Téléphone', placeholder: '+212 6 12 34 56 78', required: false },
          company: { label: 'Entreprise', placeholder: 'Nom de votre entreprise', required: false },
          subject: { label: 'Sujet', placeholder: 'Objet de votre message', required: true },
          message: { label: 'Message', placeholder: 'Décrivez votre projet, vos besoins ou posez-nous vos questions...', required: true }
        },
        submitButton: { text: 'Envoyer le message', loadingText: 'Envoi en cours...' },
        successMessage: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
        errorMessage: 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer ou nous contacter directement.'
      },
      trust: {
        title: 'Ils nous font confiance',
        subtitle: 'Des entreprises de renom nous font confiance pour leur transformation digitale',
        companies: [
          { name: 'Microsoft', logo: '/logos/microsoft.svg' },
          { name: 'Google', logo: '/logos/google.svg' },
          { name: 'Odoo', logo: '/odoo.png' },
          { name: 'HubSpot', logo: '/logos/hubspot.svg' }
        ]
      },
      contact: {
        title: 'Informations de contact',
        subtitle: 'N\'hésitez pas à nous contacter directement',
        info: [
          { icon: 'Phone', title: 'Téléphone', value: '+212 6 12 34 56 78', url: 'tel:+212612345678' },
          { icon: 'Mail', title: 'Email', value: 'contact@blackswantechnology.ma', url: 'mailto:contact@blackswantechnology.ma' },
          { icon: 'MapPin', title: 'Adresse', value: 'Twin Center, Casablanca, Maroc', url: 'https://maps.google.com/?q=Twin+Center+Casablanca' }
        ]
      }
    },
    isActive: true,
    metadata: { order: 1 }
  });
  console.log('✅ Contact content seeded');

  // 5. Blog Page Content
  await Content.create({
    type: 'blog-page',
    title: 'Blog',
    description: 'Articles et actualités sur la transformation digitale',
    content: {
      hero: {
        title: 'Découvrez Nos Articles',
        subtitle: 'Guides pratiques, études de cas et insights sur Odoo ERP, HubSpot CRM et la transformation digitale.',
        description: 'Restez informé des dernières tendances et bonnes pratiques'
      },
      categories: {
        title: 'Catégories',
        items: [
          { name: 'HubSpot', color: '#ff5c35', count: 12 },
          { name: 'Odoo', color: '#714b67', count: 8 },
          { name: 'Transformation Digitale', color: '#000000', count: 15 },
          { name: 'CRM', color: '#3b82f6', count: 6 },
          { name: 'ERP', color: '#10b981', count: 4 },
          { name: 'Conseils', color: '#f59e0b', count: 10 }
        ]
      },
      blogPosts: [
        {
          title: 'Comment optimiser votre pipeline de vente avec HubSpot',
          excerpt: 'Découvrez les meilleures pratiques pour optimiser votre pipeline de vente et augmenter vos conversions avec HubSpot CRM.',
          content: 'Contenu complet de l\'article...',
          author: 'Ahmed Mansouri',
          authorRole: 'CEO & Fondateur',
          date: '2025-01-15',
          category: 'HubSpot',
          featured: true,
          image: '/blog/hubspot-pipeline.jpg',
          slug: 'optimiser-pipeline-vente-hubspot'
        },
        {
          title: 'Migration ERP : Guide complet pour une transition réussie',
          excerpt: 'Tout ce que vous devez savoir pour migrer vers un nouvel ERP en toute sécurité et sans interruption de service.',
          content: 'Contenu complet de l\'article...',
          author: 'Salma Benali',
          authorRole: 'CTO',
          date: '2025-01-10',
          category: 'ERP',
          featured: false,
          image: '/blog/erp-migration.jpg',
          slug: 'migration-erp-guide-complet'
        },
        {
          title: 'Les 5 étapes clés de la transformation digitale',
          excerpt: 'Un guide étape par étape pour réussir votre transformation digitale et moderniser vos processus métier.',
          content: 'Contenu complet de l\'article...',
          author: 'Youssef Kadiri',
          authorRole: 'Directeur Commercial',
          date: '2025-01-05',
          category: 'Transformation Digitale',
          featured: false,
          image: '/blog/digital-transformation.jpg',
          slug: '5-etapes-transformation-digitale'
        }
      ]
    },
    isActive: true,
    metadata: { order: 1 }
  });
  console.log('✅ Blog page content seeded');

  console.log('🎉 All dynamic content has been seeded successfully!');
  console.log('📊 Content types created:');
  console.log('   - Header navigation and dropdowns');
  console.log('   - Footer with newsletter and links');
  console.log('   - About page with team and values');
  console.log('   - Contact page with form and project types');
  console.log('   - Blog page with categories and posts');
  
  process.exit(0);
}

 