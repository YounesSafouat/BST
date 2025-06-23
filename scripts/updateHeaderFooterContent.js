const mongoose = require('mongoose');
let Content;

async function updateHeaderFooterContent() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
    await mongoose.connect(MONGODB_URI);

    // Fix for ES module/CommonJS interop
    Content = require('../models/Content');
    if (Content.default) Content = Content.default;

    // Remove existing header and footer content
    await Content.deleteMany({ type: { $in: ['header', 'footer'] } });

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
                  icon: 'TrendingUp'
                },
                {
                  title: 'Marketing Hub',
                  description: 'Email marketing avancé',
                  icon: 'Mail'
                },
                {
                  title: 'Service Hub',
                  description: 'Support client professionnel',
                  icon: 'HeadphonesIcon'
                }
              ]
            },
            {
              title: 'Nos Services',
              items: [
                {
                  title: 'Audit HubSpot',
                  description: 'Évaluation complète',
                  icon: 'Target'
                },
                {
                  title: 'Implémentation',
                  description: 'Configuration sur mesure',
                  icon: 'Rocket'
                },
                {
                  title: 'Formation',
                  description: 'Équipes certifiées',
                  icon: 'GraduationCap'
                }
              ]
            }
          ],
          ctaButton: {
            text: 'En Savoir Plus',
            url: '/hubspot',
            icon: 'ArrowRight'
          }
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
                  icon: 'ShoppingCart'
                },
                {
                  title: 'Comptabilité',
                  description: 'Gestion financière',
                  icon: 'BarChart3'
                },
                {
                  title: 'Inventaire',
                  description: 'Gestion des stocks',
                  icon: 'Building'
                }
              ]
            },
            {
              title: 'Nos Expertises',
              items: [
                {
                  title: 'Analyse & Audit',
                  description: 'Évaluation des processus',
                  icon: 'PieChart'
                },
                {
                  title: 'Personnalisation',
                  description: 'Modules sur mesure',
                  icon: 'Workflow'
                },
                {
                  title: 'Migration',
                  description: 'Transfert sécurisé',
                  icon: 'Database'
                }
              ]
            }
          ],
          ctaButton: {
            text: 'En Savoir Plus',
            url: '/odoo',
            icon: 'ArrowRight'
          }
        },
        about: {
          title: 'À Propos de Blackswantechnology',
          subtitle: 'Votre Partenaire de Transformation Digitale',
          stats: [
            {
              title: '5+ Années',
              description: 'D\'expérience au Maroc',
              icon: 'Star'
            },
            {
              title: '200+ Clients',
              description: 'Entreprises accompagnées',
              icon: 'Users'
            },
            {
              title: '100% Réussite',
              description: 'Taux de satisfaction',
              icon: 'CheckCircle'
            },
            {
              title: 'Casablanca',
              description: 'Expertise internationale',
              icon: 'Globe'
            }
          ],
          ctaButton: {
            text: 'Notre Histoire',
            url: '/about',
            icon: 'ArrowRight'
          }
        },
        contact: {
          title: 'Contact',
          url: '/contact'
        },
        casClient: {
          title: 'Nos Références Clients',
          subtitle: 'Découvrez nos succès clients',
          url: '/cas-client'
        },
        phone: {
          number: '+212XXXXXXXXX',
          icon: 'Phone'
        }
      },
      isActive: true,
      metadata: { order: 1 }
    });

    // Footer Content
    await Content.create({
      type: 'footer',
      title: 'Footer',
      description: 'Pied de page du site',
      content: {
        newsletter: {
          title: 'Restez à la pointe de l\'innovation',
          description: 'Recevez nos dernières actualités, études de cas et conseils d\'experts directement dans votre boîte mail.',
          placeholder: 'Votre email professionnel',
          buttonText: 'S\'inscrire',
          disclaimer: 'En vous inscrivant, vous acceptez notre politique de confidentialité.'
        },
        companyInfo: {
          logo: {
            image: '/bst.png',
            alt: 'Blackswantechnology'
          },
          description: 'Nous transformons les entreprises marocaines grâce à des solutions digitales innovantes et sur mesure.',
          contact: {
            address: {
              icon: 'MapPin',
              text: 'Twin Center, Casablanca, Maroc'
            },
            phone: {
              icon: 'Phone',
              text: '+212 6 XX XX XX XX'
            },
            email: {
              icon: 'Mail',
              text: 'contact@blackswantechnology.ma'
            }
          }
        },
        quickLinks: {
          title: 'Liens Rapides',
          links: [
            { text: 'Accueil', url: '/' },
            { text: 'Services', url: '/services' },
            { text: 'À Propos', url: '/about' },
            { text: 'Témoignages', url: '/testimonials' },
            { text: 'Blog', url: '/blog' },
            { text: 'Carrières', url: '/careers' },
            { text: 'Contact', url: '/contact' }
          ]
        },
        services: {
          title: 'Nos Services',
          links: [
            { text: 'HubSpot CRM', url: '/hubspot' },
            { text: 'Odoo ERP', url: '/odoo' },
            { text: 'Intégration API', url: '/api-integration' },
            { text: 'Développement Web', url: '/web-development' },
            { text: 'Marketing Digital', url: '/digital-marketing' },
            { text: 'Formation & Support', url: '/training' },
            { text: 'Audit Digital', url: '/audit' }
          ]
        },
        social: {
          title: 'Suivez-nous',
          networks: [
            { name: 'Facebook', icon: 'Facebook', url: '#', color: 'bg-blue-600' },
            { name: 'Twitter', icon: 'Twitter', url: '#', color: 'bg-sky-500' },
            { name: 'LinkedIn', icon: 'Linkedin', url: '#', color: 'bg-blue-700' },
            { name: 'Instagram', icon: 'Instagram', url: '#', color: 'bg-pink-600' }
          ]
        },
        certifications: {
          title: 'Certifications',
          badges: [
            'HubSpot Platinum',
            'Odoo Partner',
            'ISO 27001',
            'GDPR Compliant'
          ]
        },
        legal: {
          copyright: `© ${new Date().getFullYear()} Blackswantechnology. Tous droits réservés.`,
          links: [
            { text: 'Politique de confidentialité', url: '/privacy' },
            { text: 'Conditions d\'utilisation', url: '/terms' },
            { text: 'Mentions légales', url: '/legal' }
          ]
        }
      },
      isActive: true,
      metadata: { order: 99 }
    });

    console.log('✅ Header and footer content updated successfully!');
  } catch (error) {
    console.error('Error updating header and footer content:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateHeaderFooterContent();