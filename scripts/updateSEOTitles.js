const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import the SEO model
const SEO = require('../models/SEO.ts');

// Load the updated SEO data
const seoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-data.json'), 'utf8'));

async function updateSEOTitles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update each SEO entry
    for (const seoEntry of seoData) {
      const { page, language, ...updateData } = seoEntry;
      
      const result = await SEO.findOneAndUpdate(
        { page, language },
        updateData,
        { 
          new: true, 
          upsert: true,
          runValidators: true 
        }
      );
      
      console.log(`Updated SEO for ${page} (${language}): ${result.title}`);
    }

    console.log('All SEO titles updated successfully!');
  } catch (error) {
    console.error('Error updating SEO titles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateSEOTitles(); 