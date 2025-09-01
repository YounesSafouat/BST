import mongoose from 'mongoose';

const StructuredDataSchema = new mongoose.Schema({
  // Basic Business Information
  businessName: {
    type: String,
    required: true,
    default: 'BlackSwan Technology'
  },
  alternateNames: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  foundingDate: {
    type: String,
    default: '2022'
  },
  websiteUrl: {
    type: String,
    required: true,
    default: 'https://agence-blackswan.com'
  },
  
  // Logo and Images
  logo: {
    type: String,
    required: true
  },
  businessImage: {
    type: String
  },
  
  // Address Information
  address: {
    streetAddress: {
      type: String,
      required: true
    },
    addressLocality: {
      type: String,
      required: true,
      default: 'Casablanca'
    },
    addressRegion: {
      type: String,
      required: true,
      default: 'Casablanca-Settat'
    },
    postalCode: {
      type: String,
      required: true
    },
    addressCountry: {
      type: String,
      required: true,
      default: 'MA'
    }
  },
  
  // Geographic Coordinates
  geo: {
    latitude: {
      type: Number,
      required: true,
      default: 33.5731
    },
    longitude: {
      type: Number,
      required: true,
      default: -7.5898
    }
  },
  
  // Contact Information
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  
  // Business Hours
  businessHours: {
    monday: {
      isOpen: { type: Boolean, default: true },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      opens: { type: String, default: '09:00' },
      closes: { type: String, default: '18:00' }
    }
  },
  
  // Contact Points
  contactPoints: [{
    telephone: String,
    contactType: {
      type: String,
      enum: ['customer service', 'sales', 'technical support', 'billing support'],
      default: 'customer service'
    },
    areaServed: String,
    availableLanguage: [String],
    hoursAvailable: {
      dayOfWeek: [String],
      opens: String,
      closes: String
    }
  }],
  
  // Social Media
  socialMedia: {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  
  // Service Areas
  serviceAreas: [{
    type: {
      type: String,
      enum: ['Country', 'City', 'Region'],
      default: 'Country'
    },
    name: String
  }],
  
  // Services Offered
  services: [{
    name: String,
    description: String,
    category: String
  }],
  
  // Business Details
  priceRange: {
    type: String,
    enum: ['€', '€€', '€€€', '€€€€'],
    default: '€€'
  },
  paymentAccepted: [String],
  currenciesAccepted: [String],
  
  // Expertise
  knowsAbout: [String],
  
  // Schema Type Configuration
  schemaType: {
    type: String,
    enum: ['LocalBusiness', 'Organization', 'Service'],
    default: 'LocalBusiness'
  },
  
  // Page-specific configurations
  pageConfigurations: {
    home: {
      enabled: { type: Boolean, default: true },
      schemaType: { type: String, default: 'LocalBusiness' }
    },
    about: {
      enabled: { type: Boolean, default: true },
      schemaType: { type: String, default: 'Organization' }
    },
    contact: {
      enabled: { type: Boolean, default: true },
      schemaType: { type: String, default: 'LocalBusiness' }
    },
    hubspot: {
      enabled: { type: Boolean, default: true },
      schemaType: { type: String, default: 'Service' }
    },
    odoo: {
      enabled: { type: Boolean, default: true },
      schemaType: { type: String, default: 'Service' }
    }
  },
  
  // Google Business Profile Settings
  googleBusinessProfile: {
    verificationCode: String,
    isVerified: { type: Boolean, default: false },
    lastVerified: Date,
    businessCategory: String,
    attributes: [String]
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
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

// Index for efficient queries
StructuredDataSchema.index({ isActive: 1 });
StructuredDataSchema.index({ 'pageConfigurations.home.enabled': 1 });

export default mongoose.models.StructuredData || mongoose.model('StructuredData', StructuredDataSchema);
