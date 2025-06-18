import mongoose from 'mongoose';
import Content from '../models/Content';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';

async function seedHomeContent() {
  await mongoose.connect(MONGODB_URI);

  // Remove existing home content
  await Content.deleteMany({ type: { $in: [
    'hero', 'challenge', 'solution', 'transformation', 'success', 'cta'] } });

  // Insert hero section
  await Content.create({
    type: 'hero',
    title: 'PARTENAIRES OFFICIELS ODOO & HUBSPOT',
    description: 'Solutions Digitales\nSur Mesure',
    content: {
      subtitle: `Nous implémentons <span class="text-[#714b67] font-semibold">Odoo ERP</span> ou <span class="text-[#ff5c35] font-semibold">HubSpot CRM</span> selon vos besoins spécifiques.<br/><span class="block mt-2 text-lg text-gray-500">Analyse personnalisée • Solutions adaptées • Accompagnement complet</span>`
    },
    isActive: true,
    metadata: { order: 1 }
  });

  // Insert challenge section
  await Content.create({
    type: 'challenge',
    title: 'CHAPITRE 2 : LE DÉFI',
    description: 'Le Chaos Organisé',
    content: {
      intro: "Avant la transformation, il y a toujours le chaos. Voici les défis que nous résolvons quotidiennement.",
      challenges: [
        {
          icon: 'AlertTriangle',
          title: 'Données Fragmentées',
          description: 'Informations éparpillées dans des systèmes isolés, créant des silos organisationnels.',
          impact: '-40% Efficacité',
        },
        {
          icon: 'TrendingUp',
          title: 'Opportunités Perdues',
          description: 'Leads non qualifiés, processus manuels, et décisions basées sur des intuitions.',
          impact: '-60% Conversions',
        },
        {
          icon: 'Users',
          title: 'Équipes Déconnectées',
          description: 'Collaboration limitée, workflows inefficaces, et perte de temps considérable.',
          impact: '+3h Perdues/Jour',
        },
      ]
    },
    isActive: true,
    metadata: { order: 2 }
  });

  // Insert solution section
  await Content.create({
    type: 'solution',
    title: 'CHAPITRE 3 : LA SOLUTION',
    description: "L'Art de l'Intégration",
    content: {
      intro: "Nous transformons le chaos en symphonie grâce à une approche méthodique et des outils de classe mondiale.",
      solutions: [
        {
          icon: 'Settings',
          title: 'HubSpot',
          subtitle: 'Le Cerveau Commercial',
          description: 'CRM intelligent, automatisation marketing, et analytics prédictifs pour une croissance mesurable.',
          color: '#ff5c35',
          features: ['CRM Avancé', 'Marketing Automation', 'Sales Pipeline'],
        },
        {
          icon: 'BarChart3',
          title: 'Odoo',
          subtitle: "L'Épine Dorsale",
          description: 'ERP complet unifiant tous vos processus métier dans une plateforme cohérente et évolutive.',
          color: '#714b67',
          features: ['ERP Modulaire', 'Gestion Intégrée', 'Workflows Personnalisés'],
        },
        {
          icon: 'Zap',
          title: 'Intégration',
          subtitle: 'La Magie Opère',
          description: 'Synchronisation parfaite créant un écosystème digital où chaque donnée trouve sa place.',
          color: '#000000',
          features: ['Sync Temps Réel', 'API Natives', 'Données Unifiées'],
        },
      ]
    },
    isActive: true,
    metadata: { order: 3 }
  });

  // Insert transformation section
  await Content.create({
    type: 'transformation',
    title: 'CHAPITRE 4 : TRANSFORMATION',
    description: 'Notre Méthodologie',
    content: {
      intro: "Un processus éprouvé en 4 étapes pour garantir le succès de votre transformation digitale.",
      steps: [
        {
          step: '01',
          title: 'Audit & Stratégie',
          description: "Analyse approfondie de votre écosystème actuel et définition d'une roadmap personnalisée.",
          icon: 'Target',
          side: 'left',
        },
        {
          step: '02',
          title: 'Architecture & Design',
          description: "Conception de l'architecture technique et des workflows optimisés pour vos besoins spécifiques.",
          icon: 'Lightbulb',
          side: 'right',
        },
        {
          step: '03',
          title: 'Implémentation',
          description: 'Déploiement méthodique avec formation continue et accompagnement de vos équipes.',
          icon: 'Settings',
          side: 'left',
        },
        {
          step: '04',
          title: 'Optimisation',
          description: 'Monitoring continu, ajustements et évolutions pour maximiser votre retour sur investissement.',
          icon: 'Rocket',
          side: 'right',
        },
      ]
    },
    isActive: true,
    metadata: { order: 4 }
  });

  // Insert success section
  await Content.create({
    type: 'success',
    title: 'CHAPITRE 5 : SUCCÈS',
    description: 'Histoires de Réussite',
    content: {
      intro: 'Chaque transformation raconte une histoire unique. Voici quelques-unes de nos plus belles réussites.',
      testimonials: [
        {
          name: 'Ahmed Mansouri',
          role: 'CEO, TechCorp',
          quote: 'Notre transformation digitale a révolutionné notre approche commerciale. Résultats exceptionnels.',
          result: '+900% Leads',
          avatar: 'AM',
        },
        {
          name: 'Salma Benali',
          role: 'Directrice, InnovateMA',
          quote: "L'intégration Odoo a unifié tous nos processus. Une efficacité opérationnelle remarquable.",
          result: '-70% Temps Gestion',
          avatar: 'SB',
        },
        {
          name: 'Youssef Kadiri',
          role: 'CTO, GlobalTrade',
          quote: "Accompagnement exceptionnel et résultats au-delà de nos espérances. Partenaire de confiance.",
          result: '+150% ROI',
          avatar: 'YK',
        },
      ]
    },
    isActive: true,
    metadata: { order: 5 }
  });

  // Insert CTA section
  await Content.create({
    type: 'cta',
    title: "ÉPILOGUE : VOTRE HISTOIRE",
    description: 'Prêt à Écrire Votre Légende ?',
    content: {
      intro: 'Chaque grande transformation commence par une conversation. Commençons la vôtre.',
      actions: [
        { label: 'Commencer Ma Transformation', icon: 'ArrowRight' },
        { label: 'Planifier un Appel', icon: 'Globe' },
      ],
      locations: [
        { icon: 'Globe', title: 'Casablanca', subtitle: 'Maroc' },
        { icon: 'Shield', title: '5+ Années', subtitle: "D'Excellence" },
        { icon: 'Award', title: 'Platinum', subtitle: 'HubSpot & Odoo' },
      ]
    },
    isActive: true,
    metadata: { order: 6 }
  });

  console.log('Home content seeded!');
  process.exit(0);
}

seedHomeContent().catch((err) => {
  console.error(err);
  process.exit(1);
}); 