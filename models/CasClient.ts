import mongoose from 'mongoose'

// Content Block Schema
const ContentBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'text-only',                    // Just text content like "Pourquoi Blackswan a été choisi ?"
      'text-image-left',             // Text on right, image on left like "Notre Approche"
      'text-image-right',            // Text on left, image on right
      'image-stats-left',            // Image on left, stats on right like "Résultats Obtenus"
      'image-stats-right',           // Image on right, stats on left
      'text-stats',                  // Text with statistics like "Impact & Transformation"
      'cards-layout',                // Multiple cards like "Le Livrable"
      'video',                       // Video content
      'testimonial',                 // Testimonial block
      'cta'                          // Call to action
    ]
  },
  order: { type: Number, required: true },
  title: { type: String },
  content: { type: String }, // HTML content
  
  // For text-image blocks
  imageUrl: { type: String },
  imageAlt: { type: String },
  imagePosition: { type: String, enum: ['left', 'right'] },
  
  // For video blocks
  videoUrl: { type: String },
  videoThumbnail: { type: String },
  
  // For stats blocks
  stats: [{
    label: { type: String },
    value: { type: String },
    description: { type: String },
    icon: { type: String } // Icon name for the stat
  }],
  
  // For cards layout
  cards: [{
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    imageUrl: { type: String }
  }],
  
  // For testimonial blocks
  testimonial: {
    quote: { type: String },
    author: {
      name: { type: String },
      role: { type: String },
      company: { type: String },
      avatar: { type: String }
    },
    rating: { type: Number, min: 1, max: 5 }
  },
  
  // For CTA blocks
  cta: {
    text: { type: String },
    url: { type: String },
    style: { type: String, enum: ['primary', 'secondary', 'outline'] }
  },
  
  // Additional styling options
  backgroundColor: { type: String },
  textColor: { type: String },
  padding: { type: String }
}, { _id: false })

// Company Schema
const CompanySchema = new mongoose.Schema({
  logo: { type: String, required: true },
  size: { type: String, required: true },
  sector: { type: String, required: true },
  location: { type: String },
  website: { type: String }
}, { _id: false })

// Project Schema
const ProjectSchema = new mongoose.Schema({
  solution: { 
    type: String, 
    required: true,
    enum: ['hubspot', 'odoo', 'both', 'custom']
  },
  customSolution: { type: String },
  duration: { type: String },
  teamSize: { type: String },
  budget: { type: String },
  status: { 
    type: String, 
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'completed'
  }
}, { _id: false })

// Media Schema
const MediaSchema = new mongoose.Schema({
  coverImage: { type: String },
  heroVideo: { type: String },
  heroVideoThumbnail: { type: String },
  gallery: [{ type: String }]
}, { _id: false })

// SEO Schema
const SEOSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImage: { type: String }
}, { _id: false })

// Testimonial Schema
const TestimonialSchema = new mongoose.Schema({
  quote: { type: String },
  author: {
    name: { type: String },
    role: { type: String },
    company: { type: String },
    avatar: { type: String }
  },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  videoUrl: { type: String }
}, { _id: false })

// Quick Stats Schema
const QuickStatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String },
  description: { type: String }
}, { _id: false })

// Main CAS Client Schema
const CasClientSchema = new mongoose.Schema({
  // Basic Info
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true },

  // Company Details
  company: { type: CompanySchema, required: true },

  // Project Details
  project: { type: ProjectSchema, required: true },

  // Media
  media: { type: MediaSchema, required: true },

  // Dynamic Content
  contentBlocks: [ContentBlockSchema],

  // SEO & Metadata
  seo: { type: SEOSchema },

  // Social Proof
  testimonial: { type: TestimonialSchema },

  // Quick Stats
  quickStats: [QuickStatSchema],

  // Filtering
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date }
}, {
  timestamps: true
})

// Update the updatedAt field before saving
CasClientSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create indexes for better performance
CasClientSchema.index({ slug: 1 })
CasClientSchema.index({ published: 1 })
CasClientSchema.index({ featured: 1 })
CasClientSchema.index({ 'company.sector': 1 })
CasClientSchema.index({ 'project.solution': 1 })
CasClientSchema.index({ tags: 1 })

export default mongoose.models.CasClient || mongoose.model('CasClient', CasClientSchema)
