import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Merge duplicates endpoint called')
    await connectDB()
    
    // Find all partial submissions
    const allSubmissions = await ContactSubmission.find({ submissionStatus: 'partial' }).sort({ createdAt: 1 });
    console.log(`Found ${allSubmissions.length} partial submissions`)
    
    const mergedCount = 0;
    const processedIds = new Set();
    
    for (const submission of allSubmissions) {
      if (processedIds.has(submission._id.toString())) continue;
      
      // Find potential duplicates for this submission
      const duplicates = allSubmissions.filter(s => 
        s._id.toString() !== submission._id.toString() &&
        !processedIds.has(s._id.toString()) &&
        (
          (submission.email && s.email === submission.email) ||
          (submission.phone && s.phone === submission.phone) ||
          (submission.email && s.phone && submission.phone && s.phone === submission.phone) ||
          (submission.phone && s.email && submission.email && s.email === submission.email)
        )
      );
      
      if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicates for submission ${submission._id}`)
        
        // Merge all duplicates into the first submission
        for (const duplicate of duplicates) {
          // Merge fields
          if (duplicate.firstname && !submission.firstname) submission.firstname = duplicate.firstname;
          if (duplicate.lastname && !submission.lastname) submission.lastname = duplicate.lastname;
          if (duplicate.email && !submission.email) submission.email = duplicate.email;
          if (duplicate.phone && !submission.phone) submission.phone = duplicate.phone;
          if (duplicate.company && !submission.company) submission.company = duplicate.company;
          if (duplicate.message && !submission.message) submission.message = duplicate.message;
          if (duplicate.brief_description && !submission.brief_description) submission.brief_description = duplicate.brief_description;
          
          // Merge fieldsFilled
          if (duplicate.fieldsFilled) {
            submission.fieldsFilled = {
              ...submission.fieldsFilled,
              ...duplicate.fieldsFilled
            };
          }
          
          // Mark as processed
          processedIds.add(duplicate._id.toString());
          
          // Delete the duplicate
          await ContactSubmission.findByIdAndDelete(duplicate._id);
          console.log(`Deleted duplicate ${duplicate._id}`)
        }
        
        // Save the merged submission
        await submission.save();
        console.log(`Saved merged submission ${submission._id}`)
        mergedCount++;
      }
      
      processedIds.add(submission._id.toString());
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${allSubmissions.length} submissions, merged ${mergedCount} duplicates`,
      totalSubmissions: allSubmissions.length,
      mergedCount
    })
    
  } catch (error) {
    console.error("Error merging duplicates:", error)
    return NextResponse.json(
      { error: "Error merging duplicates", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
