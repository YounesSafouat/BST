import { NextResponse } from "next/server"
import { Client } from '@hubspot/api-client'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing HubSpot contact_status enum...')
    
    // Check if environment variable is set
    const hasToken = !!process.env.HUBSPOT_ACCESS_TOKEN;
    console.log('HubSpot Access Token available:', hasToken);
    
    if (!hasToken) {
      return NextResponse.json({
        success: false,
        error: 'HUBSPOT_ACCESS_TOKEN environment variable is not set'
      }, { status: 500 });
    }
    
    const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
    
    // Get the specific contact_status property to see its options
    const contactStatusProperty = await hubspotClient.crm.properties.coreApi.getByName('contacts', 'contact_status');
    
    console.log('Contact status property details:', contactStatusProperty);
    
    return NextResponse.json({
      success: true,
      message: 'Contact status property retrieved successfully',
      property: {
        name: contactStatusProperty.name,
        label: contactStatusProperty.label,
        type: contactStatusProperty.type,
        fieldType: contactStatusProperty.fieldType,
        options: contactStatusProperty.options || []
      }
    });
    
  } catch (error) {
    console.error('HubSpot enum test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'HubSpot enum test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
