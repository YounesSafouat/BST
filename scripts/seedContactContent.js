const mongoose = require('mongoose');
let Content;

async function seedContactContent() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
  await mongoose.connect(MONGODB_URI);

  // Fix for ES module/CommonJS interop
  Content = require('../models/Content');
  if (Content.default) Content = Content.default;

  // Remove existing contact content
  await Content.deleteMany({ type: 'contact' });

  // Create contact page content
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
          firstName: {
            label: 'Prénom',
            placeholder: 'Votre prénom',
            required: true
          },
          lastName: {
            label: 'Nom',
            placeholder: 'Votre nom',
            required: true
          },
          email: {
            label: 'Email',
            placeholder: 'votre@email.com',
            required: true
          },
          phone: {
            label: 'Téléphone',
            placeholder: '+212 6 12 34 56 78',
            required: false
          },
          company: {
            label: 'Entreprise',
            placeholder: 'Nom de votre entreprise',
            required: false
          },
          subject: {
            label: 'Sujet',
            placeholder: 'Objet de votre message',
            required: true
          },
          message: {
            label: 'Message',
            placeholder: 'Décrivez votre projet, vos besoins ou posez-nous vos questions...',
            required: true
          }
        },
        submitButton: {
          text: 'Envoyer le message',
          loadingText: 'Envoi en cours...'
        },
        successMessage: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
        errorMessage: 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer ou nous contacter directement.'
      },
      trust: {
        title: 'Ils nous font confiance',
        subtitle: 'Des entreprises de renom nous font confiance pour leur transformation digitale',
        companies: [
          {
            name: 'Microsoft',
            logo: '/logos/microsoft.svg'
          },
          {
            name: 'Google',
            logo: '/logos/google.svg'
          },
          {
            name: 'Odoo',
            logo: '/odoo.png'
          },
          {
            name: 'HubSpot',
            logo: '/logos/hubspot.svg'
          }
        ]
      },
      contact: {
        title: 'Informations de contact',
        subtitle: 'N\'hésitez pas à nous contacter directement',
        info: [
          {
            icon: 'Phone',
            title: 'Téléphone',
            value: '+212 6 12 34 56 78',
            url: 'tel:+212612345678'
          },
          {
            icon: 'Mail',
            title: 'Email',
            value: 'contact@blackswantechnology.ma',
            url: 'mailto:contact@blackswantechnology.ma'
          },
          {
            icon: 'MapPin',
            title: 'Adresse',
            value: 'Twin Center, Casablanca, Maroc',
            url: 'https://maps.google.com/?q=Twin+Center+Casablanca'
          }
        ]
      }
    },
    isActive: true,
    metadata: { order: 1 }
  });

  console.log('✅ Contact content seeded successfully!');
  process.exit(0);
}

seedContactContent().catch(console.error); 