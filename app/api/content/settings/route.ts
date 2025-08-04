import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Get settings document using the Content model
    const settings = await Content.findOne({ type: 'settings' });
    
    return NextResponse.json({
      success: true,
      content: settings?.content || {}
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('Settings update request:', body);

    // Update or create settings using the Content model
    const settings = await Content.findOneAndUpdate(
      { type: 'settings' },
      {
        type: 'settings',
        title: body.title || 'Site Settings',
        description: body.description || 'Paramètres globaux du site',
        content: body.content,
        isActive: true,
        metadata: body.metadata || { order: 1 },
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true
      }
    );

    console.log('Settings saved:', settings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      result: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 