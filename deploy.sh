#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /root/BST

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2 application..."
pm2 delete bst-app || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment complete! PM2 app restarted."
echo "📊 PM2 status:"
pm2 status

echo "🌐 Application should be running on port 3000"
