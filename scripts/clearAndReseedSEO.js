const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Load the updated SEO data
const seoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-data.json'), 'utf8'));

// Define the SEO schema inline
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

// Create the model
const SEO = mongoose.models.SEO || mongoose.model('SEO', SEOSchema);

async function clearAndReseedSEO() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all existing SEO data
    await SEO.deleteMany({});
    console.log('Cleared all existing SEO data');

    // Insert the new SEO data
    for (const seoEntry of seoData) {
      const newSEO = new SEO({
        ...seoEntry,
        updatedBy: 'system'
      });
      await newSEO.save();
      console.log(`Created SEO for ${seoEntry.page} (${seoEntry.language}): ${seoEntry.title}`);
    }

    console.log('All SEO data reseeded successfully!');
  } catch (error) {
    console.error('Error reseeding SEO data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

clearAndReseedSEO(); 