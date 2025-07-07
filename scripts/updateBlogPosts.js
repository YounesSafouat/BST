const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';

// Updated blog posts with testimonials and similarPosts
const updatedBlogPosts = [
  {
    slug: "odoo-15-to-18-migration",
    title: "Comment migrer d'Odoo 15 vers Odoo 18 sans perdre vos données",
    excerpt: "Découvrez notre méthodologie éprouvée pour migrer votre ERP Odoo vers la dernière version tout en préservant l'intégrité de vos données.",
    category: "Odoo ERP",
    image: "/https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Expert Odoo",
    date: "12 juin 2025",
    readTime: "8 min",
    featured: true,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fb", "6867f1badd06baf59cc481fd"], // Marie Dubois, Sophie Bernard
    similarPosts: ["hubspot-automation-tips", "odoo-hubspot-integration", "worqbox-case-study"],
    body: "# Comment migrer d'Odoo 15 vers Odoo 18 sans perdre vos données\n\nMigrer votre ERP Odoo vers une nouvelle version peut sembler complexe, mais avec la bonne méthodologie, vous pouvez garantir la sécurité de vos données et profiter des nouvelles fonctionnalités.\n\n## Étapes clés de la migration\n\n1. **Audit de l'existant**\n   - Analysez vos modules personnalisés et vos données actuelles.\n2. **Sauvegarde complète**\n   - Effectuez une sauvegarde de la base de données et des fichiers.\n3. **Test de migration**\n   - Réalisez une migration sur un environnement de test pour identifier les éventuels problèmes.\n4. **Migration des modules**\n   - Mettez à jour ou réécrivez les modules personnalisés pour Odoo 18.\n5. **Validation des données**\n   - Vérifiez l'intégrité des données migrées.\n6. **Mise en production**\n   - Planifiez la bascule en minimisant l'impact sur les utilisateurs.\n\n## Bonnes pratiques\n\n- Impliquez les utilisateurs clés dans les tests.\n- Documentez chaque étape.\n- Prévoyez un plan de retour arrière.\n\n> **Astuce :** Utilisez les outils officiels d'Odoo pour faciliter la migration.\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  },
  {
    slug: "hubspot-automation-tips",
    title: "15 automatisations HubSpot qui vont révolutionner votre marketing",
    excerpt: "Explorez les workflows d'automatisation les plus puissants de HubSpot pour optimiser vos campagnes marketing et augmenter vos conversions.",
    category: "HubSpot CRM",
    image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Spécialiste Marketing",
    date: "5 juin 2025",
    readTime: "6 min",
    featured: false,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fc", "6867f1badd06baf59cc481fe"], // Pierre Martin, Thomas Leroy
    similarPosts: ["odoo-15-to-18-migration", "odoo-hubspot-integration", "hubspot-dashboard-kpis"],
    body: "# 15 automatisations HubSpot qui vont révolutionner votre marketing\n\nL'automatisation est la clé d'un marketing moderne et efficace. Voici 15 idées de workflows à mettre en place dans HubSpot :\n\n1. **Nurturing de leads** : Envoyez des emails personnalisés selon le comportement du prospect.\n2. **Relance de paniers abandonnés** : Récupérez des ventes perdues automatiquement.\n3. **Qualification automatique** : Attribuez des scores à vos leads selon leurs actions.\n4. **Notifications internes** : Prévenez vos commerciaux dès qu'un lead est chaud.\n5. **Onboarding client** : Automatisez l'envoi de ressources après une vente.\n6. **Réengagement** : Relancez les contacts inactifs.\n7. **Feedback post-achat** : Demandez un avis après une commande.\n8. **Mise à jour de données** : Nettoyez et enrichissez vos contacts automatiquement.\n9. **Segmentation dynamique** : Ajoutez/retirez des contacts de listes selon leurs actions.\n10. **Alertes de renouvellement** : Prévenez vos clients avant l'expiration d'un service.\n11. **Cross-sell/Up-sell** : Proposez des produits complémentaires.\n12. **Gestion des événements** : Automatisez les invitations et relances.\n13. **Lead assignment** : Répartissez les leads entre commerciaux.\n14. **Campagnes anniversaires** : Envoyez des offres personnalisées à la bonne date.\n15. **Analyse de satisfaction** : Automatisez l'envoi de questionnaires NPS.\n\n> **Astuce :** Commencez simple, puis complexifiez vos workflows au fil du temps !\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  },
  {
    slug: "odoo-hubspot-integration",
    title: "Intégration Odoo-HubSpot : le guide complet",
    excerpt: "Comment connecter votre ERP Odoo avec votre CRM HubSpot pour créer un écosystème digital parfaitement synchronisé.",
    category: "Transformation Digitale",
    image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Architecte Solutions",
    date: "28 mai 2025",
    readTime: "12 min",
    featured: false,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fc", "6867f1badd06baf59cc481ff"], // Pierre Martin, Julie Moreau
    similarPosts: ["odoo-15-to-18-migration", "hubspot-automation-tips", "worqbox-case-study"],
    body: "# Intégration Odoo-HubSpot : le guide complet\n\nConnecter Odoo et HubSpot permet d'automatiser vos processus et d'améliorer la visibilité sur vos clients.\n\n## Pourquoi intégrer Odoo et HubSpot ?\n- Centralisation des données clients\n- Automatisation du marketing et des ventes\n- Meilleure expérience utilisateur\n\n## Étapes de l'intégration\n1. **Définir les objectifs** : Quelles données synchroniser ?\n2. **Choisir la méthode** : API, connecteurs, ou solutions tierces.\n3. **Configurer les accès API** dans Odoo et HubSpot.\n4. **Mapper les champs** : Assurez-vous que les données correspondent.\n5. **Tester la synchronisation** sur un environnement de test.\n6. **Former les équipes** à l'utilisation du nouvel écosystème.\n\n## Bonnes pratiques\n- Sécurisez les accès API.\n- Surveillez les logs de synchronisation.\n- Mettez à jour la documentation interne.\n\n> **Ressource utile :** Consultez la documentation officielle Odoo et HubSpot pour les dernières nouveautés.\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  },
  {
    slug: "worqbox-case-study",
    title: "Comment Worqbox a optimisé sa logistique avec Odoo 18",
    excerpt: "Étude de cas détaillée sur la transformation digitale de Worqbox et les résultats obtenus après la migration vers Odoo 18.",
    category: "Études de Cas",
    image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Chef de Projet",
    date: "20 mai 2025",
    readTime: "10 min",
    featured: false,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fd", "6867f1badd06baf59cc481ff"], // Sophie Bernard, Julie Moreau
    similarPosts: ["odoo-15-to-18-migration", "odoo-hubspot-integration", "odoo-analytical-accounting"],
    body: "# Comment Worqbox a optimisé sa logistique avec Odoo 18\n\nDécouvrez comment Worqbox a transformé sa gestion logistique grâce à la migration vers Odoo 18.\n\n## Contexte\nAvant la migration, Worqbox faisait face à :\n- Des processus manuels chronophages\n- Un manque de visibilité sur les stocks\n- Des erreurs de préparation de commandes\n\n## Solutions mises en place\n- **Automatisation des flux logistiques**\n- **Intégration des modules Inventaire et Achat**\n- **Tableaux de bord personnalisés**\n\n## Résultats obtenus\n- Réduction de 30% du temps de traitement des commandes\n- Diminution des erreurs de stock\n- Amélioration de la satisfaction client\n\n> **Conclusion :** La digitalisation de la logistique est un levier de croissance majeur pour les PME.\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  },
  {
    slug: "hubspot-dashboard-kpis",
    title: "Les KPIs essentiels à suivre dans votre dashboard HubSpot",
    excerpt: "Guide pratique pour configurer un tableau de bord HubSpot efficace avec les indicateurs clés de performance qui comptent vraiment.",
    category: "HubSpot CRM",
    image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Analyste CRM",
    date: "15 mai 2025",
    readTime: "7 min",
    featured: false,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fc", "6867f1badd06baf59cc481fe"], // Pierre Martin, Thomas Leroy
    similarPosts: ["hubspot-automation-tips", "odoo-hubspot-integration", "odoo-analytical-accounting"],
    body: "# Les KPIs essentiels à suivre dans votre dashboard HubSpot\n\nUn bon dashboard HubSpot vous aide à piloter votre activité marketing et commerciale.\n\n## KPIs à surveiller\n- **Taux de conversion des leads**\n- **Nombre de nouveaux contacts**\n- **Taux d'ouverture des emails**\n- **Cycle de vente moyen**\n- **Valeur du pipeline**\n- **ROI des campagnes**\n\n## Comment configurer votre dashboard\n1. Sélectionnez les rapports les plus pertinents pour votre activité.\n2. Personnalisez les filtres (période, équipe, source...)\n3. Analysez les tendances et ajustez vos actions.\n\n> **Astuce :** Automatisez l'envoi de rapports hebdomadaires à votre équipe !\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  },
  {
    slug: "odoo-analytical-accounting",
    title: "Comment configurer la comptabilité analytique dans Odoo",
    excerpt: "Tutoriel pas à pas pour mettre en place une comptabilité analytique performante dans Odoo et optimiser votre reporting financier.",
    category: "Tutoriels",
    image: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg",
    author: "Younes SAFOUAT",
    authorRole: "Consultante Odoo",
    date: "8 mai 2025",
    readTime: "9 min",
    featured: false,
    published: true,
    testimonials: ["6867f1badd06baf59cc481fb", "6867f1badd06baf59cc481ff"], // Marie Dubois, Julie Moreau
    similarPosts: ["worqbox-case-study", "hubspot-dashboard-kpis", "odoo-15-to-18-migration"],
    body: "# Comment configurer la comptabilité analytique dans Odoo\n\nLa comptabilité analytique permet de mieux suivre la rentabilité de vos projets et centres de coûts.\n\n## Étapes de configuration\n1. **Activer le module Analytique** dans Odoo.\n2. **Créer des plans analytiques** adaptés à votre organisation.\n3. **Affecter des comptes analytiques** lors de la saisie des factures et dépenses.\n4. **Analyser les rapports** pour piloter votre activité.\n\n## Conseils pratiques\n- Impliquez les responsables de chaque service dans la définition des axes analytiques.\n- Automatisez l'affectation des comptes via des règles.\n\n> **Ressource :** Consultez la documentation Odoo pour des exemples avancés.\n",
    cover: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/placeholder.svg"
  }
];

async function updateBlogPosts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const contentsCollection = db.collection('contents');

    // Find the blog-page document
    const blogPage = await contentsCollection.findOne({ type: 'blog-page' });
    
    if (!blogPage) {
      console.log('Blog page document not found');
      return;
    }

    // Update the blog-page document with new blog posts
    const result = await contentsCollection.updateOne(
      { type: 'blog-page' },
      {
        $set: {
          content: {
            blogPosts: updatedBlogPosts
          },
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('Blog posts updated successfully!');
      console.log(`Updated ${updatedBlogPosts.length} blog posts`);
      
      // Display the updated posts
      console.log('\nUpdated blog posts:');
      updatedBlogPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Category: ${post.category}`);
        console.log(`   Featured: ${post.featured}`);
        console.log(`   Published: ${post.published}`);
        console.log(`   Testimonials: ${post.testimonials?.length || 0}`);
        console.log(`   Similar Posts: ${post.similarPosts?.length || 0}`);
        console.log('');
      });
    } else {
      console.log('No changes made to blog posts');
    }

  } catch (error) {
    console.error('Error updating blog posts:', error);
  } finally {
    await client.close();
  }
}

// Run the update function
updateBlogPosts(); 