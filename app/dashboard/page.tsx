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
} from "lucide-react";
import AcceuilPage from "@/app/components/acceuil-page";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Loader from '@/components/home/Loader';

const stats = [
  {
    title: "Total Users",
    value: "12",
    icon: Users,
    color: "from-blue-200 to-blue-100 text-blue-700",
    shadow: "shadow-blue-100/60",
  },
  {
    title: "Content Pages",
    value: "8",
    icon: FileText,
    color: "from-green-200 to-green-100 text-green-700",
    shadow: "shadow-green-100/60",
  },
  {
    title: "Clients",
    value: "24",
    icon: Building2,
    color: "from-purple-200 to-purple-100 text-purple-700",
    shadow: "shadow-purple-100/60",
  },
  {
    title: "Blog Posts",
    value: "16",
    icon: MessageSquare,
    color: "from-yellow-200 to-yellow-100 text-yellow-700",
    shadow: "shadow-yellow-100/60",
  },
];

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

export default function DashboardPage() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [buttonClicks, setButtonClicks] = useState<ButtonClick[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
      const [viewsResponse, clicksResponse] = await Promise.all([
        fetch('/api/dashboard/page-views'),
        fetch('/api/dashboard/button-clicks')
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPageViews}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Button Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalButtonClicks}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all buttons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.length}</div>
            <p className="text-xs text-muted-foreground">
              Pages with views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buttons</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buttonClicks.length}</div>
            <p className="text-xs text-muted-foreground">
              Buttons with clicks
            </p>
          </CardContent>
        </Card>
      </div>

          {/* Page Views Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pageViews.slice(0, 5).map((view) => (
              <div key={view._id} className="flex justify-between items-center">
                <span className="font-medium break-all text-blue-700">{view.path || view.page || 'Unknown Page'}</span>
                <span className="text-sm text-muted-foreground">
                  {view.count} views
                </span>
            </div>
            ))}
          </div>
        </CardContent>
      </Card>

          {/* Button Clicks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Button Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buttonClicks.slice(0, 5).map((click) => (
              <div key={click._id} className="flex justify-between items-center">
                <span className="font-medium break-all">{click.buttonId}</span>
                <span className="text-sm text-muted-foreground">
                  {click.count} clicks
                </span>
            </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 