import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function POST(request: NextRequest) {
  try {
    const { utmData, pageUrl, referrer, userAgent } = await request.json();

    await connectDB();

    const pageView = new PageView({
      pageUrl,
      referrer,
      userAgent,
      utmSource: utmData.utm_source,
      utmMedium: utmData.utm_medium,
      utmCampaign: utmData.utm_campaign,
      utmTerm: utmData.utm_term,
      utmContent: utmData.utm_content,
      timestamp: new Date(),
    });

    await pageView.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking UTM data:', error);
    return NextResponse.json({ error: 'Failed to track UTM data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const medium = searchParams.get('medium');
    const campaign = searchParams.get('campaign');

    await connectDB();

    const query: any = {};
    if (source) query.utmSource = source;
    if (medium) query.utmMedium = medium;
    if (campaign) query.utmCampaign = campaign;

    const utmStats = await PageView.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            source: '$utmSource',
            medium: '$utmMedium',
            campaign: '$utmCampaign',
            term: '$utmTerm',
            content: '$utmContent'
          },
          count: { $sum: 1 },
          lastVisit: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ]).then(stats => 
      stats.filter(stat => 
        stat._id.source || stat._id.medium || stat._id.campaign
      )
    );

    return NextResponse.json({ utmStats });
  } catch (error) {
    console.error('Error fetching UTM stats:', error);
    return NextResponse.json({ error: 'Failed to fetch UTM stats' }, { status: 500 });
  }
}
