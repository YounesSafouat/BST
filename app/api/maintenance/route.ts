import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Content.findOne({ type: 'settings' });
    
    if (settings && settings.content && settings.content.general) {
      const maintenanceMode = settings.content.general.maintenanceMode || false;
      
      return NextResponse.json(
        { 
          maintenanceMode,
          timestamp: new Date().toISOString(),
          source: 'database'
        },
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
      { 
        maintenanceMode: false,
        timestamp: new Date().toISOString(),
        source: 'database-default'
      },
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
      { 
        maintenanceMode: false,
        timestamp: new Date().toISOString(),
        source: 'error-fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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

// POST method to clear middleware cache (for testing)
export async function POST() {
  try {
    await connectDB();
    
    const settings = await Content.findOne({ type: 'settings' });
    
    if (settings && settings.content && settings.content.general) {
      const maintenanceMode = settings.content.general.maintenanceMode || false;
      
      return NextResponse.json(
        { 
          maintenanceMode,
          timestamp: new Date().toISOString(),
          source: 'database',
          message: 'Cache should be refreshed on next request'
        },
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
      { 
        maintenanceMode: false,
        timestamp: new Date().toISOString(),
        source: 'database-default',
        message: 'Cache should be refreshed on next request'
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Maintenance API POST error:', error);
    return NextResponse.json(
      { 
        maintenanceMode: false,
        timestamp: new Date().toISOString(),
        source: 'error-fallback',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Cache should be refreshed on next request'
      },
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