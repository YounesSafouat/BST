const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bst';

async function seedTestimonials() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('contents');
    
    const testimonials = [
      {
        type: 'testimonial',
        title: 'Sophie Martin',
        description: 'Directrice Marketing - TechCorp',
        content: {
          name: 'Sophie Martin',
          role: 'Directrice Marketing',
          company: 'TechCorp',
          quote: 'L\'implémentation HubSpot par BST a transformé notre processus de génération de leads. Nous avons augmenté nos conversions de 150% en seulement 3 mois.',
          result: '+150% de conversions en 3 mois',
          avatar: 'SM'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'testimonial',
        title: 'Marc Dubois',
        description: 'CEO - InnovateStartup',
        content: {
          name: 'Marc Dubois',
          role: 'CEO',
          company: 'InnovateStartup',
          quote: 'Odoo nous a permis de centraliser toutes nos opérations. L\'équipe BST a été exceptionnelle dans l\'implémentation et la formation de nos équipes.',
          result: 'Centralisation complète des opérations',
          avatar: 'MD'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'testimonial',
        title: 'Marie Laurent',
        description: 'Directrice Commerciale - GrowthCo',
        content: {
          name: 'Marie Laurent',
          role: 'Directrice Commerciale',
          company: 'GrowthCo',
          quote: 'La combinaison HubSpot + Odoo nous a donné une visibilité totale sur notre pipeline. Nos ventes ont augmenté de 200% cette année.',
          result: '+200% de ventes en 1 an',
          avatar: 'ML'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'testimonial',
        title: 'Pierre Moreau',
        description: 'Directeur Technique - DigitalFirst',
        content: {
          name: 'Pierre Moreau',
          role: 'Directeur Technique',
          company: 'DigitalFirst',
          quote: 'L\'expertise technique de BST est remarquable. Ils ont su adapter Odoo à nos besoins spécifiques et l\'intégrer parfaitement avec nos outils existants.',
          result: 'Intégration parfaite avec l\'écosystème existant',
          avatar: 'PM'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'testimonial',
        title: 'Julie Bernard',
        description: 'Responsable Marketing - ScaleUp',
        content: {
          name: 'Julie Bernard',
          role: 'Responsable Marketing',
          company: 'ScaleUp',
          quote: 'HubSpot a révolutionné notre marketing automation. L\'équipe BST nous a accompagnés à chaque étape avec un support exceptionnel.',
          result: 'Marketing automation optimisé',
          avatar: 'JB'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Clear existing testimonials
    await collection.deleteMany({ type: 'testimonial' });
    console.log('Cleared existing testimonials');
    
    // Insert new testimonials
    const result = await collection.insertMany(testimonials);
    console.log(`Inserted ${result.insertedCount} testimonials`);
    
    console.log('Testimonials seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  } finally {
    await client.close();
  }
}

seedTestimonials(); 