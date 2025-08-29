import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Fix status migration endpoint called')
    await connectDB()
    
    // Find all records with invalid status values
    const invalidRecords = await ContactSubmission.find({
      status: { $nin: ['pending', 'in-progress', 'completed', 'read', 'replied', 'closed', 'partial_lead_sent', 'archived'] }
    });
    
    console.log(`Found ${invalidRecords.length} records with invalid status values`)
    
    if (invalidRecords.length > 0) {
      // Update all invalid status values to 'pending'
      const result = await ContactSubmission.updateMany(
        { status: { $nin: ['pending', 'in-progress', 'completed', 'read', 'replied', 'closed', 'partial_lead_sent', 'archived'] } },
        { $set: { status: 'pending' } }
      );
      
      console.log(`Updated ${result.modifiedCount} records`)
      
      return NextResponse.json({
        success: true,
        message: `Fixed ${result.modifiedCount} records with invalid status values`,
        invalidRecordsFound: invalidRecords.length,
        recordsUpdated: result.modifiedCount
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'No records with invalid status values found',
      invalidRecordsFound: 0,
      recordsUpdated: 0
    })
    
  } catch (error) {
    console.error("Error fixing status values:", error)
    return NextResponse.json(
      { error: "Error fixing status values", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
