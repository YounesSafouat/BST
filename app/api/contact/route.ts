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
    
    // Extract form data - handle both simple and complex form structures
    let contactData: ContactData = {
      email: body.email || '',
      firstname: body.firstname || body.name?.split(' ')[0] || '',
      lastname: body.lastname || body.name?.split(' ').slice(1).join(' ') || '',
      phone: body.phone || '',
      company: body.company || body.organization || '',
      message: body.message || body.description || body.project_description || '',
      // Always include brief_description for HubSpot
      brief_description: body.brief_description || body.userBehavior || ''
    }

    // Add any additional custom properties from the form
    Object.keys(body).forEach(key => {
      if (!['email', 'firstname', 'lastname', 'phone', 'company', 'message', 'name'].includes(key)) {
        contactData[key] = body[key]
      }
    })

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
      
      // Mark as sent to HubSpot
      submission.sentToHubSpot = true;
      await submission.save();
      
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