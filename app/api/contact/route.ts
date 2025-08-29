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
      
      // Website Analytics Properties (writable)
      hs_analytics_source: body.hs_analytics_source || 'WEBSITE_FORM',
      hs_analytics_source_data_1: body.hs_analytics_source_data_1 || 'contact_form',
      hs_analytics_source_data_2: body.hs_analytics_source_data_2 || 'website',
      
      // Lead Qualification Properties (writable)
      lifecyclestage: body.lifecyclestage || 'lead',
      hs_lead_status: body.hs_lead_status || 'NEW',
      
      // Geographic & IP Data (writable)
      country: body.country || body.countryCode || '',
      hs_country_region_code: body.hs_country_region_code || body.countryCode || '',
      city: body.city || '',
      state: body.state || '',
      hs_state_code: body.hs_state_code || '',
      
      // Company Information (writable)
      industry: body.industry || '',
      numemployees: body.numemployees || '',
      annualrevenue: body.annualrevenue || '',
      website: body.website || '',
      jobtitle: body.jobtitle || '',
      hs_role: body.hs_role || '',
      hs_seniority: body.hs_seniority || '',
      
      // Sales Intelligence (writable)
      hs_buying_role: body.hs_buying_role || 'DECISION_MAKER',
      
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