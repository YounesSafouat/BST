import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appearance from '@/models/Appearance';

export async function GET() {
  try {
    await connectDB();
    const activeAppearance = await Appearance.findOne({ isActive: true });
    
    if (!activeAppearance) {
      return NextResponse.json(
        { error: 'No active theme found' },
        { status: 404 }
      );
    }

    return NextResponse.json(activeAppearance);
  } catch (error) {
    console.error('Error fetching active appearance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active appearance' },
      { status: 500 }
    );
  }
} 