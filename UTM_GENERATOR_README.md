# UTM Generator & Tracking System

## Overview
The UTM Generator is a powerful tool that allows you to create trackable links for your social media posts and campaigns. This system helps you understand which specific posts are driving traffic to your website.

## Features

### 🎯 UTM Generator
- **Social Platform Selection**: Choose from LinkedIn, Facebook, Instagram, Twitter, YouTube, TikTok, Pinterest, and Snapchat
- **Medium Types**: Select from Social Media, Post, Story, Reel, Video, Paid Ad, or Organic Post
- **Campaign Naming**: Create descriptive campaign names for easy tracking
- **Optional Parameters**: Add terms and content identifiers for detailed tracking
- **Post URL Tracking**: Link back to the original social media post

### 📊 UTM Analytics
- **Real-time Tracking**: Monitor visits from your UTM links
- **Campaign Performance**: See which campaigns drive the most traffic
- **Source Analysis**: Understand which social platforms perform best
- **Filtering**: Filter results by source, medium, or campaign
- **Last Visit Tracking**: See when each campaign was last active

## How to Use

### 1. Generate UTM Links
1. Navigate to **Dashboard > Settings > UTM Generator**
2. Select your social media platform (Source)
3. Choose the content type (Medium)
4. Enter a descriptive campaign name
5. Optionally add terms and content identifiers
6. Paste the original social media post URL
7. Click "Generate UTM Link"
8. Copy the generated link

### 2. Use in Social Media Posts
- Replace your regular website links with the generated UTM links
- Use the same UTM link across all platforms for the same campaign
- Create different UTM links for different posts/content

### 3. Track Results
- View analytics in the UTM Generator page
- Monitor which posts drive the most traffic
- Analyze performance by platform and content type
- Use data to optimize your social media strategy

## UTM Parameters Explained

- **utm_source**: The social media platform (linkedin, facebook, instagram, etc.)
- **utm_medium**: The type of content (social, post, story, video, etc.)
- **utm_campaign**: Your campaign name (summer-promotion-2024, etc.)
- **utm_term**: Optional keyword or topic (odoo-implementation, etc.)
- **utm_content**: Optional content identifier (post-image, video-thumbnail, etc.)

## Example Usage

### LinkedIn Post Campaign
```
Source: linkedin
Medium: post
Campaign: odoo-case-study-2024
Term: odoo-implementation
Content: case-study-image
Post URL: https://linkedin.com/posts/your-post-id
```

Generated UTM:
```
https://blackswantechnology.com?utm_source=linkedin&utm_medium=post&utm_campaign=odoo-case-study-2024&utm_term=odoo-implementation&utm_content=case-study-image
```

### Instagram Story Campaign
```
Source: instagram
Medium: story
Campaign: summer-promotion-2024
Content: story-highlight
Post URL: https://instagram.com/stories/your-story-id
```

Generated UTM:
```
https://blackswantechnology.com?utm_source=instagram&utm_medium=story&utm_campaign=summer-promotion-2024&utm_content=story-highlight
```

## Best Practices

1. **Consistent Naming**: Use consistent campaign naming conventions
2. **Descriptive Campaigns**: Make campaign names descriptive and easy to understand
3. **Track Everything**: Use UTM links for all social media posts
4. **Regular Analysis**: Check analytics regularly to optimize performance
5. **A/B Testing**: Create different UTM links for A/B testing different content

## Technical Details

- **Database**: UTM data is stored in MongoDB using the PageView model
- **API Endpoint**: `/api/utm-tracking` handles UTM data storage and retrieval
- **Analytics**: Real-time analytics with filtering and aggregation
- **Integration**: Works with existing traffic source detection system

## Troubleshooting

### No Data Showing
- Ensure UTM links are being used correctly
- Check that the traffic source detection is working
- Verify database connection

### Missing Campaigns
- Check UTM parameter spelling
- Ensure campaigns are being tracked in the database
- Verify API endpoint is responding correctly

## Support

For technical support or questions about the UTM tracking system, contact the development team.
