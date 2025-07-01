const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';

const footerContent = {
  type: "footer",
  title: "Footer",
  description: "Pied de page du site",
  content: {
    newsletter: {
      title: "Restez à la pointe de l'innovation",
      description: "Recevez nos dernières actualités, études de cas et conseils d'experts directement dans votre boîte mail.",
      placeholder: "Votre email professionnel",
      buttonText: "S'inscrire"
    },
    companyInfo: {
      logo: {
        image: "/bst.png",
        alt: "Blackswantechnology"
      },
      description: "Nous transformons les entreprises marocaines grâce à des solutions digitales innovantes et sur mesure.",
      contact: {
        address: {
          icon: "MapPin",
          text: "Twin Center, Casablanca, Maroc"
        },
        phone: {
          icon: "Phone",
          text: "+212 6 XX XX XX XX"
        },
        email: {
          icon: "Mail",
          text: "contact@blackswantechnology.ma"
        }
      }
    },
    quickLinks: {
      title: "Liens Rapides",
      links: [
        { text: "Accueil", url: "/" },
        { text: "Services", url: "/services" },
        { text: "À Propos", url: "/about" },
        { text: "Témoignages", url: "/testimonials" },
        { text: "Blog", url: "/blog" },
        { text: "Carrières", url: "/careers" },
        { text: "Contact", url: "/contact" }
      ]
    },
    services: {
      title: "Nos Services",
      links: [
        { text: "HubSpot CRM", url: "/hubspot" },
        { text: "Odoo ERP", url: "/odoo" },
        { text: "Intégration API", url: "/api-integration" },
        { text: "Développement Web", url: "/web-development" },
        { text: "Marketing Digital", url: "/digital-marketing" },
        { text: "Formation & Support", url: "/training" },
        { text: "Audit Digital", url: "/audit" }
      ]
    },
    social: {
      title: "Suivez-nous",
      networks: [
        { name: "Facebook", icon: "Facebook", url: "#", color: "bg-blue-600" },
        { name: "Twitter", icon: "Twitter", url: "#", color: "bg-sky-500" },
        { name: "LinkedIn", icon: "Linkedin", url: "#", color: "bg-blue-700" },
        { name: "Instagram", icon: "Instagram", url: "#", color: "bg-pink-600" }
      ]
    },
    certifications: {
      title: "Certifications",
      badges: ["HubSpot Platinum", "Odoo Partner", "ISO 27001", "GDPR Compliant"]
    },
    legal: {
      copyright: "© 2025 Blackswantechnology. Tous droits réservés.",
      links: [
        { text: "Politique de confidentialité", url: "/privacy" },
        { text: "Conditions d'utilisation", url: "/terms" },
        { text: "Mentions légales", url: "/legal" }
      ]
    }
  },
  isActive: true,
  metadata: { order: 99 },
  createdAt: new Date(),
  updatedAt: new Date()
};

async function seedFooterContent() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const contentCollection = db.collection('contents');

    // Check if footer content already exists
    const existingFooter = await contentCollection.findOne({ type: 'footer' });

    if (existingFooter) {
      console.log('Footer content already exists. Updating...');
      await contentCollection.updateOne(
        { type: 'footer' },
        { 
          $set: {
            ...footerContent,
            updatedAt: new Date()
          }
        }
      );
      console.log('Footer content updated successfully');
    } else {
      console.log('Creating new footer content...');
      await contentCollection.insertOne(footerContent);
      console.log('Footer content created successfully');
    }

  } catch (error) {
    console.error('Error seeding footer content:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedFooterContent().catch(console.error); 