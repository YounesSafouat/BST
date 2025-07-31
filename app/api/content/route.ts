import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: List or filter content
export async function GET(req: NextRequest) {
  try {
    console.log("API: Starting content fetch...")
    await connectDB();
    console.log("API: Connected to database")

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    console.log("API: Request params:", { type })

    const query: any = {};
    if (type) query.type = type;
    console.log("API: Query being executed:", JSON.stringify(query))

    const contents = await Content.find(query);
    console.log("API: Found content count:", contents.length)
    console.log("API: Content types found:", contents.map(c => c.type))
    
    // Special logging for footer type
    if (type === 'footer') {
      console.log("API: Footer content found:", contents.length > 0 ? "YES" : "NO")
      if (contents.length > 0) {
        console.log("API: Footer content structure:", {
          hasContent: !!contents[0].content,
          contentKeys: contents[0].content ? Object.keys(contents[0].content) : [],
          newsletter: contents[0].content?.newsletter,
          companyInfo: contents[0].content?.companyInfo
        })
      } else {
        console.log("API: NO FOOTER DOCUMENT FOUND IN DATABASE")
        // Let's see what types exist
        const allContent = await Content.find({});
        console.log("API: All content types in database:", allContent.map(c => c.type))
      }
    }
    
    console.log("API: Found content details:", JSON.stringify(contents, null, 2))

    return NextResponse.json(contents, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create new content
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("API: Creating content:", body)

    const content = await Content.create(body);
    console.log("API: Created content:", content)

    return NextResponse.json(content, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update content by type
export async function PUT(req: NextRequest) {
  try {
    console.log("API: Starting PUT request...")
    console.log("API: Request URL:", req.url)
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    console.log("API: All search params:", Object.fromEntries(searchParams.entries()))
    
    const type = searchParams.get('type');
    console.log("API: PUT request for type:", type)
    console.log("API: Type is null/undefined:", type === null || type === undefined)
    
    if (!type) {
      console.log("API: Missing type parameter - returning 400")
      return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }
    
    const body = await req.json();
    console.log("API: PUT request body:", body)
    
    // Only allow updating the content field for safety
    const update: any = {};
    if (body.content) update['content'] = body.content;
    if (body.title) update['title'] = body.title;
    if (body.description) update['description'] = body.description;
    if (body.metadata) update['metadata'] = body.metadata;
    if (typeof body.isActive === 'boolean') update['isActive'] = body.isActive;
    
    console.log("API: Update object:", update)
    
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    const updated = await Content.findOneAndUpdate(
      { type },
      { $set: update },
      { new: true }
    );
    
    console.log("API: Update result:", updated)
    
    if (!updated) {
      console.log("API: No document found to update for type:", type)
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 