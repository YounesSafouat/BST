import mongoose from 'mongoose';

const SEOSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'hubspot', 'odoo', 'contact', 'about', 'blog', 'clients', 'dashboard']
  },
  language: {
    type: String,
    required: true,
    enum: ['fr', 'en', 'ar'],
    default: 'fr'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  },
  ogTitle: {
    type: String
  },
  ogDescription: {
    type: String
  },
  ogImage: {
    type: String
  },
  canonical: {
    type: String
  },
  hreflang: [{
    language: String,
    url: String
  }],
  structuredData: {
    type: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index for page + language
SEOSchema.index({ page: 1, language: 1 }, { unique: true });

export default mongoose.models.SEO || mongoose.model('SEO', SEOSchema); 