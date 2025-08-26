import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get all blog posts or blog settings
export async function GET(req: NextRequest) {
  try {
            // Blog API: Starting blog posts fetch...
    await connectDB();
            // Blog API: Connected to database

    const { searchParams } = new URL(req.url);
    const settings = searchParams.get('settings');

    // If requesting settings, return blog page configuration
    if (settings === 'true') {
      const blogPageContent = await Content.findOne({ type: 'blog-page' });
      if (blogPageContent) {
        return NextResponse.json({
          popularArticles: blogPageContent.content?.popularArticles || [],
          categories: blogPageContent.content?.categories || [],
          settings: blogPageContent.content?.settings || {}
        });
      }
      return NextResponse.json({
        popularArticles: [],
        categories: [],
        settings: {}
      });
    }

    // First try to get blog posts from blog-page content
    const blogPageContent = await Content.findOne({ type: 'blog-page' });
    // Blog API: Blog page content structure logged silently

    if (blogPageContent && blogPageContent.content && blogPageContent.content.blogPosts) {
      // Add the blog-page document ID to each blog post for reference
      const blogPostsWithId = blogPageContent.content.blogPosts.map((post: any, index: number) => ({
        ...post,
        _id: `${blogPageContent._id}_${index}`,
        _blogPageId: blogPageContent._id,
        _index: index
      }));
      // Blog API: Blog posts with IDs logged silently
      return NextResponse.json(blogPostsWithId, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // If no blog-page content, try to get individual blog posts
    const individualBlogPosts = await Content.find({ type: 'blog-post' });
    // Blog API: Individual blog posts structure logged silently

    return NextResponse.json(individualBlogPosts, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// POST: Create new blog post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // Blog API: Creating blog post silently

    // Process SEO data if present
    if (body.seo) {
      // Ensure keywords is an array
      if (body.seo.keywords && !Array.isArray(body.seo.keywords)) {
        body.seo.keywords = body.seo.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
      }
      
      // Calculate SEO scores if not provided
      if (body.seo.seoScore === undefined) {
        body.seo.seoScore = calculateSEOScore(body);
      }
      
      if (body.seo.readabilityScore === undefined) {
        body.seo.readabilityScore = calculateReadabilityScore(body.body || '');
      }
      
      if (body.seo.keywordDensity === undefined) {
        body.seo.keywordDensity = calculateKeywordDensity(body.body || '', body.seo.keywords || []);
      }
    }

    // First, try to find existing blog-page document
    let blogPage = await Content.findOne({ type: 'blog-page' });
    
    if (!blogPage) {
      // Create new blog-page document if it doesn't exist
      blogPage = await Content.create({
        type: 'blog-page',
        title: 'Blog Page',
        description: 'Blog posts collection',
        content: {
          blogPosts: []
        }
      });
      // Blog API: Created new blog-page document
    }

    // Add the new blog post to the array
    const newIndex = blogPage.content.blogPosts.length;
    const result = await Content.findByIdAndUpdate(
      blogPage._id,
      { $push: { 'content.blogPosts': body } },
      { new: true }
    );

    console.log("Blog API: Added blog post to blog-page, new index:", newIndex);

    // Return the blog post with the synthetic ID
    const response = {
      ...body,
      _id: `${blogPage._id}_${newIndex}`,
      _blogPageId: blogPage._id,
      _index: newIndex
    };

    return NextResponse.json({ content: response }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// SEO Helper Functions
function calculateSEOScore(post: any): number {
  let score = 0;
  
  // Title optimization (25 points)
  if (post.title && post.title.length >= 30 && post.title.length <= 60) score += 25;
  else if (post.title) score += Math.max(0, 25 - Math.abs(post.title.length - 45) * 2);
  
  // Meta description (20 points)
  if (post.seo?.metaDescription && post.seo.metaDescription.length >= 120 && post.seo.metaDescription.length <= 160) score += 20;
  else if (post.seo?.metaDescription) score += Math.max(0, 20 - Math.abs(post.seo.metaDescription.length - 140) * 0.5);
  
  // Keywords (25 points)
  if (post.seo?.keywords && post.seo.keywords.length >= 3 && post.seo.keywords.length <= 8) score += 25;
  else if (post.seo?.keywords) score += Math.max(0, 25 - Math.abs(post.seo.keywords.length - 5) * 5);
  
  // Content length (15 points)
  if (post.body && post.body.length >= 300) score += 15;
  else if (post.body) score += Math.max(0, (post.body.length / 300) * 15);
  
  // Image optimization (15 points)
  if (post.image) score += 15;
  
  return Math.min(100, Math.round(score));
}

function calculateReadabilityScore(content: string): number {
  if (!content) return 0;
  
  const words = content.split(' ').length;
  const sentences = content.split(/[.!?]+/).length;
  const syllables = content.toLowerCase().replace(/[^a-z]/g, '').split('').filter(char => 'aeiou'.includes(char)).length;
  
  // Flesch Reading Ease formula
  const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  
  // Convert to 0-100 scale
  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}

function calculateKeywordDensity(content: string, keywords: string[]): any {
  if (!content || !keywords || keywords.length === 0) return { primary: 0, secondary: [] };
  
  const wordCount = content.toLowerCase().split(' ').length;
  const keywordDensity = keywords.map(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = content.match(regex) || [];
    const density = (matches.length / wordCount) * 100;
    
    return {
      keyword,
      density: Math.round(density * 100) / 100
    };
  });
  
  return {
    primary: keywordDensity[0]?.density || 0,
    secondary: keywordDensity.slice(1)
  };
}

// PUT: Update blog post
export async function PUT(req: NextRequest) {
  try {
    console.log("Blog API: PUT request received");
    await connectDB();
    
    const body = await req.json();
    console.log("Blog API: Request body:", body);
    
    const id = body._id;
    console.log("Blog API: ID from body:", id);
    console.log("Blog API: ID length:", id?.length);
    
    if (!id) {
      console.log("Blog API: Missing id parameter");
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    
    // Remove _id from body to avoid conflicts
    const { _id, ...updateData } = body;
    
    // Process SEO data if present
    if (updateData.seo) {
      // Ensure keywords is an array
      if (updateData.seo.keywords && !Array.isArray(updateData.seo.keywords)) {
        updateData.seo.keywords = updateData.seo.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
      }
      
      // Calculate SEO scores if not provided
      if (updateData.seo.seoScore === undefined) {
        updateData.seo.seoScore = calculateSEOScore(updateData);
      }
      
      if (updateData.seo.readabilityScore === undefined) {
        updateData.seo.readabilityScore = calculateReadabilityScore(updateData.body || '');
      }
      
      if (updateData.seo.keywordDensity === undefined) {
        updateData.seo.keywordDensity = calculateKeywordDensity(updateData.body || '', updateData.seo.keywords || []);
      }
    }
    
    // Check if this is a blog post from blog-page (has _blogPageId)
    if (id.includes('_') && !id.match(/^[0-9a-fA-F]{24}$/)) {
      // This is a blog post from blog-page document
      const [blogPageId, indexStr] = id.split('_');
      const index = parseInt(indexStr);
      
      console.log("Blog API: Updating blog post in blog-page:", { blogPageId, index, updateData });
      
      const blogPage = await Content.findById(blogPageId);
      console.log("Blog API: Found blog page:", blogPage ? "Yes" : "No");
      
      if (!blogPage || !blogPage.content || !blogPage.content.blogPosts) {
        console.log("Blog API: Blog page not found or invalid structure");
        return NextResponse.json({ error: 'Blog page not found' }, { status: 404 });
      }
      
      console.log("Blog API: Current blog posts array length:", blogPage.content.blogPosts.length);
      
      // Update the specific blog post in the array using proper MongoDB update
      const result = await Content.findByIdAndUpdate(
        blogPageId,
        { $set: { [`content.blogPosts.${index}`]: updateData } },
        { new: true }
      );
      
      console.log("Blog API: Update result:", result ? "Success" : "Failed");
      
      if (!result) {
        console.log("Blog API: Failed to update blog page");
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
      }
      
      const response = { 
        ...updateData, 
        _id: id, 
        _blogPageId: blogPageId, 
        _index: index 
      };
      console.log("Blog API: Returning response:", response);
      
      return NextResponse.json(response, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      // This is an individual blog post
      console.log("Blog API: Updating individual blog post:", { id, updateData });
      
      const updated = await Content.findByIdAndUpdate(
        id,
        { $set: { content: updateData } },
        { new: true }
      );
      
      console.log("Blog API: Updated individual blog post:", updated ? "Yes" : "No");
      
      if (!updated) {
        console.log("Blog API: Individual blog post not found");
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      
      return NextResponse.json(updated, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// DELETE: Delete blog post
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const id = body._id;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    
    // Check if this is a blog post from blog-page (has _blogPageId)
    if (id.includes('_') && !id.match(/^[0-9a-fA-F]{24}$/)) {
      // This is a blog post from blog-page document
      const [blogPageId, indexStr] = id.split('_');
      const index = parseInt(indexStr);
      
      console.log("Blog API: Deleting blog post from blog-page:", { blogPageId, index });
      
      const blogPage = await Content.findById(blogPageId);
      if (!blogPage || !blogPage.content || !blogPage.content.blogPosts) {
        return NextResponse.json({ error: 'Blog page not found' }, { status: 404 });
      }
      
      console.log("Blog API: Current blog posts array length:", blogPage.content.blogPosts.length);
      console.log("Blog API: Blog post to delete at index:", index);
      console.log("Blog API: Blog post to delete:", blogPage.content.blogPosts[index]);
      
      // Remove the specific blog post from the array using the index
      const result = await Content.findByIdAndUpdate(
        blogPageId,
        { $unset: { [`content.blogPosts.${index}`]: 1 } },
        { new: true }
      );
      
      // Then clean up the array by removing null values
      await Content.findByIdAndUpdate(
        blogPageId,
        { $pull: { 'content.blogPosts': null } }
      );
      
      if (!result) {
        console.log("Blog API: Failed to delete blog post");
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
      }
      
      return NextResponse.json({ message: 'Blog post deleted successfully' }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      // This is an individual blog post
      console.log("Blog API: Deleting individual blog post:", { id });
      
      const deleted = await Content.findByIdAndDelete(id);
      
      if (!deleted) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Blog post deleted successfully' }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 