const mongoose = require('mongoose');
require('dotenv').config();

async function fixSEOIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('seos');

    // Drop the old unique index on 'page' field
    try {
      await collection.dropIndex('page_1');
      console.log('Dropped old index on page field');
    } catch (error) {
      console.log('Old index on page field not found or already dropped');
    }

    // Create the new compound unique index on { page, language }
    try {
      await collection.createIndex({ page: 1, language: 1 }, { unique: true });
      console.log('Created new compound unique index on { page, language }');
    } catch (error) {
      console.log('Compound index already exists or error creating it:', error.message);
    }

    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.key));

    console.log('SEO index fix completed successfully');
  } catch (error) {
    console.error('Error fixing SEO index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixSEOIndex(); 