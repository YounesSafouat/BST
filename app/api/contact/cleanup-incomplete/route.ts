import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Cleanup incomplete emails API endpoint called')
    await connectDB()
    
    // Find and remove incomplete email records
    const incompleteEmails = await ContactSubmission.find({
      email: { $regex: /^[^\s@]+@[^\s@]+$/, $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    });
    
    console.log(`Found ${incompleteEmails.length} incomplete email records`);
    
    let cleanedCount = 0;
    
    for (const submission of incompleteEmails) {
      console.log(`Removing incomplete email: ${submission.email}`);
      await ContactSubmission.findByIdAndDelete(submission._id);
      cleanedCount++;
    }
    
    console.log(`Cleanup completed. Removed ${cleanedCount} incomplete email records`);
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Removed ${cleanedCount} incomplete email records`,
      cleanedCount,
      remainingPartialSubmissions: await ContactSubmission.countDocuments({ submissionStatus: 'partial' })
    })

  } catch (error) {
    console.error("Error cleaning up incomplete emails:", error)
    return NextResponse.json(
      { error: "Error cleaning up incomplete emails", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    
    // Find incomplete email records
    const incompleteEmails = await ContactSubmission.find({
      email: { $regex: /^[^\s@]+@[^\s@]+$/, $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    });
    
    return NextResponse.json({
      incompleteEmails: incompleteEmails.length,
      examples: incompleteEmails.map(s => ({ id: s._id, email: s.email })),
      totalPartialSubmissions: await ContactSubmission.countDocuments({ submissionStatus: 'partial' })
    })
  } catch (error) {
    console.error("Error getting incomplete email info:", error)
    return NextResponse.json(
      { error: "Error getting incomplete email info" },
      { status: 500 }
    )
  }
}
