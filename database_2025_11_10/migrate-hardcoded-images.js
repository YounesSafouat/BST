const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { v2: cloudinary } = require('cloudinary');
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
} else {
  throw new Error('Cloudinary credentials not found');
}

const stats = {
  filesProcessed: 0,
  imagesFound: 0,
  uploaded: 0,
  skipped: 0,
  failed: 0,
  updated: 0,
  errors: [],
};

const imageCache = new Map();
const urlMapping = new Map();

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

async function uploadToCloudinary(url) {
  if (urlMapping.has(url)) {
    stats.skipped++;
    return urlMapping.get(url);
  }
  
  if (url.includes('res.cloudinary.com')) {
    stats.skipped++;
    urlMapping.set(url, url);
    return url;
  }
  
  try {
    console.log(`  Downloading: ${url.substring(0, 80)}...`);
    const buffer = await downloadFile(url);
    
    console.log(`  Uploading to Cloudinary...`);
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'bst-migration',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    const newUrl = result.secure_url;
    urlMapping.set(url, newUrl);
    stats.uploaded++;
    console.log(`  ✓ Uploaded: ${newUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return newUrl;
  } catch (error) {
    stats.failed++;
    const errorMsg = error.message || 'Unknown error';
    stats.errors.push({ url, error: errorMsg });
    console.error(`  ✗ Failed: ${errorMsg}`);
    return null;
  }
}

function findHubSpotUrls(content) {
  const regex = /https:\/\/144151551\.fs1\.hubspotusercontent-eu1\.net[^\s"'`\)]+/g;
  return content.match(regex) || [];
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const urls = findHubSpotUrls(content);
    
    if (urls.length === 0) {
      return;
    }
    
    console.log(`\nProcessing: ${filePath}`);
    console.log(`  Found ${urls.length} HubSpot URL(s)`);
    
    stats.filesProcessed++;
    stats.imagesFound += urls.length;
    
    let updatedContent = content;
    let hasUpdates = false;
    
    for (const oldUrl of urls) {
      const newUrl = await uploadToCloudinary(oldUrl);
      if (newUrl && newUrl !== oldUrl) {
        updatedContent = updatedContent.replace(new RegExp(escapeRegex(oldUrl), 'g'), newUrl);
        hasUpdates = true;
      }
    }
    
    if (hasUpdates) {
      fs.writeFileSync(filePath, updatedContent, 'utf-8');
      stats.updated++;
      console.log(`  ✓ File updated`);
    } else {
      console.log(`  ⚠ No updates made`);
    }
  } catch (error) {
    console.error(`  ✗ Error processing file: ${error.message}`);
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  const validExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
  
  if (!validExtensions.includes(ext)) {
    return false;
  }
  
  const fileName = path.basename(filePath);
  if (fileName.includes('node_modules') || 
      fileName.includes('.next') || 
      fileName.includes('migrate') ||
      filePath.includes('database_2025_11_10')) {
    return false;
  }
  
  return true;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && 
          !file.includes('.next') && 
          !file.includes('.git') &&
          !file.includes('database_2025_11_10')) {
        getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      if (shouldProcessFile(filePath)) {
        arrayOfFiles.push(filePath);
      }
    }
  });
  
  return arrayOfFiles;
}

async function main() {
  console.log('Starting migration of hardcoded HubSpot image URLs...');
  console.log('='.repeat(60));
  
  const rootDir = path.join(__dirname, '..');
  const files = getAllFiles(rootDir);
  
  console.log(`Found ${files.length} files to process\n`);
  
  for (const file of files) {
    await processFile(file);
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('Migration Summary');
  console.log(`${'='.repeat(60)}`);
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Images found: ${stats.imagesFound}`);
  console.log(`Successfully uploaded: ${stats.uploaded}`);
  console.log(`Skipped (cached): ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Files updated: ${stats.updated}`);
  
  if (stats.errors.length > 0) {
    console.log(`\nErrors (showing first 10):`);
    stats.errors.slice(0, 10).forEach(({ url, error }) => {
      console.log(`  - ${url.substring(0, 60)}...: ${error}`);
    });
  }
  
  console.log('\nMigration completed!');
}

main().catch(console.error);

