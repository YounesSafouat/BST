import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

// GET: Get a single content item by id
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const id = request.url.split('/').pop();
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
    const id = request.url.split('/').pop();
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

// PATCH: Update a content item by id
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const id = request.url.split('/').pop();
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
    const id = request.url.split('/').pop();
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