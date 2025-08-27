import { NextResponse } from "next/server"
import { HubSpotService } from '@/lib/hubspot'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing simple HubSpot integration...')
    
    // Check if environment variable is set
    const hasToken = !!process.env.HUBSPOT_ACCESS_TOKEN;
    console.log('HubSpot Access Token available:', hasToken);
    
    if (!hasToken) {
      return NextResponse.json({
        success: false,
        error: 'HUBSPOT_ACCESS_TOKEN environment variable is not set',
        message: 'Please set HUBSPOT_ACCESS_TOKEN in your .env.local file'
      }, { status: 500 });
    }
    
    // Test with ONLY basic properties that definitely exist
    const testContact = {
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      phone: '+1234567890',
      company: 'Test Company'
    };
    
    console.log('Testing with basic properties:', testContact);
    
    const result = await HubSpotService.upsertContact(testContact);
    
    console.log('HubSpot test successful:', result);
    
    return NextResponse.json({
      success: true,
      message: 'HubSpot integration working with basic properties!',
      result
    });
    
  } catch (error) {
    console.error('HubSpot test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'HubSpot test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
