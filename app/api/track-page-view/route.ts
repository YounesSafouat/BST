import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageView from '@/models/PageView';
import { detectTrafficSource } from '@/lib/traffic-source-detector';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { 
      path, 
      page, 
      userAgent, 
      referrer, 
      ipAddress, 
      country, 
      city, 
      device, 
      browser, 
      os 
    } = body;
    
    // Get the full URL from the request
    const fullUrl = req.headers.get('referer') || `https://agence-blackswan.com${path}`;
    
    // Detect traffic source
    const trafficData = detectTrafficSource(fullUrl, referrer, userAgent);
    
    console.log('Page View Tracking:', {
      path,
      trafficSource: trafficData.trafficSource,
      utmCampaign: trafficData.utmCampaign,
      referrer: trafficData.referrer
    });
    
    // Create or update page view with traffic source data
    const pageViewData = {
      path,
      page: page || path,
      count: 1,
      lastViewed: new Date(),
      firstViewed: new Date(),
      userAgent,
      referrer: trafficData.referrer,
      ipAddress,
      country,
      city,
      device,
      browser,
      os,
      // Traffic source data
      trafficSource: trafficData.trafficSource,
      campaign: trafficData.campaign,
      medium: trafficData.medium,
      source: trafficData.source,
      utmSource: trafficData.utmSource,
      utmMedium: trafficData.utmMedium,
      utmCampaign: trafficData.utmCampaign,
      utmTerm: trafficData.utmTerm,
      utmContent: trafficData.utmContent,
      // Performance metrics
      avgTimeOnPage: 0,
      bounceRate: 0,
      viewsByDate: [{
        date: new Date(),
        count: 1
      }]
    };
    
    await PageView.findOneAndUpdate(
      { path },
      { 
        $inc: { count: 1 },
        $set: {
          ...pageViewData,
          lastViewed: new Date()
        },
        $setOnInsert: {
          firstViewed: new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      trafficSource: trafficData.trafficSource,
      utmCampaign: trafficData.utmCampaign 
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 });
  }
} 