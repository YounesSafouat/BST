// Content Block Types
export type ContentBlockType = 
  | 'text-only'                    // Just text content like "Pourquoi Blackswan a été choisi ?"
  | 'text-image-left'             // Text on right, image on left like "Notre Approche"
  | 'text-image-right'            // Text on left, image on right
  | 'image-stats-left'            // Image on left, stats on right like "Résultats Obtenus"
  | 'image-stats-right'           // Image on right, stats on left
  | 'text-stats'                  // Text with statistics like "Impact & Transformation"
  | 'cards-layout'                // Multiple cards like "Le Livrable"
  | 'video'                       // Video content
  | 'testimonial'                 // Testimonial block
  | 'contact-form'                // Contact form block
  | 'cta'                         // Call to action

export interface ContentBlock {
  _id?: string; // Optional for new blocks
  id: string;
  type: ContentBlockType;
  order: number;
  title?: string;
  content?: string; // HTML content for text blocks
  
  // Section badge customization
  sectionBadge?: string;
  sectionBadgeIcon?: string;
  
  // For text-image blocks
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  
  // For section background images (cards-layout)
  sectionImageUrl?: string;
  sectionImageAlt?: string;
  
  // For video blocks
  videoUrl?: string;
  videoThumbnail?: string;
  
  // For stats blocks
  stats?: { 
    label: string; 
    value: string; 
    icon?: string;
  }[];
  
  // For cards layout
  cards?: {
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
  }[];
  
  // For testimonial blocks
  testimonial?: {
    quote: string;
    author: {
      name: string;
      role: string;
      company: string;
      avatar?: string;
    };
    rating?: number;
  };
  
  // For CTA blocks
  cta?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  
  // Additional styling options
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
}

// Enhanced CAS Client interface for the new dynamic system
export interface DynamicClientCase {
  // Basic Info
  slug: string
  name: string
  headline: string
  summary: string
  
  // Company Details
  company: {
    logo: string
    size: string // e.g., "50-100 employés"
    sector: string
    customSector?: string // Custom sector when "Autre" is selected
    location?: string
    website?: string
  }
  
  // Project Details
  project: {
    solution: 'hubspot' | 'odoo' | 'both' | 'custom'
    customSolution?: string
    duration: string // e.g., "6 mois"
    teamSize: string // e.g., "5 personnes"
    budget?: string
    status: 'completed' | 'in-progress' | 'on-hold'
  }
  
  // Media
  media: {
    coverImage: string
    heroVideo?: string
    heroVideoThumbnail?: string
    cardBackgroundImage?: string
    gallery?: Array<{
      url: string
      alt: string
      caption?: string
    }>
  }
  
  // Dynamic Content
  contentBlocks: ContentBlock[]
  
  // SEO & Metadata
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  
  // Social Proof
  testimonial?: {
    quote: string
    author: {
      name: string
      role: string
      company: string
      avatar?: string
    }
    rating?: number
    videoUrl?: string
  }
  
  // Project Stats (for quick display)
  quickStats?: Array<{
    label: string
    value: string
    icon?: string
  }>
  
  // Filtering & Discovery
  tags: string[]
  featured: boolean
  published: boolean
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// CMS Form Types for the admin interface
export interface ClientCaseFormData {
  // Basic Info
  slug: string
  name: string
  headline: string
  summary: string
  
  // Company Details
  company: {
    logo: string
    size: string
    sector: string
    customSector?: string // Custom sector when "Autre" is selected
    location?: string
    website?: string
  }
  
  // Project Details
  project: {
    solution: 'hubspot' | 'odoo' | 'both' | 'custom'
    customSolution?: string
    duration: string
    teamSize: string
    budget?: string
    status: 'completed' | 'in-progress' | 'on-hold'
  }
  
  // Media
  media: {
    coverImage: string
    heroVideo?: string
    heroVideoThumbnail?: string
    cardBackgroundImage?: string
    gallery?: Array<{
      url: string
      alt: string
      caption?: string
    }>
  }
  
  // Content Blocks (simplified for form)
  contentBlocks: Array<{
    id: string
    type: ContentBlockType
    order: number
    data: any // Will be validated based on type
  }>
  
  // SEO
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  
  // Social Proof
  testimonial?: {
    quote: string
    author: {
      name: string
      role: string
      company: string
      avatar?: string
    }
    rating?: number
    videoUrl?: string
  }
  
  // Quick Stats
  quickStats?: Array<{
    label: string
    value: string
    icon?: string
  }>
  
  // Filtering
  tags: string[]
  featured: boolean
  published: boolean
}

// Filter options for the CAS client listing
export interface ClientCaseFilters {
  search?: string
  solution?: 'all' | 'hubspot' | 'odoo' | 'both' | 'custom'
  sector?: string
  tags?: string[]
  featured?: boolean
  published?: boolean
  sortBy?: 'newest' | 'oldest' | 'name' | 'featured'
}

// API Response types
export interface ClientCasesResponse {
  cases: DynamicClientCase[]
  total: number
  page: number
  limit: number
  filters: ClientCaseFilters
}

// Content Block Templates for easy creation
export const CONTENT_BLOCK_TEMPLATES = {
  'text-only': {
    type: 'text-only' as const,
    title: 'Titre de la section',
    content: '<p>Votre contenu ici...</p>'
  },
  'text-image-left': {
    type: 'text-image-left' as const,
    title: 'Notre Approche',
    content: '<p>Nous avons développé une approche méthodique pour accompagner [NOM_CLIENT] dans sa transformation digitale...</p>',
    imageUrl: '',
    imageAlt: 'Image du projet'
  },
  'text-image-right': {
    type: 'text-image-right' as const,
    title: 'Titre de la section',
    content: '<p>Votre contenu ici...</p>',
    imageUrl: '',
    imageAlt: 'Description de l\'image'
  },
  'image-stats-left': {
    type: 'image-stats-left' as const,
    title: 'Résultats Obtenus',
    content: '<p>La collaboration avec [NOM_CLIENT] a permis d\'atteindre des résultats significatifs...</p>',
    imageUrl: '',
    imageAlt: 'Résultats',
    stats: [
      { label: 'Performance', value: '+85%', icon: 'trending-up', description: 'Amélioration de la performance' },
      { label: 'Temps perdu', value: '-60%', icon: 'clock', description: 'Réduction du temps perdu' }
    ]
  },
  'image-stats-right': {
    type: 'image-stats-right' as const,
    title: 'Titre de la section',
    content: '<p>Votre contenu ici...</p>',
    imageUrl: '',
    imageAlt: 'Description de l\'image',
    stats: [
      { label: 'Métrique 1', value: '100%', icon: 'trending-up', description: 'Description' },
      { label: 'Métrique 2', value: '+50%', icon: 'bar-chart', description: 'Description' }
    ]
  },
  'text-stats': {
    type: 'text-stats' as const,
    title: 'Impact & Transformation',
    content: '<p>La transformation digitale de [NOM_CLIENT] a eu un impact significatif sur l\'ensemble de l\'organisation...</p>',
    stats: [
      { label: 'Efficacité opérationnelle', value: '+90%', icon: 'trending-up' },
      { label: 'Satisfaction client', value: '+75%', icon: 'heart' },
      { label: 'Réduction des erreurs', value: '-80%', icon: 'check-circle' }
    ]
  },
  'cards-layout': {
    type: 'cards-layout' as const,
    title: 'Le Livrable',
    content: '<p>Description des livrables du projet...</p>',
    cards: [
      {
        title: 'Migration Odoo Complète',
        description: 'Une migration complète d\'Odoo vers la dernière version, incluant la formation des équipes...',
        icon: 'database'
      },
      {
        title: 'Formation Personnalisée',
        description: 'Sessions de formation adaptées aux besoins spécifiques de [NOM_CLIENT]...',
        icon: 'users'
      },
      {
        title: 'Support & Accompagnement',
        description: 'Un accompagnement continu post-migration pour assurer la stabilité du système...',
        icon: 'headphones'
      }
    ]
  },
  'video': {
    type: 'video' as const,
    title: 'Vidéo du projet',
    content: '<p>Description de la vidéo...</p>',
    videoUrl: '',
    videoThumbnail: ''
  },
  'testimonial': {
    type: 'testimonial' as const,
    title: 'Témoignage client',
    testimonial: {
      quote: 'BlackSwan Technology a transformé notre façon de travailler. L\'efficacité a considérablement augmenté.',
      author: {
        name: 'Nom du client',
        role: 'Directeur Général',
        company: 'Nom de l\'entreprise',
        avatar: ''
      },
      rating: 5
    }
  },
  'contact-form': {
    type: 'contact-form' as const,
    title: 'Intéressé par notre travail?',
    
  },
  'cta': {
    type: 'cta' as const,
    title: 'Prêt à transformer votre entreprise ?',
    content: '<p>Contactez-nous pour discuter de votre projet de transformation digitale.</p>',
    cta: {
      text: 'Nous Contacter',
      url: '/#contact',
      style: 'primary' as const
    }
  }
} as const

// Available sectors for filtering
export const AVAILABLE_SECTORS = [
  'Technologie',
  'Industrie',
  'Santé',
  'Éducation',
  'Commerce',
  'Automobile',
  'Restauration',
  'Immobilier',
  'Finance',
  'Logistique',
  'Agriculture',
  'Tourisme',
  'Autre'
] as const

// Available tags for better categorization
export const AVAILABLE_TAGS = [
  'migration',
  'crm',
  'erp',
  'e-commerce',
  'formation',
  'support',
  'développement',
  'intégration',
  'optimisation',
  'automatisation',
  'roi',
  'croissance',
  'efficacité',
  'collaboration'
] as const
