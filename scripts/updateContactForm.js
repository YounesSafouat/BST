require('dotenv').config();
const mongoose = require('mongoose');

let Content;

async function updateContactForm() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
    await mongoose.connect(MONGODB_URI);

    // Use the same model as your app
    Content = require('../models/Content');
    if (Content.default) Content = Content.default;

    // Find the contact document by ID
    const contactId = '685047117e4828ed4be27195';
    const contactSection = await Content.findById(contactId);

    if (!contactSection) {
      console.log('❌ No contact section found');
      const allDocs = await Content.find({}).select('type title _id');
      allDocs.forEach(doc => {
        console.log(`- ${doc.type}: ${doc.title} (ID: ${doc._id})`);
      });
      return;
    }

    // New contact form structure
    const updatedContactForm = {
      title: 'Envoyez-nous un message',
      subtitle: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.',
      fields: {
        name: { label: 'Nom complet', placeholder: 'Votre nom complet', required: true },
        email: { label: 'Adresse email', placeholder: 'votre@email.com', required: true },
        phone: { label: 'Numéro de téléphone', placeholder: '+212 6 12 34 56 78', required: false },
        company: { label: "Nom de l'entreprise", placeholder: 'Votre entreprise', required: false },
        subject: { label: 'Sujet', placeholder: 'Objet de votre message', required: true },
        message: { label: 'Message', placeholder: 'Décrivez votre projet, vos besoins ou posez-nous vos questions...', required: true }
      },
      submitButton: { text: 'Envoyer le message', loadingText: 'Envoi en cours...' },
      successMessage: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      errorMessage: "Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement."
    };

    // Update the contact section
    const result = await Content.findByIdAndUpdate(
      contactId,
      {
        $set: {
          'content.contactForm': updatedContactForm,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (result) {
      console.log('✅ Contact form updated successfully!');
    } else {
      console.log('❌ No changes made to contact form');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateContactForm(); 