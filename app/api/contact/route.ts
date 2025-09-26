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
    console.log('Request body received:', body);
    
    // Handle both old and new standardized format
    let formData, additionalData;
    
    if (body.event === 'formSubmit' && body.formData) {
      // New standardized format
      formData = body.formData;
      additionalData = body.additionalData || {};
      console.log('Using new standardized format');
    } else {
      // Legacy format - backward compatibility
      formData = body;
      additionalData = body;
      console.log('Using legacy format for backward compatibility');
    }
    
    // Validate required fields for complete submission
    if (!formData.email) {
      console.log('Validation failed: Email is required')
      return NextResponse.json(
        { error: "Email est requis" },
        { status: 400 }
      )
    }
    
    if (!formData.name && !formData.firstname) {
      console.log('Validation failed: Name is required')
      return NextResponse.json(
        { error: "Le nom est requis" },
        { status: 400 }
      )
    }
    
    if (!formData.phone) {
      console.log('Validation failed: Phone is required')
      return NextResponse.json(
        { error: "Le téléphone est requis" },
        { status: 400 }
      )
    }

    // Prepare contact data for HubSpot
    const contactData: any = {
      email: formData.email,
      firstname: formData.firstname || formData.name?.split(' ')[0] || '',
      lastname: formData.lastname || formData.name?.split(' ').slice(1).join(' ') || '',
      phone: formData.phone || '',
      company: formData.company || '',
      message: formData.message || '',
      brief_description: additionalData.brief_description || '',
      
      // Website Analytics Properties (writable)
      hs_analytics_source: 'DIRECT_TRAFFIC',
      
      // Lead Qualification Properties (writable)
      lifecyclestage: 'lead',
      hs_lead_status: 'NEW',
      
      // Custom Properties
      contact_status: 'new lead',
      submission_count: '1',
      first_submission_date: new Date().toISOString().split('T')[0],
      last_submission_date: new Date().toISOString().split('T')[0],
      
      // Geographic properties (will be populated conditionally)
      country: undefined,
      hs_country_region_code: undefined,
      city: undefined,
      state: undefined,
      hs_state_code: undefined
    };

    console.log('Initial contactData:', contactData);
    console.log('Body city field:', body.city);
    console.log('Body countryCode field:', body.countryCode);

    // Only add geographic properties if we have real data
    if (additionalData.countryCode) {
      contactData.country = additionalData.countryCode;
      contactData.hs_country_region_code = additionalData.countryCode;
    }
    
    if (additionalData.city) {
      contactData.city = additionalData.city;
    }
    
    if (additionalData.state) {
      contactData.state = additionalData.state;
      contactData.hs_state_code = additionalData.state;
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
      if (additionalData.countryCode) submission.countryCode = additionalData.countryCode;
      if (additionalData.countryName) submission.countryName = additionalData.countryName;
      if (additionalData.source) submission.source = additionalData.source;
      if (additionalData.page) submission.page = additionalData.page;
      // Always include brief_description for complete submissions
      if (additionalData.brief_description) submission.brief_description = additionalData.brief_description;
      
      // Update comprehensive HubSpot properties
      if (contactData.hs_analytics_source) submission.hs_analytics_source = contactData.hs_analytics_source;
      if (contactData.lifecyclestage) submission.lifecyclestage = contactData.lifecyclestage;
      if (contactData.hs_lead_status) submission.hs_lead_status = contactData.hs_lead_status;
      if (contactData.contact_status) submission.contact_status = contactData.contact_status;
      if (contactData.submission_count) submission.submission_count = contactData.submission_count;
      if (contactData.first_submission_date) submission.first_submission_date = contactData.first_submission_date;
      if (contactData.last_submission_date) submission.last_submission_date = contactData.last_submission_date;
      if (contactData.country) submission.country = contactData.country;
      if (contactData.hs_country_region_code) submission.hs_country_region_code = contactData.hs_country_region_code;
      if (contactData.city) submission.city = contactData.city;
      if (contactData.state) submission.state = contactData.state;
      if (contactData.hs_state_code) submission.hs_state_code = contactData.hs_state_code;
      
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
        countryCode: additionalData.countryCode,
        countryName: additionalData.countryName,
        source: additionalData.source || 'website',
        page: additionalData.page || 'home',
        userAgent: req.headers.get('user-agent') || '',
        // Always include brief_description for complete submissions
        brief_description: additionalData.brief_description || '',
        
        // Comprehensive HubSpot properties
        hs_analytics_source: contactData.hs_analytics_source,
        lifecyclestage: contactData.lifecyclestage,
        hs_lead_status: contactData.hs_lead_status,
        contact_status: contactData.contact_status,
        submission_count: contactData.submission_count,
        first_submission_date: contactData.first_submission_date,
        last_submission_date: contactData.last_submission_date,
        country: contactData.country,
        hs_country_region_code: contactData.hs_country_region_code,
        city: contactData.city,
        state: contactData.state,
        hs_state_code: contactData.hs_state_code
      });

      console.log('New submission city field:', contactData.city);
      console.log('New submission data being saved:', submission);
    }

    console.log('Saving to MongoDB...')
    await submission.save()
    console.log('Successfully saved to MongoDB')

    // Integrate with HubSpot CRM (only for complete submissions)
    let hubspotResult: any = null
    try {
      console.log('Attempting HubSpot integration...')
      hubspotResult = await HubSpotService.upsertContact(contactData)
      console.log('HubSpot integration result:', hubspotResult)
      
      // Only mark as sent to HubSpot if the operation was successful
      if (hubspotResult.success) {
        submission.sentToHubSpot = true;
        submission.hubspotContactId = hubspotResult.contactId;
        submission.hubspotSyncDate = new Date();
        await submission.save();
        
        console.log('Database updated with HubSpot details:', {
          sentToHubSpot: submission.sentToHubSpot,
          hubspotContactId: submission.hubspotContactId,
          hubspotSyncDate: submission.hubspotSyncDate
        });
      } else {
        console.log('HubSpot integration failed, not updating database:', hubspotResult.error);
        // Keep sentToHubSpot as false since the operation failed
      }
      
    } catch (hubspotError) {
      console.error('HubSpot integration failed with exception:', hubspotError)
      // Don't fail the entire request if HubSpot fails
      // The contact is still saved in MongoDB
      // Keep sentToHubSpot as false since the operation failed
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