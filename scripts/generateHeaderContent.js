const headerContent = {
  type: "header",
  content: {
    logo: {
      image: "/bst.png",
      alt: "Black Swan Technology"
    },
    navigation: {
      main: [
        {
          label: "Accueil",
          url: "/",
          icon: "Home",
          isActive: true
        },
        {
          label: "À Propos",
          url: "/about",
          icon: "Users",
          isActive: true
        },
        {
          label: "Services",
          url: "/services",
          icon: "Briefcase",
          isActive: true
        },
        {
          label: "Blog",
          url: "/blog",
          icon: "FileText",
          isActive: true
        },
        {
          label: "Contact",
          url: "/contact",
          icon: "Mail",
          isActive: true
        }
      ],
      hubspot: {
        title: "HubSpot",
        subtitle: "Plateforme CRM complète pour la croissance de votre entreprise",
        badge: "POPULAIRE",
        isActive: true,
        crmItems: [
          {
            icon: "TrendingUp",
            title: "CRM Marketing",
            description: "Automatisez vos campagnes marketing",
            url: "/hubspot/marketing"
          },
          {
            icon: "Target",
            title: "CRM Sales",
            description: "Optimisez votre processus de vente",
            url: "/hubspot/sales"
          },
          {
            icon: "HeadphonesIcon",
            title: "CRM Service",
            description: "Améliorez l'expérience client",
            url: "/hubspot/service"
          },
          {
            icon: "BarChart3",
            title: "Analytics",
            description: "Analysez vos performances",
            url: "/hubspot/analytics"
          }
        ],
        serviceItems: [
          {
            icon: "Rocket",
            title: "Implémentation",
            description: "Configuration complète de HubSpot",
            url: "/services/hubspot-implementation"
          },
          {
            icon: "GraduationCap",
            title: "Formation",
            description: "Formation de vos équipes",
            url: "/services/hubspot-training"
          },
          {
            icon: "Zap",
            title: "Optimisation",
            description: "Optimisation de vos processus",
            url: "/services/hubspot-optimization"
          },
          {
            icon: "Users",
            title: "Support",
            description: "Support technique continu",
            url: "/services/hubspot-support"
          }
        ]
      },
      odoo: {
        title: "Odoo",
        subtitle: "ERP modulaire pour tous les secteurs d'activité",
        badge: "ERP",
        isActive: true,
        modules: [
          {
            icon: "Database",
            title: "CRM",
            description: "Gestion de la relation client",
            url: "/odoo/crm"
          },
          {
            icon: "ShoppingCart",
            title: "Ventes",
            description: "Gestion des ventes et devis",
            url: "/odoo/sales"
          },
          {
            icon: "Building",
            title: "Achats",
            description: "Gestion des achats et fournisseurs",
            url: "/odoo/purchases"
          },
          {
            icon: "BarChart3",
            title: "Comptabilité",
            description: "Gestion comptable complète",
            url: "/odoo/accounting"
          },
          {
            icon: "Users",
            title: "RH",
            description: "Gestion des ressources humaines",
            url: "/odoo/hr"
          },
          {
            icon: "Database",
            title: "Stock",
            description: "Gestion des stocks et inventaires",
            url: "/odoo/inventory"
          },
          {
            icon: "Target",
            title: "Projets",
            description: "Gestion de projets et tâches",
            url: "/odoo/projects"
          },
          {
            icon: "HeadphonesIcon",
            title: "Support",
            description: "Gestion du support client",
            url: "/odoo/helpdesk"
          }
        ],
        services: [
          {
            icon: "Rocket",
            title: "Développement",
            description: "Développement de modules sur mesure",
            url: "/services/odoo-development"
          },
          {
            icon: "GraduationCap",
            title: "Formation",
            description: "Formation Odoo pour vos équipes",
            url: "/services/odoo-training"
          },
          {
            icon: "Zap",
            title: "Migration",
            description: "Migration depuis votre système actuel",
            url: "/services/odoo-migration"
          },
          {
            icon: "Users",
            title: "Maintenance",
            description: "Maintenance et support technique",
            url: "/services/odoo-maintenance"
          },
          {
            icon: "Globe",
            title: "Intégration",
            description: "Intégration avec vos outils existants",
            url: "/services/odoo-integration"
          },
          {
            icon: "Star",
            title: "Optimisation",
            description: "Optimisation des performances",
            url: "/services/odoo-optimization"
          }
        ]
      }
    },
    contact: {
      phone: "+212 6 12 34 56 78",
      email: "contact@blackswantechnology.com",
      address: "Casablanca, Maroc"
    },
    cta: {
      text: "Prendre Rendez-vous",
      url: "/rendez-vous",
      isActive: true
    }
  }
};

console.log(JSON.stringify(headerContent, null, 2)); 