import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Content.findOne({ type: 'settings' });
    
    if (settings && settings.content && settings.content.general) {
      const maintenanceMode = settings.content.general.maintenanceMode || false;
      
      return NextResponse.json(
        { maintenanceMode },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
    
    return NextResponse.json(
      { maintenanceMode: false },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json(
      { maintenanceMode: false },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
} 