const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (process.env.CLOUDINARY_URL) {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (urlMatch) {
    cloudinary.config({
      cloud_name: urlMatch[3],
      api_key: urlMatch[1],
      api_secret: urlMatch[2],
      secure: true
    });
  } else {
    throw new Error('Invalid CLOUDINARY_URL format');
  }
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
} else {
  throw new Error('Cloudinary credentials not found. Please set CLOUDINARY_URL or individual credentials in .env');
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

const stats = {
  totalImages: 0,
  uploaded: 0,
  skipped: 0,
  failed: 0,
  errors: [],
};

const imageCache = new Map();

function isImageUrl(value) {
  if (typeof value !== 'string') return false;
  
  const url = value.trim();
  
  if (!url) return false;
  
  if (url.startsWith('data:')) return false;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const urlLower = url.toLowerCase();
    
    if (imageExtensions.some(ext => urlLower.includes(ext))) {
      return true;
    }
    
    if (url.includes('hubspotusercontent')) {
      return true;
    }
    
    if (url.includes('res.cloudinary.com')) {
      return false;
    }
  }
  
  return false;
}

function isVideoUrl(value) {
  if (typeof value !== 'string') return false;
  
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith('data:')) return false;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const urlLower = url.toLowerCase();
    return videoExtensions.some(ext => urlLower.includes(ext)) || 
           url.includes('video') || 
           url.includes('youtube') || 
           url.includes('vimeo');
  }
  
  return false;
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location || '').then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToCloudinary(url, resourceType = 'auto') {
  if (imageCache.has(url)) {
    stats.skipped++;
    return imageCache.get(url);
  }
  
  if (url.includes('res.cloudinary.com')) {
    stats.skipped++;
    const mapping = {
      oldUrl: url,
      newUrl: url,
      publicId: '',
    };
    imageCache.set(url, mapping);
    return mapping;
  }
  
  try {
    console.log(`Downloading: ${url}`);
    const buffer = await downloadFile(url);
    
    console.log(`Uploading to Cloudinary: ${url}`);
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType === 'auto' ? 'auto' : resourceType,
          folder: 'bst-migration',
          allowed_formats: resourceType === 'video' 
            ? ['mp4', 'webm', 'mov', 'avi', 'mkv'] 
            : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    const mapping = {
      oldUrl: url,
      newUrl: result.secure_url,
      publicId: result.public_id,
    };
    
    imageCache.set(url, mapping);
    stats.uploaded++;
    console.log(`✓ Uploaded: ${url} → ${result.secure_url}`);
    
    return mapping;
  } catch (error) {
    stats.failed++;
    const errorMsg = error.message || 'Unknown error';
    stats.errors.push({ url, error: errorMsg });
    console.error(`✗ Failed to upload ${url}: ${errorMsg}`);
    throw error;
  }
}

async function processImagesInObject(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => processImagesInObject(item)));
  }
  
  if (typeof obj === 'object') {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (isImageUrl(value)) {
        try {
          const mapping = await uploadToCloudinary(value, 'image');
          result[key] = mapping.newUrl;
          stats.totalImages++;
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to process image at ${key}, keeping original URL`);
          result[key] = value;
        }
      } else if (isVideoUrl(value)) {
        try {
          const mapping = await uploadToCloudinary(value, 'video');
          result[key] = mapping.newUrl;
          stats.totalImages++;
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to process video at ${key}, keeping original URL`);
          result[key] = value;
        }
      } else if (typeof value === 'object') {
        result[key] = await processImagesInObject(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  return obj;
}

function convertMongoDates(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertMongoDates(item));
  }
  
  if (typeof obj === 'object') {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' && value && typeof value === 'object' && '$oid' in value) {
        result._id = new mongoose.Types.ObjectId(value.$oid);
      } else if ((key === 'createdAt' || key === 'updatedAt' || key === 'publishedAt' || key === 'lastUpdated') && 
                 value && typeof value === 'object' && '$date' in value) {
        result[key] = new Date(value.$date);
      } else if (typeof value === 'object') {
        result[key] = convertMongoDates(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  return obj;
}

async function migrateCollection(collectionName, jsonFilePath, Model) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${collectionName}`);
  console.log(`${'='.repeat(60)}`);
  
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`File not found: ${jsonFilePath}`);
    return;
  }
  
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const documents = JSON.parse(fileContent);
  
  if (!Array.isArray(documents)) {
    console.error(`Expected array in ${jsonFilePath}`);
    return;
  }
  
  console.log(`Found ${documents.length} documents`);
  
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    console.log(`\nProcessing document ${i + 1}/${documents.length}`);
    
    try {
      const processedDoc = await processImagesInObject(doc);
      const convertedDoc = convertMongoDates(processedDoc);
      
      if (convertedDoc._id) {
        const documentId = convertedDoc._id;
        delete convertedDoc._id;
        delete convertedDoc.__v;
        
        await Model.findByIdAndUpdate(
          documentId,
          { $set: convertedDoc },
          { upsert: true, new: true, runValidators: false }
        );
        
        console.log(`✓ Updated document ${documentId}`);
      } else {
        console.log(`⚠ Document ${i + 1} has no _id, skipping...`);
      }
    } catch (error) {
      console.error(`✗ Error processing document ${i + 1}:`, error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }
}

async function main() {
  console.log('Starting image migration to Cloudinary...');
  console.log(`MongoDB URI: ${MONGODB_URI.substring(0, 20)}...`);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const scriptDir = __dirname;
    
    const ContentSchema = new mongoose.Schema({}, { strict: false, collection: 'contents' });
    const CasClientSchema = new mongoose.Schema({}, { strict: false, collection: 'casclients' });
    const TestimonialSchema = new mongoose.Schema({}, { strict: false, collection: 'testimonials' });
    const SEOSchema = new mongoose.Schema({}, { strict: false, collection: 'seos' });
    
    const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
    const CasClient = mongoose.models.CasClient || mongoose.model('CasClient', CasClientSchema);
    const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
    const SEO = mongoose.models.SEO || mongoose.model('SEO', SEOSchema);
    
    await migrateCollection(
      'contents',
      path.join(scriptDir, 'blackswantechnology.contents.json'),
      Content
    );
    
    await migrateCollection(
      'casclients',
      path.join(scriptDir, 'blackswantechnology.casclients.json'),
      CasClient
    );
    
    await migrateCollection(
      'testimonials',
      path.join(scriptDir, 'blackswantechnology.testimonials.json'),
      Testimonial
    );
    
    await migrateCollection(
      'seos',
      path.join(scriptDir, 'blackswantechnology.seos.json'),
      SEO
    );
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('Migration Summary');
    console.log(`${'='.repeat(60)}`);
    console.log(`Total images found: ${stats.totalImages}`);
    console.log(`Successfully uploaded: ${stats.uploaded}`);
    console.log(`Skipped (cached): ${stats.skipped}`);
    console.log(`Failed: ${stats.failed}`);
    
    if (stats.errors.length > 0) {
      console.log(`\nErrors:`);
      stats.errors.forEach(({ url, error }) => {
        console.log(`  - ${url}: ${error}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\nMigration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();

