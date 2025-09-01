import { NextResponse } from "next/server"
import { HubSpotService } from '@/lib/hubspot'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Partial lead HubSpot API endpoint called')
    
    const body = await req.json();
    const { email, phone, countryCode, countryName, source, page, timestamp } = body;
    
    console.log('Received partial lead data:', body);
    console.log('Brief description received:', body.brief_description);
    
    // Validate that we have at least email or phone
    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        error: 'Email or phone is required for partial lead'
      }, { status: 400 });
    }
    
    // First, find the existing partial submission in the database
    let submission = await ContactSubmission.findOne({
      $or: [
        { email: email || '' },
        { phone: phone || '' }
      ],
      submissionStatus: 'partial'
    });
    
    if (!submission) {
      console.log('No partial submission found in database, creating new record');
      // Create a new partial submission record
      submission = new ContactSubmission({
        email: email || '',
        phone: phone || '',
        firstname: body.firstname || '',
        lastname: body.lastname || '',
        countryCode,
        countryName,
        source: source || 'website_contact_form',
        page: page || 'home',
        submissionStatus: 'partial',
        fieldsFilled: {
          email: !!email,
          phone: !!phone,
          firstname: !!body.firstname,
          lastname: !!body.lastname,
          name: false,
          company: false,
          message: false
        },
        sentToHubSpot: false,
        status: 'pending'
      });
    }
    
    // Check if already sent to HubSpot to prevent duplicates
    if (submission.sentToHubSpot) {
      console.log('Partial lead already sent to HubSpot, skipping');
      return NextResponse.json({
        success: true,
        message: 'Partial lead already sent to HubSpot',
        submission
      });
    }
    
    // Prepare contact data for HubSpot
    const contactData: any = {
      email: email || '',
      firstname: body.firstname || body.name?.split(' ')[0] || '',
      lastname: body.lastname || body.name?.split(' ').slice(1).join(' ') || '',
      phone: phone || '',
      company: body.company || '',
      message: 'Lead partiel - Formulaire non complété dans les 30 minutes',
      brief_description: body.brief_description || '', // Add French behavior description
      
      // Website Analytics Properties (writable)
      hs_analytics_source: 'DIRECT_TRAFFIC',
      
      // Lead Qualification Properties (writable)
      lifecyclestage: 'lead',
      hs_lead_status: 'NEW',
      
      // Custom Properties
      contact_status: 'partial lead',
      submission_count: '1',
      first_submission_date: new Date().toISOString().split('T')[0],
      last_submission_date: new Date().toISOString().split('T')[0]
    };
    
    // Only add geographic properties if we have real data
    if (body.country || body.countryCode) {
      contactData.country = body.country || body.countryCode;
      contactData.hs_country_region_code = body.hs_country_region_code || body.country || body.countryCode;
    }
    
    if (body.city) {
      contactData.city = body.city;
    }
    
    if (body.state) {
      contactData.state = body.state;
      contactData.hs_state_code = body.hs_state_code || body.state;
    }
    
    // Add user behavior data if available
    if (body.userBehavior) {
      contactData.message += `\n\n${body.userBehavior}`;
    }
    
    console.log('Sending partial lead to HubSpot:', contactData);
    
    // Send to HubSpot with partial lead status
    const hubspotResult = await HubSpotService.upsertContact(contactData);
    
    if (hubspotResult.success) {
      // Update database: mark as sent to HubSpot and update status
      submission.sentToHubSpot = true;
      submission.status = 'partial_lead_sent';
      submission.hubspotContactId = hubspotResult.contactId;
      submission.hubspotSyncDate = new Date();
      submission.brief_description = body.brief_description || ''; // Save French description to DB
      submission.firstname = body.firstname || ''; // Save firstname to DB
      submission.lastname = body.lastname || ''; // Save lastname to DB
      
      // Save comprehensive HubSpot properties to database
      submission.hs_analytics_source = contactData.hs_analytics_source;
      submission.lifecyclestage = contactData.lifecyclestage;
      submission.hs_lead_status = contactData.hs_lead_status;
      submission.contact_status = contactData.contact_status;
      submission.submission_count = contactData.submission_count;
      submission.first_submission_date = contactData.first_submission_date;
      submission.last_submission_date = contactData.last_submission_date;
      submission.country = contactData.country;
      submission.hs_country_region_code = contactData.hs_country_region_code;
      submission.city = contactData.city;
      submission.state = contactData.state;
      submission.hs_state_code = contactData.hs_state_code;
      
      await submission.save();
      
      console.log('Partial lead sent to HubSpot successfully and database updated');
      
      return NextResponse.json({
        success: true,
        message: 'Partial lead sent to HubSpot successfully',
        hubspotResult,
        submission
      });
    } else {
      console.error('HubSpot integration failed:', hubspotResult);
      return NextResponse.json({
        success: false,
        error: 'Failed to send partial lead to HubSpot',
        hubspotResult
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error sending partial lead to HubSpot:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send partial lead to HubSpot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
