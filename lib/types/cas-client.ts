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
    description?: string
  }>

  // Sidebar Info - Dynamic key-value pairs for sidebar
  sidebarInfo?: Array<{
    key: string
    value: string
    icon?: string
    order?: number
  }>
  
  // Filtering & Discovery
  tags: string[]
  featured: boolean
  published: boolean
  
  // Regional targeting
  targetRegions?: string[]
  
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
    description?: string
  }>

  // Sidebar Info - Dynamic key-value pairs for sidebar
  sidebarInfo?: Array<{
    key: string
    value: string
    icon?: string
    order?: number
  }>

  // Filtering
  tags: string[]
  featured: boolean
  published: boolean
  
  // Regional targeting
  targetRegions?: string[]
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
    title: '',
    content: ''
  },
  'text-image-left': {
    type: 'text-image-left' as const,
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: ''
  },
  'text-image-right': {
    type: 'text-image-right' as const,
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: ''
  },
  'image-stats-left': {
    type: 'image-stats-left' as const,
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    stats: []
  },
  'image-stats-right': {
    type: 'image-stats-right' as const,
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    stats: []
  },
  'text-stats': {
    type: 'text-stats' as const,
    title: '',
    content: '',
    stats: []
  },
  'cards-layout': {
    type: 'cards-layout' as const,
    title: '',
    content: '',
    cards: []
  },
  'video': {
    type: 'video' as const,
    title: '',
    content: '',
    videoUrl: '',
    videoThumbnail: ''
  },
  'testimonial': {
    type: 'testimonial' as const,
    title: '',
    testimonial: {
      quote: '',
      author: {
        name: '',
        role: '',
        company: '',
        avatar: ''
      },
      rating: 0
    }
  },
  'contact-form': {
    type: 'contact-form' as const,
    title: ''
  },
  'cta': {
    type: 'cta' as const,
    title: '',
    content: '',
    cta: {
      text: '',
      url: '',
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
