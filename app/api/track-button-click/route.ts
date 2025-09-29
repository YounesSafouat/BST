import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ButtonClick from '@/models/ButtonClick';
import { detectTrafficSource } from '@/lib/traffic-source-detector';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { 
      buttonId, 
      path, 
      buttonText, 
      buttonType, 
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
      buttonId: buttonId || 'unknown',
      path: path || '/',
      buttonText: buttonText || 'Unknown',
      buttonType: buttonType || 'button',
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
    
    console.log('Button Click Tracking:', {
      buttonId: trackingData.buttonId,
      path: trackingData.path,
      trafficSource: trafficData.trafficSource,
      utmCampaign: trafficData.utmCampaign,
      referrer: trafficData.referrer
    });
    
    // Create or update button click with traffic source data
    const buttonClickData = {
      buttonId: trackingData.buttonId,
      path: trackingData.path,
      count: 1,
      lastClicked: new Date(),
      firstClicked: new Date(),
      buttonText: trackingData.buttonText,
      buttonType: trackingData.buttonType,
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
      conversionRate: 0,
      avgTimeToClick: 0,
      clicksByDate: [{
        date: new Date(),
        count: 1
      }]
    };
    
    await ButtonClick.findOneAndUpdate(
      { buttonId: trackingData.buttonId, path: trackingData.path },
      { 
        $inc: { count: 1 },
        $set: {
          ...buttonClickData,
          lastClicked: new Date()
        },
        $setOnInsert: {
          firstClicked: new Date()
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
    console.error('Error tracking button click:', error);
    return NextResponse.json({ error: 'Failed to track button click' }, { status: 500 });
  }
} 