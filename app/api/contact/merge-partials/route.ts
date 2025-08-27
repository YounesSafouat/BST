import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Merge partial submissions API endpoint called')
    await connectDB()
    
    // Find all partial submissions
    const partialSubmissions = await ContactSubmission.find({ submissionStatus: 'partial' });
    console.log(`Found ${partialSubmissions.length} partial submissions`);
    
    if (partialSubmissions.length <= 1) {
      return NextResponse.json({
        success: true,
        message: 'No duplicates to merge',
        mergedCount: 0
      });
    }
    
    // Group by source, page, and country to identify potential duplicates
    const groups = new Map();
    
    partialSubmissions.forEach(submission => {
      const key = `${submission.source || 'unknown'}-${submission.page || 'unknown'}-${submission.countryCode || 'unknown'}`;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(submission);
    });
    
    let mergedCount = 0;
    
    for (const [key, submissions] of groups) {
      if (submissions.length > 1) {
        console.log(`Found ${submissions.length} submissions in group: ${key}`);
        
        // Sort by creation date (oldest first)
        submissions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        // Keep the oldest submission and merge others into it
        const keepSubmission = submissions[0];
        const mergeSubmissions = submissions.slice(1);
        
        console.log(`Keeping submission ${keepSubmission._id}, merging ${mergeSubmissions.length} others`);
        
        // Merge all fields from other submissions
        for (const mergeSubmission of mergeSubmissions) {
          // Merge basic fields
          if (mergeSubmission.name && !keepSubmission.name) keepSubmission.name = mergeSubmission.name;
          if (mergeSubmission.email && !keepSubmission.email) keepSubmission.email = mergeSubmission.email;
          if (mergeSubmission.phone && !keepSubmission.phone) keepSubmission.phone = mergeSubmission.phone;
          if (mergeSubmission.company && !keepSubmission.company) keepSubmission.company = mergeSubmission.company;
          if (mergeSubmission.message && !keepSubmission.message) keepSubmission.message = mergeSubmission.message;
          
          // Merge fieldsFilled
          if (mergeSubmission.fieldsFilled) {
            keepSubmission.fieldsFilled = {
              ...keepSubmission.fieldsFilled,
              ...mergeSubmission.fieldsFilled
            };
          }
          
          // Delete the merged submission
          await ContactSubmission.findByIdAndDelete(mergeSubmission._id);
          mergedCount++;
        }
        
        // Save the updated submission
        await keepSubmission.save();
        console.log(`Successfully merged submissions into ${keepSubmission._id}`);
      }
    }
    
    console.log(`Merge completed. Merged ${mergedCount} duplicate records`);
    
    return NextResponse.json({
      success: true,
      message: `Merge completed. Merged ${mergedCount} duplicate records`,
      mergedCount,
      remainingPartialSubmissions: await ContactSubmission.countDocuments({ submissionStatus: 'partial' })
    })

  } catch (error) {
    console.error("Error merging partial submissions:", error)
    return NextResponse.json(
      { error: "Error merging partial submissions", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    
    const partialSubmissions = await ContactSubmission.find({ submissionStatus: 'partial' });
    
    // Group by source, page, country
    const groups = new Map();
    partialSubmissions.forEach(submission => {
      const key = `${submission.source || 'unknown'}-${submission.page || 'unknown'}-${submission.countryCode || 'unknown'}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(submission);
    });
    
    const duplicateGroups = Array.from(groups.entries())
      .filter(([key, submissions]) => submissions.length > 1)
      .map(([key, submissions]) => ({
        group: key,
        count: submissions.length,
        submissions: submissions.map(s => ({
          id: s._id,
          email: s.email,
          phone: s.phone,
          fieldsFilled: s.fieldsFilled
        }))
      }));
    
    return NextResponse.json({
      totalPartialSubmissions: partialSubmissions.length,
      duplicateGroups,
      canMerge: duplicateGroups.length > 0
    })
  } catch (error) {
    console.error("Error getting partial submission groups:", error)
    return NextResponse.json(
      { error: "Error getting partial submission groups" },
      { status: 500 }
    )
  }
}
