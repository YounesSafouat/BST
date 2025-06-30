const mongoose = require('mongoose');
require('dotenv').config();

// Define the Appearance schema (same as in models/Appearance.ts)
const AppearanceSchema = new mongoose.Schema({
  // Primary Colors
  primaryColor: { type: String, default: '#10b981', required: true },
  secondaryColor: { type: String, default: '#6366f1', required: true },
  accentColor: { type: String, default: '#f59e0b', required: true },

  // Background Colors
  backgroundColor: { type: String, default: '#ffffff', required: true },
  surfaceColor: { type: String, default: '#f9fafb', required: true },

  // Text Colors
  textPrimary: { type: String, default: '#111827', required: true },
  textSecondary: { type: String, default: '#6b7280', required: true },
  textMuted: { type: String, default: '#9ca3af', required: true },

  // Typography
  fontFamily: { type: String, default: 'Inter', required: true },
  headingFontFamily: { type: String, default: 'Inter', required: true },
  fontSize: { type: String, default: '16px', required: true },
  headingFontSize: { type: String, default: '24px', required: true },
  lineHeight: { type: String, default: '1.5', required: true },

  // Spacing
  borderRadius: { type: String, default: '8px', required: true },
  spacing: { type: String, default: '16px', required: true },

  // Shadows
  shadowColor: { type: String, default: 'rgba(0, 0, 0, 0.1)', required: true },
  shadowSize: { type: String, default: '4px', required: true },

  // Gradients
  gradientStart: { type: String, default: '#10b981', required: true },
  gradientEnd: { type: String, default: '#059669', required: true },

  // Status
  isActive: { type: Boolean, default: true, required: true },

  // Metadata
  name: { type: String, default: 'Default Theme', required: true },
  description: { type: String, default: 'Default appearance settings', required: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Appearance = mongoose.models.Appearance || mongoose.model('Appearance', AppearanceSchema);

// Light theme (current settings)
const lightTheme = {
  name: 'BST Light Theme',
  description: 'Default light theme for Black Swan Technology',
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
};

// Dark theme
const darkTheme = {
  name: 'BST Dark Theme',
  description: 'Dark theme for Black Swan Technology',
  isActive: false,
  primaryColor: '#10b981',
  secondaryColor: '#6366f1',
  accentColor: '#f59e0b',
  backgroundColor: '#111827',
  surfaceColor: '#1f2937',
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  fontFamily: 'Inter',
  headingFontFamily: 'Inter',
  fontSize: '16px',
  headingFontSize: '24px',
  lineHeight: '1.5',
  borderRadius: '8px',
  spacing: '16px',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowSize: '4px',
  gradientStart: '#10b981',
  gradientEnd: '#059669',
};

async function seedThemes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing themes
    await Appearance.deleteMany({});
    console.log('Cleared existing themes');

    // Insert light theme
    const lightThemeDoc = new Appearance(lightTheme);
    await lightThemeDoc.save();
    console.log('✅ Light theme created');

    // Insert dark theme
    const darkThemeDoc = new Appearance(darkTheme);
    await darkThemeDoc.save();
    console.log('✅ Dark theme created');

    console.log('\n🎉 Themes seeded successfully!');
    console.log('Light theme is set as active by default.');

  } catch (error) {
    console.error('Error seeding themes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedThemes(); 