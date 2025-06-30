const mongoose = require('mongoose');
const SEO = require('../models/SEO.ts').default;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bst';

const pages = [
  {
    page: 'home',
    titles: {
      fr: 'Accueil - Blackswan Technology | Experts Odoo & HubSpot au Maroc',
      en: 'Home - Blackswan Technology | Odoo & HubSpot Experts in Morocco',
      ar: 'الرئيسية - بلاك سوان تكنولوجي | خبراء أودو وهبسبوت في المغرب'
    },
    descriptions: {
      fr: 'Blackswan Technology, intégrateur Odoo & HubSpot au Maroc. Digitalisez votre entreprise avec nos solutions ERP & CRM sur mesure. Partenaire officiel, support local, expertise certifiée.',
      en: 'Blackswan Technology, Odoo & HubSpot integrator in Morocco. Digitize your business with our custom ERP & CRM solutions. Official partner, local support, certified expertise.',
      ar: 'بلاك سوان تكنولوجي، شريك رسمي لأودو وهبسبوت في المغرب. حلول ERP وCRM مخصصة لدعم تحول أعمالك رقمياً.'
    },
    keywords: {
      fr: ['Odoo Maroc', 'HubSpot Maroc', 'ERP Maroc', 'CRM Maroc', 'Transformation digitale'],
      en: ['Odoo Morocco', 'HubSpot Morocco', 'ERP Morocco', 'CRM Morocco', 'Digital transformation'],
      ar: ['أودو المغرب', 'هبسبوت المغرب', 'إي آر بي المغرب', 'سي آر إم المغرب', 'التحول الرقمي']
    },
    ogImage: '/bst.png',
    canonical: '/',
  },
  {
    page: 'hubspot',
    titles: {
      fr: 'HubSpot CRM au Maroc - Partenaire Platinum | Blackswan Technology',
      en: 'HubSpot CRM in Morocco - Platinum Partner | Blackswan Technology',
      ar: 'هبسبوت CRM في المغرب - شريك بلاتينيوم | بلاك سوان تكنولوجي'
    },
    descriptions: {
      fr: 'Expert HubSpot CRM au Maroc. Implémentation, formation et support HubSpot. Partenaire Platinum HubSpot avec 5+ ans d\'expérience. Sales Hub, Marketing Hub, Service Hub.',
      en: 'HubSpot CRM expert in Morocco. Implementation, training, and support. Platinum HubSpot Partner with 5+ years experience. Sales Hub, Marketing Hub, Service Hub.',
      ar: 'خبير هبسبوت CRM في المغرب. تنفيذ، تدريب ودعم. شريك بلاتينيوم مع أكثر من 5 سنوات خبرة.'
    },
    keywords: {
      fr: ['HubSpot CRM Maroc', 'Partenaire HubSpot', 'Implémentation HubSpot', 'CRM Casablanca'],
      en: ['HubSpot CRM Morocco', 'HubSpot Partner', 'HubSpot Implementation', 'CRM Casablanca'],
      ar: ['هبسبوت المغرب', 'شريك هبسبوت', 'تنفيذ هبسبوت', 'CRM الدار البيضاء']
    },
    ogImage: '/hubspot-og.jpg',
    canonical: '/hubspot',
  },
  {
    page: 'odoo',
    titles: {
      fr: 'Odoo ERP au Maroc - Partenaire Officiel | Blackswan Technology',
      en: 'Odoo ERP in Morocco - Official Partner | Blackswan Technology',
      ar: 'أودو ERP في المغرب - شريك رسمي | بلاك سوان تكنولوجي'
    },
    descriptions: {
      fr: 'Expert Odoo ERP au Maroc. Implémentation, migration et développement Odoo. Partenaire Officiel Odoo avec 5+ ans d\'expérience. Modules ERP, CRM, Comptabilité, Inventaire.',
      en: 'Odoo ERP expert in Morocco. Implementation, migration, and development. Official Odoo Partner with 5+ years experience. ERP, CRM, Accounting, Inventory modules.',
      ar: 'خبير أودو ERP في المغرب. تنفيذ، ترحيل وتطوير. شريك رسمي مع أكثر من 5 سنوات خبرة. وحدات ERP، CRM، المحاسبة، المخزون.'
    },
    keywords: {
      fr: ['Odoo ERP Maroc', 'Partenaire Odoo', 'Implémentation Odoo', 'ERP Casablanca'],
      en: ['Odoo ERP Morocco', 'Odoo Partner', 'Odoo Implementation', 'ERP Casablanca'],
      ar: ['أودو المغرب', 'شريك أودو', 'تنفيذ أودو', 'ERP الدار البيضاء']
    },
    ogImage: '/odoo-og.jpg',
    canonical: '/odoo',
  },
  {
    page: 'contact',
    titles: {
      fr: 'Contactez-nous - Blackswan Technology',
      en: 'Contact Us - Blackswan Technology',
      ar: 'اتصل بنا - بلاك سوان تكنولوجي'
    },
    descriptions: {
      fr: 'Contactez Blackswan Technology pour une consultation gratuite sur vos projets Odoo, HubSpot, ERP ou CRM au Maroc.',
      en: 'Contact Blackswan Technology for a free consultation on your Odoo, HubSpot, ERP, or CRM projects in Morocco.',
      ar: 'اتصل ببلاك سوان تكنولوجي لاستشارة مجانية حول مشاريع أودو، هبسبوت، ERP أو CRM في المغرب.'
    },
    keywords: {
      fr: ['Contact Odoo', 'Contact HubSpot', 'Consultation ERP', 'Consultation CRM'],
      en: ['Contact Odoo', 'Contact HubSpot', 'ERP Consultation', 'CRM Consultation'],
      ar: ['اتصال أودو', 'اتصال هبسبوت', 'استشارة ERP', 'استشارة CRM']
    },
    ogImage: '/bst.png',
    canonical: '/contact',
  },
  {
    page: 'about',
    titles: {
      fr: 'À propos de Blackswan Technology',
      en: 'About Blackswan Technology',
      ar: 'حول بلاك سوان تكنولوجي'
    },
    descriptions: {
      fr: 'Découvrez l\'équipe, la mission et les valeurs de Blackswan Technology, experts en transformation digitale au Maroc.',
      en: 'Discover the team, mission, and values of Blackswan Technology, digital transformation experts in Morocco.',
      ar: 'تعرف على فريق، مهمة وقيم بلاك سوان تكنولوجي، خبراء التحول الرقمي في المغرب.'
    },
    keywords: {
      fr: ['À propos', 'Blackswan Technology', 'Transformation digitale'],
      en: ['About', 'Blackswan Technology', 'Digital transformation'],
      ar: ['حول', 'بلاك سوان تكنولوجي', 'التحول الرقمي']
    },
    ogImage: '/bst.png',
    canonical: '/about',
  },
  {
    page: 'blog',
    titles: {
      fr: 'Blog - Conseils Odoo, HubSpot & Digital',
      en: 'Blog - Odoo, HubSpot & Digital Tips',
      ar: 'مدونة - نصائح أودو، هبسبوت والتحول الرقمي'
    },
    descriptions: {
      fr: 'Découvrez nos articles, guides et études de cas sur Odoo, HubSpot, ERP, CRM et la transformation digitale au Maroc.',
      en: 'Read our articles, guides, and case studies on Odoo, HubSpot, ERP, CRM, and digital transformation in Morocco.',
      ar: 'اقرأ مقالاتنا، أدلتنا ودراسات الحالة حول أودو، هبسبوت، ERP، CRM والتحول الرقمي في المغرب.'
    },
    keywords: {
      fr: ['Blog Odoo', 'Blog HubSpot', 'ERP Maroc', 'CRM Maroc'],
      en: ['Odoo Blog', 'HubSpot Blog', 'ERP Morocco', 'CRM Morocco'],
      ar: ['مدونة أودو', 'مدونة هبسبوت', 'ERP المغرب', 'CRM المغرب']
    },
    ogImage: '/bst.png',
    canonical: '/blog',
  },
  {
    page: 'dashboard',
    titles: {
      fr: 'Dashboard - Administration | Blackswan Technology',
      en: 'Dashboard - Admin | Blackswan Technology',
      ar: 'لوحة التحكم - الإدارة | بلاك سوان تكنولوجي'
    },
    descriptions: {
      fr: 'Espace d\'administration pour gérer le contenu, les utilisateurs et le SEO du site Blackswan Technology.',
      en: 'Admin area to manage content, users, and SEO for the Blackswan Technology website.',
      ar: 'منطقة الإدارة لإدارة المحتوى، المستخدمين وSEO لموقع بلاك سوان تكنولوجي.'
    },
    keywords: {
      fr: ['Dashboard', 'Administration', 'Gestion contenu'],
      en: ['Dashboard', 'Admin', 'Content management'],
      ar: ['لوحة التحكم', 'الإدارة', 'إدارة المحتوى']
    },
    ogImage: '/bst.png',
    canonical: '/dashboard',
  },
];

const languages = ['fr', 'en', 'ar'];

async function seedSEO() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  for (const page of pages) {
    for (const lang of languages) {
      const entry = {
        page: page.page,
        language: lang,
        title: page.titles[lang],
        description: page.descriptions[lang],
        keywords: page.keywords[lang],
        ogTitle: page.titles[lang],
        ogDescription: page.descriptions[lang],
        ogImage: page.ogImage,
        canonical: page.canonical,
        isActive: true,
        updatedBy: 'seed-script',
      };
      await SEO.findOneAndUpdate(
        { page: entry.page, language: entry.language },
        entry,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Seeded SEO for ${page.page} (${lang})`);
    }
  }
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seedSEO().catch((err) => {
  console.error(err);
  mongoose.disconnect();
}); 