"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  MousePointer,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Plus,
  Filter,
  RefreshCw,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Loader from '@/components/home/Loader';

interface PageView {
  _id: string;
  path: string;
  page: string;
  count: number;
  lastViewed: string;
  totalViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

interface ButtonClick {
  _id: string;
  buttonId: string;
  path: string;
  count: number;
  lastClicked: string;
  buttonType: string;
  buttonText: string;
  totalClicks: number;
  conversionRate: number;
}

export default function DashboardPage() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [buttonClicks, setButtonClicks] = useState<ButtonClick[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Global filters
  const [timeRange, setTimeRange] = useState('7d');
  const [device, setDevice] = useState('all');
  const [country, setCountry] = useState('all');
  const [buttonType, setButtonType] = useState('all');

  // Helper functions
  const getButtonDisplayName = (buttonId: string): string => {
    const buttonNames: { [key: string]: string } = {
      // Header buttons
      'header_phone_button': '📞 Phone Call',
      'header_whatsapp_button': '💬 WhatsApp',
      'header_rdv_button': '📅 Prendre RDV',
      
      // Footer buttons
      'footer_phone': '📞 Footer Phone',
      'footer_email': '📧 Footer Email',
      'footer_whatsapp': '💬 Footer WhatsApp',
      'footer_contact_button': '📝 Contact Form',
      
      // Mobile navigation
      'mobile_header_rdv_button': '📅 Mobile RDV',
      'bottom-nav-phone': '📞 Bottom Phone',
      'bottom-nav-whatsapp': '💬 Bottom WhatsApp',
      'bottom-nav-blog': '📰 Blog',
      'bottom-nav-cas-client': '👤 CAS Client',
      
      // Other buttons
      'whatsapp_number': '💬 WhatsApp',
      'phone_number': '📞 Phone Call',
      'meeting_link': '📅 Meeting Link',
      'newsletter_submit': '📧 Newsletter',
      'hero_cta_button': '🚀 Hero CTA',
      'pricing_cta_button': '💰 Pricing CTA',
      'contact_form_submit': '📝 Contact Submit'
    };
    return buttonNames[buttonId] || buttonId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getButtonIcon = (buttonId: string) => {
    if (buttonId.includes('whatsapp')) return <MessageCircle className="w-4 h-4 text-green-500" />;
    if (buttonId.includes('phone')) return <Phone className="w-4 h-4 text-blue-500" />;
    if (buttonId.includes('email') || buttonId.includes('newsletter')) return <Mail className="w-4 h-4 text-purple-500" />;
    if (buttonId.includes('rdv') || buttonId.includes('meeting')) return <Calendar className="w-4 h-4 text-orange-500" />;
    if (buttonId.includes('contact')) return <Target className="w-4 h-4 text-red-500" />;
    return <MousePointer className="w-4 h-4 text-gray-500" />;
  };

  const getButtonCategory = (buttonId: string): string => {
    if (buttonId.includes('whatsapp')) return 'Communication';
    if (buttonId.includes('phone')) return 'Communication';
    if (buttonId.includes('email') || buttonId.includes('newsletter')) return 'Communication';
    if (buttonId.includes('rdv') || buttonId.includes('meeting')) return 'Appointment';
    if (buttonId.includes('contact')) return 'Contact';
    if (buttonId.includes('cta')) return 'Conversion';
    return 'Other';
  };

  const getPageDisplayName = (page: string): string => {
    if (page === '/') return '🏠 Home Page';
    if (page === '/blog') return '📰 Blog';
    if (page === '/about') return 'ℹ️ About';
    if (page === '/contact') return '📞 Contact';
    if (page === '/cas-client') return '👤 CAS Client';
    return page.replace('/', '').replace(/\b\w/g, l => l.toUpperCase()) || '❓ Unknown Page';
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, device, country, buttonType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
             // Build query parameters
       const params = new URLSearchParams({
         timeRange,
         ...(device && device !== 'all' && { device }),
         ...(country && country !== 'all' && { country }),
         ...(buttonType && buttonType !== 'all' && { buttonType })
       });

      const [viewsResponse, clicksResponse] = await Promise.all([
        fetch(`/api/dashboard/page-views?${params}`),
        fetch(`/api/dashboard/button-clicks?${params}`)
      ]);

      const viewsData = await viewsResponse.json();
      const clicksData = await clicksResponse.json();

      setPageViews(viewsData);
      setButtonClicks(clicksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPageViews = pageViews.reduce((sum, pv) => sum + pv.count, 0);
  const totalButtonClicks = buttonClicks.reduce((sum, bc) => sum + bc.count, 0);
  const engagementRate = totalPageViews > 0 ? ((totalButtonClicks / totalPageViews) * 100).toFixed(1) : '0';

  // Top performers
  const topPages = pageViews.slice(0, 5);
  const topButtons = buttonClicks.slice(0, 5);

  // Chart data
  const pagePerformance = pageViews.map(view => ({
    name: getPageDisplayName(view.path),
    views: view.count,
    percentage: totalPageViews > 0 ? ((view.count / totalPageViews) * 100).toFixed(1) : '0'
  }));

  const buttonPerformance = buttonClicks.map(click => ({
    name: getButtonDisplayName(click.buttonId),
    clicks: click.count,
    engagement: totalPageViews > 0 ? ((click.count / totalPageViews) * 100).toFixed(1) : '0'
  }));

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return <Loader />;
  }

  // Show helpful message when no data
  if (pageViews.length === 0 && buttonClicks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 Dashboard Ready!</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-md">
            Your dashboard is set up and ready to collect data. 
            Start browsing your website to see analytics appear here.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
            <h3 className="font-semibold text-blue-900 mb-2">💡 What to do next:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Visit different pages on your website</li>
              <li>• Click buttons (WhatsApp, Phone, Contact)</li>
              <li>• Check back in a few minutes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600">Real-time insights into your website performance</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Global Filters */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Filter className="w-5 h-5" />
            Global Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
                         <div>
               <label className="text-sm font-medium text-gray-700 mb-2 block">Device</label>
               <Select value={device} onValueChange={setDevice}>
                 <SelectTrigger className="w-full bg-white border-gray-200">
                   <SelectValue placeholder="All devices" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All devices</SelectItem>
                   <SelectItem value="desktop">Desktop</SelectItem>
                   <SelectItem value="mobile">Mobile</SelectItem>
                   <SelectItem value="tablet">Tablet</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             
             <div>
               <label className="text-sm font-medium text-gray-700 mb-2 block">Country</label>
               <Select value={country} onValueChange={setCountry}>
                 <SelectTrigger className="w-full bg-white border-gray-200">
                   <SelectValue placeholder="All countries" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All countries</SelectItem>
                   <SelectItem value="FR">France</SelectItem>
                   <SelectItem value="US">United States</SelectItem>
                   <SelectItem value="CA">Canada</SelectItem>
                   <SelectItem value="GB">United Kingdom</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             
             <div>
               <label className="text-sm font-medium text-gray-700 mb-2 block">Button Type</label>
               <Select value={buttonType} onValueChange={setButtonType}>
                 <SelectTrigger className="w-full bg-white border-gray-200">
                   <SelectValue placeholder="All types" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All types</SelectItem>
                   <SelectItem value="whatsapp">WhatsApp</SelectItem>
                   <SelectItem value="phone">Phone</SelectItem>
                   <SelectItem value="email">Email</SelectItem>
                   <SelectItem value="contact">Contact</SelectItem>
                   <SelectItem value="newsletter">Newsletter</SelectItem>
                   <SelectItem value="rdv">RDV</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">📊 Total Page Views</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span>Last {timeRange === '24h' ? '24 hours' : timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {pageViews.length} pages tracked
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">🎯 Total Button Clicks</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointer className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalButtonClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Target className="w-3 h-3 mr-1 text-green-500" />
              <span>User interactions</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {buttonClicks.length} buttons tracked
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">📈 Engagement Rate</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{engagementRate}%</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Zap className="w-3 h-3 mr-1 text-purple-500" />
              <span>Clicks per page view</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {totalButtonClicks > 0 ? `1 click every ${Math.round(totalPageViews / totalButtonClicks)} page views` : 'No clicks yet'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">📊 Page Views Performance</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Which pages are getting the most traffic</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pagePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: any) => [value, name === 'views' ? 'Views' : 'Percentage']}
                  labelFormatter={(label) => `Page: ${label}`}
                />
                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Button Clicks Chart */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">🎯 Button Engagement Performance</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Which buttons users click the most</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buttonPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: any) => [value, name === 'clicks' ? 'Clicks' : 'Engagement %']}
                  labelFormatter={(label) => `Button: ${label}`}
                />
                <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Pages */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">🏆 Top Performing Pages</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your most visited pages</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={page._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{getPageDisplayName(page.path)}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{page.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      {totalPageViews > 0 ? ((page.count / totalPageViews) * 100).toFixed(1) : '0'}% of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Buttons */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">🎯 Top Performing Buttons</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your most clicked buttons</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topButtons.map((button, index) => (
                <div key={button._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      {getButtonIcon(button.buttonId)}
                    </div>
                                          <div>
                        <div className="font-medium text-gray-900">{getButtonDisplayName(button.buttonId)}</div>
                        <div className="text-sm text-gray-500">{getButtonCategory(button.buttonId)}</div>
                      </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{button.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      {totalPageViews > 0 ? ((button.count / totalPageViews) * 100).toFixed(1) : '0'}% engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Summary */}
      <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">📋 Data Summary</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Overview of your tracking setup</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pageViews.length}</div>
              <div className="text-sm text-gray-600">Pages Tracked</div>
              <div className="text-xs text-gray-400 mt-1">Active monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{buttonClicks.length}</div>
              <div className="text-sm text-gray-600">Buttons Tracked</div>
              <div className="text-xs text-gray-400 mt-1">User interactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{timeRange === '24h' ? '24h' : timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</div>
              <div className="text-sm text-gray-600">Current Period</div>
              <div className="text-xs text-gray-400 mt-1">Data range</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 