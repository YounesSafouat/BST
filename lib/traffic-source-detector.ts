/**
 * Traffic Source Detection Utility
 * Detects traffic sources from UTM parameters, referrers, and other indicators
 */

export interface TrafficSourceData {
  trafficSource: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  campaign?: string;
  medium?: string;
  source?: string;
}

export function detectTrafficSource(
  url: string,
  referrer?: string,
  userAgent?: string
): TrafficSourceData {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;
  
  // Extract UTM parameters
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmTerm = params.get('utm_term');
  const utmContent = params.get('utm_content');
  
  // Extract other campaign parameters
  const campaign = params.get('campaign') || params.get('gclid') ? 'google_ads' : undefined;
  const medium = params.get('medium');
  const source = params.get('source');
  
  // Determine traffic source based on UTM parameters
  let trafficSource = 'unknown';
  
  if (utmSource) {
    trafficSource = mapUtmSourceToTrafficSource(utmSource, utmMedium || undefined);
  } else if (referrer) {
    trafficSource = detectTrafficSourceFromReferrer(referrer);
  } else if (campaign) {
    trafficSource = 'google_ads';
  } else {
    trafficSource = 'direct';
  }
  
  return {
    trafficSource,
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    utmTerm: utmTerm || undefined,
    utmContent: utmContent || undefined,
    referrer: referrer || undefined,
    campaign: campaign || undefined,
    medium: medium || undefined,
    source: source || undefined
  };
}

function mapUtmSourceToTrafficSource(utmSource: string, utmMedium?: string): string {
  const source = utmSource.toLowerCase();
  const medium = utmMedium?.toLowerCase();
  
  // Google Ads
  if (source.includes('google') || source.includes('gclid') || medium === 'cpc') {
    return 'google_ads';
  }
  
  // Meta/Facebook Ads
  if (source.includes('facebook') || source.includes('fb') || source.includes('instagram') || source.includes('meta')) {
    return 'meta_ads';
  }
  
  // LinkedIn Ads
  if (source.includes('linkedin') || source.includes('li')) {
    return 'linkedin_ads';
  }
  
  // Twitter Ads
  if (source.includes('twitter') || source.includes('tweet') || source.includes('x.com')) {
    return 'twitter_ads';
  }
  
  // Email campaigns
  if (source.includes('email') || source.includes('mail') || medium === 'email') {
    return 'email';
  }
  
  // Social media (organic)
  if (source.includes('social') || medium === 'social') {
    return 'social';
  }
  
  // Referral
  if (medium === 'referral') {
    return 'referral';
  }
  
  // Organic search
  if (source.includes('search') || medium === 'organic') {
    return 'organic_search';
  }
  
  return 'other';
}

function detectTrafficSourceFromReferrer(referrer: string): string {
  const referrerUrl = new URL(referrer);
  const hostname = referrerUrl.hostname.toLowerCase();
  
  // Google
  if (hostname.includes('google.')) {
    return 'organic_search';
  }
  
  // Facebook/Meta
  if (hostname.includes('facebook.') || hostname.includes('fb.') || hostname.includes('instagram.')) {
    return 'social';
  }
  
  // LinkedIn
  if (hostname.includes('linkedin.')) {
    return 'social';
  }
  
  // Twitter/X
  if (hostname.includes('twitter.') || hostname.includes('x.com')) {
    return 'social';
  }
  
  // YouTube
  if (hostname.includes('youtube.') || hostname.includes('youtu.be')) {
    return 'social';
  }
  
  // Other social platforms
  if (hostname.includes('tiktok.') || hostname.includes('snapchat.') || hostname.includes('pinterest.')) {
    return 'social';
  }
  
  // Email providers
  if (hostname.includes('gmail.') || hostname.includes('outlook.') || hostname.includes('yahoo.')) {
    return 'email';
  }
  
  // Other websites
  return 'referral';
}

export function getTrafficSourceDisplayName(trafficSource: string): string {
  const displayNames: { [key: string]: string } = {
    'google_ads': '🎯 Google Ads',
    'meta_ads': '📘 Meta Ads',
    'linkedin_ads': '💼 LinkedIn Ads',
    'twitter_ads': '🐦 Twitter Ads',
    'organic_search': '🔍 Organic Search',
    'direct': '🏠 Direct',
    'referral': '🔗 Referral',
    'social': '📱 Social',
    'email': '📧 Email',
    'other': '❓ Other',
    'unknown': '❓ Unknown'
  };
  
  return displayNames[trafficSource] || '❓ Unknown';
}

export function isPaidTraffic(trafficSource: string): boolean {
  return ['google_ads', 'meta_ads', 'linkedin_ads', 'twitter_ads'].includes(trafficSource);
}

export function isOrganicTraffic(trafficSource: string): boolean {
  return ['organic_search', 'direct', 'referral', 'social', 'email'].includes(trafficSource);
}
