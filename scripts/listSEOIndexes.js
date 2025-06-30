const mongoose = require('mongoose');
require('dotenv').config();

async function listSEOIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('seos');

    const indexes = await collection.indexes();
    console.log('Current indexes on seos collection:');
    indexes.forEach(idx => console.log(idx));
  } catch (error) {
    console.error('Error listing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

listSEOIndexes(); 