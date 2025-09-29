import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UTM from '@/models/UTM';

export const dynamic = 'force-dynamic';

// GET - Fetch all UTMs
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    const utms = await UTM.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const total = await UTM.countDocuments();
    
    return NextResponse.json({
      utms,
      total,
      hasMore: skip + utms.length < total
    });
  } catch (error) {
    console.error('Error fetching UTMs:', error);
    return NextResponse.json({ error: 'Failed to fetch UTMs' }, { status: 500 });
  }
}

// POST - Create new UTM
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { source, medium, campaign, term, content, generatedUrl } = body;
    
    // Validate required fields
    if (!source || !medium || !campaign || !generatedUrl) {
      return NextResponse.json(
        { error: 'Source, medium, campaign, and generatedUrl are required' },
        { status: 400 }
      );
    }
    
    // Check if UTM already exists
    const existingUTM = await UTM.findOne({ generatedUrl });
    if (existingUTM) {
      return NextResponse.json({
        success: true,
        utm: existingUTM,
        message: 'UTM already exists'
      });
    }
    
    // Create new UTM
    const utm = new UTM({
      source,
      medium,
      campaign,
      term,
      content,
      generatedUrl,
      clicks: 0
    });
    
    await utm.save();
    
    return NextResponse.json({
      success: true,
      utm
    });
  } catch (error) {
    console.error('Error creating UTM:', error);
    return NextResponse.json({ error: 'Failed to create UTM' }, { status: 500 });
  }
}

// PUT - Update UTM clicks
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { generatedUrl } = body;
    
    if (!generatedUrl) {
      return NextResponse.json(
        { error: 'GeneratedUrl is required' },
        { status: 400 }
      );
    }
    
    const utm = await UTM.findOneAndUpdate(
      { generatedUrl },
      { $inc: { clicks: 1 } },
      { new: true }
    );
    
    if (!utm) {
      return NextResponse.json(
        { error: 'UTM not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      utm
    });
  } catch (error) {
    console.error('Error updating UTM clicks:', error);
    return NextResponse.json({ error: 'Failed to update UTM clicks' }, { status: 500 });
  }
}
