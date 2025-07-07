const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';

const sampleTestimonials = [
  {
    author: "Marie Dubois",
    role: "CEO, TechStart",
    text: "La migration vers Odoo 18 a transformé notre gestion d'entreprise. L'équipe de Black Swan Technology a été exceptionnelle dans l'accompagnement.",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    author: "Pierre Martin",
    role: "Directeur Marketing, InnovCorp",
    text: "L'intégration HubSpot-Odoo nous a permis d'automatiser 80% de nos processus marketing. Résultats exceptionnels !",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    author: "Sophie Bernard",
    role: "Responsable Logistique, Worqbox",
    text: "Grâce à Odoo 18, nous avons optimisé notre chaîne logistique et réduit nos coûts de 30%. Un investissement rentable !",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    author: "Thomas Leroy",
    role: "Directeur Commercial, SalesPro",
    text: "Les automatisations HubSpot ont révolutionné notre processus de vente. Nous avons doublé notre taux de conversion en 6 mois.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    author: "Julie Moreau",
    role: "CTO, DigitalFlow",
    text: "La transformation digitale avec Black Swan Technology a été un succès total. Notre ROI a été atteint en moins d'un an.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedTestimonials() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const testimonialsCollection = db.collection('testimonials');

    // Clear existing testimonials
    await testimonialsCollection.deleteMany({});
    console.log('Cleared existing testimonials');

    // Insert sample testimonials
    const result = await testimonialsCollection.insertMany(sampleTestimonials);
    console.log(`Inserted ${result.insertedCount} testimonials`);

    // Display the inserted testimonials with their IDs
    const insertedTestimonials = await testimonialsCollection.find({}).toArray();
    console.log('\nInserted testimonials:');
    insertedTestimonials.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.author} (${testimonial.role})`);
      console.log(`   ID: ${testimonial._id}`);
      console.log(`   Text: "${testimonial.text.substring(0, 50)}..."`);
      console.log('');
    });

    console.log('Testimonials seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding function
seedTestimonials(); 