import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Content.findOne({ type: 'settings' });
    
    if (settings && settings.content && settings.content.general) {
      return NextResponse.json({
        maintenanceMode: settings.content.general.maintenanceMode || false
      });
    }
    
    return NextResponse.json({ maintenanceMode: false });
  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json({ maintenanceMode: false });
  }
} 