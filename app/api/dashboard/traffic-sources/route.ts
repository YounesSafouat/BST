import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';
import ButtonClick from '@/models/ButtonClick';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get('timeRange') || '7d';
  const device = searchParams.get('device');
  const country = searchParams.get('country');
  
  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  
  switch (timeRange) {
    case '24h':
      startDate.setHours(now.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }
  
  // Build filter
  const filter: any = {
    lastViewed: { $gte: startDate }
  };
  
  if (device) filter.device = device;
  if (country) filter.country = country;
  
  try {
    console.log('Traffic Sources API: Filter:', filter);
    
    // Get traffic source data from page views
    const pageViews = await PageView.find(filter);
    console.log('Traffic Sources API: Found', pageViews.length, 'page views');
    
    // Group by traffic source
    const trafficSourceData: { [key: string]: any } = {};
    
    pageViews.forEach(view => {
      const source = view.trafficSource || 'unknown';
      const utmSource = view.utmSource || 'unknown';
      const utmCampaign = view.utmCampaign || 'unknown';
      
      // Create a unique key for this traffic source
      const key = `${source}_${utmSource}_${utmCampaign}`;
      
      if (!trafficSourceData[key]) {
        trafficSourceData[key] = {
          trafficSource: source,
          utmSource: utmSource,
          utmCampaign: utmCampaign,
          pageViews: 0,
          buttonClicks: 0,
          countries: new Set(),
          devices: new Set(),
          pages: new Set(),
          lastActivity: view.lastViewed
        };
      }
      
      trafficSourceData[key].pageViews += view.count || 1;
      if (view.country) trafficSourceData[key].countries.add(view.country);
      if (view.device) trafficSourceData[key].devices.add(view.device);
      if (view.path) trafficSourceData[key].pages.add(view.path);
      
      if (view.lastViewed > trafficSourceData[key].lastActivity) {
        trafficSourceData[key].lastActivity = view.lastViewed;
      }
    });
    
    // Get button clicks data
    const buttonClicks = await ButtonClick.find({
      lastClicked: { $gte: startDate },
      ...(device && { device }),
      ...(country && { country })
    });
    
    buttonClicks.forEach(click => {
      const source = click.trafficSource || 'unknown';
      const utmSource = click.utmSource || 'unknown';
      const utmCampaign = click.utmCampaign || 'unknown';
      
      const key = `${source}_${utmSource}_${utmCampaign}`;
      
      if (trafficSourceData[key]) {
        trafficSourceData[key].buttonClicks += click.count || 1;
      }
    });
    
    // Convert to array and calculate metrics
    const stats = Object.values(trafficSourceData).map((item: any) => ({
      ...item,
      countries: Array.from(item.countries),
      devices: Array.from(item.devices),
      pages: Array.from(item.pages),
      conversionRate: item.pageViews > 0 ? Math.round((item.buttonClicks / item.pageViews) * 100) / 100 : 0,
      totalTraffic: item.pageViews + item.buttonClicks
    })).sort((a: any, b: any) => b.totalTraffic - a.totalTraffic);
    
    console.log('Traffic Sources API: Returning', stats.length, 'traffic sources');
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    return NextResponse.json({ error: 'Failed to fetch traffic sources' }, { status: 500 });
  }
}
