# Cloudinary Setup Guide

## ✅ Local Development (.env.local)

Already configured! The `.env.local` file has been created with your Cloudinary credentials.

## 🚀 Server/Production Environment

Add the following environment variable to your server/deployment platform:

### For IONOS (via GitHub Actions/Environment Variables)

Add this single environment variable in your deployment settings:

```env
CLOUDINARY_URL=cloudinary://995612736338499:wjKAOfN7qWy024XARYAO6gaVO_U@dwob2hfin
```

### Alternative: Individual Variables (if CLOUDINARY_URL doesn't work)

If your platform doesn't support the CLOUDINARY_URL format, use these three variables:

```env
CLOUDINARY_CLOUD_NAME=dwob2hfin
CLOUDINARY_API_KEY=995612736338499
CLOUDINARY_API_SECRET=wjKAOfN7qWy024XARYAO6gaVO_U
```

## 📝 Where to Add on Server

### Option 1: GitHub Secrets (Recommended for GitHub Actions)
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add `CLOUDINARY_URL` with the value: `cloudinary://995612736338499:wjKAOfN7qWy024XARYAO6gaVO_U@dwob2hfin`

### Option 2: IONOS Control Panel
1. Log into IONOS control panel
2. Navigate to your application/hosting settings
3. Find "Environment Variables" or "Config Variables"
4. Add the `CLOUDINARY_URL` variable

### Option 3: Server .env file (if you have SSH access)
Add to your server's `.env` file:
```env
CLOUDINARY_URL=cloudinary://995612736338499:wjKAOfN7qWy024XARYAO6gaVO_U@dwob2hfin
```

## ✅ Verification

After adding the environment variable:
1. Restart your application/server
2. Try uploading an image in the dashboard
3. Check that images are uploaded to Cloudinary (dashboard → Media Library)

## 🔒 Security Notes

- Never commit `.env.local` or `.env` files to git (already in .gitignore)
- The `CLOUDINARY_URL` contains sensitive credentials - keep it secure
- Use environment variables in your deployment platform, not hardcoded values

## 📊 Cloudinary Dashboard

Monitor your usage at: https://cloudinary.com/console
- Free tier: 25GB storage, 25GB bandwidth/month
- All uploads are stored in the `bst-uploads` folder


