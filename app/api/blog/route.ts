import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get all blog posts
export async function GET(req: NextRequest) {
  try {
    console.log("Blog API: Starting blog posts fetch...")
    await connectDB();
    console.log("Blog API: Connected to database")

    // First try to get blog posts from blog-page content
    const blogPageContent = await Content.findOne({ type: 'blog-page' });
    console.log("Blog API: Blog page content:", blogPageContent);

    if (blogPageContent && blogPageContent.content && blogPageContent.content.blogPosts) {
      console.log("Blog API: Found blog posts in blog-page:", blogPageContent.content.blogPosts.length);
      // Add the blog-page document ID to each blog post for reference
      const blogPostsWithId = blogPageContent.content.blogPosts.map((post: any, index: number) => ({
        ...post,
        _id: `${blogPageContent._id}_${index}`,
        _blogPageId: blogPageContent._id,
        _index: index
      }));
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

    return NextResponse.json(individualBlogPosts, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create new blog post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Blog API: Creating blog post:", body)

    const blogPost = await Content.create({
      type: 'blog-post',
      content: body
    });
    console.log("Blog API: Created blog post:", blogPost)

    return NextResponse.json(blogPost, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update blog post
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    const body = await req.json();
    
    // Check if this is a blog post from blog-page (has _blogPageId)
    if (id.includes('_') && !id.match(/^[0-9a-fA-F]{24}$/)) {
      // This is a blog post from blog-page document
      const [blogPageId, indexStr] = id.split('_');
      const index = parseInt(indexStr);
      
      console.log("Blog API: Updating blog post in blog-page:", { blogPageId, index, body });
      
      const blogPage = await Content.findById(blogPageId);
      if (!blogPage || !blogPage.content || !blogPage.content.blogPosts) {
        return NextResponse.json({ error: 'Blog page not found' }, { status: 404 });
      }
      
      // Update the specific blog post in the array
      blogPage.content.blogPosts[index] = body;
      await blogPage.save();
      
      return NextResponse.json({ 
        ...body, 
        _id: id, 
        _blogPageId: blogPageId, 
        _index: index 
      }, {
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
      
      if (!updated) {
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
      
      // Remove the specific blog post from the array
      blogPage.content.blogPosts.splice(index, 1);
      await blogPage.save();
      
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