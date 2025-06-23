const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// IMPORTANT: Replace with your full MongoDB Atlas connection string and the path to your JSON file.
const MONGO_URI = 'mongodb+srv://younes:Bst.987654321@cluster0.7oaxi3p.mongodb.net/blackswantechnology?retryWrites=true&w=majority&appName=Cluster0';
const JSON_FILE_PATH = path.join(__dirname, 'blackswantechnology.contents.json');
const COLLECTION_NAME = 'contents';

// --- Mongoose Model Definition ---
// A generic schema to accept any structure from the JSON file.
const contentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  strict: false // Allows for fields not defined in the schema
});

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema, COLLECTION_NAME);

// --- Migration Logic ---
async function migrateData() {
  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error(`\n[ERROR] JSON file not found at: ${JSON_FILE_PATH}`);
    console.error('Please make sure the file exists and the path is correct in the script.');
    return;
  }

  console.log('[INFO] Starting database migration...');

  try {
    // 1. Connect to MongoDB Atlas
    console.log('[INFO] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('[SUCCESS] Connected to MongoDB Atlas successfully.');

    // 2. Read and Parse JSON file
    console.log(`[INFO] Reading data from ${JSON_FILE_PATH}...`);
    const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const data = JSON.parse(rawData);
    console.log(`[SUCCESS] Found ${data.length} documents to migrate.`);
    
    // 3. Clear existing collection
    console.log(`[INFO] Clearing the '${COLLECTION_NAME}' collection to prevent duplicates...`);
    await Content.deleteMany({});
    console.log('[SUCCESS] Collection cleared.');

    // 4. Insert new data
    console.log(`[INFO] Inserting ${data.length} new documents into the '${COLLECTION_NAME}' collection...`);
    // The MongoDB driver might add _id, so we ensure the ones from the file are used.
    await Content.insertMany(data, { ordered: false });
    console.log('[SUCCESS] All documents have been inserted successfully.');

    console.log('\n[COMPLETE] Migration finished without errors.');

  } catch (error) {
    console.error('\n[FATAL ERROR] An error occurred during the migration process:');
    console.error(error);
    process.exit(1);
  } finally {
    // 5. Close the connection
    await mongoose.connection.close();
    console.log('\n[INFO] Database connection closed.');
  }
}

// --- Run the migration ---
migrateData(); 