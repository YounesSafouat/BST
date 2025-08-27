import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Cleanup duplicates API endpoint called')
    await connectDB()
    
    // Find all partial submissions
    const partialSubmissions = await ContactSubmission.find({ submissionStatus: 'partial' });
    console.log(`Found ${partialSubmissions.length} partial submissions`);
    
    // Group by email and phone to find duplicates
    const emailGroups = new Map();
    const phoneGroups = new Map();
    
    partialSubmissions.forEach(submission => {
      if (submission.email) {
        if (!emailGroups.has(submission.email)) {
          emailGroups.set(submission.email, []);
        }
        emailGroups.get(submission.email).push(submission);
      }
      
      if (submission.phone) {
        if (!phoneGroups.has(submission.phone)) {
          phoneGroups.set(submission.phone, []);
        }
        phoneGroups.get(submission.phone).push(submission);
      }
    });
    
    let cleanedCount = 0;
    
    // Clean up email duplicates
    for (const [email, submissions] of emailGroups) {
      if (submissions.length > 1) {
        console.log(`Found ${submissions.length} duplicates for email: ${email}`);
        
        // Keep the first one, merge data from others
        const keepSubmission = submissions[0];
        const toDelete = submissions.slice(1);
        
        // Merge fieldsFilled
        toDelete.forEach(submission => {
          Object.keys(submission.fieldsFilled).forEach(field => {
            if (submission.fieldsFilled[field]) {
              keepSubmission.fieldsFilled[field] = true;
            }
          });
          
          // Merge other fields if they exist
          if (submission.name && !keepSubmission.name) keepSubmission.name = submission.name;
          if (submission.phone && !keepSubmission.phone) keepSubmission.phone = submission.phone;
          if (submission.company && !keepSubmission.company) keepSubmission.company = submission.company;
          if (submission.message && !keepSubmission.message) keepSubmission.message = submission.message;
        });
        
        // Save the merged submission
        await keepSubmission.save();
        
        // Delete duplicates
        for (const submission of toDelete) {
          await ContactSubmission.findByIdAndDelete(submission._id);
        }
        
        cleanedCount += toDelete.length;
        console.log(`Cleaned up ${toDelete.length} duplicates for email: ${email}`);
      }
    }
    
    // Clean up phone duplicates
    for (const [phone, submissions] of phoneGroups) {
      if (submissions.length > 1) {
        console.log(`Found ${submissions.length} duplicates for phone: ${phone}`);
        
        // Keep the first one, merge data from others
        const keepSubmission = submissions[0];
        const toDelete = submissions.slice(1);
        
        // Merge fieldsFilled
        toDelete.forEach(submission => {
          Object.keys(submission.fieldsFilled).forEach(field => {
            if (submission.fieldsFilled[field]) {
              keepSubmission.fieldsFilled[field] = true;
            }
          });
          
          // Merge other fields if they exist
          if (submission.name && !keepSubmission.name) keepSubmission.name = submission.name;
          if (submission.email && !keepSubmission.email) keepSubmission.email = submission.email;
          if (submission.company && !keepSubmission.company) keepSubmission.company = submission.company;
          if (submission.message && !keepSubmission.message) keepSubmission.message = submission.message;
        });
        
        // Save the merged submission
        await keepSubmission.save();
        
        // Delete duplicates
        for (const submission of toDelete) {
          await ContactSubmission.findByIdAndDelete(submission._id);
        }
        
        cleanedCount += toDelete.length;
        console.log(`Cleaned up ${toDelete.length} duplicates for phone: ${phone}`);
      }
    }
    
    console.log(`Cleanup completed. Removed ${cleanedCount} duplicate records`);
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Removed ${cleanedCount} duplicate records`,
      cleanedCount,
      remainingPartialSubmissions: await ContactSubmission.countDocuments({ submissionStatus: 'partial' })
    })

  } catch (error) {
    console.error("Error cleaning up duplicates:", error)
    return NextResponse.json(
      { error: "Error cleaning up duplicates", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    
    // Count partial submissions
    const partialCount = await ContactSubmission.countDocuments({ submissionStatus: 'partial' });
    
    // Find potential duplicates
    const emailDuplicates = await ContactSubmission.aggregate([
      { $match: { submissionStatus: 'partial', email: { $exists: true, $ne: null } } },
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    const phoneDuplicates = await ContactSubmission.aggregate([
      { $match: { submissionStatus: 'partial', phone: { $exists: true, $ne: null } } },
      { $group: { _id: '$phone', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    return NextResponse.json({
      partialSubmissions: partialCount,
      emailDuplicates: emailDuplicates.length,
      phoneDuplicates: phoneDuplicates.length,
      totalDuplicates: emailDuplicates.length + phoneDuplicates.length
    })
  } catch (error) {
    console.error("Error getting duplicate info:", error)
    return NextResponse.json(
      { error: "Error getting duplicate info" },
      { status: 500 }
    )
  }
}
