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
      'whatsapp_number': 'WhatsApp',
      'phone_number': 'Phone Call',
      'meeting_link': 'Prendre RDV',
      'footer_phone': 'Footer Phone',
      'footer_email': 'Footer Email',
      'footer_whatsapp': 'Footer WhatsApp',
      'newsletter_submit': 'Newsletter',
      'mobile_header_rdv_button': 'Mobile RDV',
      'bottom-nav-phone': 'Bottom Nav Phone',
      'bottom-nav-whatsapp': 'Bottom Nav WhatsApp',
      'bottom-nav-blog': 'Bottom Nav Blog',
      'bottom-nav-cas-client': 'Bottom Nav CAS'
    };
    return buttonNames[buttonId] || buttonId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getButtonIcon = (buttonId: string) => {
    if (buttonId.includes('whatsapp')) return <MessageCircle className="w-4 h-4" />;
    if (buttonId.includes('phone')) return <Phone className="w-4 h-4" />;
    if (buttonId.includes('email') || buttonId.includes('newsletter')) return <Mail className="w-4 h-4" />;
    if (buttonId.includes('rdv') || buttonId.includes('meeting')) return <Calendar className="w-4 h-4" />;
    return <MousePointer className="w-4 h-4" />;
  };

  const getPageDisplayName = (page: string): string => {
    if (page === '/') return 'Home Page';
    if (page === '/blog') return 'Blog';
    if (page === '/about') return 'About';
    if (page === '/contact') return 'Contact';
    return page.replace('/', '').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Page';
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
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Page Views</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span>↑ {timeRange} period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Button Clicks</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointer className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalButtonClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Target className="w-3 h-3 mr-1 text-green-500" />
              <span>↑ {timeRange} period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
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
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Page Views Performance</CardTitle>
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
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Button Engagement Performance</CardTitle>
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
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Pages</CardTitle>
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
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Buttons</CardTitle>
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
                      <div className="text-sm text-gray-500">{button.buttonType || 'Unknown'}</div>
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
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Data Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pageViews.length}</div>
              <div className="text-sm text-gray-600">Pages Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{buttonClicks.length}</div>
              <div className="text-sm text-gray-600">Buttons Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{timeRange}</div>
              <div className="text-sm text-gray-600">Current Period</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 