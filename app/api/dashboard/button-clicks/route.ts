import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ButtonClick from '@/models/ButtonClick';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get('timeRange') || '7d';
  const device = searchParams.get('device');
  const country = searchParams.get('country');
  const buttonType = searchParams.get('buttonType');
  
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
    lastClicked: { $gte: startDate }
  };
  
  if (device) filter.device = device;
  if (country) filter.country = country;
  if (buttonType) filter.buttonType = buttonType;
  
  try {
    // Aggregate data by buttonId for the specified time range
    const stats = await ButtonClick.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$buttonId',
          buttonId: { $first: '$buttonId' },
          path: { $first: '$path' },
          count: { $sum: '$count' },
          lastClicked: { $max: '$lastClicked' },
          firstClicked: { $min: '$firstClicked' },
          buttonType: { $first: '$buttonType' },
          buttonText: { $first: '$buttonText' },
          totalClicks: { $sum: 1 },
          conversionRate: { $avg: '$conversionRate' },
          avgTimeToClick: { $avg: '$avgTimeToClick' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching button clicks:', error);
    return NextResponse.json({ error: 'Failed to fetch button clicks' }, { status: 500 });
  }
} 