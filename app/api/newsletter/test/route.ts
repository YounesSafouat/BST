import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';

export const dynamic = 'force-dynamic';

// GET: Test newsletter functionality
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get newsletter subscribers count
    const newsletterCount = await ContactSubmission.countDocuments({ 
      status: 'newsletter' 
    });

    // Get recent newsletter subscribers
    const recentSubscribers = await ContactSubmission.find({ 
      status: 'newsletter' 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('email createdAt sentToHubSpot hubspotContactId');

    return NextResponse.json({
      success: true,
      data: {
        totalNewsletterSubscribers: newsletterCount,
        recentSubscribers,
        message: 'Newsletter API is working correctly'
      }
    });

  } catch (error: any) {
    console.error('Newsletter Test API Error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      success: false 
    }, { status: 500 });
  }
}
