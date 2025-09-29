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
    
    // Get the full URL from the request body or headers
    const fullUrl = body.url || req.headers.get('referer') || `https://agence-blackswan.com${path}`;
    
    // Detect traffic source
    const trafficData = detectTrafficSource(fullUrl, referrer, userAgent);
    
    console.log('Button Click Tracking:', {
      buttonId,
      path,
      trafficSource: trafficData.trafficSource,
      utmCampaign: trafficData.utmCampaign,
      referrer: trafficData.referrer
    });
    
    // Create or update button click with traffic source data
    const buttonClickData = {
      buttonId,
      path,
      count: 1,
      lastClicked: new Date(),
      firstClicked: new Date(),
      buttonText: buttonText || buttonId,
      buttonType: buttonType || 'other',
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
      conversionRate: 0,
      avgTimeToClick: 0,
      clicksByDate: [{
        date: new Date(),
        count: 1
      }]
    };
    
    await ButtonClick.findOneAndUpdate(
      { buttonId, path },
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