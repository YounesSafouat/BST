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
import { Save, Eye, ArrowLeft, Plus, Trash2, X, GripVertical, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/home/Loader";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/dashboard/ImageUpload";
import VideoUpload from "@/components/dashboard/VideoUpload";

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
          expertiseBadgeUrl?: string; // URL of the expertise badge image
          carousel?: {
               companies: Array<{
                    name: string;
                    logo: string;
                    url?: string;
                    regions?: string[]; // Array of regions: ['france', 'morocco', 'international']
               }>;
               regionalCompanies?: {
                    france: Array<{
                         name: string;
                         logo: string;
                         url?: string;
                    }>;
                    morocco: Array<{
                         name: string;
                         logo: string;
                         url?: string;
                    }>;
                    other: Array<{
                         name: string;
                         logo: string;
                         url?: string;
                    }>;
               };
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
          services: Array<{
               icon: string;
               title: string;
               description: string;
               image: string;
               buttonText?: string;
          }>;
          defaultButtonText?: string;
     };
     certification: {
          headline: string;
          subheadline: string;
          description: string;
          partnerTitle: string;
          partnerDescription: string;
          features: Array<{
               title: string;
               description: string;
               icon: string;
          }>;
          certificationImages?: Array<{
               src: string;
               alt: string;
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
          imageOtherCountries?: string;
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
     selectedClients?: Array<{
          id: string;
          order: number;
     }>; // Array of client IDs with ordering for video testimonials
     videoTestimonials?: {
          headline: string;
          subtitle: string;
          showStars: boolean;
          starCount: number;
          ctaButton: {
               text: string;
               url: string;
          };
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
     const [availableClients, setAvailableClients] = useState<any[]>([]);
     const [selectedRegion, setSelectedRegion] = useState<string>('all');
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const router = useRouter();

     useEffect(() => {
          fetchHomeData();
          fetchAvailableTestimonials();
          fetchAvailableClients();
     }, []);

     const fetchHomeData = async () => {
          try {
               const response = await fetch('/api/content?type=home-page');
               if (response.ok) {
                    const data = await response.json();

                    // Find the home-page content specifically
                    const homePageContent = data.find(item => item.type === 'home-page');
                    if (!homePageContent || !homePageContent.content) {
                         console.error('No home-page content found');
                         return;
                    }

                    const contentData = homePageContent.content;

                    // Initialize carousel data if it doesn't exist
                    if (!contentData.hero.carousel) {
                         contentData.hero.carousel = {
                              companies: [],
                              regionalCompanies: {
                                   france: [],
                                   morocco: [],
                                   other: []
                              },
                              speed: 20
                         };
                    }

                    // Initialize regionalCompanies if it doesn't exist
                    if (!contentData.hero.carousel.regionalCompanies) {
                         contentData.hero.carousel.regionalCompanies = {
                              france: [],
                              morocco: [],
                              other: []
                         };
                    }

                    // Initialize services data if it doesn't exist
                    if (!contentData.services) {
                         contentData.services = {
                              headline: "NOS SERVICES",
                              subheadline: "De l'audit à la mise en production, nous vous accompagnons à chaque étape",
                              defaultButtonText: "Discutons-en",
                              services: [
                                   {
                                        icon: "Settings",
                                        title: "Implémentation",
                                        description: "Nous déployons Odoo sur mesure en l'adaptant à vos processus. Migration de données sécurisée et mise en production sans friction.",
                                        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80&fit=crop"
                                   },
                                   {
                                        icon: "Link2",
                                        title: "Intégration",
                                        description: "Connectez Odoo à votre écosystème existant (CRM, e-commerce, outils métier) pour une synchronisation temps réel et des processus unifiés.",
                                        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&fit=crop"
                                   },
                                   {
                                        icon: "GraduationCap",
                                        title: "Formation",
                                        description: "Nous formons vos équipes via des sessions personnalisées pour garantir une adoption rapide et une maîtrise parfaite de votre nouvel environnement Odoo.",
                                        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&fit=crop"
                                   },
                                   {
                                        icon: "Headphones",
                                        title: "Support & Maintenance",
                                        description: "Bénéficiez d'une assistance technique réactive et d'une maintenance préventive pour garantir la performance et la pérennité de votre système.",
                                        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&fit=crop"
                                   },
                                   {
                                        icon: "SearchCheck",
                                        title: "Audit & Optimisation",
                                        description: "Nos experts analysent vos processus actuels pour identifier les goulots d'étranglement et définir un plan d'action pour maximiser votre ROI.",
                                        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop"
                                   },
                                   {
                                        icon: "Lightbulb",
                                        title: "Conseil Stratégique",
                                        description: "Nous vous accompagnons dans la définition de votre feuille de route digitale pour faire de la technologie un véritable levier de croissance.",
                                        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&fit=crop"
                                   }
                              ]
                         };
                    }

                    // Initialize certification data if it doesn't exist
                    if (!contentData.certification) {
                         contentData.certification = {
                              headline: "Certifications Odoo",
                              subheadline: "EXPERTISE RECONNUE",
                              description: "Notre expertise certifiée sur les dernières versions d'Odoo vous garantit des implémentations de qualité professionnelle.",
                              partnerTitle: "Odoo Silver Partner",
                              partnerDescription: "Certification officielle pour l'implémentation et la formation Odoo. Notre statut de partenaire Silver confirme notre expertise reconnue et notre engagement envers l'excellence.",
                              features: [
                                   {
                                        title: "Certification officielle",
                                        description: "Reconnue par Odoo SA",
                                        icon: "CheckCircle"
                                   },
                                   {
                                        title: "Équipe certifiée",
                                        description: "Consultants experts",
                                        icon: "Users"
                                   },
                                   {
                                        title: "Support premium",
                                        description: "Accès prioritaire",
                                        icon: "Shield"
                                   },
                                   {
                                        title: "Garantie qualité",
                                        description: "Standards Odoo",
                                        icon: "Award"
                                   }
                              ],
                              certificationImages: [
                                   {
                                        src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762787679/bst-migration/gr2anwuyuvxj7naqp0wo.png",
                                        alt: "Odoo Certification Certificate"
                                   },
                                   {
                                        src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762788380/blog_205_20_1_f45upp.png",
                                        alt: "Odoo Silver Partner Badge"
                                   },
                                   {
                                        src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762787681/bst-migration/zrrfchxk7gw9fmxkny76.png",
                                        alt: "Odoo Official Partner"
                                   }
                              ]
                         };
                    }

                    // Initialize certificationImages if it doesn't exist
                    if (!contentData.certification?.certificationImages || contentData.certification.certificationImages.length === 0) {
                         contentData.certification.certificationImages = [
                              {
                                   src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762787679/bst-migration/gr2anwuyuvxj7naqp0wo.png",
                                   alt: "Odoo Certification Certificate"
                              },
                              {
                                   src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762788380/blog_205_20_1_f45upp.png",
                                   alt: "Odoo Silver Partner Badge"
                              },
                              {
                                   src: "https://res.cloudinary.com/dwob2hfin/image/upload/v1762787681/bst-migration/zrrfchxk7gw9fmxkny76.png",
                                   alt: "Odoo Official Partner"
                              }
                         ];
                    }

                    // Initialize FAQ data if it doesn't exist
                    if (!contentData.faq) {
                         contentData.faq = {
                              headline: "QUESTIONS FRÉQUENTES",
                              description: "Tout savoir sur Odoo",
                              subdescription: "Découvrez les réponses aux questions les plus courantes sur notre accompagnement Odoo",
                              items: [
                                   {
                                        question: "Odoo est-il adapté à mon secteur d'activité ?",
                                        answer: "Absolument ! Odoo propose une architecture modulaire ultra-flexible qui s'adapte parfaitement à tous les secteurs d'activité : industrie, services, BTP, distribution, éducation, santé, et bien d'autres. Chez BlackswanTechnology, nous créons des solutions verticales sur mesure qui intègrent les spécificités métier de votre secteur pour maximiser votre productivité."
                                   },
                                   {
                                        question: "Comment se déroule un projet d'intégration Odoo avec BlackswanTechnology ?",
                                        answer: "Chez BlackswanTechnology, nous suivons une méthodologie éprouvée en 4 phases : cadrage détaillé de vos besoins, déploiement progressif, formation personnalisée de vos équipes, et support continu. Chaque étape est supervisée par nos experts certifiés Odoo pour garantir une mise en œuvre sans accroc et un ROI optimal."
                                   },
                                   {
                                        question: "Quels sont les délais moyens d'un projet d'intégration ?",
                                        answer: "Nos délais varient selon la complexité : pour un projet standard avec une équipe de taille humaine, comptez 6 à 16 semaines. Pour des projets plus complexes multi-services, les délais s'étendent de 12 à 22 semaines. Notre approche agile vous permet de voir des résultats concrets dès les premières semaines avec des livrables à chaque sprint."
                                   },
                                   {
                                        question: "Puis-je héberger Odoo sur le cloud ?",
                                        answer: "Bien sûr ! BlackswanTechnology propose un hébergement cloud managé de haute qualité via notre plateforme dédiée. Nous garantissons une haute disponibilité, des sauvegardes quotidiennes automatisées, et un monitoring 24/7 pour assurer la continuité de vos activités."
                                   },
                                   {
                                        question: "Proposez-vous une formation à l'utilisation d'Odoo ?",
                                        answer: "Oui, la formation est un élément clé de notre accompagnement ! Chaque projet inclut des sessions de formation personnalisées adaptées à vos processus métier. Nos experts BlackswanTechnology accompagnent vos équipes pour une prise en main rapide et efficace, garantissant l'autonomie de vos utilisateurs."
                                   },
                                   {
                                        question: "Comment se passe le support après la mise en production ?",
                                        answer: "Chez BlackswanTechnology, votre succès ne s'arrête pas à la mise en production ! Nous assurons un support technique et fonctionnel complet avec des SLA définis et respectés. Vous bénéficiez d'un accompagnement continu - vous n'êtes jamais seul, même après la mise en ligne de votre solution Odoo."
                                   }
                              ]
                         };
                    }

                    // Initialize with default companies if no companies exist
                    if (!contentData.hero.carousel?.companies || contentData.hero.carousel.companies.length === 0) {
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
                         contentData.hero.carousel.companies = defaultCompanies;
                    }

                    // Migrate selectedClients from old format (string[]) to new format (Array<{id: string, order: number}>)
                    if (contentData.selectedClients && Array.isArray(contentData.selectedClients)) {
                         const firstItem = contentData.selectedClients[0];
                         if (typeof firstItem === 'string') {
                              // Old format: convert to new format
                              contentData.selectedClients = contentData.selectedClients.map((id: string, index: number) => ({
                                   id: id,
                                   order: index
                              }));
                              console.log('Migrated selectedClients to new format');
                         }
                    }

                    setHomeData(contentData);
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
               const response = await fetch('/api/testimonials');
               if (response.ok) {
                    const data = await response.json();
                    // Map the testimonials data to match the expected format
                    const mapped = data.map((item: any) => ({
                         _id: item._id,
                         author: item.author || '',
                         role: item.role || '',
                         text: item.text || '',
                         photo: item.photo || '',
                         company: '',
                         result: '',
                    }));
                    setAvailableTestimonials(mapped);
               } else {
                    console.error('Failed to fetch available testimonials');
               }
          } catch (error) {
               console.error('Error fetching available testimonials:', error);
          }
     };

     const fetchAvailableClients = async () => {
          try {
               const response = await fetch('/api/cas-client?published=true');
               if (response.ok) {
                    const data = await response.json();
                    setAvailableClients(data.cases || []);
               } else {
                    console.error('Failed to fetch available clients');
               }
          } catch (error) {
               console.error('Error fetching available clients:', error);
          }
     };

     // Filter clients by region for display
     const getFilteredClientsByRegion = (clients: any[], region: string) => {
          if (!region) return clients;
          return clients.filter(client => {
               if (!client.targetRegions || client.targetRegions.length === 0) {
                    return true; // Show if no region specified
               }
               const normalizedRegion = region.toLowerCase();
               const normalizedTargetRegions = client.targetRegions.map((r: string) => r.toLowerCase());
               return normalizedTargetRegions.includes('all') || normalizedTargetRegions.includes(normalizedRegion);
          });
     };

     const saveHomeData = async () => {
          if (!homeData) return;

          setSaving(true);
          try {
               // Wrap the data in the content field as expected by the API
               const requestBody = {
                    content: homeData
               };

               const apiUrl = '/api/content?type=home-page';
               console.log('Sending request to:', apiUrl);
               console.log('Request body:', requestBody);

               // Try with absolute URL to see if that helps
               const fullUrl = window.location.origin + '/api/content';
               console.log('Full URL:', fullUrl);

               const response = await fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         action: 'update',
                         type: 'home-page',
                         ...requestBody
                    }),
               });

               if (response.ok) {
                    toast({
                         title: "Succès",
                         description: "Données sauvegardées avec succès",
                    });
               } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API Error Response:', errorData);
                    throw new Error(`Failed to save: ${errorData.error || 'Unknown error'}`);
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
               if (current[keys[i]] === undefined || current[keys[i]] === null) {
                    current[keys[i]] = {};
               }
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

          // Navigate to the parent object
          for (let i = 0; i < keys.length - 1; i++) {
               if (!current[keys[i]]) {
                    return; // Path doesn't exist, nothing to update
               }
               current = current[keys[i]];
          }

          // Ensure the array exists and update the field
          const lastKey = keys[keys.length - 1];
          if (current[lastKey] && Array.isArray(current[lastKey]) && current[lastKey][index]) {
               current[lastKey][index] = { ...current[lastKey][index], [field]: value };
               setHomeData(newData);
          }
     };

     const addArrayItem = (path: string, defaultItem: any) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          // Navigate to the parent object
          for (let i = 0; i < keys.length - 1; i++) {
               if (!current[keys[i]]) {
                    current[keys[i]] = {};
               }
               current = current[keys[i]];
          }

          // Ensure the array exists
          const lastKey = keys[keys.length - 1];
          if (!current[lastKey]) {
               current[lastKey] = [];
          }

          current[lastKey].push(defaultItem);
          setHomeData(newData);
     };

     const removeArrayItem = (path: string, index: number) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          // Navigate to the parent object
          for (let i = 0; i < keys.length - 1; i++) {
               if (!current[keys[i]]) {
                    return; // Path doesn't exist, nothing to remove
               }
               current = current[keys[i]];
          }

          // Ensure the array exists and remove the item
          const lastKey = keys[keys.length - 1];
          if (current[lastKey] && Array.isArray(current[lastKey])) {
               current[lastKey].splice(index, 1);
               setHomeData(newData);
          }
     };

     const moveArrayItem = (path: string, fromIndex: number, toIndex: number) => {
          if (!homeData) return;

          const keys = path.split('.');
          const newData = { ...homeData };
          let current: any = newData;

          // Navigate to the parent object
          for (let i = 0; i < keys.length - 1; i++) {
               if (!current[keys[i]]) {
                    return; // Path doesn't exist
               }
               current = current[keys[i]];
          }

          // Ensure the array exists and move the item
          const lastKey = keys[keys.length - 1];
          if (current[lastKey] && Array.isArray(current[lastKey])) {
               const array = current[lastKey];
               if (toIndex >= 0 && toIndex < array.length) {
                    const [movedItem] = array.splice(fromIndex, 1);
                    array.splice(toIndex, 0, movedItem);
                    setHomeData(newData);
               }
          }
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
               const formData = new FormData();
               formData.append('file', file);
               const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
               });
               if (response.ok) {
                    const data = await response.json();
                    if (homeData && homeData.hero.carousel?.companies) {
                         const companies = [...homeData.hero.carousel.companies];
                         companies[companyIndex] = { ...companies[companyIndex], logo: data.url };

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
                    toast({
                         title: "Succès",
                         description: "Image téléchargée avec succès",
                    });
               } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
               }
          } catch (error: any) {
               console.error('Error uploading image:', error);
               toast({
                    title: "Erreur",
                    description: error.message || "Erreur lors du téléchargement de l'image",
                    variant: "destructive",
               });
          }
     };

     const handleVideoUpload = async (file: File) => {
          try {
               const formData = new FormData();
               formData.append('file', file);
               const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
               });
               if (response.ok) {
                    const data = await response.json();
                    if (homeData) {
                         setHomeData({
                              ...homeData,
                              hero: {
                                   ...homeData.hero,
                                   videoUrl: data.url
                              }
                         });
                    }
                    toast({
                         title: "Succès",
                         description: "Vidéo téléchargée avec succès",
                    });
               } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
               }
          } catch (error: any) {
               console.error('Error uploading video:', error);
               toast({
                    title: "Erreur",
                    description: error.message || "Erreur lors du téléchargement de la vidéo",
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
               const formData = new FormData();
               formData.append('file', file);
               const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
               });
               if (response.ok) {
                    const data = await response.json();
                    updateArrayField('videoTestimonials.videos', videoIndex, 'videoUrl', data.url);
                    toast({
                         title: "Succès",
                         description: "Vidéo téléchargée avec succès",
                    });
               } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
               }
          } catch (error: any) {
               console.error('Error uploading video:', error);
               toast({
                    title: "Erreur",
                    description: error.message || "Impossible de télécharger la vidéo",
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
                    <TabsList className="grid w-full grid-cols-10">
                         <TabsTrigger value="hero">Hero</TabsTrigger>
                         <TabsTrigger value="platform">Plateforme</TabsTrigger>
                         <TabsTrigger value="services">Services</TabsTrigger>
                         <TabsTrigger value="certification">Certification</TabsTrigger>
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
                                             <RichTextEditor
                                                  value={homeData.hero.headline}
                                                  onChange={(value) => updateField('hero.headline', value)}
                                                  placeholder="Titre principal"
                                                  height={100}
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <RichTextEditor
                                                  value={homeData.hero.subheadline}
                                                  onChange={(value) => updateField('hero.subheadline', value)}
                                                  placeholder="Sous-titre"
                                                  height={100}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <RichTextEditor
                                             value={homeData.hero.description}
                                             onChange={(value) => updateField('hero.description', value)}
                                             placeholder="Description"
                                             height={120}
                                        />
                                   </div>
                                   <div>
                                        <VideoUpload
                                             value={homeData.hero.videoUrl || ''}
                                             onChange={(url) => updateField('hero.videoUrl', url)}
                                             label="Vidéo"
                                             placeholder="URL de la vidéo (YouTube, Vimeo) ou télécharger"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Vous pouvez utiliser une URL (YouTube, Vimeo) ou télécharger un fichier vidéo
                                        </p>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Bouton principal - Texte</Label>
                                             <RichTextEditor
                                                  value={homeData.hero.ctaPrimary.text}
                                                  onChange={(value) => updateField('hero.ctaPrimary.text', value)}
                                                  placeholder="Texte du bouton principal"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Bouton secondaire - Texte</Label>
                                             <RichTextEditor
                                                  value={homeData.hero.ctaSecondary.text}
                                                  onChange={(value) => updateField('hero.ctaSecondary.text', value)}
                                                  placeholder="Texte du bouton secondaire"
                                                  height={80}
                                             />
                                        </div>
                                   </div>

                                   {/* Expertise Badge */}
                                   <div>
                                        <ImageUpload
                                             value={homeData.hero.expertiseBadgeUrl || ''}
                                             onChange={(url) => updateField('hero.expertiseBadgeUrl', url)}
                                             label="URL du badge d'expertise"
                                             placeholder="https://example.com/badge.png ou télécharger"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Remplace le texte "3 ans d'expertise" par une image. Entrez l'URL de l'image du badge ou téléchargez une image.
                                        </p>
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
                                                                 { name: 'Nouvelle entreprise', logo: '/ref/placeholder.svg', url: '', regions: ['france', 'morocco', 'international'] },
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
                                             <RichTextEditor
                                                  value={homeData.hero.carousel?.text || ''}
                                                  onChange={(value) => updateField('hero.carousel.text', value)}
                                                  placeholder="Ex: +112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne."
                                                  height={100}
                                             />
                                             <p className="text-xs text-gray-500 mt-1">
                                                  Ce texte apparaîtra au-dessus du carousel des logos d'entreprises
                                             </p>
                                        </div>

                                        {/* Companies Management */}
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between">
                                                  <Label className="text-lg font-semibold">Entreprises</Label>
                                                  <div className="text-sm text-gray-500">
                                                       Chaque entreprise peut être visible dans différentes régions
                                                  </div>
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
                                                            <ImageUpload
                                                                 value={company.logo}
                                                                 onChange={(url) => {
                                                                      const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                      const updatedCompanies = [...currentCompanies];
                                                                      updatedCompanies[index] = { ...updatedCompanies[index], logo: url };
                                                                      updateField('hero.carousel.companies', updatedCompanies);
                                                                 }}
                                                                 label="Logo"
                                                                 placeholder="URL du logo ou télécharger"
                                                                 showPreview={false}
                                                            />
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

                                                  {/* Region Selection */}
                                                  <div className="mt-4">
                                                       <Label className="text-sm font-medium">Régions d'affichage</Label>
                                                       <p className="text-xs text-gray-500 mb-3">Sélectionnez les régions où cette entreprise doit apparaître</p>
                                                       <div className="flex gap-4">
                                                            <div className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      id={`france-${index}`}
                                                                      checked={company.regions?.includes('france') || false}
                                                                      onChange={(e) => {
                                                                           const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                           const updatedCompanies = [...currentCompanies];
                                                                           const currentRegions = updatedCompanies[index].regions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'france']
                                                                                : currentRegions.filter(r => r !== 'france');
                                                                           updatedCompanies[index] = { ...updatedCompanies[index], regions: newRegions };
                                                                           updateField('hero.carousel.companies', updatedCompanies);
                                                                      }}
                                                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                 />
                                                                 <Label htmlFor={`france-${index}`} className="text-sm flex items-center gap-1">
                                                                      🇫🇷 France
                                                                 </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      id={`morocco-${index}`}
                                                                      checked={company.regions?.includes('morocco') || false}
                                                                      onChange={(e) => {
                                                                           const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                           const updatedCompanies = [...currentCompanies];
                                                                           const currentRegions = updatedCompanies[index].regions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'morocco']
                                                                                : currentRegions.filter(r => r !== 'morocco');
                                                                           updatedCompanies[index] = { ...updatedCompanies[index], regions: newRegions };
                                                                           updateField('hero.carousel.companies', updatedCompanies);
                                                                      }}
                                                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                                 />
                                                                 <Label htmlFor={`morocco-${index}`} className="text-sm flex items-center gap-1">
                                                                      🇲🇦 Maroc
                                                                 </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                 <input
                                                                      type="checkbox"
                                                                      id={`international-${index}`}
                                                                      checked={company.regions?.includes('international') || false}
                                                                      onChange={(e) => {
                                                                           const currentCompanies = homeData.hero.carousel?.companies || [];
                                                                           const updatedCompanies = [...currentCompanies];
                                                                           const currentRegions = updatedCompanies[index].regions || [];
                                                                           const newRegions = e.target.checked
                                                                                ? [...currentRegions, 'international']
                                                                                : currentRegions.filter(r => r !== 'international');
                                                                           updatedCompanies[index] = { ...updatedCompanies[index], regions: newRegions };
                                                                           updateField('hero.carousel.companies', updatedCompanies);
                                                                      }}
                                                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                                                 />
                                                                 <Label htmlFor={`international-${index}`} className="text-sm flex items-center gap-1">
                                                                      🌍 International
                                                                 </Label>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </Card>
                                        ))}

                                        </div>
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
                                             <RichTextEditor
                                                  value={homeData.platformSection.headline}
                                                  onChange={(value) => updateField('platformSection.headline', value)}
                                                  placeholder="Titre de la section plateforme"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <RichTextEditor
                                                  value={homeData.platformSection.subheadline}
                                                  onChange={(value) => updateField('platformSection.subheadline', value)}
                                                  placeholder="Sous-titre"
                                                  height={80}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <RichTextEditor
                                             value={homeData.platformSection.description || ''}
                                             onChange={(value) => updateField('platformSection.description', value)}
                                             placeholder="Description"
                                             height={120}
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
                                                            <RichTextEditor
                                                                 value={app.title}
                                                                 onChange={(value) => updateArrayField('platformSection.apps', index, 'title', value)}
                                                                 placeholder="Titre de l'application"
                                                                 height={80}
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
                                                       <RichTextEditor
                                                            value={app.description}
                                                            onChange={(value) => updateArrayField('platformSection.apps', index, 'description', value)}
                                                            placeholder="Description de l'application"
                                                            height={100}
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

                    <TabsContent value="services" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Services</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <RichTextEditor
                                                  value={homeData.services.headline}
                                                  onChange={(value) => updateField('services.headline', value)}
                                                  placeholder="Titre de la section services"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <RichTextEditor
                                                  value={homeData.services.subheadline}
                                                  onChange={(value) => updateField('services.subheadline', value)}
                                                  placeholder="Sous-titre"
                                                  height={80}
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <Label>Texte par défaut du bouton</Label>
                                        <Input
                                             value={homeData.services.defaultButtonText || ''}
                                             onChange={(e) => updateField('services.defaultButtonText', e.target.value)}
                                             placeholder="Texte par défaut pour tous les boutons (ex: 'Discutons-en')"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Texte utilisé pour les services qui n'ont pas de texte personnalisé
                                        </p>
                                   </div>

                                   {/* Services */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Services</Label>
                                             <Button
                                                  onClick={() => addArrayItem('services.services', {
                                                       icon: 'Settings',
                                                       title: 'Nouveau service',
                                                       description: 'Description du service',
                                                       image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80&fit=crop',
                                                       buttonText: ''
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter un service
                                             </Button>
                                        </div>

                                        {homeData.services.services?.map((service, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <div className="flex items-center gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                 <Button
                                                                      onClick={() => moveArrayItem('services.services', index, index - 1)}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="h-6 w-6 p-0"
                                                                      disabled={index === 0}
                                                                 >
                                                                      <ChevronUp className="w-4 h-4" />
                                                                 </Button>
                                                                 <Button
                                                                      onClick={() => moveArrayItem('services.services', index, index + 1)}
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="h-6 w-6 p-0"
                                                                      disabled={index === homeData.services.services.length - 1}
                                                                 >
                                                                      <ChevronDown className="w-4 h-4" />
                                                                 </Button>
                                                            </div>
                                                            <h4 className="font-semibold">Service {index + 1}</h4>
                                                       </div>
                                                       <Button
                                                            onClick={() => removeArrayItem('services.services', index)}
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
                                                            <Select
                                                                 value={service.icon}
                                                                 onValueChange={(value) => updateArrayField('services.services', index, 'icon', value)}
                                                            >
                                                                 <SelectTrigger>
                                                                      <SelectValue placeholder="Choisir une icône" />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      <SelectItem value="Settings">Settings</SelectItem>
                                                                      <SelectItem value="Link2">Link2</SelectItem>
                                                                      <SelectItem value="GraduationCap">GraduationCap</SelectItem>
                                                                      <SelectItem value="Headphones">Headphones</SelectItem>
                                                                      <SelectItem value="SearchCheck">SearchCheck</SelectItem>
                                                                      <SelectItem value="Lightbulb">Lightbulb</SelectItem>
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                       <div>
                                                            <Label>Titre</Label>
                                                            <RichTextEditor
                                                                 value={service.title}
                                                                 onChange={(value) => updateArrayField('services.services', index, 'title', value)}
                                                                 placeholder="Titre du service"
                                                                 height={80}
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Description</Label>
                                                       <RichTextEditor
                                                            value={service.description}
                                                            onChange={(value) => updateArrayField('services.services', index, 'description', value)}
                                                            placeholder="Description du service"
                                                            height={120}
                                                       />
                                                  </div>

                                                  <div className="mt-4">
                                                       <ImageUpload
                                                            value={service.image}
                                                            onChange={(url) => updateArrayField('services.services', index, 'image', url)}
                                                            label="Image de fond"
                                                            placeholder="URL de l'image de fond ou télécharger"
                                                       />
                                                       <p className="text-xs text-gray-500 mt-1">
                                                            URL de l'image qui sera affichée en arrière-plan du service
                                                       </p>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Texte du bouton (optionnel)</Label>
                                                       <Input
                                                            value={service.buttonText || ''}
                                                            onChange={(e) => updateArrayField('services.services', index, 'buttonText', e.target.value)}
                                                            placeholder="Texte personnalisé du bouton (ex: 'Démarrer un projet')"
                                                       />
                                                       <p className="text-xs text-gray-500 mt-1">
                                                            Laissez vide pour utiliser le texte par défaut
                                                       </p>
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="certification" className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Section Certification Odoo</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre</Label>
                                             <RichTextEditor
                                                  value={homeData.certification.headline}
                                                  onChange={(value) => updateField('certification.headline', value)}
                                                  placeholder="Titre de la section certification"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <RichTextEditor
                                                  value={homeData.certification.subheadline}
                                                  onChange={(value) => updateField('certification.subheadline', value)}
                                                  placeholder="Sous-titre"
                                                  height={80}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <RichTextEditor
                                             value={homeData.certification.description || ''}
                                             onChange={(value) => updateField('certification.description', value)}
                                             placeholder="Description"
                                             height={120}
                                        />
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <Label>Titre du partenariat</Label>
                                             <RichTextEditor
                                                  value={homeData.certification.partnerTitle}
                                                  onChange={(value) => updateField('certification.partnerTitle', value)}
                                                  placeholder="Titre du partenariat"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Description du partenariat</Label>
                                             <RichTextEditor
                                                  value={homeData.certification.partnerDescription || ''}
                                                  onChange={(value) => updateField('certification.partnerDescription', value)}
                                                  placeholder="Description du partenariat"
                                                  height={120}
                                             />
                                        </div>
                                   </div>

                                   {/* Features */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Fonctionnalités</Label>
                                             <Button
                                                  onClick={() => addArrayItem('certification.features', {
                                                       title: 'Nouvelle fonctionnalité',
                                                       description: 'Description de la fonctionnalité',
                                                       icon: 'CheckCircle'
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter une fonctionnalité
                                             </Button>
                                        </div>

                                        {homeData.certification.features?.map((feature, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Fonctionnalité {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('certification.features', index)}
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
                                                            <Select
                                                                 value={feature.icon}
                                                                 onValueChange={(value) => updateArrayField('certification.features', index, 'icon', value)}
                                                            >
                                                                 <SelectTrigger>
                                                                      <SelectValue placeholder="Choisir une icône" />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      <SelectItem value="CheckCircle">CheckCircle</SelectItem>
                                                                      <SelectItem value="Award">Award</SelectItem>
                                                                      <SelectItem value="Shield">Shield</SelectItem>
                                                                      <SelectItem value="Users">Users</SelectItem>
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                       <div>
                                                            <Label>Titre</Label>
                                                            <Input
                                                                 value={feature.title}
                                                                 onChange={(e) => updateArrayField('certification.features', index, 'title', e.target.value)}
                                                                 placeholder="Titre de la fonctionnalité"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="mt-4">
                                                       <Label>Description</Label>
                                                       <Input
                                                            value={feature.description}
                                                            onChange={(e) => updateArrayField('certification.features', index, 'description', e.target.value)}
                                                            placeholder="Description de la fonctionnalité"
                                                       />
                                                  </div>
                                             </Card>
                                        ))}
                                   </div>

                                   {/* Certification Images */}
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <Label className="text-lg font-semibold">Images de Certification</Label>
                                             <Button
                                                  onClick={() => addArrayItem('certification.certificationImages', {
                                                       src: '',
                                                       alt: 'Nouvelle image de certification'
                                                  })}
                                                  size="sm"
                                                  className="flex items-center gap-2"
                                             >
                                                  <Plus className="w-4 h-4" />
                                                  Ajouter une image
                                             </Button>
                                        </div>

                                        {homeData.certification.certificationImages?.map((image, index) => (
                                             <Card key={index} className="p-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h4 className="font-semibold">Image {index + 1}</h4>
                                                       <Button
                                                            onClick={() => removeArrayItem('certification.certificationImages', index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                       <div>
                                                            <ImageUpload
                                                                 value={image.src}
                                                                 onChange={(url) => updateArrayField('certification.certificationImages', index, 'src', url)}
                                                                 label="URL de l'image"
                                                                 placeholder="https://example.com/image.jpg ou télécharger"
                                                                 showPreview={false}
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Texte alternatif</Label>
                                                            <Input
                                                                 value={image.alt}
                                                                 onChange={(e) => updateArrayField('certification.certificationImages', index, 'alt', e.target.value)}
                                                                 placeholder="Description de l'image"
                                                            />
                                                       </div>
                                                  </div>

                                                  {/* Image Preview */}
                                                  {image.src && (
                                                       <div className="mt-4">
                                                            <Label>Aperçu</Label>
                                                            <div className="mt-2 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                                 <img
                                                                      src={image.src}
                                                                      alt={image.alt}
                                                                      className="w-full h-full object-cover"
                                                                      onError={(e) => {
                                                                           const target = e.currentTarget as HTMLImageElement;
                                                                           const errorDiv = target.nextElementSibling as HTMLDivElement;
                                                                           target.style.display = 'none';
                                                                           if (errorDiv) errorDiv.style.display = 'flex';
                                                                      }}
                                                                 />
                                                                 <div className="hidden absolute inset-0 items-center justify-center text-gray-500 text-sm">
                                                                      Image non trouvée
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  )}
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
                                             <RichTextEditor
                                                  value={homeData.pricing.headline}
                                                  onChange={(value) => updateField('pricing.headline', value)}
                                                  placeholder="Titre de la section tarifs"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Sous-titre</Label>
                                             <RichTextEditor
                                                  value={homeData.pricing.subheadline}
                                                  onChange={(value) => updateField('pricing.subheadline', value)}
                                                  placeholder="Sous-titre"
                                                  height={80}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Description</Label>
                                        <RichTextEditor
                                             value={homeData.pricing.description || ''}
                                             onChange={(value) => updateField('pricing.description', value)}
                                             placeholder="Description"
                                             height={120}
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
                                                       <RichTextEditor
                                                            value={plan.description}
                                                            onChange={(value) => updateArrayField('pricing.plans', index, 'description', value)}
                                                            placeholder="Description du plan"
                                                            height={100}
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
                                             <RichTextEditor
                                                  value={homeData.partnership.headline}
                                                  onChange={(value) => updateField('partnership.headline', value)}
                                                  placeholder="Titre de la section agence"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <RichTextEditor
                                                  value={homeData.partnership.subdescription || ''}
                                                  onChange={(value) => updateField('partnership.subdescription', value)}
                                                  placeholder="Description"
                                                  height={80}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Texte d'expertise</Label>
                                        <RichTextEditor
                                             value={homeData.partnership.expertiseText || ''}
                                             onChange={(value) => updateField('partnership.expertiseText', value)}
                                             placeholder="Texte d'expertise"
                                             height={120}
                                        />
                                   </div>

                                   <div>
                                        <ImageUpload
                                             value={homeData.partnership.image || ''}
                                             onChange={(url) => updateField('partnership.image', url)}
                                             label="Image de l'agence"
                                             placeholder="URL de l'image ou /placeholder.svg"
                                        />
                                   </div>

                                   <div>
                                        <ImageUpload
                                             value={homeData.partnership.imageOtherCountries || ''}
                                             onChange={(url) => updateField('partnership.imageOtherCountries', url)}
                                             label="Image autres pays"
                                             placeholder="URL de l'image pour les autres pays"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Cette image sera affichée pour tous les visiteurs sauf ceux du Maroc
                                        </p>
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
                                                       <RichTextEditor
                                                            value={feature.description}
                                                            onChange={(value) => updateArrayField('partnership.features', index, 'description', value)}
                                                            placeholder="Description de la fonctionnalité"
                                                            height={100}
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
                                             <RichTextEditor
                                                  value={homeData.contact?.headline || ''}
                                                  onChange={(value) => updateField('contact.headline', value)}
                                                  placeholder="Titre de la section contact"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <RichTextEditor
                                                  value={homeData.contact?.description || ''}
                                                  onChange={(value) => updateField('contact.description', value)}
                                                  placeholder="Description"
                                                  height={80}
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <Label>Sous-description (texte avec statistiques)</Label>
                                        <RichTextEditor
                                             value={homeData.contact?.subdescription || ''}
                                             onChange={(value) => updateField('contact.subdescription', value)}
                                             placeholder="Ex: +112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne."
                                             height={100}
                                        />
                                   </div>
                                   <div>
                                        <Label>Description du formulaire</Label>
                                        <RichTextEditor
                                             value={homeData.contact?.formDescription || ''}
                                             onChange={(value) => updateField('contact.formDescription', value)}
                                             placeholder="Description du formulaire"
                                             height={120}
                                        />
                                   </div>
                                   <div>
                                        <Label>Titre du formulaire</Label>
                                        <RichTextEditor
                                             value={homeData.contact?.formTitle || ''}
                                             onChange={(value) => updateField('contact.formTitle', value)}
                                             placeholder="Titre du formulaire"
                                             height={80}
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
                                                       <RichTextEditor
                                                            value={benefit.description}
                                                            onChange={(value) => updateArrayField('contact.benefits', index, 'description', value)}
                                                            placeholder="Description de l'avantage"
                                                            height={100}
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

                                        <RichTextEditor
                                             value={homeData.contact?.guarantee || ''}
                                             onChange={(value) => updateField('contact.guarantee', value)}
                                             placeholder="Texte de la garantie"
                                             height={120}
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
                                             <RichTextEditor
                                                  value={homeData.faq?.headline || ''}
                                                  onChange={(value) => updateField('faq.headline', value)}
                                                  placeholder="Titre de la section FAQ"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <RichTextEditor
                                                  value={homeData.faq?.description || ''}
                                                  onChange={(value) => updateField('faq.description', value)}
                                                  placeholder="Description"
                                                  height={80}
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <Label>Sous-description</Label>
                                        <RichTextEditor
                                             value={homeData.faq?.subdescription || ''}
                                             onChange={(value) => updateField('faq.subdescription', value)}
                                             placeholder="Découvrez les réponses aux questions les plus courantes sur notre accompagnement Odoo"
                                             height={80}
                                        />
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
                                                            <RichTextEditor
                                                                 value={item.question}
                                                                 onChange={(value) => updateArrayField('faq.items', index, 'question', value)}
                                                                 placeholder="Question"
                                                                 height={100}
                                                            />
                                                       </div>
                                                       <div>
                                                            <Label>Réponse</Label>
                                                            <RichTextEditor
                                                                 value={item.answer}
                                                                 onChange={(value) => updateArrayField('faq.items', index, 'answer', value)}
                                                                 placeholder="Réponse"
                                                                 height={120}
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
                                             <RichTextEditor
                                                  value={homeData.testimonialsSection.headline}
                                                  onChange={(value) => updateField('testimonialsSection.headline', value)}
                                                  placeholder="Titre de la section témoignages"
                                                  height={80}
                                             />
                                        </div>
                                        <div>
                                             <Label>Description</Label>
                                             <RichTextEditor
                                                  value={homeData.testimonialsSection.description}
                                                  onChange={(value) => updateField('testimonialsSection.description', value)}
                                                  placeholder="Description"
                                                  height={80}
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
                                             homeData.testimonials.map((testimonialItem, index) => {
                                                  // Handle both testimonial IDs (strings) and testimonial objects
                                                  let testimonial;
                                                  let testimonialId;
                                                  
                                                  if (typeof testimonialItem === 'string') {
                                                       // It's an ID
                                                       testimonialId = testimonialItem;
                                                       testimonial = availableTestimonials.find(t => t._id === testimonialId);
                                                  } else if (typeof testimonialItem === 'object' && testimonialItem !== null) {
                                                       // It's a testimonial object
                                                       testimonial = testimonialItem;
                                                       testimonialId = testimonial._id || testimonial.id || `testimonial-${index}`;
                                                  } else {
                                                       // Invalid item, skip it
                                                       return null;
                                                  }
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
                                                                                <div className="text-sm font-medium">{testimonial.author || testimonial.name || 'N/A'}</div>
                                                                           </div>
                                                                           <div>
                                                                                <Label className="text-sm font-medium text-gray-600">Rôle</Label>
                                                                                <div className="text-sm">{testimonial.role || 'N/A'}</div>
                                                                           </div>
                                                                      </div>

                                                                      <div>
                                                                           <Label className="text-sm font-medium text-gray-600">Témoignage</Label>
                                                                           <div className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                                                                                "{testimonial.text || testimonial.quote || 'N/A'}"
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
                                             }).filter(Boolean)
                                        )}
                                   </div>
                              </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="videoTestimonials" className="space-y-6">
                         {/* Section Header Configuration */}
                         <Card>
                              <CardHeader>
                                   <CardTitle>Configuration Section Cas Clients</CardTitle>
                                   <p className="text-sm text-gray-500 mt-2">
                                        Configurez l'en-tête et les paramètres de la section "Nos derniers projets"
                                   </p>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                   {/* Headline */}
                                   <div>
                                        <Label htmlFor="videoTestimonials-headline" className="text-sm font-medium">
                                             Titre principal
                                        </Label>
                                        <RichTextEditor
                                             value={homeData.videoTestimonials?.headline || ''}
                                             onChange={(value) => updateField('videoTestimonials.headline', value)}
                                             placeholder="Ex: Nos derniers projets"
                                             height={100}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Supporte HTML et Tailwind CSS. Ex: &lt;span className="text-[var(--color-main)]"&gt;Nos derniers&lt;/span&gt; projets
                                        </p>
                                   </div>

                                   {/* Subtitle */}
                                   <div>
                                        <Label htmlFor="videoTestimonials-subtitle" className="text-sm font-medium">
                                             Sous-titre
                                        </Label>
                                        <RichTextEditor
                                             value={homeData.videoTestimonials?.subtitle || ''}
                                             onChange={(value) => updateField('videoTestimonials.subtitle', value)}
                                             placeholder="Ex: +80 entreprises accompagnées"
                                             height={100}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                             Supporte HTML et Tailwind CSS
                                        </p>
                                   </div>

                                   {/* Stars Configuration */}
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <Label className="text-sm font-medium mb-2 block">Afficher les étoiles</Label>
                                             <div className="flex items-center space-x-2">
                                                  <input
                                                       type="checkbox"
                                                       id="videoTestimonials-showStars"
                                                       checked={homeData.videoTestimonials?.showStars !== false}
                                                       onChange={(e) => updateField('videoTestimonials.showStars', e.target.checked)}
                                                       className="rounded"
                                                  />
                                                  <Label htmlFor="videoTestimonials-showStars" className="text-sm">
                                                       Afficher les étoiles de notation
                                                  </Label>
                                             </div>
                                        </div>

                                        <div>
                                             <Label htmlFor="videoTestimonials-starCount" className="text-sm font-medium">
                                                  Nombre d'étoiles
                                             </Label>
                                             <Input
                                                  id="videoTestimonials-starCount"
                                                  type="number"
                                                  min="1"
                                                  max="10"
                                                  value={homeData.videoTestimonials?.starCount || 5}
                                                  onChange={(e) => updateField('videoTestimonials.starCount', parseInt(e.target.value))}
                                                  className="mt-1"
                                             />
                                        </div>
                                   </div>

                                   {/* CTA Button */}
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <Label htmlFor="videoTestimonials-ctaText" className="text-sm font-medium">
                                                  Texte du bouton CTA
                                             </Label>
                                             <RichTextEditor
                                                  value={homeData.videoTestimonials?.ctaButton?.text || ''}
                                                  onChange={(value) => updateField('videoTestimonials.ctaButton.text', value)}
                                                  placeholder="Ex: Voir tous nos projets"
                                                  height={100}
                                             />
                                        </div>

                                        <div>
                                             <Label htmlFor="videoTestimonials-ctaUrl" className="text-sm font-medium">
                                                  URL du bouton CTA
                                             </Label>
                                             <Input
                                                  id="videoTestimonials-ctaUrl"
                                                  value={homeData.videoTestimonials?.ctaButton?.url || ''}
                                                  onChange={(e) => updateField('videoTestimonials.ctaButton.url', e.target.value)}
                                                  placeholder="Ex: /cas-client"
                                                  className="mt-1"
                                             />
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Client Selection */}
                         <Card>
                              <CardHeader>
                                   <CardTitle>Sélection des Cas Clients</CardTitle>
                                   <p className="text-sm text-gray-500 mt-2">
                                        Sélectionnez les cas clients à afficher dans la section témoignages vidéo. 
                                        Les cas clients sont gérés dans la section "Cas Clients" du dashboard.
                                        Les cas clients sélectionnés seront automatiquement filtrés par région IP sur le site.
                                   </p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div>
                                        <Label className="text-lg font-semibold mb-4 block">Cas clients à afficher</Label>
                                        <p className="text-sm text-gray-500 mb-4">
                                             Cochez les cas clients que vous souhaitez afficher. Si aucun n'est sélectionné, tous les cas clients publiés seront affichés.
                                        </p>
                                        
                                        {/* Region Filter */}
                                        <div className="mb-6">
                                             <Label className="text-sm font-medium mb-2 block">Filtrer par région</Label>
                                             <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                                  <SelectTrigger className="w-full max-w-xs">
                                                       <SelectValue placeholder="Sélectionner une région" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="all">Toutes les régions</SelectItem>
                                                       <SelectItem value="france">🇫🇷 France</SelectItem>
                                                       <SelectItem value="morocco">🇲🇦 Maroc</SelectItem>
                                                       <SelectItem value="international">🌍 International</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                             <p className="text-xs text-gray-500 mt-1">
                                                  Affiche les cas clients selon leur ciblage régional
                                             </p>
                                        </div>
                                        
                                        {availableClients.length === 0 ? (
                                             <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                  <p className="text-gray-500">Aucun cas client disponible</p>
                                                  <Button 
                                                       variant="link" 
                                                       onClick={() => router.push('/dashboard/clients')}
                                                       className="mt-2"
                                                  >
                                                       Créer un cas client
                                                  </Button>
                                             </div>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-4 border rounded-lg">
                                                  {getFilteredClientsByRegion(availableClients, selectedRegion).map((client) => {
                                                       const currentSelected = homeData.selectedClients || [];
                                                       const selectedClient = currentSelected.find(sc => sc.id === client._id);
                                                       const isSelected = !!selectedClient;
                                                       const order = selectedClient?.order || 0;
                                                       
                                                       return (
                                                            <div 
                                                                 key={client._id} 
                                                                 className={`flex items-start space-x-3 p-4 border rounded-lg transition-all ${
                                                                      isSelected 
                                                                           ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5' 
                                                                           : 'border-gray-200 hover:border-gray-300'
                                                                 }`}
                                                            >
                                                                 <input
                                                                      type="checkbox"
                                                                      checked={isSelected}
                                                                      onChange={(e) => {
                                                                           const currentSelected = homeData.selectedClients || [];
                                                                           let newSelected: Array<{id: string; order: number}>;
                                                                           
                                                                           if (e.target.checked) {
                                                                                const maxOrder = Math.max(0, ...currentSelected.map(sc => sc.order));
                                                                                newSelected = [...currentSelected, { id: client._id, order: maxOrder + 1 }];
                                                                           } else {
                                                                                newSelected = currentSelected.filter(sc => sc.id !== client._id);
                                                                           }
                                                                           
                                                                           updateField('selectedClients', newSelected);
                                                                      }}
                                                                      className="mt-1"
                                                                 />
                                                                 <div className="flex-1 min-w-0">
                                                                      <div className="font-semibold text-sm truncate">{client.name}</div>
                                                                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{client.summary}</div>
                                                                      {client.company?.sector && (
                                                                           <div className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                                                {client.company.sector === 'Autre' ? client.company.customSector : client.company.sector}
                                                                           </div>
                                                                      )}
                                                                      {client.targetRegions && client.targetRegions.length > 0 && (
                                                                           <div className="text-xs text-gray-400 mt-1">
                                                                                Régions: {client.targetRegions.join(', ')}
                                                                           </div>
                                                                      )}
                                                                 </div>
                                                            </div>
                                                       );
                                                  })}
                                             </div>
                                        )}
                                   </div>
                                   
                                   {/* Selected Clients Ordering */}
                                   {homeData.selectedClients && homeData.selectedClients.length > 0 && (
                                        <div className="mt-6">
                                             <Label className="text-lg font-semibold mb-4 block">Ordre d'affichage des témoignages</Label>
                                             <div className="space-y-2">
                                                  {homeData.selectedClients
                                                       .sort((a, b) => a.order - b.order)
                                                       .map((selectedClient, index) => {
                                                            const client = availableClients.find(c => c._id === selectedClient.id);
                                                            if (!client) return null;
                                                            
                                                            return (
                                                                 <div 
                                                                      key={selectedClient.id}
                                                                      className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                                                                 >
                                                                      <div className="flex items-center space-x-3">
                                                                           <div className="w-6 h-6 bg-[var(--color-secondary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                                {index + 1}
                                                                           </div>
                                                                           <div>
                                                                                <div className="font-semibold text-sm">{client.name}</div>
                                                                                <div className="text-xs text-gray-500">{client.company?.name}</div>
                                                                           </div>
                                                                      </div>
                                                                      <div className="flex items-center space-x-2">
                                                                           <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                     if (index > 0 && homeData.selectedClients) {
                                                                                          const newSelected = [...homeData.selectedClients];
                                                                                          [newSelected[index], newSelected[index - 1]] = [newSelected[index - 1], newSelected[index]];
                                                                                          // Update order numbers
                                                                                          newSelected.forEach((sc, i) => {
                                                                                               if (typeof sc === 'object' && sc !== null) {
                                                                                                    sc.order = i;
                                                                                               }
                                                                                          });
                                                                                          updateField('selectedClients', newSelected);
                                                                                     }
                                                                                }}
                                                                                disabled={index === 0}
                                                                                className="p-1 h-8 w-8"
                                                                           >
                                                                                ↑
                                                                           </Button>
                                                                           <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                     if (index < (homeData.selectedClients?.length || 0) - 1 && homeData.selectedClients) {
                                                                                          const newSelected = [...homeData.selectedClients];
                                                                                          [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
                                                                                          // Update order numbers
                                                                                          newSelected.forEach((sc, i) => {
                                                                                               if (typeof sc === 'object' && sc !== null) {
                                                                                                    sc.order = i;
                                                                                               }
                                                                                          });
                                                                                          updateField('selectedClients', newSelected);
                                                                                     }
                                                                                }}
                                                                                disabled={index === (homeData.selectedClients?.length || 0) - 1}
                                                                                className="p-1 h-8 w-8"
                                                                           >
                                                                                ↓
                                                                           </Button>
                                                                      </div>
                                                                 </div>
                                                            );
                                                       })}
                                             </div>
                                        </div>
                                   )}
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