const mongoose = require('mongoose');
require('dotenv').config();

const AppearanceSchema = new mongoose.Schema({
  name: String,
  description: String,
  isActive: Boolean,
  // Generic brand colors
  brandMain: String,
  brandAccent: String,
  // Existing fields for compatibility
  primaryColor: String,
  secondaryColor: String,
  accentColor: String,
  backgroundColor: String,
  surfaceColor: String,
  textPrimary: String,
  textSecondary: String,
  textMuted: String,
  fontFamily: String,
  headingFontFamily: String,
  fontSize: String,
  headingFontSize: String,
  lineHeight: String,
  borderRadius: String,
  spacing: String,
  shadowColor: String,
  shadowSize: String,
  gradientStart: String,
  gradientEnd: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Appearance = mongoose.models.Appearance || mongoose.model('Appearance', AppearanceSchema);

const brandTheme = {
  name: 'Brand Theme',
  description: 'Theme using generic brand color variables',
  isActive: true,
  // Generic brand colors
  brandMain: '#714b67',
  brandAccent: '#ff5c35',
  // Existing fields for compatibility
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
  gradientStart: '#714b67',
  gradientEnd: '#ff5c35',
};

async function seedBrandTheme() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Appearance.deleteMany({});
    console.log('Cleared all previous themes');
    const doc = new Appearance(brandTheme);
    await doc.save();
    console.log('✅ Brand theme created and set as active');
  } catch (error) {
    console.error('Error seeding brand theme:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedBrandTheme(); 