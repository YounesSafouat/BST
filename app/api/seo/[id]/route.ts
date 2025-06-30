import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SEO from '@/models/SEO';

// GET specific SEO entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const seoData = await SEO.findById(params.id);
    
    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error fetching SEO entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO entry' },
      { status: 500 }
    );
  }
}

// PUT update SEO entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    const updatedSEO = await SEO.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedBy: session.user.email || session.user.name,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedSEO) {
      return NextResponse.json(
        { error: 'SEO entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSEO);
  } catch (error) {
    console.error('Error updating SEO entry:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO entry' },
      { status: 500 }
    );
  }
}

// DELETE SEO entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const deletedSEO = await SEO.findByIdAndDelete(params.id);
    
    if (!deletedSEO) {
      return NextResponse.json(
        { error: 'SEO entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'SEO entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting SEO entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete SEO entry' },
      { status: 500 }
    );
  }
} 