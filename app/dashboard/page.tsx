"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  Shield,
  Award,
  Users,
  FileText,
  Building2,
  MessageSquare,
  Settings,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  BarChart3,
  Activity,
  Zap,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Loader from '@/components/home/Loader';
import GlobalSEOAnalyzer from '@/components/GlobalSEOAnalyzer';

interface PageView {
  _id: string;
  page: string;
  count: number;
  lastViewed: string;
  path?: string;
}

interface ButtonClick {
  _id: string;
  buttonId: string;
  count: number;
  lastClicked: string;
}

interface SEOData {
  _id: string;
  page: string;
  language: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export default function DashboardPage() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [buttonClicks, setButtonClicks] = useState<ButtonClick[]>([]);
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { theme } = useTheme();

  // Helper functions - moved to top to avoid ReferenceError
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

  const getPageDisplayName = (page: string): string => {
    if (page === '/') return 'Home Page';
    if (page === '/blog') return 'Blog';
    if (page === '/about') return 'About';
    if (page === '/contact') return 'Contact';
    return page.replace('/', '').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Page';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [viewsResponse, clicksResponse, seoResponse] = await Promise.all([
        fetch('/api/dashboard/page-views'),
        fetch('/api/dashboard/button-clicks'),
        fetch('/api/seo')
      ]);

      const viewsData = await viewsResponse.json();
      const clicksData = await clicksResponse.json();
      const seoData = await seoResponse.json();

      setPageViews(viewsData);
      setButtonClicks(clicksData);
      setSeoData(seoData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPageViews = pageViews.reduce((sum, pv) => sum + pv.count, 0);
  const totalButtonClicks = buttonClicks.reduce((sum, bc) => sum + bc.count, 0);

  // Enhanced analytics calculations
  const topPages = [...pageViews].sort((a, b) => b.count - a.count).slice(0, 5);
  const topButtons = [...buttonClicks].sort((a, b) => b.count - a.count).slice(0, 5);
  
  // Engagement rate calculation
  const engagementRate = totalPageViews > 0 ? ((totalButtonClicks / totalPageViews) * 100).toFixed(1) : '0';
  
  // Button performance analysis
  const buttonPerformance = buttonClicks.map(click => ({
    name: getButtonDisplayName(click.buttonId),
    clicks: click.count,
    engagement: totalPageViews > 0 ? ((click.count / totalPageViews) * 100).toFixed(1) : '0'
  }));

  // Page performance analysis
  const pagePerformance = pageViews.map(view => ({
    name: getPageDisplayName(view.path || view.page),
    views: view.count,
    percentage: totalPageViews > 0 ? ((view.count / totalPageViews) * 100).toFixed(1) : '0'
  }));

  // Chart colors
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
          <p className="text-muted-foreground">Real-time insights into your website performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalPageViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span>All time views</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Button Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalButtonClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Target className="w-3 h-3 mr-1 text-green-500" />
              <span>All time clicks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{engagementRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Zap className="w-3 h-3 mr-1 text-purple-500" />
              <span>Clicks per page view</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pageViews.length}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <FileText className="w-3 h-3 mr-1 text-orange-500" />
              <span>Pages with traffic</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Page Views Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pagePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, name === 'views' ? 'Views' : 'Percentage']}
                  labelFormatter={(label) => `Page: ${label}`}
                />
                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Button Clicks Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              Button Engagement Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buttonPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, name === 'clicks' ? 'Clicks' : 'Engagement %']}
                  labelFormatter={(label) => `Button: ${label}`}
                />
                <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Performing Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{getPageDisplayName(page.path || page.page)}</div>
                      <div className="text-sm text-gray-500">{page.path || page.page}</div>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Top Performing Buttons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topButtons.map((button, index) => (
                <div key={button._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{getButtonDisplayName(button.buttonId)}</div>
                      <div className="text-sm text-gray-500">{button.buttonId}</div>
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

      {/* Insights & Recommendations */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Award className="w-5 h-5" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🚀 Performance Highlights</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {topPages[0]?.count || 0} views on your top page</li>
                <li>• {topButtons[0]?.count || 0} clicks on your most engaging button</li>
                <li>• {engagementRate}% overall engagement rate</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💡 Optimization Tips</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Focus on high-performing pages</li>
                <li>• Optimize button placement based on click data</li>
                <li>• Monitor engagement trends over time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global SEO Analysis */}
      <div className="mb-6">
        <GlobalSEOAnalyzer seoData={seoData} />
      </div>
    </div>
  );
} 