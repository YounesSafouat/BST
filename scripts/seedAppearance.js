const mongoose = require('mongoose');
require('dotenv').config();

// Define the Appearance schema
const AppearanceSchema = new mongoose.Schema({
  // Primary Colors
  primaryColor: {
    type: String,
    default: '#10b981', // Green
    required: true
  },
  secondaryColor: {
    type: String,
    default: '#6366f1', // Indigo
    required: true
  },
  accentColor: {
    type: String,
    default: '#f59e0b', // Amber
    required: true
  },

  // Background Colors
  backgroundColor: {
    type: String,
    default: '#ffffff', // White
    required: true
  },
  surfaceColor: {
    type: String,
    default: '#f9fafb', // Gray-50
    required: true
  },

  // Text Colors
  textPrimary: {
    type: String,
    default: '#111827', // Gray-900
    required: true
  },
  textSecondary: {
    type: String,
    default: '#6b7280', // Gray-500
    required: true
  },
  textMuted: {
    type: String,
    default: '#9ca3af', // Gray-400
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

  // Gradients
  gradientStart: {
    type: String,
    default: '#10b981',
    required: true
  },
  gradientEnd: {
    type: String,
    default: '#059669',
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

const Appearance = mongoose.models.Appearance || mongoose.model('Appearance', AppearanceSchema);

async function seedAppearance() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if appearance settings already exist
    const existingAppearance = await Appearance.findOne({ isActive: true });
    
    if (existingAppearance) {
      console.log('Appearance settings already exist, skipping seed');
      return;
    }

    // Create default appearance settings
    const defaultAppearance = new Appearance({
      name: 'Default Theme',
      description: 'Default appearance settings for Blackswan Technology',
      isActive: true,
      primaryColor: '#10b981',
      secondaryColor: '#6366f1',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      surfaceColor: '#f9fafb',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      fontFamily: 'Inter',
      headingFontFamily: 'Inter',
      fontSize: '16px',
      headingFontSize: '24px',
      lineHeight: '1.5',
      borderRadius: '8px',
      spacing: '16px',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowSize: '4px',
      gradientStart: '#10b981',
      gradientEnd: '#059669',
    });

    await defaultAppearance.save();
    console.log('Default appearance settings created successfully');

    // Create a few additional themes
    const themes = [
      {
        name: 'Dark Theme',
        description: 'Dark mode appearance settings',
        isActive: false,
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#f59e0b',
        backgroundColor: '#0f172a',
        surfaceColor: '#1e293b',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
        fontFamily: 'Inter',
        headingFontFamily: 'Inter',
        fontSize: '16px',
        headingFontSize: '24px',
        lineHeight: '1.5',
        borderRadius: '8px',
        spacing: '16px',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowSize: '4px',
        gradientStart: '#3b82f6',
        gradientEnd: '#1d4ed8',
      },
      {
        name: 'Warm Theme',
        description: 'Warm and inviting color scheme',
        isActive: false,
        primaryColor: '#f97316',
        secondaryColor: '#ec4899',
        accentColor: '#fbbf24',
        backgroundColor: '#fefefe',
        surfaceColor: '#fef3c7',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textMuted: '#9ca3af',
        fontFamily: 'Poppins',
        headingFontFamily: 'Poppins',
        fontSize: '16px',
        headingFontSize: '24px',
        lineHeight: '1.6',
        borderRadius: '12px',
        spacing: '20px',
        shadowColor: 'rgba(249, 115, 22, 0.1)',
        shadowSize: '6px',
        gradientStart: '#f97316',
        gradientEnd: '#ea580c',
      }
    ];

    for (const theme of themes) {
      const newTheme = new Appearance(theme);
      await newTheme.save();
      console.log(`Theme "${theme.name}" created successfully`);
    }

    console.log('All appearance themes seeded successfully');
  } catch (error) {
    console.error('Error seeding appearance settings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAppearance(); 