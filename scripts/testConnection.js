const mongoose = require('mongoose');

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackswantechnology';
    console.log('🔌 Testing MongoDB connection...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test if we can access the Content model
    const Content = require('../models/Content');
    console.log('✅ Content model loaded successfully!');
    
    // Count existing documents
    const count = await Content.countDocuments();
    console.log(`📊 Current documents in database: ${count}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection(); 