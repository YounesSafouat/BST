/**
 * HubSpot Page
 * 
 * Comprehensive HubSpot CRM and Marketing Automation showcase page.
 * Features BlackSwan Technology's HubSpot Platinum Partner expertise
 * with regional adaptation, advanced animations, and conversion optimization.
 * 
 * @author younes safouat
 * @version 2.0.0 - Enhanced HubSpot Showcase
 * @since 2025
 */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Check,
  CheckCircle,
  Award,
  Users,
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  Star,
  Zap,
  BarChart3,
  Rocket,
  Crown,
  ChevronRight,
  Building2,
  Globe2,
  Lock,
  Lightbulb,
  Play,
  Quote,
  Settings,
  Briefcase,
  Phone,
  Mail,
  MessageCircle,
  Database,
  Workflow,
  PieChart,
  LineChart,
  Heart,
  Sparkles,
  Megaphone,
  ShoppingCart,
  FileText,
  Clock,
  UserCheck,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loader from '@/components/home/Loader';
import PageVisibilityGuard from '@/components/PageVisibilityGuard';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { useButtonAnalytics } from '@/hooks/use-analytics';
import CompaniesCarouselV3 from '@/components/CompaniesCarouselV3';
import CountryCodeSelector from '@/components/CountryCodeSelector';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  result: string;
  avatar: string;
  company?: string;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface HubSpotData {
  type: string;
  title: string;
  hero: {
    headline: string;
    logo: string;
    subheadline: string;
    ctaPrimary: {
      text: string;
      icon: string;
    };
    ctaSecondary: {
      text: string;
      icon: string;
    };
  };
  trustMetrics: Array<{
    number: number;
    suffix: string;
    label: string;
  }>;
  hubspotCapabilities: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  hubCards: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
  partnership: {
    headline: string;
    description: string;
    hubs: string[];
  };
  testimonials: string[];
  finalCta: {
    headline: string;
    description: string;
  };
}

// Enhanced HubSpot services data
const hubspotServices = [
  {
    icon: Target,
    title: "Marketing Automation",
    description: "Créez des campagnes marketing sophistiquées qui génèrent et qualifient vos leads automatiquement",
    features: [
      "Lead scoring automatique",
      "Email marketing personnalisé", 
      "Landing pages optimisées",
      "Workflows d'nurturing"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "CRM & Sales Pipeline",
    description: "Transformez vos prospects en clients avec un pipeline de vente structuré et automatisé",
    features: [
      "Gestion des contacts centralisée",
      "Suivi des opportunités",
      "Automatisation des ventes",
      "Reporting commercial"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: MessageCircle,
    title: "Service Client Excellence",
    description: "Délivrez un service client exceptionnel avec des outils de support intégrés",
    features: [
      "Système de ticketing",
      "Base de connaissances",
      "Live chat intégré",
      "Enquêtes satisfaction"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Database,
    title: "Operations & Intégrations",
    description: "Connectez tous vos outils business pour une vue unifiée de vos données",
    features: [
      "Synchronisation des données",
      "Intégrations personnalisées",
      "Workflows automatisés",
      "Reporting unifié"
    ],
    color: "from-purple-500 to-indigo-500"
  }
];

// HubSpot transformation journey
const transformationSteps = [
  {
    step: "01",
    title: "Audit & Stratégie",
    description: "Analyse complète de vos processus actuels et définition de la roadmap HubSpot",
    icon: FileText,
    duration: "1-2 semaines"
  },
  {
    step: "02", 
    title: "Configuration & Setup",
    description: "Implémentation technique, migration des données et configuration des workflows",
    icon: Settings,
    duration: "2-4 semaines"
  },
  {
    step: "03",
    title: "Formation & Adoption",
    description: "Formation complète de vos équipes et accompagnement à l'adoption",
    icon: Users,
    duration: "1-2 semaines"
  },
  {
    step: "04",
    title: "Optimisation Continue",
    description: "Suivi des performances, optimisations et évolutions selon vos besoins",
    icon: TrendingUp,
    duration: "En continu"
  }
];

// Success metrics
const successMetrics = [
  { metric: "+300%", label: "Génération de leads", icon: Target },
  { metric: "+150%", label: "Taux de conversion", icon: TrendingUp },
  { metric: "-70%", label: "Temps administratif", icon: Clock },
  { metric: "+200%", label: "Visibilité commerciale", icon: BarChart3 }
];

function HubSpotPageContent() {
  const [activeService, setActiveService] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hubspotData, setHubspotData] = useState<HubSpotData | null>(null);
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
  const [homePageData, setHomePageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { region: userRegion, data: locationData } = useGeolocationSingleton();
  const { trackButtonClick } = useButtonAnalytics();

  // Email capture and popup form states
  const [email, setEmail] = useState('');
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    company: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Country and phone formatting states
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦'
  });


  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    fetchHubSpotData();
    fetchTestimonials();
    fetchHomePageData();

    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);


  // Auto-detect country based on geolocation
  useEffect(() => {
    if (locationData?.countryCode) {
      const countryCode = locationData.countryCode;
      const countryName = locationData.country || '';
      
      // Map of country codes to country data
      const countryMap: { [key: string]: Country } = {
        'MA': { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
        'FR': { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
        'US': { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
        'CA': { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
        'BE': { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
        'CH': { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
        'LU': { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
        'TN': { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
        'DZ': { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
        'SN': { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
        'DE': { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
        'IT': { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
        'ES': { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
        'GB': { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
        'NL': { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' },
        'AT': { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹' },
        'SE': { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪' },
        'NO': { code: 'NO', name: 'Norvège', dialCode: '+47', flag: '🇳🇴' },
        'DK': { code: 'DK', name: 'Danemark', dialCode: '+45', flag: '🇩🇰' },
        'FI': { code: 'FI', name: 'Finlande', dialCode: '+358', flag: '🇫🇮' },
        'PL': { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱' },
        'CZ': { code: 'CZ', name: 'République tchèque', dialCode: '+420', flag: '🇨🇿' },
        'SK': { code: 'SK', name: 'Slovaquie', dialCode: '+421', flag: '🇸🇰' },
        'HU': { code: 'HU', name: 'Hongrie', dialCode: '+36', flag: '🇭🇺' },
        'RO': { code: 'RO', name: 'Roumanie', dialCode: '+40', flag: '🇷🇴' },
        'BG': { code: 'BG', name: 'Bulgarie', dialCode: '+359', flag: '🇧🇬' },
        'HR': { code: 'HR', name: 'Croatie', dialCode: '+385', flag: '🇭🇷' },
        'SI': { code: 'SI', name: 'Slovénie', dialCode: '+386', flag: '🇸🇮' },
        'EE': { code: 'EE', name: 'Estonie', dialCode: '+372', flag: '🇪🇪' },
        'LV': { code: 'LV', name: 'Lettonie', dialCode: '+371', flag: '🇱🇻' },
        'LT': { code: 'LT', name: 'Lituanie', dialCode: '+370', flag: '🇱🇹' },
        'GR': { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷' },
        'CY': { code: 'CY', name: 'Chypre', dialCode: '+357', flag: '🇨🇾' },
        'MT': { code: 'MT', name: 'Malte', dialCode: '+356', flag: '🇲🇹' },
        'IE': { code: 'IE', name: 'Irlande', dialCode: '+353', flag: '🇮🇪' },
        'IS': { code: 'IS', name: 'Islande', dialCode: '+354', flag: '🇮🇸' },
        'RU': { code: 'RU', name: 'Russie', dialCode: '+7', flag: '🇷🇺' },
        'UA': { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
        'BY': { code: 'BY', name: 'Biélorussie', dialCode: '+375', flag: '🇧🇾' },
        'MD': { code: 'MD', name: 'Moldavie', dialCode: '+373', flag: '🇲🇩' },
        'GE': { code: 'GE', name: 'Géorgie', dialCode: '+995', flag: '🇬🇪' },
        'AM': { code: 'AM', name: 'Arménie', dialCode: '+374', flag: '🇦🇲' },
        'AZ': { code: 'AZ', name: 'Azerbaïdjan', dialCode: '+994', flag: '🇦🇿' },
        'TR': { code: 'TR', name: 'Turquie', dialCode: '+90', flag: '🇹🇷' },
        'IL': { code: 'IL', name: 'Israël', dialCode: '+972', flag: '🇮🇱' },
        'LB': { code: 'LB', name: 'Liban', dialCode: '+961', flag: '🇱🇧' },
        'SY': { code: 'SY', name: 'Syrie', dialCode: '+963', flag: '🇸🇾' },
        'IQ': { code: 'IQ', name: 'Irak', dialCode: '+964', flag: '🇮🇶' },
        'IR': { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
        'AF': { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
        'PK': { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
        'IN': { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳' },
        'BD': { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
        'LK': { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
        'NP': { code: 'NP', name: 'Népal', dialCode: '+977', flag: '🇳🇵' },
        'BT': { code: 'BT', name: 'Bhoutan', dialCode: '+975', flag: '🇧🇹' },
        'MM': { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
        'TH': { code: 'TH', name: 'Thaïlande', dialCode: '+66', flag: '🇹🇭' },
        'LA': { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
        'KH': { code: 'KH', name: 'Cambodge', dialCode: '+855', flag: '🇰🇭' },
        'VN': { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
        'MY': { code: 'MY', name: 'Malaisie', dialCode: '+60', flag: '🇲🇾' },
        'SG': { code: 'SG', name: 'Singapour', dialCode: '+65', flag: '🇸🇬' },
        'ID': { code: 'ID', name: 'Indonésie', dialCode: '+62', flag: '🇮🇩' },
        'PH': { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
        'TW': { code: 'TW', name: 'Taïwan', dialCode: '+886', flag: '🇹🇼' },
        'HK': { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
        'MO': { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
        'CN': { code: 'CN', name: 'Chine', dialCode: '+86', flag: '🇨🇳' },
        'JP': { code: 'JP', name: 'Japon', dialCode: '+81', flag: '🇯🇵' },
        'KR': { code: 'KR', name: 'Corée du Sud', dialCode: '+82', flag: '🇰🇷' },
        'AU': { code: 'AU', name: 'Australie', dialCode: '+61', flag: '🇦🇺' },
        'NZ': { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64', flag: '🇳🇿' },
        'BR': { code: 'BR', name: 'Brésil', dialCode: '+55', flag: '🇧🇷' },
        'AR': { code: 'AR', name: 'Argentine', dialCode: '+54', flag: '🇦🇷' },
        'CL': { code: 'CL', name: 'Chili', dialCode: '+56', flag: '🇨🇱' },
        'PE': { code: 'PE', name: 'Pérou', dialCode: '+51', flag: '🇵🇪' },
        'CO': { code: 'CO', name: 'Colombie', dialCode: '+57', flag: '🇨🇴' },
        'VE': { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
        'EC': { code: 'EC', name: 'Équateur', dialCode: '+593', flag: '🇪🇨' },
        'BO': { code: 'BO', name: 'Bolivie', dialCode: '+591', flag: '🇧🇴' },
        'PY': { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
        'UY': { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
        'GY': { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
        'SR': { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
        'FK': { code: 'FK', name: 'Îles Malouines', dialCode: '+500', flag: '🇫🇰' }
      };

      const detectedCountry = countryMap[countryCode];
      if (detectedCountry) {
        setSelectedCountry(detectedCountry);
      }
    }
  }, [locationData]);

  const fetchHubSpotData = async () => {
    try {
      const response = await fetch('/api/content?type=hubspot-page');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const hubspotContent = data.find(item => item.type === 'hubspot-page');
          if (hubspotContent && hubspotContent.content) {
            setHubspotData(hubspotContent.content);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching HubSpot data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setAvailableTestimonials(data.map((item: any) => ({
          _id: item._id,
          name: item.author || '',
          role: item.role || '',
          quote: item.text || '',
          result: '',
          avatar: item.photo || '',
          company: ''
        })));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchHomePageData = async () => {
    try {
      const response = await fetch('/api/content?type=home-page');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const homePageContent = data.find(item => item.type === 'home-page');
          if (homePageContent && homePageContent.content) {
            setHomePageData(homePageContent.content);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching home page data:', error);
    }
  };

  const AnimatedCounter = ({ target, suffix, duration = 2500 }: { target: number, suffix: string, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsVisible) return;

      let startTime: number | undefined;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [target, duration, statsVisible]);

    return <span>{count}{suffix}</span>;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Target: <Target className="w-8 h-8" />,
      Users: <Users className="w-8 h-8" />,
      BarChart3: <BarChart3 className="w-8 h-8" />,
      Zap: <Zap className="w-8 h-8" />,
      Settings: <Settings className="w-8 h-8" />,
      Briefcase: <Briefcase className="w-8 h-8" />,
      Calendar: <Calendar className="w-5 h-5" />,
      ArrowRight: <ArrowRight className="w-5 h-5" />,
      Play: <Play className="w-5 h-5" />,
      Check: <Check className="w-3 h-3" />,
      CheckCircle: <CheckCircle className="w-10 h-10" />,
      Quote: <Quote className="w-10 h-10" />
    };
    return iconMap[iconName] || <Target className="w-8 h-8" />;
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, navigate there first
      window.location.href = '/#contact';
    }
    trackButtonClick('hubspot_contact_cta');
  };

  const handleMeetingClick = () => {
    const meetingLink = 'https://meetings-eu1.hubspot.com/yraissi';
    window.open(meetingLink, '_blank');
    trackButtonClick('hubspot_meeting_cta');
  };

  // Email capture and form submission functions
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setFormErrors({ email: 'Veuillez entrer une adresse email valide' });
      return;
    }

    setFormErrors({});
    
    // Step 1: Save email to database as partial lead
    try {
      const response = await fetch('/api/contact/partial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'hubspot-page',
          page: 'hubspot',
          brief_description: 'Lead généré depuis la page HubSpot - Email capturé'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Email saved as partial lead:', result);
        setShowPopupForm(true);
        trackButtonClick('hubspot_email_capture');
      } else {
        console.error('Failed to save email:', await response.json());
        // Still show popup even if partial save fails
        setShowPopupForm(true);
        trackButtonClick('hubspot_email_capture');
      }
    } catch (error) {
      console.error('Error saving email:', error);
      // Still show popup even if partial save fails
      setShowPopupForm(true);
      trackButtonClick('hubspot_email_capture');
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstname.trim()) {
      errors.firstname = 'Le prénom est requis';
    }
    
    if (!formData.lastname.trim()) {
      errors.lastname = 'Le nom est requis';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Le téléphone est requis';
    } else if (!isPhoneValid(formData.phone)) {
      const phoneWithoutCountry = formData.phone.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
      let errorMessage = 'Le numéro de téléphone est invalide';
      
      if (selectedCountry.code === 'MA') {
        if (phoneWithoutCountry.length !== 9) {
          errorMessage = 'Le numéro de téléphone marocain doit contenir exactement 9 chiffres';
        } else {
          errorMessage = 'Le numéro de téléphone ne peut contenir que des chiffres';
        }
      } else {
        if (phoneWithoutCountry.length < 8) {
          errorMessage = 'Le numéro de téléphone doit contenir au moins 8 chiffres';
        } else if (phoneWithoutCountry.length > 15) {
          errorMessage = 'Le numéro de téléphone ne peut pas dépasser 15 chiffres';
        } else {
          errorMessage = 'Le numéro de téléphone ne peut contenir que des chiffres';
        }
      }
      
      errors.phone = errorMessage;
    }
    
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 2: Update the existing partial record with complete data and send to HubSpot
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'formSubmit',
          formData: {
            email: email,
            firstname: formData.firstname.trim(),
            lastname: formData.lastname.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim(),
            company: formData.company.trim(),
            name: `${formData.firstname.trim()} ${formData.lastname.trim()}`.trim()
          },
          additionalData: {
            source: 'hubspot-page',
            page: 'hubspot',
            brief_description: 'Lead généré depuis la page HubSpot - Formulaire complet',
            countryCode: selectedCountry.code,
            countryName: selectedCountry.name,
            city: locationData?.city || '',
            state: ''
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Reset form and close popup
        setFormData({
          firstname: '',
          lastname: '',
          phone: '',
          company: '',
          message: ''
        });
        setEmail('');
        setShowPopupForm(false);
        setFormErrors({});
        
        // Show success message (you can customize this)
        alert('Merci ! Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.');
        
        trackButtonClick('hubspot_form_submit_success');
      } else {
        const errorData = await response.json();
        console.error('Form submission failed:', errorData);
        alert('Une erreur est survenue. Veuillez réessayer.');
        trackButtonClick('hubspot_form_submit_error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      trackButtonClick('hubspot_form_submit_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopupForm = () => {
    setShowPopupForm(false);
    setFormErrors({});
  };

  // Phone formatting and validation functions
  const formatPhoneNumber = (value: string) => {
    let phoneNumber = value;
    if (phoneNumber.startsWith(selectedCountry.dialCode)) {
      phoneNumber = phoneNumber.substring(selectedCountry.dialCode.length);
    }

    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
    }
  };

  const isPhoneValid = (phoneNumber: string) => {
    if (!phoneNumber.trim()) return false;
    
    const phoneWithoutCountry = phoneNumber.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
    
    if (selectedCountry.code === 'MA') {
      return phoneWithoutCountry.length === 9 && /^\d+$/.test(phoneWithoutCountry);
    } else {
      return phoneWithoutCountry.length >= 8 && phoneWithoutCountry.length <= 15 && /^\d+$/.test(phoneWithoutCountry);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Clear phone field when country changes
    setFormData(prev => ({ ...prev, phone: '' }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    const fullNumber = selectedCountry.dialCode + ' ' + formatted;
    
    setFormData(prev => ({ ...prev, phone: fullNumber }));
    
    // Clear error when user starts typing
    if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  // Fallback data if CMS data is not available
  const fallbackData: HubSpotData = {
    type: "hubspot-page",
    title: "HubSpot",
    hero: {
      headline: "HubSpot CRM & Marketing Automation",
      logo: "https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/hubspot.svg",
      subheadline: "En tant que Partenaire Platinum HubSpot, nous transformons votre chaos commercial en machine de croissance automatisée.",
      ctaPrimary: { text: "Planifier une Consultation", icon: "Calendar" },
      ctaSecondary: { text: "Voir Nos Cas d'Étude", icon: "Play" }
    },
    trustMetrics: [
      { number: 100, suffix: "+", label: "Clients HubSpot" },
      { number: 98, suffix: "%", label: "Taux de Réussite" },
      { number: 5, suffix: " Ans", label: "Partenariat HubSpot" },
      { number: 24, suffix: "h", label: "Support Expert" }
    ],
    hubspotCapabilities: [
      { icon: "Target", title: "Marketing Hub", description: "Automatisation marketing complète" },
      { icon: "Users", title: "Sales Hub", description: "CRM et pipeline de vente" },
      { icon: "BarChart3", title: "Service Hub", description: "Support client intégré" },
      { icon: "Zap", title: "Operations Hub", description: "Intégrations et workflows" }
    ],
    hubCards: [],
    partnership: {
      headline: "Partenaire HubSpot Platinum",
      description: "Le plus haut niveau d'expertise HubSpot au Maroc",
      hubs: ["Marketing Hub", "Sales Hub", "Service Hub", "Operations Hub"]
    },
    testimonials: [],
    finalCta: {
      headline: "Prêt à Transformer Votre Business ?",
      description: "Laissez nos experts HubSpot concevoir une solution qui génère de vrais résultats."
    }
  };

  const data = hubspotData || fallbackData;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - DesignBell Inspired */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        
        {/* Enhanced Orange Design Motifs Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large flowing orange shapes */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-orange-400/15 via-orange-500/10 to-yellow-400/5 rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute -bottom-20 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-orange-300/20 via-orange-400/15 to-orange-500/10 rounded-full blur-2xl transform -rotate-45"></div>
          
          {/* Smaller accent shapes */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-orange-200/30 to-orange-300/20 rounded-full blur-xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-gradient-to-l from-yellow-300/25 to-orange-400/15 rounded-full blur-xl transform -rotate-12"></div>
          
          {/* Organic flowing shapes */}
          <div className="absolute top-1/2 left-10 w-40 h-96 bg-gradient-to-b from-orange-300/20 to-transparent rounded-full blur-2xl transform -rotate-12"></div>
          <div className="absolute top-20 right-20 w-32 h-80 bg-gradient-to-b from-orange-400/15 to-transparent rounded-full blur-xl transform rotate-45"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* HubSpot Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <Image
                src={data.hero.logo}
                alt="HubSpot"
                width={200}
                height={50}
                className="h-16 w-auto mx-auto mb-6"
                priority
              />
            </motion.div>
            
            {/* Platinum Partner Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-orange-100 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            >
              <Crown className="w-3 h-3 text-orange-500" />
              PARTENAIRE PLATINUM
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Libérez le Potentiel de Votre{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Croissance Business
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Une plateforme. Des résultats illimités. Transformez vos prospects en clients fidèles 
              avec notre expertise HubSpot et sécurisez votre avantage concurrentiel.
            </motion.p>
            
            {/* Email Input with CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-lg mx-auto mb-12 relative"
            >
              <form onSubmit={handleEmailSubmit} className="flex items-center gap-0 bg-white/60 backdrop-blur-xl rounded-full p-1 border border-orange-200/50 shadow-xl">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@entreprise.com"
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 px-6 py-4 rounded-full focus:outline-none focus:ring-0 text-base"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shrink-0 h-16 group"
                >
                  Audit Gratuit
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </form>
              
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-2 text-center">{formErrors.email}</p>
              )}
              
              {/* Hand-drawn arrow pointing to email input from the side */}
              <div className="hidden lg:block absolute -left-32 top-1/2 transform -translate-y-1/2">
                <svg width="120" height="40" viewBox="0 0 120 40" className="text-orange-500">
                  <path
                    d="M10 20 Q 60 10 100 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M95 15 L 100 20 L 95 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Companies Carousel - Bottom of Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16"
            >
              <CompaniesCarouselV3
                companies={homePageData?.hero?.carousel?.companies}
                userRegion={userRegion}
                speed={homePageData?.hero?.carousel?.speed ? Math.min(homePageData.hero.carousel.speed, 50) : 25}
                text={homePageData?.hero?.carousel?.text}
                layout="carousel"
                theme="light"
                showCount={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* HubSpot Hubs Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Faire grandir une entreprise est difficile.{" "}
                  <span className="text-[var(--color-main)]">HubSpot</span> le rend plus facile.
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Des outils déconnectés et des données dispersées vous ralentissent. 
                  HubSpot connecte tout — et tout le monde — en un seul endroit pour 
                  faire grandir votre entreprise plus facilement que vous ne le pensez.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleMeetingClick}
                    className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-6 py-3 rounded-md font-semibold"
                  >
                    Obtenir une démo
                  </Button>
                  <Button
                    onClick={scrollToContact}
                    variant="outline"
                    className="border-2 border-[var(--color-main)] text-[var(--color-main)] px-6 py-3 rounded-md hover:bg-[var(--color-main)] hover:text-white"
                  >
                    Commencer gratuitement
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Cards */}
            <div className="space-y-12">
              {[
                {
                  name: "Marketing Hub",
                  description: "Logiciel marketing pour générer du trafic, convertir plus de visiteurs et mener des campagnes inbound complètes à grande échelle.",
                  icon: Target,
                  color: "text-[var(--color-main)]",
                  bgColor: "bg-[var(--color-main)]/10",
                  features: [
                    "Attirer et convertir les bons prospects",
                    "Lancer des campagnes, personnaliser le contenu et tout suivre"
                  ]
                },
                {
                  name: "Sales Hub",
                  description: "CRM de vente pour obtenir des insights plus profonds sur vos prospects, automatiser les tâches et conclure plus d'affaires rapidement.",
                  icon: Users,
                  color: "text-[var(--color-secondary)]",
                  bgColor: "bg-[var(--color-secondary)]/10",
                  features: [
                    "Générer des prospects qualifiés et conclure plus vite",
                    "Automatiser la prospection et accélérer la croissance"
                  ]
                },
                {
                  name: "Service Hub",
                  description: "Logiciel de service client pour connecter avec vos clients, dépasser leurs attentes et les transformer en promoteurs.",
                  icon: Heart,
                  color: "text-[var(--color-main)]",
                  bgColor: "bg-[var(--color-main)]/10",
                  features: [
                    "Support évolutif sans augmenter les coûts",
                    "Répondre plus vite et automatiser les workflows"
                  ]
                },
                {
                  name: "Operations Hub",
                  description: "Logiciel d'opérations qui connecte vos applications, nettoie vos données et automatise les processus.",
                  icon: Settings,
                  color: "text-[var(--color-secondary)]",
                  bgColor: "bg-[var(--color-secondary)]/10",
                  features: [
                    "Transformer les données dispersées en intelligence unifiée",
                    "Nettoyer et activer vos données client"
                  ]
                },
                {
                  name: "Content Hub",
                  description: "Système de gestion de contenu qui aide à créer du contenu qui attire votre audience.",
                  icon: FileText,
                  color: "text-[var(--color-main)]",
                  bgColor: "bg-[var(--color-main)]/10",
                  features: [
                    "Créer du contenu qui attire votre audience",
                    "Construire des pages et publier du contenu"
                  ]
                },
                {
                  name: "Commerce Hub",
                  description: "Outils e-commerce pour faciliter les paiements et gérer les abonnements de vos clients.",
                  icon: ShoppingCart,
                  color: "text-[var(--color-secondary)]",
                  bgColor: "bg-[var(--color-secondary)]/10",
                  features: [
                    "Faciliter les paiements pour vos clients",
                    "Envoyer des devis et gérer les abonnements"
                  ]
                }
              ].map((hub, index) => {
                const Icon = hub.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${hub.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${hub.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{hub.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{hub.description}</p>
                        <div className="space-y-2">
                          {hub.features.map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-center space-x-2">
                              <Check className={`w-4 h-4 ${hub.color} flex-shrink-0`} />
                              <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
                        <div className="mt-4">
                          <button className={`text-sm font-medium ${hub.color} hover:underline flex items-center gap-1`}>
                            En savoir plus
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos <span className="text-[var(--color-main)]">Certifications</span> HubSpot
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une expertise reconnue et certifiée par HubSpot pour vous accompagner dans votre transformation digitale
            </p>
          </motion.div>

          {/* Main Certification Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 max-w-2xl mx-auto">
              <Image
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/Hubspot.webp"
                alt="Certification HubSpot"
                width={300}
                height={200}
                className="mx-auto mb-6"
                priority
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Partenaire Certifié HubSpot
              </h3>
              <p className="text-gray-600 mb-4">
                Certification officielle HubSpot validant notre expertise
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-main)] font-semibold">
                <CheckCircle className="w-4 h-4" />
                Certifié et validé par HubSpot
              </div>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 border border-gray-200 shadow-sm">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                Partenaire Platinum HubSpot depuis 2020
              </span>
              <Award className="w-5 h-5 text-[var(--color-main)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre <span className="text-[var(--color-main)]">Méthode</span> de Transformation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus éprouvé en 4 étapes pour garantir le succès de votre projet HubSpot
            </p>
          </motion.div>

          <div className="space-y-8">
            {transformationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[var(--color-main)] text-white rounded-xl flex items-center justify-center font-bold text-lg">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          <div className="text-sm text-[var(--color-main)] font-semibold">{step.duration}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-20 h-20 bg-[var(--color-main)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-10 h-10 text-[var(--color-main)]" />
                </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Simple CTA Section - HubSpot Style */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Il existe une meilleure façon de grandir.
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Logiciel de marketing, vente et service qui aide votre entreprise à grandir sans compromis. Parce que "bon pour l'entreprise" devrait aussi signifier "bon pour le client."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleMeetingClick}
                size="lg"
                className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-8 py-4 text-lg font-medium rounded-md"
              >
                Obtenir une démo
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                size="lg"
                className="border-2 border-[var(--color-main)] text-[var(--color-main)] px-8 py-4 text-lg font-medium rounded-md hover:bg-[var(--color-main)] hover:text-white"
              >
                Commencer gratuitement
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Commencez avec des outils GRATUITS, et évoluez au fur et à mesure de votre croissance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popup Form Modal */}
      <AnimatePresence>
        {showPopupForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePopupForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Complétez votre demande</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Quelques informations supplémentaires pour personnaliser votre audit
                    </p>
                  </div>
                  <button
                    onClick={closePopupForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleFormInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                    {formErrors.firstname && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstname}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleFormInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                    {formErrors.lastname && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <div className="flex space-x-2">
                    <CountryCodeSelector
                      selectedCountry={selectedCountry}
                      onCountryChange={handleCountryChange}
                    />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone.replace(selectedCountry.dialCode, '').trim()}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1 px-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors h-11 sm:h-12"
                      placeholder={selectedCountry.code === 'MA' ? '6 12 34 56 78' : '123 456 789'}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleFormInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Décrivez brièvement vos besoins en HubSpot..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        Recevoir mon audit gratuit
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HubSpotPage() {
  return (
    <PageVisibilityGuard pageName="hubspot">
      <HubSpotPageContent />
    </PageVisibilityGuard>
  );
}