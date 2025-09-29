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
    
    // Set defaults for missing fields
    const trackingData = {
      path: path || '/',
      page: page || 'Unknown',
      userAgent: userAgent || 'Unknown',
      referrer: referrer || undefined,
      ipAddress: ipAddress || 'Unknown',
      country: country || 'Unknown',
      city: city || 'Unknown',
      device: device || 'Unknown',
      browser: browser || 'Unknown',
      os: os || 'Unknown'
    };
    
    // Get the full URL from the request body or headers
    const fullUrl = body.url || req.headers.get('referer') || `https://agence-blackswan.com${trackingData.path}`;
    
    // Detect traffic source
    const trafficData = detectTrafficSource(fullUrl, trackingData.referrer, trackingData.userAgent);
    
    console.log('Page View Tracking:', {
      path: trackingData.path,
      fullUrl,
      trafficSource: trafficData.trafficSource,
      utmSource: trafficData.utmSource,
      utmMedium: trafficData.utmMedium,
      utmCampaign: trafficData.utmCampaign,
      utmTerm: trafficData.utmTerm,
      utmContent: trafficData.utmContent,
      referrer: trafficData.referrer
    });
    
    // Create or update page view with traffic source data
    const pageViewData = {
      path: trackingData.path,
      page: trackingData.page,
      count: 1,
      lastViewed: new Date(),
      firstViewed: new Date(),
      userAgent: trackingData.userAgent,
      referrer: trafficData.referrer,
      ipAddress: trackingData.ipAddress,
      country: trackingData.country,
      city: trackingData.city,
      device: trackingData.device,
      browser: trackingData.browser,
      os: trackingData.os,
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
      { path: trackingData.path },
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