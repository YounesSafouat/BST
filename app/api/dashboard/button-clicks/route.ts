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
    console.log('Button Clicks API: Filter:', filter);
    
    // Get all button clicks in the time range
    const buttonClicks = await ButtonClick.find(filter).sort({ lastClicked: -1 });
    console.log('Button Clicks API: Found', buttonClicks.length, 'button clicks');
    
    // Group by buttonId manually for better control
    const groupedData: { [key: string]: any } = {};
    
    buttonClicks.forEach(click => {
      const buttonId = click.buttonId;
      if (!groupedData[buttonId]) {
        groupedData[buttonId] = {
          _id: buttonId,
          buttonId: buttonId,
          path: click.path,
          count: 0,
          lastClicked: click.lastClicked,
          firstClicked: click.firstClicked,
          buttonType: click.buttonType,
          buttonText: click.buttonText,
          totalClicks: 0,
          conversionRate: 0,
          avgTimeToClick: 0,
          countries: new Set(),
          devices: new Set(),
          referrers: new Set()
        };
      }
      
      groupedData[buttonId].count += click.count || 1;
      groupedData[buttonId].totalClicks += 1;
      groupedData[buttonId].conversionRate += click.conversionRate || 0;
      groupedData[buttonId].avgTimeToClick += click.avgTimeToClick || 0;
      
      if (click.country) groupedData[buttonId].countries.add(click.country);
      if (click.device) groupedData[buttonId].devices.add(click.device);
      if (click.referrer) groupedData[buttonId].referrers.add(click.referrer);
      
      if (click.lastClicked > groupedData[buttonId].lastClicked) {
        groupedData[buttonId].lastClicked = click.lastClicked;
      }
      if (click.firstClicked < groupedData[buttonId].firstClicked) {
        groupedData[buttonId].firstClicked = click.firstClicked;
      }
    });
    
    // Convert to array and calculate averages
    const stats = Object.values(groupedData).map((item: any) => ({
      ...item,
      conversionRate: item.totalClicks > 0 ? Math.round((item.conversionRate / item.totalClicks) * 100) / 100 : 0,
      avgTimeToClick: item.totalClicks > 0 ? Math.round(item.avgTimeToClick / item.totalClicks) : 0,
      countries: Array.from(item.countries),
      devices: Array.from(item.devices),
      referrers: Array.from(item.referrers)
    })).sort((a: any, b: any) => b.count - a.count);
    
    console.log('Button Clicks API: Returning', stats.length, 'grouped stats');
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching button clicks:', error);
    return NextResponse.json({ error: 'Failed to fetch button clicks' }, { status: 500 });
  }
} 