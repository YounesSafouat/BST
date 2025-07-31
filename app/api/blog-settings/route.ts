import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// POST: Save blog settings
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Blog Settings API: Saving settings:", body);

    // Find or create blog-page document
    let blogPage = await Content.findOne({ type: 'blog-page' });
    
    if (!blogPage) {
      // Create new blog-page document if it doesn't exist
      blogPage = await Content.create({
        type: 'blog-page',
        title: 'Blog Page',
        description: 'Blog page configuration',
        content: {
          blogPosts: [],
          popularArticles: [],
          categories: [],
          settings: {}
        }
      });
      console.log("Blog Settings API: Created new blog-page document");
    }

    // Update the blog page with new settings
    const result = await Content.findByIdAndUpdate(
      blogPage._id,
      {
        $set: {
          'content.popularArticles': body.popularArticles || [],
          'content.categories': body.categories || [],
          'content.settings': body.settings || {}
        }
      },
      { new: true }
    );

    console.log("Blog Settings API: Settings saved successfully");

    return NextResponse.json({ success: true, data: result }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog Settings API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Get blog settings
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    console.log("Blog Settings API: Fetching settings");

    const blogPage = await Content.findOne({ type: 'blog-page' });
    
    if (!blogPage) {
      return NextResponse.json({
        popularArticles: [],
        categories: [],
        settings: {
          postsPerPage: 6,
          enableComments: false,
          enableSocialSharing: true,
        }
      });
    }

    const settings = {
      popularArticles: blogPage.content?.popularArticles || [],
      categories: blogPage.content?.categories || [],
      settings: blogPage.content?.settings || {
        postsPerPage: 6,
        enableComments: false,
        enableSocialSharing: true,
      }
    };

    console.log("Blog Settings API: Settings fetched:", settings);

    return NextResponse.json(settings, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Blog Settings API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
} 