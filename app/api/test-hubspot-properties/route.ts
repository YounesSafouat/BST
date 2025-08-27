import { NextResponse } from "next/server"
import { Client } from '@hubspot/api-client'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing HubSpot properties...')
    
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
    
    // Get all contact properties to see what exists
    const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
    
    console.log('Available properties:', propertiesResponse.results.map(p => ({
      name: p.name,
      label: p.label,
      type: p.type,
      fieldType: p.fieldType
    })));
    
    // Look for our custom properties specifically
    const customProperties = propertiesResponse.results.filter(p => 
      p.name === 'submission_count' || 
      p.name === 'contact_status' || 
      p.name === 'last_submission_date' || 
      p.name === 'first_submission_date'
    );
    
    return NextResponse.json({
      success: true,
      message: 'HubSpot properties retrieved successfully',
      totalProperties: propertiesResponse.results.length,
      customProperties: customProperties.map(p => ({
        name: p.name,
        label: p.label,
        type: p.type,
        fieldType: p.fieldType
      })),
      allProperties: propertiesResponse.results.map(p => ({
        name: p.name,
        label: p.label,
        type: p.type
      }))
    });
    
  } catch (error) {
    console.error('HubSpot properties test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'HubSpot properties test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
