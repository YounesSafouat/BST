'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  generatedUrl: string;
}

interface StoredUTM {
  _id: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  generatedUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function UTMGeneratorPage() {
  const [utmData, setUtmData] = useState<UTMData>({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
    generatedUrl: ''
  });

  const [copied, setCopied] = useState(false);
  const [storedUTMs, setStoredUTMs] = useState<StoredUTM[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch stored UTMs
  const fetchUTMs = async () => {
    try {
      const response = await fetch('/api/utm');
      const data = await response.json();
      if (data.utms) {
        setStoredUTMs(data.utms);
      }
    } catch (error) {
      console.error('Error fetching UTMs:', error);
    }
  };

  // Store UTM in database
  const storeUTM = async (utmData: UTMData) => {
    try {
      const response = await fetch('/api/utm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(utmData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchUTMs(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error storing UTM:', error);
      return false;
    }
  };

  // Load UTMs on component mount
  useEffect(() => {
    fetchUTMs();
  }, []);

  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'google', label: 'Google Ads' },
    { value: 'meta', label: 'Meta Ads' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'referral', label: 'Referral' },
    { value: 'direct', label: 'Direct' }
  ];

  const mediumOptions = [
    { value: 'social', label: 'Social Media' },
    { value: 'post', label: 'Social Post' },
    { value: 'story', label: 'Story' },
    { value: 'reel', label: 'Reel' },
    { value: 'video', label: 'Video' },
    { value: 'ad', label: 'Paid Ad' },
    { value: 'organic', label: 'Organic Post' },
    { value: 'email', label: 'Email' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'referral', label: 'Referral' },
    { value: 'direct', label: 'Direct' },
    { value: 'cpc', label: 'Cost Per Click' },
    { value: 'cpm', label: 'Cost Per Mille' }
  ];

  const handleInputChange = (field: keyof UTMData, value: string) => {
    setUtmData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateUTM = async () => {
    if (!utmData.source || !utmData.medium || !utmData.campaign) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    const baseUrl = 'https://agence-blackswan.com';
    const utmParams = new URLSearchParams();
    
    utmParams.append('utm_source', utmData.source);
    utmParams.append('utm_medium', utmData.medium);
    utmParams.append('utm_campaign', utmData.campaign);
    
    if (utmData.term) {
      utmParams.append('utm_term', utmData.term);
    }
    
    if (utmData.content) {
      utmParams.append('utm_content', utmData.content);
    }

    const generatedUrl = `${baseUrl}?${utmParams.toString()}`;
    
    const utmToStore = {
      ...utmData,
      generatedUrl
    };
    
    setUtmData(prev => ({
      ...prev,
      generatedUrl
    }));

    // Store UTM in database
    const stored = await storeUTM(utmToStore);
    
    if (stored) {
      toast.success('Lien UTM généré et sauvegardé avec succès !');
    } else {
      toast.success('Lien UTM généré avec succès !');
    }
    
    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(utmData.generatedUrl);
      setCopied(true);
      toast.success('Lien UTM copié dans le presse-papiers !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Échec de la copie dans le presse-papiers');
    }
  };

  const openLink = () => {
    window.open(utmData.generatedUrl, '_blank');
  };

  const resetForm = () => {
    setUtmData({
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
      generatedUrl: ''
    });
    setCopied(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Générateur UTM</h1>
          <p className="text-muted-foreground mt-2">
            Générez des liens traçables pour vos campagnes marketing afin d'identifier les sources de leads
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UTM Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration UTM</CardTitle>
            <CardDescription>
              Configurez vos paramètres UTM pour suivre le trafic de vos campagnes marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select onValueChange={(value) => handleInputChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la plateforme marketing" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium">Medium *</Label>
              <Select onValueChange={(value) => handleInputChange('medium', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de contenu" />
                </SelectTrigger>
                <SelectContent>
                  {mediumOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign *</Label>
              <Input
                id="campaign"
                placeholder="ex: promotion-ete-2024, campagne-linkedin-odoo"
                value={utmData.campaign}
                onChange={(e) => handleInputChange('campaign', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Terme (optionnel)</Label>
              <Input
                id="term"
                placeholder="ex: implementation-odoo"
                value={utmData.term}
                onChange={(e) => handleInputChange('term', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu (optionnel)</Label>
              <Input
                id="content"
                placeholder="ex: image-post, miniature-video"
                value={utmData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generateUTM} className="flex-1" disabled={loading}>
                {loading ? 'Génération...' : 'Générer le lien UTM'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated UTM Link */}
        <Card>
          <CardHeader>
            <CardTitle>Lien UTM généré</CardTitle>
            <CardDescription>
              Votre lien traçable prêt à utiliser dans vos campagnes marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {utmData.generatedUrl ? (
              <>
                <div className="space-y-2">
                  <Label>URL générée</Label>
                  <div className="p-3 bg-muted rounded-md break-all text-sm">
                    {utmData.generatedUrl}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="flex-1">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier le lien
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={openLink}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Tester le lien
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Détail des paramètres UTM</Label>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-mono">{utmData.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium:</span>
                      <span className="font-mono">{utmData.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Campaign:</span>
                      <span className="font-mono">{utmData.campaign}</span>
                    </div>
                    {utmData.term && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Term:</span>
                        <span className="font-mono">{utmData.term}</span>
                      </div>
                    )}
                    {utmData.content && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Content:</span>
                        <span className="font-mono">{utmData.content}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Générez un lien UTM pour le voir ici</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stored UTMs Table */}
      <Card>
        <CardHeader>
          <CardTitle>UTMs Générés</CardTitle>
          <CardDescription>
            Liste de tous les liens UTM générés et leurs statistiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          {storedUTMs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun UTM généré pour le moment</p>
              <p className="text-sm">Générez votre premier lien UTM ci-dessus</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Source</th>
                    <th className="text-left p-2 font-medium">Medium</th>
                    <th className="text-left p-2 font-medium">Campaign</th>
                    <th className="text-left p-2 font-medium">Clics</th>
                    <th className="text-left p-2 font-medium">Créé le</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storedUTMs.map((utm) => (
                    <tr key={utm._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {utm.source}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {utm.medium}
                        </span>
                      </td>
                      <td className="p-2 font-medium">{utm.campaign}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {utm.clicks}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(utm.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(utm.generatedUrl);
                              toast.success('Lien copié !');
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(utm.generatedUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
