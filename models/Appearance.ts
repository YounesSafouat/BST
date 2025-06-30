import mongoose from 'mongoose';

const AppearanceSchema = new mongoose.Schema({
  // Simplified Color System
  colorMain: {
    type: String,
    default: '#ff5c35', // Orange
    required: true
  },
  colorSecondary: {
    type: String,
    default: '#714b67', // Purple
    required: true
  },
  colorBackground: {
    type: String,
    default: '#ffffff', // White
    required: true
  },
  colorBlack: {
    type: String,
    default: '#000000', // Black
    required: true
  },
  colorWhite: {
    type: String,
    default: '#ffffff', // White
    required: true
  },
  colorGray: {
    type: String,
    default: '#6b7280', // Gray
    required: true
  },
  colorGreen: {
    type: String,
    default: '#10b981', // Green
    required: true
  },

  // Typography
  fontFamily: {
    type: String,
    default: 'Inter',
    required: true
  },
  headingFontFamily: {
    type: String,
    default: 'Inter',
    required: true
  },
  fontSize: {
    type: String,
    default: '16px',
    required: true
  },
  headingFontSize: {
    type: String,
    default: '24px',
    required: true
  },
  lineHeight: {
    type: String,
    default: '1.5',
    required: true
  },

  // Spacing
  borderRadius: {
    type: String,
    default: '8px',
    required: true
  },
  spacing: {
    type: String,
    default: '16px',
    required: true
  },

  // Shadows
  shadowColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.1)',
    required: true
  },
  shadowSize: {
    type: String,
    default: '4px',
    required: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },

  // Metadata
  name: {
    type: String,
    default: 'Default Theme',
    required: true
  },
  description: {
    type: String,
    default: 'Default appearance settings',
    required: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AppearanceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Appearance || mongoose.model('Appearance', AppearanceSchema); 