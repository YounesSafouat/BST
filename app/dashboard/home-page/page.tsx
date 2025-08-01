"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft, Plus, Trash2, X, GripVertical, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/home/Loader";

interface Testimonial {
     _id: string;
     author: string;
     role: string;
     text: string;
     photo?: string;
     company?: string;
     result?: string;
     createdAt?: string;
     updatedAt?: string;
}

interface HomePageData {
     type: string;
     title: string;
     hero: {
          headline: string;
          subheadline: string;
          description: string;
          logo: string;
          videoUrl: string;
          ctaPrimary: {
               text: string;
               icon: string;
          };
          ctaSecondary: {
               text: string;
               icon: string;
          };
          stats: Array<{
               number: number;
               suffix: string;
               label: string;
          }>;
          carousel?: {
               companies: Array<{
                    name: string;
                    logo: string;
                    url?: string;
               }>;
               speed?: number;
               text?: string; // Text to display above the carousel
          };
     };
     trustMetrics: Array<{
          number: number;
          suffix: string;
          label: string;
     }>;
     platformSection: {
          headline: string;
          subheadline: string;
          description?: string;
          apps: Array<{
               icon: string;
               title: string;
               description: string;
               features: string[];
               showProminently?: boolean;
          }>;
     };
     services: {
          headline: string;
          subheadline: string;
          capabilities: Array<{
               icon: string;
               title: string;
               description: string;
          }>;
     };
     pricing: {
          headline: string;
          subheadline: string;
          description?: string;
          plans: Array<{
               name: string;
               description: string;
               price: string;
               estimation: string;
               features: string[];
               cta: string;
               targetRegions?: string[];
          }>;
     };
     partnership: {
          headline: string;
          description?: string;
          subdescription?: string;
          modules?: string[];
          expertiseText?: string;
          image?: string;
          features?: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
     };
     testimonials: string[];
     testimonialsSection: {
          headline: string;
          description: string;
          subdescription?: string;
     };
     videoTestimonials?: {
          headline: string;
          description: string;
          subdescription?: string;
          videos: Array<{
               id: string;
               company: string;
               companyLogo: string;
               tagline?: string;
               duration: string;
               backgroundColor: string;
               textColor: string;
               videoUrl?: string;
               thumbnailUrl?: string;
          }>;
     };
     faq?: {
          headline: string;
          description: string;
          subdescription?: string;
          items: Array<{
               question: string;
               answer: string;
          }>;
     };
     contact?: {
          headline: string;
          description: string;
          subdescription?: string;
          formTitle: string;
          formDescription: string;
          benefits: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
          consultation: {
               title: string;
               description: string;
          };
          contactInfo: {
               phone: string;
               email: string;
          };
          guarantee: string;
     };
     finalCta: {
          headline: string;
          description: string;
          ctaPrimary: {
               text: string;
               icon: string;
          };
          ctaSecondary: {
               text: string;
               icon: string;
          };
     };
}

export default function HomePageDashboard() {
     const [homeData, setHomeData] = useState<HomePageData | null>(null);
     const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const router = useRouter();

     useEffect(() => {
          fetchHomeData();
          fetchAvailableTestimonials();
     }, []);

     const fetchHomeData = async () => {
          try {
               const response = await fetch('/api/content/odoo');
               if (response.ok) {
                    const data = await response.json();

                    // Initialize carousel data if it doesn't exist
                    if (!data.hero.carousel) {
                         data.hero.carousel = {
                              companies: [],
                              speed: 20,
                              text: "+112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne."
                         };
                    }

                    // Initialize with default companies if no companies exist
                    if (!data.hero.carousel.companies || data.hero.carousel.companies.length === 0) {
                         const defaultCompanies = [
                              { name: "FitnessPark", logo: "/ref/fitnespark-vectorized-white-3.svg" },
                              { name: "IDC Pharma", logo: "/ref/idc_pharma-horizontal-white-vector.svg" },
                              { name: "Yamaha Motors", logo: "/ref/yamaha_motors-horizontal-white-vector.svg" },
                              { name: "Malt", logo: "/ref/malt-horizontal-white-vector.svg" },
                              { name: "Optisam", logo: "/ref/optisam-horizontal-white-vector.svg" },
                              { name: "Essem", logo: "/ref/essem-1-2.svg" },
                              { name: "Jeanne d'Arc", logo: "/ref/jeannedarc-vectorized.svg" },
                              { name: "Allisone", logo: "/ref/allisone-vectorized-white.svg" },
                              { name: "Aicrafters", logo: "/ref/aicrafters-vectorized-white.svg" },
                              { name: "Barthener", logo: "/ref/barthener-vectorized-white.svg" },
                              { name: "Beks", logo: "/ref/beks-vectorized-white.svg" },
                              { name: "Call Center Group", logo: "/ref/callcenter_group-vectorized-white.svg" },
                              { name: "Chabi Chic", logo: "/ref/chabi-chic-vectorized-white.svg" },
                              { name: "ICAT", logo: "/ref/icat-vectorized-white.svg" },
                              { name: "Titre Français", logo: "/ref/titre-francais-vectorized-white.svg" },
                         ];
                         data.hero.carousel.companies = defaultCompanies;
                    }

                    setHomeData(data);
               } else {
                    console.error('Failed to fetch home data');
                    toast({
                         title: "Erreur",
                         description: "Impossible de charger les données de la page d'accueil",
                         variant: "destructive",
                    });
               }
          } catch (error) {
               console.error('Error fetching home data:', error);
               toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des données",
                    variant: "destructive",
               });
          } finally {
               setLoading(false);
          }
     };

     const fetchAvailableTestimonials = async () => {
          try {
               const response = await fetch('/api/content?type=testimonial');
               if (response.ok) {
                    const data = await response.json();
                    // Map the data structure to match our interface
                    const mapped = data.map((item: any) => ({
                         _id: typeof item._id === 'object' && item._id.$oid ? item._id.$oid : item._id.toString(),
                         author: item.content?.name || item.title || '',
                         role: item.content?.role || item.description || '',
                         text: item.content?.quote || item.content?.text || '',
                         photo: item.content?.avatar || item.content?.photo || '',
                         company: item.content?.company || '',
                         result: item.content?.result || '',
                    }));
                    setAvailableTestimonials(mapped);
               } else {
                    console.error('Failed to fetch available testimonials');
               }
          } catch (error) {
               console.error('Error fetching available testimonials:', error);
          }
     };

     const saveHomeData = async () => {
          if (!homeData) return;

          setSaving(true);
          try {
               const response = await fetch('/api/content/odoo', {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(homeData),
               });

               if (response.ok) {
                    toast({
                         title: "Succès",
                         description: "Données sauvegardées avec succès",
                    });
               } else {
                    throw new Error('Failed to save');
               }
          } catch (error) {
               console.error('Error saving home data:', error);
               toast({
                    title: "Erreur",
                    description: "Erreur lors de la sauvegarde",
                    variant: "destructive",
               });
          } finally {
               setSaving(false);
          }
     };

     const updateField = (path: string, value: any) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length - 1; i++) {
               current = current[keys[i]];
          }

          current[keys[keys.length - 1]] = value;
          setHomeData(newData);
     };

     const updateArrayField = (path: string, index: number, field: string, value: any) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current[index] = { ...current[index], [field]: value };
          setHomeData(newData);
     };

     const addArrayItem = (path: string, defaultItem: any) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current.push(defaultItem);
          setHomeData(newData);
     };

     const removeArrayItem = (path: string, index: number) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current.splice(index, 1);
          setHomeData(newData);
     };

     const addArrayStringItem = (path: string, defaultValue: string) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current.push(defaultValue);
          setHomeData(newData);
     };

     const removeArrayStringItem = (path: string, index: number) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current.splice(index, 1);
          setHomeData(newData);
     };

     const updateArrayStringItem = (path: string, index: number, value: string) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          for (let i = 0; i < keys.length; i++) {
               current = current[keys[i]];
          }

          current[index] = value;
          setHomeData(newData);
     };

     const addTestimonialFromDropdown = (testimonialId: string) => {
          if (!homeData) return;

          // Check if testimonial is already selected
          if (homeData.testimonials.includes(testimonialId)) {
               toast({
                    title: "Attention",
                    description: "Ce témoignage est déjà sélectionné",
                    variant: "destructive",
               });
               return;
          }

          const newTestimonials = [...homeData.testimonials, testimonialId];
          setHomeData({ ...homeData, testimonials: newTestimonials });

          toast({
               title: "Succès",
               description: "Témoignage ajouté avec succès",
          });
     };

     const reorderCompanies = (fromIndex: number, toIndex: number) => {
          if (!homeData || !homeData.hero.carousel?.companies) return;

          const companies = [...homeData.hero.carousel.companies];
          const [movedCompany] = companies.splice(fromIndex, 1);
          companies.splice(toIndex, 0, movedCompany);

          setHomeData({
               ...homeData,
               hero: {
                    ...homeData.hero,
                    carousel: {
                         ...homeData.hero.carousel,
                         companies
                    }
               }
          });
     };

     const handleImageUpload = async (file: File, companyIndex: number) => {
          try {
               // For now, we'll use a simple approach - convert to base64
               // In production, you'd want to upload to a CDN or cloud storage
               const reader = new FileReader();
               reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    if (homeData && homeData.hero.carousel?.companies) {
                         const companies = [...homeData.hero.carousel.companies];
                         companies[companyIndex] = { ...companies[companyIndex], logo: base64 };

                         setHomeData({
                              ...homeData,
                              hero: {
                                   ...homeData.hero,
                                   carousel: {
                                        ...homeData.hero.carousel,
                                        companies
                                   }
                              }
                         });
                    }
               };
               reader.readAsDataURL(file);
          } catch (error) {
               console.error('Error uploading image:', error);
               toast({
                    title: "Erreur",
                    description: "Erreur lors du téléchargement de l'image",
                    variant: "destructive",
               });
          }
     };

     const handleVideoUpload = async (file: File) => {
          try {
               // For now, we'll use a simple approach - convert to base64
               // In production, you'd want to upload to a CDN or cloud storage
               const reader = new FileReader();
               reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    if (homeData) {
                         setHomeData({
                              ...homeData,
                              hero: {
                                   ...homeData.hero,
                                   videoUrl: base64
                              }
                         });
                    }
               };
               reader.readAsDataURL(file);
          } catch (error) {
               console.error('Error uploading video:', error);
               toast({
                    title: "Erreur",
                    description: "Erreur lors du téléchargement de la vidéo",
                    variant: "destructive",
               });
          }
     };

     const getVideoEmbedUrl = (url: string): string => {
          // YouTube
          if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
               const videoId = url.includes('youtube.com/watch')
                    ? url.split('v=')[1]?.split('&')[0]
                    : url.split('youtu.be/')[1]?.split('?')[0];
               return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
          }

          // Vimeo
          if (url.includes('vimeo.com/')) {
               const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
               return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
          }

          // For other URLs, return as is
          return url;
     };

     const handleVideoUploadForTestimonial = async (file: File, videoIndex: number) => {
          try {
               const reader = new FileReader();
               reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    updateArrayField('videoTestimonials.videos', videoIndex, 'videoUrl', base64);
               };
               reader.readAsDataURL(file);
          } catch (error) {
               console.error('Error uploading video:', error);
               toast({
                    title: "Erreur",
                    description: "Impossible de télécharger la vidéo",
                    variant: "destructive",
               });
          }
     };



     if (loading) {
          return <Loader />;
     }

     if (!homeData) {
          return (
               <div className="container mx-auto py-8">
                    <div className="text-center">
                         <h1 className="text-2xl font-bold text-gray-900 mb-4">Page d'accueil</h1>
                         <p className="text-gray-600">Aucune donnée trouvée</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="container mx-auto py-8">
               <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                         <Button
                              variant="ghost"
                              onClick={() => router.back()}
                              className="flex items-center gap-2"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              Retour
                         </Button>
                         <h1 className="text-3xl font-bold text-gray-900">Page d'accueil</h1>
                    </div>
                    <div className="flex gap-2">
                         <Button
                              variant="outline"
                              onClick={() => window.open('/', '_blank')}
                              className="flex items-center gap-2"
                         >
                              <Eye className="w-4 h-4" />
                              Voir la page
                         </Button>
                         <Button
                              onClick={saveHomeData}
                              disabled={saving}
                              className="flex items-center gap-2"
                         >
                              <Save className="w-4 h-4" />
                              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                         </Button>
                    </div>
               </div>

               <Tabs defaultValue="hero" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-9">
                         <TabsTrigger value="hero">Hero</TabsTrigger>
                         <TabsTrigger value="platform">Plateforme</TabsTrigger>
                         <TabsTrigger value="pricing">Tarifs</TabsTrigger>
                         <TabsTrigger value="partnership">Agence</TabsTrigger>
                         <TabsTrigger value="contact">Contact</TabsTrigger>
                         <TabsTrigger value="faq">FAQ</TabsTrigger>
                         <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
                         <TabsTrigger value="videoTestimonials">Vidéos</TabsTrigger>
                         <TabsTrigger value="final">CTA Final</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Hero</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre principal</Label>
                                             <Input
                                                  value={homeData.hero.headline}
                                                  onChange={(e) => updateField('hero.headline', e.target.value)}
                                                  placeholder="Titre principal"
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <Input
                                                  value={homeData.hero.subheadline}
                                                  onChange={(e) => updateField('hero.subheadline', e.target.value)}
                                                  placeholder="Sous-titre"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <Textarea
                                             value={homeData.hero.description}
                                             onChange={(e) => updateField('hero.description', e.target.value)}
                                             placeholder="Description"
                                             rows={3}
                                        />
                                   </div>
                                   <div>
                                        <Label>Vidéo</Label>
                                        <div className="flex gap-2">
                                             <Input
                                                  value={homeData.hero.videoUrl}
                                                  onChange={(e) => updateField('hero.videoUrl', e.target.value)}
                                                  placeholder="URL de la vidéo (YouTube, Vimeo, etc.) ou télécharger un fichier"
                                                  className="flex-1"
                                             />
                                             <div className="relative">
                                                  <input
                                                       type="file"
                                                       accept="video/*"
                                                       onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                 handleVideoUpload(file);
                                                            }
                                                       }}
                                                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                       aria-label="Télécharger une vidéo"
                                                       title="Télécharger une vidéo"
                                                  />
                                                  <Button variant="outline" size="sm" className="h-10">
                                                       <Upload className="h-4 w-4" />
                                                  </Button>
                                             </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                             Vous pouvez utiliser une URL (YouTube, Vimeo) ou télécharger un fichier vidéo
                                        </p>

                                        {/* Video Preview */}
                                        {homeData.hero.videoUrl && (
                                             <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                                  <Label className="text-sm font-medium mb-2 block">Aperçu de la vidéo</Label>
                                                  <div className="w-full max-w-md aspect-video bg-black rounded overflow-hidden">
                                                       {homeData.hero.videoUrl.startsWith('data:') || homeData.hero.videoUrl.startsWith('blob:') ? (
                                                            <video
                                                                 src={homeData.hero.videoUrl}
                                                                 controls
                                                                 className="w-full h-full object-contain"
                                                                 onError={(e) => {
                                                                      e.currentTarget.style.display = 'none';
                                                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                                 }}
                                                            />
                                                       ) : (
                                                            <iframe
                                                                 src={getVideoEmbedUrl(homeData.hero.videoUrl)}
                                                                 title="Video preview"
                                                                 className="w-full h-full"
                                                                 frameBorder="0"
                                                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                 allowFullScreen
                                                            />
                                                       )}
                                                       <div className="hidden w-full h-full flex items-center justify-center text-white text-sm">
                                                            Impossible de charger la vidéo
                                                       </div>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Bouton principal - Texte</Label>
                                             <Input
                                                  value={homeData.hero.ctaPrimary.text}
                                                  onChange={(e) => updateField('hero.ctaPrimary.text', e.target.value)}
                                                  placeholder="Texte du bouton principal"
                                             />
                                        </div>
                                        <div>
                                             <Label>Bouton secondaire - Texte</Label>
                                             <Input
                                                  value={homeData.hero.ctaSecondary.text}
                                                  onChange={(e) => updateField('hero.ctaSecondary.text', e.target.value)}
                                                  placeholder="Texte du bouton secondaire"
                                             />
                                        </div>
                                   </div>

                                   {/* Carousel Management */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Carousel des entreprises</Label>
                                             <div className="flex gap-2">
                                                  <Input
                                                       type="number"
                                                       value={homeData.hero.carousel?.speed || 20}
                                                       onChange={(e) => updateField('hero.carousel.speed', parseInt(e.target.value) || 20)}
                                                       placeholder="Vitesse (secondes)"
                                                       className="w-24"
                                                  />
                                                  <Button
                                                       onClick={() => {
                                                            const currentCompanies = homeData.hero.carousel?.companies || [];
                                                            updateField('hero.carousel.companies', [
                                                                 { name: 'Nouvelle entreprise', logo: '/ref/placeholder.svg', url: '' },
                                                                 ...currentCompanies
                                                            ]);
                                                       }}
                                                       size="sm"
                                                       className="flex items-center gap-2"
                                                  >
                                                       <Plus className="w-4 h-4" />
                                                       Ajouter une entreprise
                                                  </Button>
                                             </div>
                                        </div>

                                        {/* Text above carousel */}
                                        <div>
                                             <Label>Texte au-dessus du carousel</Label>
                                             <Textarea
                                                  value={homeData.hero.carousel?.text || ''}
                                                  onChange={(e) => updateField('hero.carousel.text', e.target.value)}
                                                  placeholder="Ex: +112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne."
                                                  title="Texte au-dessus du carousel"
                                                  className="h-20"
                                             />
                                             <p className="text-xs text-gray-500 mt-1">
                                                  Ce texte apparaîtra au-dessus du carousel des logos d'entreprises
                                             </p>
                                        </div>

                                        {(homeData.hero.carousel?.companies || []).map((company, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <div className="flex items-center gap-2">
                                                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                                                                 <GripVertical className="w-4 h-4" />
                                                            </div>
                                                            <h4 className="font-semibold">Entreprise {index + 1}</h4>
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            {index > 0 && (
                                                                 <Button
                                                                      onClick={() => reorderCompanies(index, index - 1)}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-gray-600 hover:text-gray-800"
                                                                 >
                                                                      ↑
                                                                 </Button>
                                                            )}
                                                            {index < (homeData.hero.carousel?.companies?.length || 0) - 1 && (
                                                                 <Button
                                                                      onClick={() => reorderCompanies(index, index + 1)}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-gray-600 hover:text-gray-800"
                                                                 >
                                                                      ↓
                                                                 </Button>
                                                            )}
                                                            <Button
                                                                 onClick={() => {
                                                                      const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                      updateField('hero.carousel.companies', currentCompanies.filter((_, i) => i !== index));
                                                                 }}
                                                                 variant="ghost"
                                                                 size="sm"
                                                                 className="text-red-600 hover:text-red-700"
                                                            >
                                                                 <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                       </div>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Nom de l'entreprise</Label>
                                                            <Input
                                                                 value={company.name}
                                                                 onChange={(e) => {
                                                                      const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                      const updatedCompanies = [...currentCompanies];
                                                                      updatedCompanies[index] = { ...updatedCompanies[index], name: e.target.value };
                                                                      updateField('hero.carousel.companies', updatedCompanies);
                                                                 }}
                                                                 placeholder="Nom de l'entreprise"
                                                                 className="h-10"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Logo</Label>
                                                            <div className="flex gap-2">
                                                                 <Input
                                                                      value={company.logo}
                                                                      onChange={(e) => {
                                                                           const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                           const updatedCompanies = [...currentCompanies];
                                                                           updatedCompanies[index] = { ...updatedCompanies[index], logo: e.target.value };
                                                                           updateField('hero.carousel.companies', updatedCompanies);
                                                                      }}
                                                                      placeholder="URL du logo ou télécharger un fichier"
                                                                      className="flex-1 h-10"
                                                                 />
                                                                 <div className="relative">
                                                                      <input
                                                                           type="file"
                                                                           accept="image/*"
                                                                           onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                     handleImageUpload(file, index);
                                                                                }
                                                                           }}
                                                                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                           aria-label="Télécharger une image"
                                                                           title="Télécharger une image"
                                                                      />
                                                                      <Button variant="outline" size="sm" className="h-10">
                                                                           <Upload className="h-4 w-4" />
                                                                      </Button>
                                                                 </div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                 Vous pouvez utiliser une URL ou télécharger une image
                                                            </p>
                                                            {company.logo && (
                                                                 <div className="mt-2 p-2 border rounded bg-gray-50">
                                                                      <img
                                                                           src={company.logo}
                                                                           alt={company.name}
                                                                           className="h-8 object-contain"
                                                                           onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                           }}
                                                                      />
                                                                 </div>
                                                            )}
                                                       </div>

                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="trustMetrics" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Métriques de Confiance</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="flex items-center justify-between">
                                        <Label className="text-lg font-semibold">Statistiques</Label>
                                        <Button
                                             onClick={() => addArrayItem('trustMetrics', {
                                                  number: 0,
                                                  suffix: '+',
                                                  label: 'Nouvelle métrique'
                                             })}
                                             size="sm"
                                             className="flex items-center gap-2"
                                        >
                                             <Plus className="w-4 h-4" />
                                             Ajouter une métrique
                                        </Button>
                                   </div>

                                   {homeData.trustMetrics?.map((metric, index) => (
                                        <Card key={index} className="p-4">
                                             <div className="flex items-center justify-between mb-4">
                                                  <h4 className="font-semibold">Métrique {index + 1}</h4>
                                                  <Button
                                                       onClick={() => removeArrayItem('trustMetrics', index)}
                                                       variant="ghost"
                                                       size="sm"
                                                       className="text-red-600 hover:text-red-700"
                                                  >
                                                       <Trash2 className="w-4 h-4" />
                                                  </Button>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                  <div>
                                                       <Label>Nombre</Label>
                                                       <Input
                                                            type="number"
                                                            value={metric.number}
                                                            onChange={(e) => updateArrayField('trustMetrics', index, 'number', parseInt(e.target.value) || 0)}
                                                            placeholder="112"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label>Suffixe</Label>
                                                       <Input
                                                            value={metric.suffix}
                                                            onChange={(e) => updateArrayField('trustMetrics', index, 'suffix', e.target.value)}
                                                            placeholder="+"
                                                       />
                                                  </div>
                                                  <div>
                                                       <Label>Label</Label>
                                                       <Input
                                                            value={metric.label}
                                                            onChange={(e) => updateArrayField('trustMetrics', index, 'label', e.target.value)}
                                                            placeholder="entreprises nous font confiance"
                                                       />
                                                  </div>
                                             </div>
                                        </Card>
                                   ))}
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="platform" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Plateforme</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.platformSection.headline}
                                                  onChange={(e) => updateField('platformSection.headline', e.target.value)}
                                                  placeholder="Titre de la section plateforme"
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <Input
                                                  value={homeData.platformSection.subheadline}
                                                  onChange={(e) => updateField('platformSection.subheadline', e.target.value)}
                                                  placeholder="Sous-titre"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <Textarea
                                             value={homeData.platformSection.description || ''}
                                             onChange={(e) => updateField('platformSection.description', e.target.value)}
                                             placeholder="Description"
                                             rows={3}
                                        />
                                   </div>

                                   {/* Apps */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Applications</Label>
                                             <Button
                                                  onClick={() => addArrayItem('platformSection.apps', {
                                                       icon: 'Star',
                                                       title: 'Nouvelle application',
                                                       description: 'Description de l\'application',
                                                       features: ['Fonctionnalité 1'],
                                                       showProminently: false
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter une application
                                             </Button>
                                        </div>

                                        {homeData.platformSection.apps?.map((app, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Application {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('platformSection.apps', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Icône</Label>
                                                            <Input
                                                                 value={app.icon}
                                                                 onChange={(e) => updateArrayField('platformSection.apps', index, 'icon', e.target.value)}
                                                                 placeholder="Nom de l'icône (ex: Star, Check, etc.)"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Titre</Label>
                                                            <Input
                                                                 value={app.title}
                                                                 onChange={(e) => updateArrayField('platformSection.apps', index, 'title', e.target.value)}
                                                                 placeholder="Titre de l'application"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <div className="flex items-center justify-between">
                                                            <Label className="text-sm font-medium">Afficher en évidence (carousel)</Label>
                                                            <Switch
                                                                 checked={app.showProminently || false}
                                                                 onCheckedChange={(checked) => updateArrayField('platformSection.apps', index, 'showProminently', checked)}
                                                            />
                                                       </div>
                                                       <p className="text-xs text-gray-500 mt-1">
                                                            Les applications activées seront affichées dans un carousel en évidence
                                                       </p>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Description</Label>
                                                       <Textarea
                                                            value={app.description}
                                                            onChange={(e) => updateArrayField('platformSection.apps', index, 'description', e.target.value)}
                                                            placeholder="Description de l'application"
                                                            rows={2}
                                                       />
                                                  </div>

                                                  {/* Features */}
                                                  <div className="space-y-2">
                                                       <div className="flex items-center justify-between">
                                                            <Label>Fonctionnalités</Label>
                                                            <Button
                                                                 onClick={() => {
                                                                      const newFeatures = [...app.features, 'Nouvelle fonctionnalité'];
                                                                      updateArrayField('platformSection.apps', index, 'features', newFeatures);
                                                                 }}
                                                                 size="sm"
                                                                 variant="outline"
                                                            >
                                                                 <Plus className="w-3 h-3 mr-1" />
                                                                 Ajouter
                                                            </Button>
                                                       </div>
                                                       {app.features.map((feature, featureIndex) => (
                                                            <div key={featureIndex} className="flex items-center gap-2">
                                                                 <Input
                                                                      value={feature}
                                                                      onChange={(e) => {
                                                                           const newFeatures = [...app.features];
                                                                           newFeatures[featureIndex] = e.target.value;
                                                                           updateArrayField('platformSection.apps', index, 'features', newFeatures);
                                                                      }}
                                                                      placeholder="Fonctionnalité"
                                                                 />
                                                                 <Button
                                                                      onClick={() => {
                                                                           const newFeatures = app.features.filter((_, i) => i !== featureIndex);
                                                                           updateArrayField('platformSection.apps', index, 'features', newFeatures);
                                                                      }}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-red-600 hover:text-red-700"
                                                                 >
                                                                      <X className="w-3 h-3" />
                                                                 </Button>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Tarifs</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.pricing.headline}
                                                  onChange={(e) => updateField('pricing.headline', e.target.value)}
                                                  placeholder="Titre de la section tarifs"
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <Input
                                                  value={homeData.pricing.subheadline}
                                                  onChange={(e) => updateField('pricing.subheadline', e.target.value)}
                                                  placeholder="Sous-titre"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <Textarea
                                             value={homeData.pricing.description || ''}
                                             onChange={(e) => updateField('pricing.description', e.target.value)}
                                             placeholder="Description"
                                             rows={3}
                                        />
                                   </div>

                                   {/* Pricing Plans */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Plans de tarification</Label>
                                             <Button
                                                  onClick={() => addArrayItem('pricing.plans', {
                                                       name: 'Nouveau Plan',
                                                       description: 'Description du plan',
                                                       price: 'Prix',
                                                       estimation: 'Estimation',
                                                       features: ['Fonctionnalité 1'],
                                                       cta: 'Commander',
                                                       targetRegions: ['france', 'morocco', 'international']
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter un plan
                                             </Button>
                                        </div>

                                        {homeData.pricing.plans.map((plan, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Plan {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('pricing.plans', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                       <div>
                                                            <Label>Nom du plan</Label>
                                                            <Input
                                                                 value={plan.name}
                                                                 onChange={(e) => updateArrayField('pricing.plans', index, 'name', e.target.value)}
                                                                 placeholder="Nom du plan"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Prix</Label>
                                                            <Input
                                                                 value={plan.price}
                                                                 onChange={(e) => updateArrayField('pricing.plans', index, 'price', e.target.value)}
                                                                 placeholder="Prix"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Estimation</Label>
                                                            <Input
                                                                 value={plan.estimation}
                                                                 onChange={(e) => updateArrayField('pricing.plans', index, 'estimation', e.target.value)}
                                                                 placeholder="Estimation"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>CTA</Label>
                                                            <Input
                                                                 value={plan.cta}
                                                                 onChange={(e) => updateArrayField('pricing.plans', index, 'cta', e.target.value)}
                                                                 placeholder="Texte du bouton"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mb-4">
                                                       <Label>Description</Label>
                                                       <Textarea
                                                            value={plan.description}
                                                            onChange={(e) => updateArrayField('pricing.plans', index, 'description', e.target.value)}
                                                            placeholder="Description du plan"
                                                            rows={2}
                                                       />
                                                  </div>

                                                  {/* Region Targeting */}
                                                  <div className="mb-4">
                                                       <Label>Régions cibles</Label>
                                                       <div className="grid grid-cols-3 gap-2 mt-2">
                                                            <label className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      checked={plan.targetRegions?.includes('france') || false}
                                                                      onChange={(e) => {
                                                                           const currentRegions = plan.targetRegions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'france']
                                                                                : currentRegions.filter(r => r !== 'france');
                                                                           updateArrayField('pricing.plans', index, 'targetRegions', newRegions);
                                                                      }}
                                                                 />
                                                                 <span className="text-sm">France</span>
                                                            </label>
                                                            <label className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      checked={plan.targetRegions?.includes('morocco') || false}
                                                                      onChange={(e) => {
                                                                           const currentRegions = plan.targetRegions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'morocco']
                                                                                : currentRegions.filter(r => r !== 'morocco');
                                                                           updateArrayField('pricing.plans', index, 'targetRegions', newRegions);
                                                                      }}
                                                                 />
                                                                 <span className="text-sm">Maroc</span>
                                                            </label>
                                                            <label className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      checked={plan.targetRegions?.includes('international') || false}
                                                                      onChange={(e) => {
                                                                           const currentRegions = plan.targetRegions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'international']
                                                                                : currentRegions.filter(r => r !== 'international');
                                                                           updateArrayField('pricing.plans', index, 'targetRegions', newRegions);
                                                                      }}
                                                                 />
                                                                 <span className="text-sm">International</span>
                                                            </label>
                                                       </div>
                                                       <p className="text-xs text-gray-500 mt-1">
                                                            Laissez vide pour afficher dans toutes les régions
                                                       </p>
                                                  </div>

                                                  {/* Features */}
                                                  <div className="space-y-2">
                                                       <div className="flex items-center justify-between">
                                                            <Label>Fonctionnalités</Label>
                                                            <Button
                                                                 onClick={() => {
                                                                      const newFeatures = [...plan.features, 'Nouvelle fonctionnalité'];
                                                                      updateArrayField('pricing.plans', index, 'features', newFeatures);
                                                                 }}
                                                                 size="sm"
                                                                 variant="outline"
                                                            >
                                                                 <Plus className="w-3 h-3 mr-1" />
                                                                 Ajouter
                                                            </Button>
                                                       </div>
                                                       {plan.features.map((feature, featureIndex) => (
                                                            <div key={featureIndex} className="flex items-center gap-2">
                                                                 <Input
                                                                      value={feature}
                                                                      onChange={(e) => {
                                                                           const newFeatures = [...plan.features];
                                                                           newFeatures[featureIndex] = e.target.value;
                                                                           updateArrayField('pricing.plans', index, 'features', newFeatures);
                                                                      }}
                                                                      placeholder="Fonctionnalité"
                                                                 />
                                                                 <Button
                                                                      onClick={() => {
                                                                           const newFeatures = plan.features.filter((_, i) => i !== featureIndex);
                                                                           updateArrayField('pricing.plans', index, 'features', newFeatures);
                                                                      }}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-red-600 hover:text-red-700"
                                                                 >
                                                                      <X className="w-3 h-3" />
                                                                 </Button>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="partnership" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Notre Agence</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.partnership.headline}
                                                  onChange={(e) => updateField('partnership.headline', e.target.value)}
                                                  placeholder="Titre de la section agence"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.partnership.subdescription || ''}
                                                  onChange={(e) => updateField('partnership.subdescription', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Texte d'expertise</Label>
                                        <Textarea
                                             value={homeData.partnership.expertiseText || ''}
                                             onChange={(e) => updateField('partnership.expertiseText', e.target.value)}
                                             placeholder="Texte d'expertise"
                                             rows={3}
                                        />
                                   </div>

                                   <div>
                                        <Label>Image de l'agence</Label>
                                        <div className="flex items-center gap-4">
                                             <Input
                                                  value={homeData.partnership.image || ''}
                                                  onChange={(e) => updateField('partnership.image', e.target.value)}
                                                  placeholder="URL de l'image ou /placeholder.svg"
                                             />
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={async (e) => {
                                                       const file = e.target.files?.[0];
                                                       if (file) {
                                                            try {
                                                                 const formData = new FormData();
                                                                 formData.append('file', file);
                                                                 const response = await fetch('/api/upload', {
                                                                      method: 'POST',
                                                                      body: formData
                                                                 });
                                                                 if (response.ok) {
                                                                      const data = await response.json();
                                                                      updateField('partnership.image', data.url);
                                                                 }
                                                            } catch (error) {
                                                                 console.error('Error uploading image:', error);
                                                            }
                                                       }
                                                  }}
                                                  className="hidden"
                                                  id="partnership-image-upload"
                                                  title="Choisir une image pour l'agence"
                                             />
                                             <Button
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() => document.getElementById('partnership-image-upload')?.click()}
                                             >
                                                  Choisir une image
                                             </Button>
                                        </div>
                                        {homeData.partnership.image && (
                                             <div className="mt-2">
                                                  <img
                                                       src={homeData.partnership.image}
                                                       alt="Aperçu de l'image"
                                                       className="w-32 h-32 object-cover rounded-lg border"
                                                       onError={(e) => {
                                                            e.currentTarget.src = '/placeholder.svg';
                                                       }}
                                                  />
                                             </div>
                                        )}
                                   </div>

                                   {/* Partnership Features */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Fonctionnalités de l'agence</Label>
                                             <Button
                                                  onClick={() => addArrayItem('partnership.features', {
                                                       title: 'Nouvelle fonctionnalité',
                                                       description: 'Description de la fonctionnalité',
                                                       icon: 'Star'
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter une fonctionnalité
                                             </Button>
                                        </div>

                                        {homeData.partnership.features?.map((feature, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Fonctionnalité {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('partnership.features', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Titre</Label>
                                                            <Input
                                                                 value={feature.title}
                                                                 onChange={(e) => updateArrayField('partnership.features', index, 'title', e.target.value)}
                                                                 placeholder="Titre de la fonctionnalité"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Icône</Label>
                                                            <Input
                                                                 value={feature.icon}
                                                                 onChange={(e) => updateArrayField('partnership.features', index, 'icon', e.target.value)}
                                                                 placeholder="Nom de l'icône (ex: Star, Check, etc.)"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Description</Label>
                                                       <Textarea
                                                            value={feature.description}
                                                            onChange={(e) => updateArrayField('partnership.features', index, 'description', e.target.value)}
                                                            placeholder="Description de la fonctionnalité"
                                                            rows={2}
                                                       />
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Contact</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.contact?.headline || ''}
                                                  onChange={(e) => updateField('contact.headline', e.target.value)}
                                                  placeholder="Titre de la section contact"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.contact?.description || ''}
                                                  onChange={(e) => updateField('contact.description', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Sous-description (texte avec statistiques)</Label>
                                        <Textarea
                                             value={homeData.contact?.subdescription || ''}
                                             onChange={(e) => updateField('contact.subdescription', e.target.value)}
                                             placeholder="Ex: +112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne."
                                             rows={2}
                                        />
                                   </div>
                                   <div>
                                        <Label>Description du formulaire</Label>
                                        <Textarea
                                             value={homeData.contact?.formDescription || ''}
                                             onChange={(e) => updateField('contact.formDescription', e.target.value)}
                                             placeholder="Description du formulaire"
                                             rows={3}
                                        />
                                   </div>
                                   <div>
                                        <Label>Titre du formulaire</Label>
                                        <Input
                                             value={homeData.contact?.formTitle || ''}
                                             onChange={(e) => updateField('contact.formTitle', e.target.value)}
                                             placeholder="Titre du formulaire"
                                        />
                                   </div>

                                   {/* Benefits */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Avantages</Label>
                                             <Button
                                                  onClick={() => addArrayItem('contact.benefits', {
                                                       title: 'Nouvel avantage',
                                                       description: 'Description de l\'avantage',
                                                       icon: 'Check'
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter un avantage
                                             </Button>
                                        </div>

                                        {homeData.contact?.benefits?.map((benefit, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Avantage {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('contact.benefits', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Titre</Label>
                                                            <Input
                                                                 value={benefit.title}
                                                                 onChange={(e) => updateArrayField('contact.benefits', index, 'title', e.target.value)}
                                                                 placeholder="Titre de l'avantage"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Icône</Label>
                                                            <Input
                                                                 value={benefit.icon}
                                                                 onChange={(e) => updateArrayField('contact.benefits', index, 'icon', e.target.value)}
                                                                 placeholder="Nom de l'icône (ex: Check, Star, etc.)"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Description</Label>
                                                       <Textarea
                                                            value={benefit.description}
                                                            onChange={(e) => updateArrayField('contact.benefits', index, 'description', e.target.value)}
                                                            placeholder="Description de l'avantage"
                                                            rows={2}
                                                       />
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>

                                   {/* Consultation */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Consultation</Label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                  <Label>Titre</Label>
                                                  <Input
                                                       value={homeData.contact?.consultation?.title || ''}
                                                       onChange={(e) => updateField('contact.consultation.title', e.target.value)}
                                                       placeholder="Titre de la consultation"
                                                  />
                                             </div>
                                             <div>
                                                  <Label>Description</Label>
                                                  <Input
                                                       value={homeData.contact?.consultation?.description || ''}
                                                       onChange={(e) => updateField('contact.consultation.description', e.target.value)}
                                                       placeholder="Description de la consultation"
                                                  />
                                             </div>
                                        </div>
                                   </div>

                                   {/* Contact Info */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Informations de contact</Label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                  <Label>Téléphone</Label>
                                                  <Input
                                                       value={homeData.contact?.contactInfo?.phone || ''}
                                                       onChange={(e) => updateField('contact.contactInfo.phone', e.target.value)}
                                                       placeholder="Téléphone"
                                                  />
                                             </div>
                                             <div>
                                                  <Label>Email</Label>
                                                  <Input
                                                       value={homeData.contact?.contactInfo?.email || ''}
                                                       onChange={(e) => updateField('contact.contactInfo.email', e.target.value)}
                                                       placeholder="Email"
                                                  />
                                             </div>
                                        </div>
                                   </div>

                                   {/* Guarantee */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Garantie</Label>
                                        </div>

                                        <Textarea
                                             value={homeData.contact?.guarantee || ''}
                                             onChange={(e) => updateField('contact.guarantee', e.target.value)}
                                             placeholder="Texte de la garantie"
                                             rows={3}
                                        />
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>



                    <TabsContent value="faq" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section FAQ</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.faq?.headline || ''}
                                                  onChange={(e) => updateField('faq.headline', e.target.value)}
                                                  placeholder="Titre de la section FAQ"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.faq?.description || ''}
                                                  onChange={(e) => updateField('faq.description', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>

                                   {/* FAQ Items */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Questions et réponses</Label>
                                             <Button
                                                  onClick={() => addArrayItem('faq.items', {
                                                       question: 'Nouvelle question',
                                                       answer: 'Nouvelle réponse'
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter une question
                                             </Button>
                                        </div>

                                        {homeData.faq?.items?.map((item, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Question {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('faq.items', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="space-y-4">
                                                       <div>
                                                            <Label>Question</Label>
                                                            <Textarea
                                                                 value={item.question}
                                                                 onChange={(e) => updateArrayField('faq.items', index, 'question', e.target.value)}
                                                                 placeholder="Question"
                                                                 rows={2}
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Réponse</Label>
                                                            <Textarea
                                                                 value={item.answer}
                                                                 onChange={(e) => updateArrayField('faq.items', index, 'answer', e.target.value)}
                                                                 placeholder="Réponse"
                                                                 rows={3}
                                                            />
                                                       </div>
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="testimonials" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Témoignages</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.testimonialsSection.headline}
                                                  onChange={(e) => updateField('testimonialsSection.headline', e.target.value)}
                                                  placeholder="Titre de la section témoignages"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.testimonialsSection.description}
                                                  onChange={(e) => updateField('testimonialsSection.description', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>

                                   {/* Add Testimonial from Dropdown */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Ajouter un témoignage</Label>
                                        </div>

                                        <div className="flex items-center gap-4">
                                             <div className="flex-1">
                                                  <Select onValueChange={addTestimonialFromDropdown}>
                                                       <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionner un témoignage disponible" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {availableTestimonials.map((testimonial) => (
                                                                 <SelectItem key={testimonial._id} value={testimonial._id}>
                                                                      {testimonial.author} - {testimonial.role}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Selected Testimonials */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Témoignages sélectionnés</Label>
                                        </div>

                                        {homeData.testimonials.length === 0 ? (
                                             <div className="text-center py-8 text-gray-500">
                                                  Aucun témoignage sélectionné. Utilisez le sélecteur ci-dessus pour ajouter des témoignages.
                                             </div>
                                        ) : (
                                             homeData.testimonials.map((testimonialId, index) => {
                                                  const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                                  return (
                                                       <Card key={index} className="p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                 <h4 className="font-semibold">Témoignage {index + 1}</h4>
                                                                 <Button
                                                                      onClick={() => removeArrayStringItem('testimonials', index)}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-red-600 hover:text-red-700"
                                                                 >
                                                                      <Trash2 className="w-4 h-4" />
                                                                 </Button>
                                                            </div>

                                                            {testimonial ? (
                                                                 <div className="space-y-3">
                                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                           <div>
                                                                                <Label className="text-sm font-medium text-gray-600">Auteur</Label>
                                                                                <div className="text-sm font-medium">{testimonial.author}</div>
                                                                           </div>
                                                                           <div>
                                                                                <Label className="text-sm font-medium text-gray-600">Rôle</Label>
                                                                                <div className="text-sm">{testimonial.role}</div>
                                                                           </div>
                                                                      </div>

                                                                      <div>
                                                                           <Label className="text-sm font-medium text-gray-600">Témoignage</Label>
                                                                           <div className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                                                                                "{testimonial.text}"
                                                                           </div>
                                                                      </div>

                                                                      <div className="text-xs text-gray-500 mt-2">
                                                                           ID: {testimonialId}
                                                                      </div>
                                                                 </div>
                                                            ) : (
                                                                 <div className="space-y-2">
                                                                      <div className="text-xs text-red-500">
                                                                           ⚠️ Témoignage non trouvé dans la base de données
                                                                      </div>
                                                                      <div className="text-xs text-gray-500">
                                                                           ID: {testimonialId}
                                                                      </div>
                                                                 </div>
                                                            )}
                                                       </Card>
                                                  );
                                             })
                                        )}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="videoTestimonials" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Témoignages Vidéo</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.videoTestimonials?.headline || ''}
                                                  onChange={(e) => updateField('videoTestimonials.headline', e.target.value)}
                                                  placeholder="Titre de la section témoignages vidéo"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.videoTestimonials?.description || ''}
                                                  onChange={(e) => updateField('videoTestimonials.description', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Sous-description</Label>
                                        <Input
                                             value={homeData.videoTestimonials?.subdescription || ''}
                                             onChange={(e) => updateField('videoTestimonials.subdescription', e.target.value)}
                                             placeholder="Sous-description"
                                        />
                                   </div>

                                   {/* Video Testimonials */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Témoignages vidéo</Label>
                                             <Button
                                                  onClick={() => addArrayItem('videoTestimonials.videos', {
                                                       id: `video-${Date.now()}`,
                                                       company: 'Nouvelle entreprise',
                                                       companyLogo: 'Nouveau logo',
                                                       tagline: 'Découvrez notre client',
                                                       duration: '02:00',
                                                       backgroundColor: 'bg-gray-800',
                                                       textColor: 'text-white',
                                                       videoUrl: '',
                                                       thumbnailUrl: ''
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter un témoignage vidéo
                                             </Button>
                                        </div>

                                        {homeData.videoTestimonials?.videos?.map((video, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Témoignage vidéo {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('videoTestimonials.videos', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <Label>Entreprise</Label>
                                                            <Input
                                                                 value={video.company}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'company', e.target.value)}
                                                                 placeholder="Nom de l'entreprise"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Logo de l'entreprise</Label>
                                                            <Input
                                                                 value={video.companyLogo}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'companyLogo', e.target.value)}
                                                                 placeholder="Logo de l'entreprise"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                       <div>
                                                            <Label>Tagline</Label>
                                                            <Input
                                                                 value={video.tagline || ''}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'tagline', e.target.value)}
                                                                 placeholder="Tagline"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Durée</Label>
                                                            <Input
                                                                 value={video.duration}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'duration', e.target.value)}
                                                                 placeholder="Durée (ex: 02:00)"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                       <div>
                                                            <Label>Couleur de fond</Label>
                                                            <Input
                                                                 value={video.backgroundColor}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'backgroundColor', e.target.value)}
                                                                 placeholder="Couleur de fond (ex: bg-gray-800)"
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Couleur du texte</Label>
                                                            <Input
                                                                 value={video.textColor}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'textColor', e.target.value)}
                                                                 placeholder="Couleur du texte (ex: text-white)"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>URL de la vidéo</Label>
                                                       <div className="flex gap-2">
                                                            <Input
                                                                 value={video.videoUrl || ''}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'videoUrl', e.target.value)}
                                                                 placeholder="URL de la vidéo (YouTube, Vimeo, etc.) ou télécharger un fichier"
                                                                 className="flex-1"
                                                            />
                                                            <div className="relative">
                                                                 <input
                                                                      type="file"
                                                                      accept="video/*"
                                                                      onChange={(e) => {
                                                                           const file = e.target.files?.[0];
                                                                           if (file) {
                                                                                handleVideoUploadForTestimonial(file, index);
                                                                           }
                                                                      }}
                                                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                      aria-label="Télécharger une vidéo"
                                                                      title="Télécharger une vidéo"
                                                                 />
                                                                 <Button variant="outline" size="sm" className="h-10">
                                                                      <Upload className="h-4 w-4" />
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                       <p className="text-xs text-gray-500 mt-1">
                                                            Vous pouvez utiliser une URL (YouTube, Vimeo) ou télécharger un fichier vidéo
                                                       </p>

                                                       {/* Thumbnail URL */}
                                                       <div className="mt-4">
                                                            <Label>URL de la miniature (optionnel)</Label>
                                                            <Input
                                                                 value={video.thumbnailUrl || ''}
                                                                 onChange={(e) => updateArrayField('videoTestimonials.videos', index, 'thumbnailUrl', e.target.value)}
                                                                 placeholder="URL de l'image miniature (recommandé: 1280x720)"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                 URL d'une image qui sera affichée avant la lecture de la vidéo
                                                            </p>
                                                       </div>

                                                       {/* Video Preview */}
                                                       {video.videoUrl && (
                                                            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                                                 <Label className="text-sm font-medium mb-2 block">Aperçu de la vidéo</Label>
                                                                 <div className="w-full max-w-md aspect-video bg-black rounded overflow-hidden">
                                                                      {video.videoUrl.startsWith('data:') || video.videoUrl.startsWith('blob:') ? (
                                                                           <video
                                                                                src={video.videoUrl}
                                                                                controls
                                                                                className="w-full h-full object-contain"
                                                                                onError={(e) => {
                                                                                     e.currentTarget.style.display = 'none';
                                                                                     e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                                                }}
                                                                           />
                                                                      ) : (
                                                                           <iframe
                                                                                src={getVideoEmbedUrl(video.videoUrl)}
                                                                                title="Video preview"
                                                                                className="w-full h-full"
                                                                                frameBorder="0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                           />
                                                                      )}
                                                                      <div className="hidden w-full h-full flex items-center justify-center text-white text-sm">
                                                                           Impossible de charger la vidéo
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="final" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>CTA Final</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <Input
                                                  value={homeData.finalCta.headline}
                                                  onChange={(e) => updateField('finalCta.headline', e.target.value)}
                                                  placeholder="Titre du CTA final"
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <Input
                                                  value={homeData.finalCta.description}
                                                  onChange={(e) => updateField('finalCta.description', e.target.value)}
                                                  placeholder="Description"
                                             />
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Bouton principal - Texte</Label>
                                             <Input
                                                  value={homeData.finalCta.ctaPrimary.text}
                                                  onChange={(e) => updateField('finalCta.ctaPrimary.text', e.target.value)}
                                                  placeholder="Texte du bouton principal"
                                             />
                                        </div>
                                        <div>
                                             <Label>Bouton secondaire - Texte</Label>
                                             <Input
                                                  value={homeData.finalCta.ctaSecondary.text}
                                                  onChange={(e) => updateField('finalCta.ctaSecondary.text', e.target.value)}
                                                  placeholder="Texte du bouton secondaire"
                                             />
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>
               </Tabs>
          </div>
     );
} 