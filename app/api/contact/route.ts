import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'
import { HubSpotService, ContactData } from '@/lib/hubspot'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Contact API endpoint called')
    await connectDB()
    const body = await req.json()
    console.log('Request body received:', body)
    
    // Prepare contact data for HubSpot
    const contactData = {
      email: body.email,
      firstname: body.firstname || body.name?.split(' ')[0] || '',
      lastname: body.lastname || body.name?.split(' ').slice(1).join(' ') || '',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      brief_description: body.brief_description || '',
      
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
      first_conversion_event_name: body.first_conversion_event_name || 'Contact Form Submission',
      recent_conversion_date: body.recent_conversion_date || new Date().toISOString().split('T')[0],
      recent_conversion_event_name: body.recent_conversion_event_name || 'Contact Form Submission',
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
      hs_sa_first_engagement_descr: body.hs_sa_first_engagement_descr || 'FORM_SUBMISSION',
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
      hs_email_domain: body.hs_email_domain || (body.email ? body.email.split('@')[1] : ''),
      hs_email_open: body.hs_email_open || 0,
      hs_email_click: body.hs_email_click || 0,
      hs_email_delivered: body.hs_email_delivered || 0,
      hs_email_bounce: body.hs_email_bounce || 0,
      hs_email_optout: body.hs_email_optout || false,
      
      // Custom Properties
      contact_status: body.contact_status || 'new lead',
      source: body.source || 'website_contact_form',
      page: body.page || '',
      submission_count: body.submission_count || '1',
      first_submission_date: body.first_submission_date || new Date().toISOString().split('T')[0],
      last_submission_date: body.last_submission_date || new Date().toISOString().split('T')[0]
    };

    // Validate required fields for complete submission
    if (!contactData.email) {
      console.log('Validation failed: Email is required')
      return NextResponse.json(
        { error: "Email est requis" },
        { status: 400 }
      )
    }
    
    if (!contactData.firstname || !contactData.lastname) {
      console.log('Validation failed: Name is required')
      return NextResponse.json(
        { error: "Le nom est requis" },
        { status: 400 }
      )
    }
    
    if (!contactData.phone) {
      console.log('Validation failed: Phone is required')
      return NextResponse.json(
        { error: "Le téléphone est requis" },
        { status: 400 }
      )
    }

    // Check if we already have a submission for this user (partial OR complete)
    let submission = await ContactSubmission.findOne({
      $or: [
        { email: contactData.email },
        { phone: contactData.phone }
      ]
    });

    if (submission) {
      // Update existing submission (whether partial or complete)
      console.log(`Updating existing ${submission.submissionStatus} submission to complete...`)
      submission.name = `${contactData.firstname} ${contactData.lastname}`.trim();
      submission.firstname = contactData.firstname || '';
      submission.lastname = contactData.lastname || '';
      submission.email = contactData.email;
      submission.phone = contactData.phone;
      submission.company = contactData.company;
      submission.message = contactData.message;
      submission.submissionStatus = 'complete';
      submission.fieldsFilled = {
        name: true,
        firstname: !!contactData.firstname,
        lastname: !!contactData.lastname,
        email: true,
        phone: true,
        company: !!contactData.company,
        message: !!contactData.message
      };
      submission.sentToHubSpot = false; // Will be set to true after HubSpot integration
      
      // Update additional fields if provided
      if (body.countryCode) submission.countryCode = body.countryCode;
      if (body.countryName) submission.countryName = body.countryName;
      if (body.source) submission.source = body.source;
      if (body.page) submission.page = body.page;
      // Always include brief_description for complete submissions
      if (body.brief_description) submission.brief_description = body.brief_description;
      
    } else {
      // Create new complete submission
      console.log('Creating new complete submission...')
      submission = new ContactSubmission({
        name: `${contactData.firstname} ${contactData.lastname}`.trim(),
        firstname: contactData.firstname || '',
        lastname: contactData.lastname || '',
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        message: contactData.message,
        submissionStatus: 'complete',
        sentToHubSpot: false,
        fieldsFilled: {
          name: true,
          firstname: !!contactData.firstname,
          lastname: !!contactData.lastname,
          email: true,
          phone: true,
          company: !!contactData.company,
          message: !!contactData.message
        },
        countryCode: body.countryCode,
        countryName: body.countryName,
        source: body.source || 'website',
        page: body.page || 'home',
        userAgent: req.headers.get('user-agent') || '',
        // Always include brief_description for complete submissions
        brief_description: body.brief_description || ''
      });
    }

    console.log('Saving to MongoDB...')
    await submission.save()
    console.log('Successfully saved to MongoDB')

    // Integrate with HubSpot CRM (only for complete submissions)
    let hubspotResult: any = null
    try {
      console.log('Attempting HubSpot integration...')
      hubspotResult = await HubSpotService.upsertContact(contactData)
      console.log('HubSpot integration successful:', hubspotResult)
      
      // Mark as sent to HubSpot and store HubSpot details
      submission.sentToHubSpot = true;
      submission.hubspotContactId = hubspotResult.contactId;
      submission.hubspotSyncDate = new Date();
      await submission.save();
      
      console.log('Database updated with HubSpot details:', {
        sentToHubSpot: submission.sentToHubSpot,
        hubspotContactId: submission.hubspotContactId,
        hubspotSyncDate: submission.hubspotSyncDate
      });
      
    } catch (hubspotError) {
      console.error('HubSpot integration failed:', hubspotError)
      // Don't fail the entire request if HubSpot fails
      // The contact is still saved in MongoDB
    }

    console.log('Returning success response')
    return NextResponse.json({
      success: true,
      submission,
      hubspot: hubspotResult
    })

  } catch (error) {
    console.error("Error creating contact submission:", error)
    return NextResponse.json(
      { error: "Error creating contact submission", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const submissions = await ContactSubmission.find({})
      .sort({ createdAt: -1 })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching contact submissions:", error)
    return NextResponse.json(
      { error: "Error fetching contact submissions" },
      { status: 500 }
    )
  }
} 