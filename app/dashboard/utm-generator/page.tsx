'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import UTMAnalytics from '@/components/dashboard/UTMAnalytics';

interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  generatedUrl: string;
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

  const generateUTM = () => {
    if (!utmData.source || !utmData.medium || !utmData.campaign) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

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
    
    setUtmData(prev => ({
      ...prev,
      generatedUrl
    }));

    toast.success('Lien UTM généré avec succès !');
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

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Comment utiliser le Générateur UTM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">💡 Objectif</h4>
              <p className="text-sm text-blue-800">Créer des liens trackables pour vos posts LinkedIn, Instagram, Meta Ads, etc. Quand quelqu'un clique sur votre lien et remplit un formulaire, vous saurez exactement d'où il vient !</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">1. Configurer les paramètres UTM</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Source :</strong> Plateforme marketing (LinkedIn, Facebook, Google Ads, etc.)</li>
                <li><strong>Medium :</strong> Type de contenu (post, pub, email, etc.)</li>
                <li><strong>Campaign :</strong> Nom de campagne descriptif (ex: "odoo-2024", "formation-hubspot")</li>
                <li><strong>Terme :</strong> Mot-clé optionnel</li>
                <li><strong>Contenu :</strong> Identifiant de contenu optionnel</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Générer et utiliser</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Cliquez sur "Générer le lien UTM" pour créer votre URL traçable</li>
                <li>Copiez le lien généré et utilisez-le dans vos posts LinkedIn, Instagram, Meta Ads</li>
                <li>Quand les visiteurs cliquent sur votre lien et remplissent un formulaire, vous verrez d'où ils viennent !</li>
                <li>Suivez vos meilleures sources de leads dans l'onglet Analytics</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2 text-green-900">📝 Exemple concret</h4>
              <p className="text-sm text-green-800">Pour un post LinkedIn sur Odoo :</p>
              <ul className="list-disc list-inside text-sm text-green-700 mt-2">
                <li>Source: <strong>linkedin</strong></li>
                <li>Medium: <strong>post</strong></li>
                <li>Campaign: <strong>odoo-2024</strong></li>
                <li>Résultat: <code className="bg-green-100 px-1 rounded">https://agence-blackswan.com?utm_source=linkedin&utm_medium=post&utm_campaign=odoo-2024</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Suivre les sources de leads</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Surveillez les sources de trafic dans le tableau de bord</li>
                <li>Identifiez quelles campagnes génèrent le plus de leads</li>
                <li>Quand les leads remplissent des formulaires, vous saurez exactement d'où ils viennent</li>
                <li>Optimisez votre stratégie marketing basée sur les données</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Button onClick={generateUTM} className="flex-1">
                Générer le lien UTM
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

      {/* UTM Analytics */}
      <UTMAnalytics />
    </div>
  );
}
