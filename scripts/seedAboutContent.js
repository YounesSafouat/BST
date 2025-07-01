const mongoose = require('mongoose');
let Content;

async function seedAboutContent() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
  await mongoose.connect(MONGODB_URI);

  // Fix for ES module/CommonJS interop
  Content = require('../models/Content');
  if (Content.default) Content = Content.default;

  // Remove existing about content
  await Content.deleteMany({ type: 'about' });

  // Create about page content
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
          {
            title: '6 années d\'excellence',
            description: 'Depuis 2019',
            icon: 'Clock'
          },
          {
            title: '100% passion marocaine',
            description: 'Expertise locale',
            icon: 'Heart'
          },
          {
            title: 'Innovation continue',
            description: 'Technologies de pointe',
            icon: 'Rocket'
          }
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
          {
            title: 'Excellence',
            description: 'Nous visons l\'excellence dans chaque projet, chaque ligne de code, chaque interaction client.',
            icon: 'Star'
          },
          {
            title: 'Innovation',
            description: 'Nous repoussons constamment les limites de la technologie pour créer des solutions innovantes.',
            icon: 'Lightbulb'
          },
          {
            title: 'Collaboration',
            description: 'Nous croyons en la puissance du travail d\'équipe et de la collaboration avec nos clients.',
            icon: 'Users'
          },
          {
            title: 'Intégrité',
            description: 'Nous agissons avec honnêteté, transparence et éthique dans toutes nos relations.',
            icon: 'Shield'
          },
          {
            title: 'Passion',
            description: 'Notre passion pour la technologie et l\'innovation nous pousse à toujours faire mieux.',
            icon: 'Heart'
          },
          {
            title: 'Impact',
            description: 'Nous créons un impact positif sur les entreprises et la société marocaine.',
            icon: 'Globe'
          }
        ]
      },
      mission: {
        title: 'Transformer le Maroc Digital',
        subtitle: 'NOTRE MISSION',
        description: 'Notre mission est d\'accompagner les entreprises marocaines dans leur transformation digitale en leur offrant des solutions innovantes, sur mesure et performantes.',
        cta: {
          text: 'Découvrir Notre Mission',
          url: '/contact'
        }
      }
    },
    isActive: true,
    metadata: { order: 1 }
  });

  console.log('✅ About content seeded successfully!');
  process.exit(0);
}

seedAboutContent().catch(console.error); 