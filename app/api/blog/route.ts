import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get all blog posts or blog settings
export async function GET(req: NextRequest) {
  try {
    console.log("Blog API: Starting blog posts fetch...")
    await connectDB();
    console.log("Blog API: Connected to database")

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
    console.log("Blog API: Blog page content found:", blogPageContent ? "Yes" : "No");
    if (blogPageContent) {
      console.log("Blog API: Blog page content structure:", {
        hasContent: !!blogPageContent.content,
        hasBlogPosts: !!(blogPageContent.content && blogPageContent.content.blogPosts),
        blogPostsLength: blogPageContent.content?.blogPosts?.length || 0
      });
    }

    if (blogPageContent && blogPageContent.content && blogPageContent.content.blogPosts) {
      console.log("Blog API: Found blog posts in blog-page:", blogPageContent.content.blogPosts.length);
      // Add the blog-page document ID to each blog post for reference
      const blogPostsWithId = blogPageContent.content.blogPosts.map((post: any, index: number) => ({
        ...post,
        _id: `${blogPageContent._id}_${index}`,
        _blogPageId: blogPageContent._id,
        _index: index
      }));
      console.log("Blog API: Returning blog posts with IDs:", blogPostsWithId.length);
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
    console.log("Blog API: Individual blog posts found:", individualBlogPosts.length);
    console.log("Blog API: Individual blog posts structure:", individualBlogPosts.map(p => ({ id: p._id, type: p.type, hasContent: !!p.content })));

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
    console.log("Blog API: Creating blog post:", body)

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
      console.log("Blog API: Created new blog-page document");
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

// PUT: Update blog post
export async function PUT(req: NextRequest) {
  try {
    console.log("Blog API: PUT request received");
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Blog API: ID from params:", id);
    
    if (!id) {
      console.log("Blog API: Missing id parameter");
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    
    const body = await req.json();
    console.log("Blog API: Request body:", body);
    
    // Check if this is a blog post from blog-page (has _blogPageId)
    if (id.includes('_') && !id.match(/^[0-9a-fA-F]{24}$/)) {
      // This is a blog post from blog-page document
      const [blogPageId, indexStr] = id.split('_');
      const index = parseInt(indexStr);
      
      console.log("Blog API: Updating blog post in blog-page:", { blogPageId, index, body });
      
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
        { $set: { [`content.blogPosts.${index}`]: body } },
        { new: true }
      );
      
      console.log("Blog API: Update result:", result ? "Success" : "Failed");
      
      if (!result) {
        console.log("Blog API: Failed to update blog page");
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
      }
      
      const response = { 
        ...body, 
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
      console.log("Blog API: Updating individual blog post:", { id, body });
      
      const updated = await Content.findByIdAndUpdate(
        id,
        { $set: { content: body } },
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
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
      
      // Remove the specific blog post from the array using proper MongoDB update
      const result = await Content.findByIdAndUpdate(
        blogPageId,
        { $pull: { 'content.blogPosts': blogPage.content.blogPosts[index] } },
        { new: true }
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