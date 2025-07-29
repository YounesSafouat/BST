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
    console.log("API: Query:", query)

    const contents = await Content.find(query);
    console.log("API: Found content:", contents)

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
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    if (!type) {
      return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }
    const body = await req.json();
    // Only allow updating the content field for safety
    const update: any = {};
    if (body.content) update['content'] = body.content;
    if (body.title) update['title'] = body.title;
    if (body.description) update['description'] = body.description;
    if (body.metadata) update['metadata'] = body.metadata;
    if (typeof body.isActive === 'boolean') update['isActive'] = body.isActive;
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    const updated = await Content.findOneAndUpdate(
      { type },
      { $set: update },
      { new: true }
    );
    if (!updated) {
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