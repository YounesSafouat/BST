const mongoose = require('mongoose');
let Content;

async function seedContent() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
    await mongoose.connect(MONGODB_URI);

    // Fix for ES module/CommonJS interop
    Content = require('../models/Content');
    if (Content.default) Content = Content.default;

    // Remove existing content
    await Content.deleteMany({ type: { $in: ['contact', 'header'] } });

    // Contact Page Content
    await Content.create({
      type: 'contact',
      title: 'Contactez-nous',
      description: 'Nous sommes là pour vous aider à transformer votre entreprise avec nos solutions digitales sur mesure.',
      content: {
        section: 'hero',
        subtitle: 'Nous sommes là pour vous aider à transformer votre entreprise avec nos solutions digitales sur mesure.'
      },
      isActive: true,
      metadata: { order: 1 }
    });

    await Content.create({
      type: 'contact',
      title: 'Informations de Contact',
      description: 'N\'hésitez pas à nous contacter pour toute question ou demande d\'information. Notre équipe est à votre disposition.',
      content: {
        section: 'info',
        email: 'contact@blackswantechnology.com',
        phone: '+212 5XX-XXXXXX',
        address: 'Casablanca, Maroc\nZone Industrielle',
      },
      isActive: true,
      metadata: { order: 2 }
    });

    await Content.create({
      type: 'contact',
      title: 'Envoyez-nous un message',
      description: 'Formulaire de contact pour nous envoyer un message.',
      content: {
        section: 'form',
        nameLabel: 'Nom complet *',
        emailLabel: 'Email *',
        phoneLabel: 'Téléphone',
        companyLabel: 'Entreprise',
        messageLabel: 'Message *',
        submitButton: 'Envoyer le message',
        loadingText: 'Envoi en cours...',
        successMessage: 'Message envoyé avec succès!',
        errorMessage: 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
      },
      isActive: true,
      metadata: { order: 3 }
    });

    // Header Content
    await Content.create({
      type: 'header',
      title: 'Navigation',
      description: 'Menu de navigation principal',
      content: {
        section: 'navigation',
        hubspot: {
          title: 'Solutions HubSpot',
          subtitle: 'Plateforme CRM et Marketing Complète',
          badge: '★ Partenaire Platinum',
          sections: [
            {
              title: 'Logiciels CRM',
              items: [
                {
                  title: 'Sales Hub',
                  description: 'Automatisation des ventes',
                },
                {
                  title: 'Marketing Hub',
                  description: 'Email marketing avancé',
                },
                {
                  title: 'Service Hub',
                  description: 'Support client professionnel',
                },
              ],
            },
            {
              title: 'Nos Services',
              items: [
                {
                  title: 'Audit HubSpot',
                  description: 'Évaluation complète',
                },
                {
                  title: 'Implémentation',
                  description: 'Configuration sur mesure',
                },
                {
                  title: 'Formation',
                  description: 'Équipes certifiées',
                },
              ],
            },
          ],
        },
        odoo: {
          title: 'Solutions Odoo',
          subtitle: 'ERP Intégré et Gestion d\'Entreprise',
          badge: '★ Partenaire Officiel',
          sections: [
            {
              title: 'Modules ERP',
              items: [
                {
                  title: 'Ventes & CRM',
                  description: 'Gestion commerciale',
                },
                {
                  title: 'Comptabilité',
                  description: 'Gestion financière',
                },
                {
                  title: 'Inventaire',
                  description: 'Gestion des stocks',
                },
              ],
            },
            {
              title: 'Nos Expertises',
              items: [
                {
                  title: 'Analyse & Audit',
                  description: 'Évaluation des processus',
                },
                {
                  title: 'Personnalisation',
                  description: 'Modules sur mesure',
                },
                {
                  title: 'Migration',
                  description: 'Transfert sécurisé',
                },
              ],
            },
          ],
        },
        about: {
          title: 'À Propos de Blackswantechnology',
          subtitle: 'Votre Partenaire de Transformation Digitale',
          stats: [
            {
              title: '5+ Années',
              description: 'D\'expérience au Maroc',
            },
            {
              title: '200+ Clients',
              description: 'Entreprises accompagnées',
            },
            {
              title: '100% Réussite',
              description: 'Taux de satisfaction',
            },
            {
              title: 'Casablanca',
              description: 'Expertise internationale',
            },
          ],
        },
        casClient: {
          title: 'Nos Références Clients',
          subtitle: 'Découvrez nos succès clients',
          clients: [
            {
              name: 'Client 1',
              industry: 'Technologie',
              description: 'Transformation digitale complète avec HubSpot',
              results: 'ROI +150% en 6 mois',
            },
            {
              name: 'Client 2',
              industry: 'Manufacturing',
              description: 'Implémentation Odoo ERP sur mesure',
              results: 'Réduction des coûts de 30%',
            },
            {
              name: 'Client 3',
              industry: 'Services',
              description: 'Automatisation des processus marketing',
              results: 'Augmentation des leads de 200%',
            },
            {
              name: 'Client 4',
              industry: 'Retail',
              description: 'Solution CRM intégrée',
              results: 'Amélioration de la satisfaction client',
            },
            {
              name: 'Client 5',
              industry: 'Finance',
              description: 'Migration vers HubSpot Enterprise',
              results: 'Croissance des ventes de 80%',
            },
          ],
        },
      },
      isActive: true,
      metadata: { order: 1 }
    });

    console.log("✅ Website content seeded successfully!");
  } catch (error) {
    console.error("Error seeding website content:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedContent(); 