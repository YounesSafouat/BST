const mongoose = require('mongoose');
require('dotenv').config();

async function clearAndSeedSEO() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('seos');

    // List all indexes before
    const beforeIndexes = await collection.indexes();
    console.log('Indexes before:', beforeIndexes.map(idx => idx.key));

    // Clear all existing SEO data
    console.log('Clearing existing SEO data...');
    await collection.deleteMany({});
    console.log('Cleared existing SEO data');

    // Drop 'page_1' index if it exists
    const indexNames = beforeIndexes.map(idx => idx.name);
    if (indexNames.includes('page_1')) {
      await collection.dropIndex('page_1');
      console.log('Dropped old index on page field (page_1)');
    } else {
      console.log('No page_1 index to drop');
    }

    // Drop all other indexes except _id
    await collection.dropIndexes();
    console.log('Dropped all indexes except _id');

    // Create the compound unique index
    console.log('Creating compound unique index...');
    await collection.createIndex({ page: 1, language: 1 }, { unique: true });
    console.log('Created compound unique index');

    // List all indexes after
    const afterIndexes = await collection.indexes();
    console.log('Indexes after:', afterIndexes.map(idx => idx.key));

    console.log('SEO collection cleared and ready for seeding');
  } catch (error) {
    console.error('Error clearing SEO data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

clearAndSeedSEO(); 