# Image Migration to Cloudinary

This script migrates all images from the database to Cloudinary.

## Prerequisites

1. **Environment Variables**: Make sure your `.env` file has:
   ```env
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   MONGODB_URI=mongodb+srv://...
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install
   ```

## Usage

Run the migration script:

```bash
npm run migrate:cloudinary
```

Or directly:

```bash
ts-node database_2025_11_10/migrate-images-to-cloudinary.ts
```

## What It Does

1. **Reads JSON files** from the `database_2025_11_10` folder:
   - `blackswantechnology.contents.json`
   - `blackswantechnology.casclients.json`
   - `blackswantechnology.testimonials.json`
   - `blackswantechnology.seos.json`

2. **Finds all image URLs** in the documents:
   - Images (jpg, png, gif, webp, svg, etc.)
   - Videos (mp4, webm, mov, etc.)
   - Logos, photos, thumbnails, etc.

3. **Uploads to Cloudinary**:
   - Downloads each image/video
   - Uploads to Cloudinary in `bst-migration` folder
   - Caches results to avoid duplicate uploads

4. **Updates MongoDB**:
   - Replaces old URLs with Cloudinary URLs
   - Updates all documents in the database

## Image Fields Processed

### Contents Collection
- `content.logo.image`
- `content.hero.carousel.companies[].logo`
- `content.partnership.image`
- `content.partnership.imageOtherCountries`
- `content.certification.certificationImages[].src`
- `content.hero.videoUrl`
- `content.videoTestimonials.videos[].videoUrl`
- `metadata.image`
- And all nested image fields

### CasClients Collection
- `company.logo`
- `media.coverImage`
- `media.heroVideo`
- `media.heroVideoThumbnail`
- `media.cardBackgroundImage`
- `media.gallery[]`
- `contentBlocks[].imageUrl`
- `contentBlocks[].sectionImageUrl`
- `contentBlocks[].videoUrl`
- `contentBlocks[].videoThumbnail`
- `contentBlocks[].cards[].imageUrl`
- `seo.ogImage`

### Testimonials Collection
- `photo`

### SEO Collection
- `ogImage`

## Features

- ✅ **Duplicate detection**: Caches uploaded images to avoid re-uploading
- ✅ **Error handling**: Continues processing even if some images fail
- ✅ **Progress tracking**: Shows progress for each document
- ✅ **Statistics**: Provides summary at the end
- ✅ **Safe**: Keeps original URLs if upload fails

## Output

The script will:
- Show progress for each document
- Display upload status for each image
- Provide a summary with:
  - Total images found
  - Successfully uploaded
  - Skipped (cached)
  - Failed uploads
  - Error details

## Notes

- The script processes images sequentially to avoid rate limiting
- Images are uploaded to the `bst-migration` folder in Cloudinary
- Original URLs are preserved if upload fails
- The script can be run multiple times safely (cached results are reused)

## Troubleshooting

### Connection Errors
- Check your `MONGODB_URI` in `.env`
- Check your `CLOUDINARY_URL` in `.env`
- Ensure MongoDB is accessible

### Upload Failures
- Check Cloudinary credentials
- Verify image URLs are accessible
- Check Cloudinary quota/limits
- Review error messages in the output

### Memory Issues
- Process one collection at a time if needed
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`

## After Migration

1. Verify images in Cloudinary dashboard
2. Check that URLs are updated in MongoDB
3. Test your application to ensure images load correctly
4. Update your application to use Cloudinary URLs if needed


