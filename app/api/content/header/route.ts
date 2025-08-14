import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get header content
export async function GET(req: NextRequest) {
  try {
    console.log("API: Starting header fetch...");
    await connectDB();
    console.log("API: Connected to database");

    const headerContent = await Content.findOne({ type: 'header' });
    console.log("API: Header content found:", !!headerContent);

    if (!headerContent) {
      return NextResponse.json({ error: 'Header content not found' }, { status: 404 });
    }

    return NextResponse.json(headerContent, {
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

// PUT: Update header content
export async function PUT(req: NextRequest) {
  try {
    console.log("API: Starting header update...");
    await connectDB();
    
    const body = await req.json();
    console.log("API: Header update request body:", body);
    
    // Only allow updating specific fields for safety
    const update: any = {};
    if (body.content) update['content'] = body.content;
    if (body.title) update['title'] = body.title;
    if (body.description) update['description'] = body.description;
    if (typeof body.isActive === 'boolean') update['isActive'] = body.isActive;
    
    console.log("API: Header update object:", update);
    
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    // Try to update existing header content
    let updated = await Content.findOneAndUpdate(
      { type: 'header' },
      { $set: update },
      { new: true }
    );
    
    // If no existing header content, create it
    if (!updated) {
      console.log("API: No existing header content, creating new...");
      updated = await Content.create({
        type: 'header',
        ...update,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log("API: Header update/create result:", updated);
    
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

// POST: Create header content
export async function POST(req: NextRequest) {
  try {
    console.log("API: Starting header creation...");
    await connectDB();
    
    const body = await req.json();
    console.log("API: Header creation request body:", body);
    
    // Check if header content already exists
    const existingHeader = await Content.findOne({ type: 'header' });
    if (existingHeader) {
      return NextResponse.json({ error: 'Header content already exists. Use PUT to update.' }, { status: 409 });
    }
    
    // Create new header content
    const headerContent = await Content.create({
      type: 'header',
      content: body.content || {},
      title: body.title || 'Header Configuration',
      description: body.description || 'Website header with logo and navigation',
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log("API: Created header content:", headerContent);
    
    return NextResponse.json(headerContent, {
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
