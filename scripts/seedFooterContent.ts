import mongoose from 'mongoose';
import Content from '../models/Content';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

async function seedFooterContent() {
  await mongoose.connect(MONGODB_URI);

  // Remove existing footer content
  await Content.deleteMany({ type: 'footer' });

  // Insert footer section
  await Content.create({
    type: 'footer',
    title: 'Footer',
    description: 'Site footer content',
    content: {
      copyright: '© 2025 Blackswan Technology. Tous droits réservés.',
      links: [
        { label: 'Accueil', url: '/' },
        { label: 'À propos', url: '/a-propos' },
        { label: 'Contact', url: '/contact' },
        { label: 'Blog', url: '/blog' },
        { label: 'Cas Client', url: '/cas-client' },
      ],
      social: [
        { icon: 'Facebook', url: 'https://facebook.com/blackswantechnology' },
        { icon: 'Linkedin', url: 'https://linkedin.com/company/blackswantechnology' },
        { icon: 'Twitter', url: 'https://twitter.com/blackswantech' },
        { icon: 'Instagram', url: 'https://instagram.com/blackswantechnology' },
      ],
      extra: 'Made with ❤️ in Casablanca',
    },
    isActive: true,
    metadata: { order: 99 }
  });

  console.log('Footer content seeded!');
  process.exit(0);
}

seedFooterContent().catch((err) => {
  console.error(err);
  process.exit(1);
}); 