import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SEO from '@/models/SEO';

// GET all SEO data
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const language = searchParams.get('language') || 'fr';
    
    let query: any = { language };
    if (page) {
      query.page = page;
    }
    
    const seoData = await SEO.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

// POST new SEO data
export async function POST(request: NextRequest) {
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
    
    // Check if SEO entry already exists for this page and language
    const existingSEO = await SEO.findOne({
      page: body.page,
      language: body.language
    });
    
    if (existingSEO) {
      return NextResponse.json(
        { error: 'SEO entry already exists for this page and language' },
        { status: 400 }
      );
    }
    
    const seoData = new SEO({
      ...body,
      updatedBy: session.user.email || session.user.name
    });
    
    await seoData.save();
    
    return NextResponse.json(seoData, { status: 201 });
  } catch (error) {
    console.error('Error creating SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to create SEO data' },
      { status: 500 }
    );
  }
} 