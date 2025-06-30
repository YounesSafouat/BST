import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appearance from '@/models/Appearance';

export async function GET() {
  try {
    await connectDB();
    const appearances = await Appearance.find({}).sort({ createdAt: -1 });
    return NextResponse.json(appearances);
  } catch (error) {
    console.error('Error fetching appearances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appearances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('POST request body:', body);
    console.log('Typography fields in request:', {
      fontFamily: body.fontFamily,
      headingFontFamily: body.headingFontFamily,
      fontSize: body.fontSize,
      headingFontSize: body.headingFontSize,
      lineHeight: body.lineHeight
    });

    // If this is the first appearance, set it as active
    const existingCount = await Appearance.countDocuments();
    if (existingCount === 0) {
      body.isActive = true;
    }

    const appearance = new Appearance(body);
    await appearance.save();

    console.log('Created appearance:', appearance);

    return NextResponse.json(appearance, { status: 201 });
  } catch (error) {
    console.error('Error creating appearance:', error);
    return NextResponse.json(
      { error: 'Failed to create appearance' },
      { status: 500 }
    );
  }
} 