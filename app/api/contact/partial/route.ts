import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Partial contact API endpoint called')
    await connectDB()
    const body = await req.json()
    console.log('Partial contact request body received:', body)
    
    // Extract form data
    const { name, firstname, lastname, email, phone, company, message, countryCode, countryName, source, page, brief_description } = body
    
    // Check if we have at least one valid field - be more flexible for single field updates
    const hasValidField = firstname?.trim() || lastname?.trim() || email?.trim() || phone?.trim() || company?.trim() || message?.trim();
    
    if (!hasValidField) {
      console.log('Validation failed - no valid fields provided:', { firstname, lastname, email, phone, company, message })
      return NextResponse.json(
        { error: "Au moins un champ doit être rempli (firstname, lastname, email, phone, company, ou message)" },
        { status: 400 }
      )
    }

    console.log('Validation passed, processing fields:', { firstname, lastname, email, phone, company, message })

    // Check if we already have a partial submission for this user
    let submission;
    let isNewSubmission = false;
    
    // Only proceed if we have email OR phone (required for lead tracking)
    if (!email && !phone) {
      console.log('No email or phone provided - skipping partial submission');
      return NextResponse.json({
        success: false,
        message: 'Email or phone is required for partial submission tracking'
      });
    }
    
    // First, try to find by exact email match if email is provided
    if (email) {
      submission = await ContactSubmission.findOne({
        email: email,
        submissionStatus: 'partial'
      });
      console.log('Looking for existing submission by email:', email, 'Found:', !!submission);
    }
    
    // If no email match, try to find by exact phone match if phone is provided
    if (!submission && phone) {
      submission = await ContactSubmission.findOne({
        phone: phone,
        submissionStatus: 'partial'
      });
      console.log('Looking for existing submission by phone:', phone, 'Found:', !!submission);
    }
    
    // REMOVED: The problematic broader search that was finding wrong records
    // Now we only search by exact email or phone match - no cross-user interference
    
    if (!submission) {
      // Create new partial submission only if we can't find any existing one
      console.log('Creating new partial submission - no existing record found');
      submission = new ContactSubmission({
        submissionStatus: 'partial',
        sentToHubSpot: false,
        source: source || 'website',
        page: page || 'home',
        countryCode,
        countryName,
        userAgent: req.headers.get('user-agent') || '',
      });
      isNewSubmission = true;
    } else {
      console.log('Updating existing partial submission:', submission._id);
    }
    
    // Update fields and track what's filled
    const fieldsFilled: any = {};
    
    if (name && name.trim()) {
      submission.name = name.trim();
      fieldsFilled.name = true;
    }
    
    if (firstname && firstname.trim()) {
      submission.firstname = firstname.trim();
      fieldsFilled.firstname = true;
    }
    
    if (lastname && lastname.trim()) {
      submission.lastname = lastname.trim();
      fieldsFilled.lastname = true;
    }
    
    if (email && email.trim()) {
      submission.email = email.trim();
      fieldsFilled.email = true;
    }
    
    if (phone && phone.trim()) {
      submission.phone = phone.trim();
      fieldsFilled.phone = true;
    }
    
    if (company && company.trim()) {
      submission.company = company.trim();
      fieldsFilled.company = true;
    }
    
    if (message && message.trim()) {
      submission.message = message.trim();
      fieldsFilled.message = true;
    }
    
    // Store brief_description if provided
    if (brief_description && brief_description.trim()) {
      submission.brief_description = brief_description.trim();
    }
    
    // Store comprehensive HubSpot properties if provided
    if (body.hs_analytics_source) submission.hs_analytics_source = body.hs_analytics_source;
    if (body.lifecyclestage) submission.lifecyclestage = body.lifecyclestage;
    if (body.hs_lead_status) submission.hs_lead_status = body.hs_lead_status;
    if (body.contact_status) submission.contact_status = body.contact_status;
    if (body.submission_count) submission.submission_count = body.submission_count;
    if (body.first_submission_date) submission.first_submission_date = body.first_submission_date;
    if (body.last_submission_date) submission.last_submission_date = body.last_submission_date;
    if (body.country) submission.country = body.country;
    if (body.hs_country_region_code) submission.hs_country_region_code = body.hs_country_region_code;
    if (body.city) submission.city = body.city;
    if (body.state) submission.state = body.state;
    if (body.hs_state_code) submission.hs_state_code = body.hs_state_code;
    
    // Ensure status is valid - if it's not set or invalid, set to 'pending'
    if (!submission.status || !['pending', 'in-progress', 'completed', 'read', 'replied', 'closed', 'partial_lead_sent', 'archived'].includes(submission.status)) {
      submission.status = 'pending';
    }
    
    // Update fieldsFilled object - merge with existing
    submission.fieldsFilled = { 
      ...submission.fieldsFilled, 
      ...fieldsFilled 
    };
    
    // Update country info if provided
    if (countryCode) submission.countryCode = countryCode;
    if (countryName) submission.countryName = countryName;
    
    console.log('Saving partial submission to MongoDB...')
    console.log('Submission data to save:', {
      submissionStatus: submission.submissionStatus,
      fieldsFilled: submission.fieldsFilled,
      email: submission.email,
      phone: submission.phone,
      firstname: submission.firstname,
      lastname: submission.lastname
    })
    
    await submission.save()
    console.log('Successfully saved partial submission to MongoDB')

    return NextResponse.json({
      success: true,
      submission,
      isNewSubmission,
      message: 'Partial contact information saved successfully'
    })

  } catch (error) {
    console.error("Error saving partial contact submission:", error)
    return NextResponse.json(
      { error: "Error saving partial contact submission", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
