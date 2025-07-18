import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'
import { HubSpotService, ContactData } from '@/lib/hubspot'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    
    // Extract form data - handle both simple and complex form structures
    let contactData: ContactData = {
      email: body.email || '',
      firstname: body.firstname || body.name?.split(' ')[0] || '',
      lastname: body.lastname || body.name?.split(' ').slice(1).join(' ') || '',
      phone: body.phone || '',
      company: body.company || body.organization || '',
      message: body.message || body.description || body.project_description || ''
    }

    // Add any additional custom properties from the form
    Object.keys(body).forEach(key => {
      if (!['email', 'firstname', 'lastname', 'phone', 'company', 'message', 'name'].includes(key)) {
        contactData[key] = body[key]
      }
    })

    // Validate required fields
    if (!contactData.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Save to MongoDB (existing functionality)
    const submission = new ContactSubmission({
      name: `${contactData.firstname} ${contactData.lastname}`.trim(),
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      message: contactData.message,
    })

    await submission.save()

    // Integrate with HubSpot CRM
    let hubspotResult = null
    try {
      hubspotResult = await HubSpotService.upsertContact(contactData)
      console.log('HubSpot integration successful:', hubspotResult)
    } catch (hubspotError) {
      console.error('HubSpot integration failed:', hubspotError)
      // Don't fail the entire request if HubSpot fails
      // The contact is still saved in MongoDB
    }

    return NextResponse.json({
      success: true,
      submission,
      hubspot: hubspotResult
    })

  } catch (error) {
    console.error("Error creating contact submission:", error)
    return NextResponse.json(
      { error: "Error creating contact submission" },
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