'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, TrendingUp, Users, Eye, Link as LinkIcon } from 'lucide-react';

interface UTMStats {
  _id: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
  count: number;
  lastVisit: string;
}

export default function UTMAnalytics() {
  const [utmStats, setUtmStats] = useState<UTMStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchUTMStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/utm-tracking');
      const data = await response.json();
      setUtmStats(data.utmStats || []);
    } catch (error) {
      console.error('Error fetching UTM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUTMStats();
  }, []);

  const filteredStats = utmStats.filter(stat => {
    if (filter === 'all') return true;
    return stat._id.source === filter;
  }).filter(stat => stat._id.source); // Additional filter to remove undefined sources

  const totalVisits = filteredStats.reduce((sum, stat) => sum + stat.count, 0);
  const uniqueCampaigns = new Set(filteredStats.map(stat => stat._id.campaign)).size;

  const getSourceColor = (source: string) => {
    if (!source) return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      linkedin: 'bg-blue-100 text-blue-800',
      facebook: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
      twitter: 'bg-sky-100 text-sky-800',
      youtube: 'bg-red-100 text-red-800',
      tiktok: 'bg-gray-100 text-gray-800',
      pinterest: 'bg-red-100 text-red-800',
      snapchat: 'bg-yellow-100 text-yellow-800',
      google: 'bg-green-100 text-green-800',
      meta: 'bg-blue-100 text-blue-800',
      email: 'bg-purple-100 text-purple-800',
      newsletter: 'bg-indigo-100 text-indigo-800',
      referral: 'bg-orange-100 text-orange-800',
      direct: 'bg-gray-100 text-gray-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  const getMediumColor = (medium: string) => {
    if (!medium) return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      social: 'bg-green-100 text-green-800',
      post: 'bg-blue-100 text-blue-800',
      story: 'bg-purple-100 text-purple-800',
      reel: 'bg-pink-100 text-pink-800',
      video: 'bg-red-100 text-red-800',
      ad: 'bg-orange-100 text-orange-800',
      organic: 'bg-emerald-100 text-emerald-800',
      email: 'bg-purple-100 text-purple-800',
      newsletter: 'bg-indigo-100 text-indigo-800',
      referral: 'bg-orange-100 text-orange-800',
      direct: 'bg-gray-100 text-gray-800',
      cpc: 'bg-yellow-100 text-yellow-800',
      cpm: 'bg-amber-100 text-amber-800',
    };
    return colors[medium] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics UTM</h2>
          <p className="text-muted-foreground">
            Suivez les performances de vos campagnes marketing
          </p>
        </div>
        <Button onClick={fetchUTMStats} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total des visites</p>
                <p className="text-2xl font-bold">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Campagnes actives</p>
                <p className="text-2xl font-bold">{uniqueCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sources</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredStats.map(stat => stat._id.source)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Performance des campagnes</CardTitle>
          <CardDescription>
            Détail de vos campagnes UTM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {Array.from(new Set(utmStats.map(stat => stat._id.source).filter(Boolean))).map(source => (
                  <SelectItem key={source} value={source}>
                    {source?.charAt(0).toUpperCase() + source?.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <LinkIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">Aucune donnée UTM disponible</p>
              <p className="text-sm mb-4">Générez des liens UTM avec le formulaire ci-dessus pour commencer à suivre vos campagnes marketing</p>
              <div className="text-xs text-gray-500">
                <p>• Créez des liens UTM pour LinkedIn, Facebook, Google Ads</p>
                <p>• Suivez quelles campagnes génèrent le plus de leads</p>
                <p>• Identifiez les sources de leads lors des formulaires</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStats.map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {stat._id.source && (
                        <Badge className={getSourceColor(stat._id.source)}>
                          {stat._id.source}
                        </Badge>
                      )}
                      {stat._id.medium && (
                        <Badge className={getMediumColor(stat._id.medium)}>
                          {stat._id.medium}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stat.count}</p>
                      <p className="text-sm text-muted-foreground">visites</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium">{stat._id.campaign || 'Campagne sans nom'}</p>
                    {stat._id.term && (
                      <p className="text-sm text-muted-foreground">
                        Terme : {stat._id.term}
                      </p>
                    )}
                    {stat._id.content && (
                      <p className="text-sm text-muted-foreground">
                        Contenu : {stat._id.content}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Dernière visite : {new Date(stat.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
