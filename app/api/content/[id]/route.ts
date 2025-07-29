import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

// GET: Get a single content item by id
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const content = await Content.findById(id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update a content item by id
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const data = await request.json();
    
    console.log('API PUT - Received data:', JSON.stringify(data, null, 2));
    console.log('API PUT - Data structure check:', {
      hasHero: !!data.hero,
      hasSteps: !!data.steps,
      hasCards: !!data.cards,
      heroFields: data.hero ? Object.keys(data.hero) : [],
      stepsCount: data.steps?.length || 0,
      cardsCount: data.cards?.length || 0
    });
    
    // Ensure we preserve the _id and timestamps
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    // Use findByIdAndUpdate with $set to preserve all fields
    const content = await Content.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: false }
    );
    
    console.log('API PUT - Saved content:', JSON.stringify(content, null, 2));
    
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update a content item by id
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const data = await request.json();
    const content = await Content.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true 
    });
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a content item by id
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const content = await Content.findByIdAndDelete(id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Content deleted' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 