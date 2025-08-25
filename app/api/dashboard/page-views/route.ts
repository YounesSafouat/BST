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
    // Aggregate data by path for the specified time range
    const stats = await PageView.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$path',
          path: { $first: '$path' },
          page: { $first: '$page' },
          count: { $sum: '$count' },
          lastViewed: { $max: '$lastViewed' },
          firstViewed: { $min: '$firstViewed' },
          totalViews: { $sum: 1 },
          avgTimeOnPage: { $avg: '$avgTimeOnPage' },
          bounceRate: { $avg: '$bounceRate' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching page views:', error);
    return NextResponse.json({ error: 'Failed to fetch page views' }, { status: 500 });
  }
} 