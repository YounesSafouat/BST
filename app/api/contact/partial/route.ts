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
    const { name, email, phone, company, message, countryCode, countryName, source, page, brief_description } = body
    
    // At least one field must be provided
    if (!name && !email && !phone && !company && !message) {
      return NextResponse.json(
        { error: "Au moins un champ doit être rempli" },
        { status: 400 }
      )
    }

    // Check if we already have a partial submission for this user
    let submission;
    let isNewSubmission = false;
    
    // Strategy: ALWAYS try to find existing partial submission
    // This ensures we update the same record when user adds ANY field
    
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
    
    // If still no match, do a broader search for ANY partial submission
    // that might be from the same user (same source, page, country)
    // This is crucial for when user adds fields like company, name, or message
    if (!submission) {
      const broaderSearch: any = {
        submissionStatus: 'partial',
        source: source || 'website',
        page: page || 'home'
      };
      
      // Add country info if available to make search more specific
      if (countryCode) {
        broaderSearch.countryCode = countryCode;
      }
      
      submission = await ContactSubmission.findOne(broaderSearch);
      console.log('Broader search for existing submission:', broaderSearch, 'Found:', !!submission);
    }
    
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
    
    // Update fieldsFilled object - merge with existing
    submission.fieldsFilled = { 
      ...submission.fieldsFilled, 
      ...fieldsFilled 
    };
    
    // Update country info if provided
    if (countryCode) submission.countryCode = countryCode;
    if (countryName) submission.countryName = countryName;
    
    console.log('Saving partial submission to MongoDB...')
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
