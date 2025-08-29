import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Dashboard leads API endpoint called')
    await connectDB()
    
    // Fetch all submissions with proper sorting and field selection
    const submissions = await ContactSubmission.find({})
      .select('_id name firstname lastname email phone company message submissionStatus status sentToHubSpot hubspotContactId hubspotSyncDate brief_description fieldsFilled countryCode countryName source page createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean()

    console.log(`Successfully fetched ${submissions.length} submissions for dashboard`)

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching dashboard leads:", error)
    return NextResponse.json(
      { error: "Error fetching dashboard leads", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
