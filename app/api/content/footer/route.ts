import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get footer content
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const content = await Content.findOne({ type: 'footer' });
    
    if (!content) {
      return NextResponse.json({ error: 'Footer content not found' }, { status: 404 });
    }
    
    return NextResponse.json(content, {
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

// PUT: Update footer content
export async function PUT(req: NextRequest) {
  try {
    console.log("API: Starting PUT request for footer...")
    await connectDB();
    
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
      { type: 'footer' },
      { $set: update },
      { new: true, upsert: true }
    );
    
    console.log("API: Update result:", updated)
    
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