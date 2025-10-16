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
    
    console.log('POST /api/seo - Received body:', body);
    
    // Check if SEO entry already exists for this page and language
    const existingSEO = await SEO.findOne({
      page: body.page,
      language: body.language
    });
    
    if (existingSEO) {
      console.log('POST /api/seo - Entry already exists for:', body.page, body.language);
      return NextResponse.json(
        { error: 'SEO entry already exists for this page and language' },
        { status: 400 }
      );
    }
    
    const seoData = new SEO({
      ...body,
      updatedBy: session.user.email || session.user.name
    });
    
    console.log('POST /api/seo - Creating SEO document...');
    await seoData.save();
    console.log('POST /api/seo - SEO document saved successfully');
    
    return NextResponse.json(seoData, { status: 201 });
  } catch (error: any) {
    console.error('Error creating SEO data:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    return NextResponse.json(
      { 
        error: 'Failed to create SEO data',
        details: error.message,
        validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })) : undefined
      },
      { status: 500 }
    );
  }
} 