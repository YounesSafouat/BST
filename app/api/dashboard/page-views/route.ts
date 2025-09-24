import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';

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
    console.log('Page Views API: Filter:', filter);
    
    // Get all page views in the time range
    const pageViews = await PageView.find(filter).sort({ lastViewed: -1 });
    console.log('Page Views API: Found', pageViews.length, 'page views');
    
    // Group by path manually for better control
    const groupedData: { [key: string]: any } = {};
    
    pageViews.forEach(view => {
      const path = view.path;
      if (!groupedData[path]) {
        groupedData[path] = {
          _id: path,
          path: path,
          page: view.page,
          count: 0,
          lastViewed: view.lastViewed,
          firstViewed: view.firstViewed,
          totalViews: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
          countries: new Set(),
          devices: new Set(),
          referrers: new Set()
        };
      }
      
      groupedData[path].count += view.count || 1;
      groupedData[path].totalViews += 1;
      groupedData[path].avgTimeOnPage += view.avgTimeOnPage || 0;
      groupedData[path].bounceRate += view.bounceRate || 0;
      
      if (view.country) groupedData[path].countries.add(view.country);
      if (view.device) groupedData[path].devices.add(view.device);
      if (view.referrer) groupedData[path].referrers.add(view.referrer);
      
      if (view.lastViewed > groupedData[path].lastViewed) {
        groupedData[path].lastViewed = view.lastViewed;
      }
      if (view.firstViewed < groupedData[path].firstViewed) {
        groupedData[path].firstViewed = view.firstViewed;
      }
    });
    
    // Convert to array and calculate averages
    const stats = Object.values(groupedData).map((item: any) => ({
      ...item,
      avgTimeOnPage: item.totalViews > 0 ? Math.round(item.avgTimeOnPage / item.totalViews) : 0,
      bounceRate: item.totalViews > 0 ? Math.round((item.bounceRate / item.totalViews) * 100) / 100 : 0,
      countries: Array.from(item.countries),
      devices: Array.from(item.devices),
      referrers: Array.from(item.referrers)
    })).sort((a: any, b: any) => b.count - a.count);
    
    console.log('Page Views API: Returning', stats.length, 'grouped stats');
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching page views:', error);
    return NextResponse.json({ error: 'Failed to fetch page views' }, { status: 500 });
  }
} 