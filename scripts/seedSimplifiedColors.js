const mongoose = require('mongoose');
require('dotenv').config();

// Define the simplified Appearance schema
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

const Appearance = mongoose.model('Appearance', AppearanceSchema);

async function seedSimplifiedColors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing appearance data
    await Appearance.deleteMany({});
    console.log('Cleared existing appearance data');

    // Create default theme with simplified colors
    const defaultTheme = new Appearance({
      name: 'Default Theme',
      description: 'Default appearance settings with simplified color system',
      isActive: true,
      
      // Simplified Color System
      colorMain: '#ff5c35',      // Orange
      colorSecondary: '#714b67', // Purple
      colorBackground: '#ffffff', // White
      colorBlack: '#000000',     // Black
      colorWhite: '#ffffff',     // White
      colorGray: '#6b7280',      // Gray
      colorGreen: '#10b981',     // Green
      
      // Typography
      fontFamily: 'Inter',
      headingFontFamily: 'Inter',
      fontSize: '16px',
      headingFontSize: '24px',
      lineHeight: '1.5',
      
      // Spacing & Effects
      borderRadius: '8px',
      spacing: '16px',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowSize: '4px',
    });

    await defaultTheme.save();
    console.log('✅ Default theme created successfully');

    // Create a dark theme variant
    const darkTheme = new Appearance({
      name: 'Dark Theme',
      description: 'Dark theme with simplified color system',
      isActive: false,
      
      // Simplified Color System - Dark variant
      colorMain: '#ff5c35',      // Orange (same)
      colorSecondary: '#714b67', // Purple (same)
      colorBackground: '#1f2937', // Dark background
      colorBlack: '#ffffff',     // White text on dark
      colorWhite: '#000000',     // Black text on light
      colorGray: '#9ca3af',      // Lighter gray for dark theme
      colorGreen: '#10b981',     // Green (same)
      
      // Typography
      fontFamily: 'Inter',
      headingFontFamily: 'Inter',
      fontSize: '16px',
      headingFontSize: '24px',
      lineHeight: '1.5',
      
      // Spacing & Effects
      borderRadius: '8px',
      spacing: '16px',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowSize: '4px',
    });

    await darkTheme.save();
    console.log('✅ Dark theme created successfully');

    console.log('🎨 Simplified color system seeded successfully!');
    console.log('\nAvailable colors:');
    console.log('- Orange (Main): #ff5c35');
    console.log('- Purple (Secondary): #714b67');
    console.log('- Background: #ffffff');
    console.log('- Black: #000000');
    console.log('- White: #ffffff');
    console.log('- Gray: #6b7280');
    console.log('- Green: #10b981');

  } catch (error) {
    console.error('❌ Error seeding simplified colors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedSimplifiedColors(); 