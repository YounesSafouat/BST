import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';
import { HubSpotService } from '@/lib/hubspot';

export const dynamic = 'force-dynamic';

// POST: Subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    console.log('Newsletter API: Starting newsletter subscription...');
    await connectDB();
    console.log('Newsletter API: Connected to database');

    const body = await req.json();
    const { email } = body;

    console.log('Newsletter API: Received email:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('Newsletter API: Invalid email format');
      return NextResponse.json({ 
        error: 'Email invalide', 
        success: false 
      }, { status: 400 });
    }

    // Check if email already exists in database
    const existingSubmission = await ContactSubmission.findOne({ 
      email: email.toLowerCase().trim(),
      status: 'newsletter'
    });

    if (existingSubmission) {
      console.log('Newsletter API: Email already subscribed');
      return NextResponse.json({ 
        error: 'Cet email est déjà abonné à notre newsletter', 
        success: false 
      }, { status: 409 });
    }

    // Create newsletter subscription record
    const newsletterSubmission = new ContactSubmission({
      email: email.toLowerCase().trim(),
      submissionStatus: 'complete',
      status: 'newsletter',
      fieldsFilled: {
        email: true
      },
      sentToHubSpot: false,
      source: 'newsletter_footer',
      page: req.headers.get('referer') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to database
    const savedSubmission = await newsletterSubmission.save();
    console.log('Newsletter API: Saved to database:', savedSubmission._id);

    // Send to HubSpot
    try {
      const hubspotData = {
        email: email.toLowerCase().trim(),
        contact_status: 'NewsLetter',
        lifecyclestage: 'subscriber',
        hs_lead_status: 'NEW',
        hs_analytics_source: 'DIRECT_TRAFFIC',
        submission_count: '1',
        first_submission_date: new Date().toISOString().split('T')[0],
        last_submission_date: new Date().toISOString().split('T')[0],
        brief_description: 'Abonnement newsletter via footer du site web'
      };

      console.log('Newsletter API: Sending to HubSpot with data:', hubspotData);
      
      const hubspotResult = await HubSpotService.upsertContact(hubspotData);
      
      if (hubspotResult.success) {
        // Update database record with HubSpot info
        await ContactSubmission.findByIdAndUpdate(savedSubmission._id, {
          sentToHubSpot: true,
          hubspotContactId: hubspotResult.contactId,
          hubspotSyncDate: new Date()
        });
        
        console.log('Newsletter API: Successfully sent to HubSpot:', hubspotResult.contactId);
      } else {
        console.error('Newsletter API: HubSpot error:', hubspotResult.error);
        // Don't fail the request if HubSpot fails, just log it
      }
    } catch (hubspotError) {
      console.error('Newsletter API: HubSpot integration error:', hubspotError);
      // Don't fail the request if HubSpot fails
    }

    console.log('Newsletter API: Newsletter subscription successful');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Merci pour votre abonnement à notre newsletter !',
      submissionId: savedSubmission._id
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur', 
      success: false 
    }, { status: 500 });
  }
}

// GET: Get newsletter subscribers (for admin purposes)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const subscribers = await ContactSubmission.find({ 
      status: 'newsletter' 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('email createdAt sentToHubSpot hubspotContactId');

    const total = await ContactSubmission.countDocuments({ 
      status: 'newsletter' 
    });

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Newsletter GET API Error:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}
