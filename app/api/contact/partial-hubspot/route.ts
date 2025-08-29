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
    const contactData = {
      email: email || '',
      firstname: body.firstname || body.name?.split(' ')[0] || '',
      lastname: body.lastname || body.name?.split(' ').slice(1).join(' ') || '',
      phone: phone || '',
      company: body.company || '',
      message: 'Lead partiel - Formulaire non complété dans les 30 minutes',
      brief_description: body.brief_description || '', // Add French behavior description
      
      // Website Analytics Properties
      hs_analytics_source: body.hs_analytics_source || 'WEBSITE_FORM',
      hs_analytics_source_data_1: body.hs_analytics_source_data_1 || 'contact_form',
      hs_analytics_source_data_2: body.hs_analytics_source_data_2 || 'website',
      hs_analytics_first_timestamp: body.hs_analytics_first_timestamp || new Date().toISOString(),
      hs_analytics_first_visit_timestamp: body.hs_analytics_first_visit_timestamp || new Date().toISOString(),
      hs_analytics_first_url: body.hs_analytics_first_url || '',
      hs_analytics_first_referrer: body.hs_analytics_first_referrer || '',
      hs_analytics_last_timestamp: body.hs_analytics_last_timestamp || new Date().toISOString(),
      hs_analytics_last_url: body.hs_analytics_last_url || '',
      hs_analytics_last_referrer: body.hs_analytics_last_referrer || '',
      hs_analytics_num_visits: body.hs_analytics_num_visits || 1,
      hs_analytics_num_page_views: body.hs_analytics_num_page_views || 1,
      hs_analytics_num_event_completions: body.hs_analytics_num_event_completions || 1,
      hs_analytics_average_page_views: body.hs_analytics_average_page_views || 1,
      
      // Lead Qualification Properties
      lifecyclestage: body.lifecyclestage || 'lead',
      hs_lead_status: body.hs_lead_status || 'NEW',
      hs_predictivecontactscore_v2: body.hs_predictivecontactscore_v2 || 50,
      hs_predictivescoringtier: body.hs_predictivescoringtier || 'tier_3',
      hs_time_to_first_engagement: body.hs_time_to_first_engagement || 0,
      
      // Conversion Tracking
      first_conversion_date: body.first_conversion_date || new Date().toISOString().split('T')[0],
      first_conversion_event_name: body.first_conversion_event_name || 'Partial Lead - Contact Form',
      recent_conversion_date: body.recent_conversion_date || new Date().toISOString().split('T')[0],
      recent_conversion_event_name: body.recent_conversion_event_name || 'Partial Lead - Contact Form',
      num_conversion_events: body.num_conversion_events || 1,
      num_unique_conversion_events: body.num_unique_conversion_events || 1,
      
      // Geographic & IP Data
      country: body.country || body.countryCode || '',
      hs_country_region_code: body.hs_country_region_code || body.countryCode || '',
      city: body.city || '',
      state: body.state || '',
      hs_state_code: body.hs_state_code || '',
      
      // Company Information
      industry: body.industry || '',
      numemployees: body.numemployees || '',
      annualrevenue: body.annualrevenue || '',
      website: body.website || '',
      jobtitle: body.jobtitle || '',
      hs_role: body.hs_role || '',
      hs_seniority: body.hs_seniority || '',
      
      // Sales Intelligence
      hs_buying_role: body.hs_buying_role || 'DECISION_MAKER',
      hs_sa_first_engagement_date: body.hs_sa_first_engagement_date || new Date().toISOString(),
      hs_sa_first_engagement_descr: body.hs_sa_first_engagement_descr || 'PARTIAL_FORM_SUBMISSION',
      hs_sa_first_engagement_object_type: body.hs_sa_first_engagement_object_type || 'FORM',
      num_associated_deals: body.num_associated_deals || 0,
      total_revenue: body.total_revenue || 0,
      
      // Engagement & Activity
      hs_last_sales_activity_timestamp: body.hs_last_sales_activity_timestamp || new Date().toISOString(),
      notes_last_contacted: body.notes_last_contacted || new Date().toISOString(),
      notes_last_updated: body.notes_last_updated || new Date().toISOString(),
      num_contacted_notes: body.num_contacted_notes || 0,
      num_notes: body.num_notes || 0,
      
      // Email Marketing
      hs_email_domain: body.hs_email_domain || (email ? email.split('@')[1] : ''),
      hs_email_open: body.hs_email_open || 0,
      hs_email_click: body.hs_email_click || 0,
      hs_email_delivered: body.hs_email_delivered || 0,
      hs_email_bounce: body.hs_email_bounce || 0,
      hs_email_optout: body.hs_email_optout || false,
      
      // Custom Properties
      contact_status: body.contact_status || 'partial lead',
      source: body.source || 'website_contact_form',
      page: body.page || '',
      submission_count: body.submission_count || '1',
      first_submission_date: body.first_submission_date || new Date().toISOString().split('T')[0],
      last_submission_date: body.last_submission_date || new Date().toISOString().split('T')[0]
    };
    
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
