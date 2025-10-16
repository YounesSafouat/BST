"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
import CountryCodeSelector from '../../CountryCodeSelector';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';
import { useFormSubmit, StandardFormData } from '@/hooks/use-form-submit';
import { useToast } from '@/hooks/use-toast';

interface HeroData {
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
  companyName?: string;
  badge?: string;
  emphasis?: string;
  expertiseBadgeUrl?: string;
  carousel?: {
    companies: Array<{
      name: string;
      logo: string;
      url?: string;
      regions?: string[];
    }>;
    speed?: number;
    text?: string;
  };
}

interface HeroSectionV1MobileProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

function HeroSectionV1Mobile({ heroData, userRegion, isPreview = false }: HeroSectionV1MobileProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦'
  });

  // Form submission hooks
  const { submitForm } = useFormSubmit();
  const { toast } = useToast();

  // Get user location data
  const { region, data: locationData, loading: geolocationLoading } = useGeolocationSingleton();
  const countryCode = locationData?.countryCode || '';

  // Auto-detect country based on IP geolocation - same logic as ContactSection
  useEffect(() => {
    console.log('🌍 HeroSectionV1Mobile - Geolocation effect triggered:', { 
      geolocationLoading, 
      countryCode, 
      region, 
      locationData,
      currentSelectedCountry: selectedCountry
    });
    
    // Only run if we have geolocation data and it's not loading
    if (!geolocationLoading && countryCode) {
      let detectedCountry: Country;
      switch (countryCode) {
        case 'FR':
          detectedCountry = {
            code: 'FR',
            name: 'France',
            dialCode: '+33',
            flag: '🇫🇷'
          };
          break;
        case 'MA':
          detectedCountry = {
            code: 'MA',
            name: 'Maroc',
            dialCode: '+212',
            flag: '🇲🇦'
          };
          break;
        case 'US':
          detectedCountry = {
            code: 'US',
            name: 'États-Unis',
            dialCode: '+1',
            flag: '🇺🇸'
          };
          break;
        case 'CA':
          detectedCountry = {
            code: 'CA',
            name: 'Canada',
            dialCode: '+1',
            flag: '🇨🇦'
          };
          break;
        case 'BE':
          detectedCountry = {
            code: 'BE',
            name: 'Belgique',
            dialCode: '+32',
            flag: '🇧🇪'
          };
          break;
        case 'CH':
          detectedCountry = {
            code: 'CH',
            name: 'Suisse',
            dialCode: '+41',
            flag: '🇨🇭'
          };
          break;
        case 'LU':
          detectedCountry = {
            code: 'LU',
            name: 'Luxembourg',
            dialCode: '+352',
            flag: '🇱🇺'
          };
          break;
        case 'GB':
          detectedCountry = {
            code: 'GB',
            name: 'Royaume-Uni',
            dialCode: '+44',
            flag: '🇬🇧'
          };
          break;
        case 'TN':
          detectedCountry = {
            code: 'TN',
            name: 'Tunisie',
            dialCode: '+216',
            flag: '🇹🇳'
          };
          break;
        case 'DZ':
          detectedCountry = {
            code: 'DZ',
            name: 'Algérie',
            dialCode: '+213',
            flag: '🇩🇿'
          };
          break;
        case 'SN':
          detectedCountry = {
            code: 'SN',
            name: 'Sénégal',
            dialCode: '+221',
            flag: '🇸🇳'
          };
          break;
        case 'CI':
          detectedCountry = {
            code: 'CI',
            name: 'Côte d\'Ivoire',
            dialCode: '+225',
            flag: '🇨🇮'
          };
          break;
        case 'ML':
          detectedCountry = {
            code: 'ML',
            name: 'Mali',
            dialCode: '+223',
            flag: '🇲🇱'
          };
          break;
        case 'BF':
          detectedCountry = {
            code: 'BF',
            name: 'Burkina Faso',
            dialCode: '+226',
            flag: '🇧🇫'
          };
          break;
        case 'NE':
          detectedCountry = {
            code: 'NE',
            name: 'Niger',
            dialCode: '+227',
            flag: '🇳🇪'
          };
          break;
        case 'TD':
          detectedCountry = {
            code: 'TD',
            name: 'Tchad',
            dialCode: '+235',
            flag: '🇹🇩'
          };
          break;
        case 'CM':
          detectedCountry = {
            code: 'CM',
            name: 'Cameroun',
            dialCode: '+237',
            flag: '🇨🇲'
          };
          break;
        case 'CF':
          detectedCountry = {
            code: 'CF',
            name: 'République centrafricaine',
            dialCode: '+236',
            flag: '🇨🇫'
          };
          break;
        case 'CG':
          detectedCountry = {
            code: 'CG',
            name: 'Congo',
            dialCode: '+242',
            flag: '🇨🇬'
          };
          break;
        case 'CD':
          detectedCountry = {
            code: 'CD',
            name: 'République démocratique du Congo',
            dialCode: '+243',
            flag: '🇨🇩'
          };
          break;
        case 'GA':
          detectedCountry = {
            code: 'GA',
            name: 'Gabon',
            dialCode: '+241',
            flag: '🇬🇦'
          };
          break;
        case 'GQ':
          detectedCountry = {
            code: 'GQ',
            name: 'Guinée équatoriale',
            dialCode: '+240',
            flag: '🇬🇶'
          };
          break;
        case 'ST':
          detectedCountry = {
            code: 'ST',
            name: 'Sao Tomé-et-Principe',
            dialCode: '+239',
            flag: '🇸🇹'
          };
          break;
        case 'AO':
          detectedCountry = {
            code: 'AO',
            name: 'Angola',
            dialCode: '+244',
            flag: '🇦🇴'
          };
          break;
        case 'NA':
          detectedCountry = {
            code: 'NA',
            name: 'Namibie',
            dialCode: '+264',
            flag: '🇳🇦'
          };
          break;
        case 'BW':
          detectedCountry = {
            code: 'BW',
            name: 'Botswana',
            dialCode: '+267',
            flag: '🇧🇼'
          };
          break;
        case 'ZA':
          detectedCountry = {
            code: 'ZA',
            name: 'Afrique du Sud',
            dialCode: '+27',
            flag: '🇿🇦'
          };
          break;
        case 'LS':
          detectedCountry = {
            code: 'LS',
            name: 'Lesotho',
            dialCode: '+266',
            flag: '🇱🇸'
          };
          break;
        case 'SZ':
          detectedCountry = {
            code: 'SZ',
            name: 'Eswatini',
            dialCode: '+268',
            flag: '🇸🇿'
          };
          break;
        case 'MW':
          detectedCountry = {
            code: 'MW',
            name: 'Malawi',
            dialCode: '+265',
            flag: '🇲🇼'
          };
          break;
        case 'MZ':
          detectedCountry = {
            code: 'MZ',
            name: 'Mozambique',
            dialCode: '+258',
            flag: '🇲🇿'
          };
          break;
        case 'MG':
          detectedCountry = {
            code: 'MG',
            name: 'Madagascar',
            dialCode: '+261',
            flag: '🇲🇬'
          };
          break;
        case 'MU':
          detectedCountry = {
            code: 'MU',
            name: 'Maurice',
            dialCode: '+230',
            flag: '🇲🇺'
          };
          break;
        case 'SC':
          detectedCountry = {
            code: 'SC',
            name: 'Seychelles',
            dialCode: '+248',
            flag: '🇸🇨'
          };
          break;
        case 'KM':
          detectedCountry = {
            code: 'KM',
            name: 'Comores',
            dialCode: '+269',
            flag: '🇰🇲'
          };
          break;
        case 'YT':
          detectedCountry = {
            code: 'YT',
            name: 'Mayotte',
            dialCode: '+262',
            flag: '🇾🇹'
          };
          break;
        case 'RE':
          detectedCountry = {
            code: 'RE',
            name: 'La Réunion',
            dialCode: '+262',
            flag: '🇷🇪'
          };
          break;
        case 'EG':
          detectedCountry = {
            code: 'EG',
            name: 'Égypte',
            dialCode: '+20',
            flag: '🇪🇬'
          };
          break;
        case 'LY':
          detectedCountry = {
            code: 'LY',
            name: 'Libye',
            dialCode: '+218',
            flag: '🇱🇾'
          };
          break;
        case 'SD':
          detectedCountry = {
            code: 'SD',
            name: 'Soudan',
            dialCode: '+249',
            flag: '🇸🇩'
          };
          break;
        case 'SS':
          detectedCountry = {
            code: 'SS',
            name: 'Soudan du Sud',
            dialCode: '+211',
            flag: '🇸🇸'
          };
          break;
        case 'ET':
          detectedCountry = {
            code: 'ET',
            name: 'Éthiopie',
            dialCode: '+251',
            flag: '🇪🇹'
          };
          break;
        case 'ER':
          detectedCountry = {
            code: 'ER',
            name: 'Érythrée',
            dialCode: '+291',
            flag: '🇪🇷'
          };
          break;
        case 'DJ':
          detectedCountry = {
            code: 'DJ',
            name: 'Djibouti',
            dialCode: '+253',
            flag: '🇩🇯'
          };
          break;
        case 'SO':
          detectedCountry = {
            code: 'SO',
            name: 'Somalie',
            dialCode: '+252',
            flag: '🇸🇴'
          };
          break;
        case 'KE':
          detectedCountry = {
            code: 'KE',
            name: 'Kenya',
            dialCode: '+254',
            flag: '🇰🇪'
          };
          break;
        case 'UG':
          detectedCountry = {
            code: 'UG',
            name: 'Ouganda',
            dialCode: '+256',
            flag: '🇺🇬'
          };
          break;
        case 'TZ':
          detectedCountry = {
            code: 'TZ',
            name: 'Tanzanie',
            dialCode: '+255',
            flag: '🇹🇿'
          };
          break;
        case 'RW':
          detectedCountry = {
            code: 'RW',
            name: 'Rwanda',
            dialCode: '+250',
            flag: '🇷🇼'
          };
          break;
        case 'BI':
          detectedCountry = {
            code: 'BI',
            name: 'Burundi',
            dialCode: '+257',
            flag: '🇧🇮'
          };
          break;
        case 'GH':
          detectedCountry = {
            code: 'GH',
            name: 'Ghana',
            dialCode: '+233',
            flag: '🇬🇭'
          };
          break;
        case 'TG':
          detectedCountry = {
            code: 'TG',
            name: 'Togo',
            dialCode: '+228',
            flag: '🇹🇬'
          };
          break;
        case 'BJ':
          detectedCountry = {
            code: 'BJ',
            name: 'Bénin',
            dialCode: '+229',
            flag: '🇧🇯'
          };
          break;
        case 'NG':
          detectedCountry = {
            code: 'NG',
            name: 'Nigéria',
            dialCode: '+234',
            flag: '🇳🇬'
          };
          break;
        case 'GM':
          detectedCountry = {
            code: 'GM',
            name: 'Gambie',
            dialCode: '+220',
            flag: '🇬🇲'
          };
          break;
        case 'GW':
          detectedCountry = {
            code: 'GW',
            name: 'Guinée-Bissau',
            dialCode: '+245',
            flag: '🇬🇼'
          };
          break;
        case 'GN':
          detectedCountry = {
            code: 'GN',
            name: 'Guinée',
            dialCode: '+224',
            flag: '🇬🇳'
          };
          break;
        case 'SL':
          detectedCountry = {
            code: 'SL',
            name: 'Sierra Leone',
            dialCode: '+232',
            flag: '🇸🇱'
          };
          break;
        case 'LR':
          detectedCountry = {
            code: 'LR',
            name: 'Libéria',
            dialCode: '+231',
            flag: '🇱🇷'
          };
          break;
        case 'MR':
          detectedCountry = {
            code: 'MR',
            name: 'Mauritanie',
            dialCode: '+222',
            flag: '🇲🇷'
          };
          break;
        case 'ZM':
          detectedCountry = {
            code: 'ZM',
            name: 'Zambie',
            dialCode: '+260',
            flag: '🇿🇲'
          };
          break;
        case 'ZW':
          detectedCountry = {
            code: 'ZW',
            name: 'Zimbabwe',
            dialCode: '+263',
            flag: '🇿🇼'
          };
          break;
        case 'BO':
          detectedCountry = {
            code: 'BO',
            name: 'Bolivie',
            dialCode: '+591',
            flag: '🇧🇴'
          };
          break;
        case 'PY':
          detectedCountry = {
            code: 'PY',
            name: 'Paraguay',
            dialCode: '+595',
            flag: '🇵🇾'
          };
          break;
        case 'UY':
          detectedCountry = {
            code: 'UY',
            name: 'Uruguay',
            dialCode: '+598',
            flag: '🇺🇾'
          };
          break;
        case 'GY':
          detectedCountry = {
            code: 'GY',
            name: 'Guyana',
            dialCode: '+592',
            flag: '🇬🇾'
          };
          break;
        case 'SR':
          detectedCountry = {
            code: 'SR',
            name: 'Suriname',
            dialCode: '+597',
            flag: '🇸🇷'
          };
          break;
        case 'FK':
          detectedCountry = {
            code: 'FK',
            name: 'Îles Malouines',
            dialCode: '+500',
            flag: '🇫🇰'
          };
          break;
        default:
          detectedCountry = {
            code: 'MA',
            name: 'Maroc',
            dialCode: '+212',
            flag: '🇲🇦'
          };
      }
      setSelectedCountry(detectedCountry);
      console.log('🌍 HeroSectionV1Mobile - Auto-detected country:', detectedCountry);
    } else {
      console.log('Country detection skipped:', { geolocationLoading, countryCode });
      // Fallback: if geolocation is not working, try to detect from region
      if (!geolocationLoading && region && region !== 'international') {
        console.log('Falling back to region-based detection:', region);
        let fallbackCountry: Country;
        switch (region) {
          case 'france':
            fallbackCountry = {
              code: 'FR',
              name: 'France',
              dialCode: '+33',
              flag: '🇫🇷'
            };
            break;
          case 'morocco':
            fallbackCountry = {
              code: 'MA',
              name: 'Maroc',
              dialCode: '+212',
              flag: '🇲🇦'
            };
            break;
          default:
            fallbackCountry = {
              code: 'MA',
              name: 'Maroc',
              dialCode: '+212',
              flag: '🇲🇦'
            };
        }
        setSelectedCountry(fallbackCountry);
        console.log('Fallback country set to:', fallbackCountry.name);
      }
    }
  }, [countryCode, geolocationLoading, region, locationData?.city]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneWithoutCountry = phone.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
    const digits = phoneWithoutCountry.replace(/\D/g, '');
    
    if (selectedCountry.code === 'MA') {
      return digits.length === 9;
    } else {
      return digits.length >= 8 && digits.length <= 15;
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!validatePhone(formData.phone)) {
      const phoneWithoutCountry = formData.phone.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
      const digits = phoneWithoutCountry.replace(/\D/g, '');
      
      if (selectedCountry.code === 'MA') {
        newErrors.phone = 'Le numéro de téléphone marocain doit contenir exactement 9 chiffres';
      } else {
        newErrors.phone = 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres';
      }
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Le nom de l\'entreprise est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ensurePhoneWithCountryCode = (phone: string) => {
    if (phone.startsWith(selectedCountry.dialCode)) {
      return phone;
    }
    return `${selectedCountry.dialCode} ${phone}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create standardized form data
      const standardFormData: StandardFormData = {
        name: formData.fullName,
        company: formData.company,
        email: formData.email,
        phone: ensurePhoneWithCountryCode(formData.phone),
        message: 'Demande de plan d\'intégration Odoo via Google Ads'
      };

      // Additional data for tracking - specifically for Google Ads
      const additionalData = {
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        city: locationData?.city || '',
        source: 'google_ads',
        medium: 'paid_search',
        campaign: 'odoo_integration_plan',
        page: 'votre-integrateur-odoo',
        submitted_at: new Date().toISOString(),
        brief_description: `Lead from Google Ads - ${formData.company} interested in Odoo integration plan. Phone: ${ensurePhoneWithCountryCode(formData.phone)}, Email: ${formData.email}`,
        lead_source: 'google_ads',
        lead_medium: 'paid_search',
        lead_campaign: 'odoo_integration_plan',
        utm_source: 'google',
        utm_medium: 'ads',
        utm_campaign: 'odoo_integration_plan'
      };

      console.log('HeroSectionV1Mobile - Submitting form data:', standardFormData);
      console.log('HeroSectionV1Mobile - Additional tracking data:', additionalData);
      console.log('HeroSectionV1Mobile - About to call submitForm...');

      // Use the standardized form submission
      const result = await submitForm(
        standardFormData,
        additionalData,
        '/api/contact',
        'google_ads_form'
      );

      console.log('HeroSectionV1Mobile - submitForm result:', result);

      // If submitForm fails, try direct API call as fallback
      if (!result.success) {
        console.log('HeroSectionV1Mobile - submitForm failed, trying direct API call...');
        
        const directResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'formSubmit',
            formData: standardFormData,
            additionalData: additionalData
          })
        });

        const directResult = await directResponse.json();
        console.log('HeroSectionV1Mobile - Direct API call result:', directResult);
        
        if (directResponse.ok && !directResult.error) {
          console.log('HeroSectionV1Mobile - Direct API call successful');
          // Update result to success
          result.success = true;
          result.data = directResult;
        }
      }

      if (result.success) {
        console.log('HeroSectionV1Mobile - Form submitted successfully:', result.data);
        
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: ''
        });
        setErrors({});

        toast({
          title: "Demande envoyée !",
          description: "Nous vous contacterons dans les 4 heures pour votre plan d'intégration.",
          duration: 5000,
        });
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('HeroSectionV1Mobile - Error submitting form:', error);
      setSubmitError('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--color-main)] min-h-screen">
      <div className="relative w-full py-0 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Single Column */}
          <div className="space-y-6 pt-4 pb-8 min-h-screen flex flex-col justify-center px-2">

            {/* Badge Image - First on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="p-2 flex items-center justify-center">
                <img 
                  src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" 
                  alt="Odoo Silver Partner Badge" 
                  className='w-[240px] h-[240px]' 
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-3xl font-bold text-white leading-tight text-center"
              style={{ lineHeight: '1.2' }}
            >
              Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de <span className="text-[var(--color-secondary)]">confiance</span>
            </motion.h1>

            {/* Image below title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex justify-center"
            >
              <img
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/couvertureV1SiteWeb.png"
                alt="Odoo Integration"
                className="w-full max-w-md rounded-2xl shadow-lg"
              />
            </motion.div>

            {/* Form instead of Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full"
            >
              <div className="relative">
                <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-white/30">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
                    Obtenez votre plan d'intégration<br /><span className="text-[var(--color-secondary)]"> gratuitement</span>  
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Nous aidons les entreprises à centraliser l'ensemble de leur activité sur une seule plateforme grâce à <span className="font-bold"> Odoo </span>. <br />  <span className="text-[var(--color-secondary)] font-bold">Simple, efficace, et abordable.</span>
                    
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500 ${
                          errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[var(--color-main)]'
                        }`}
                      />
                      {errors.fullName && (
                        <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-0">
                        <CountryCodeSelector
                          selectedCountry={selectedCountry}
                          onCountryChange={handleCountryChange}
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="6 12 34 56 78"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className={`flex-1 px-3 py-2.5 text-sm rounded-r-lg border border-l-0 bg-white focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500 ${
                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[var(--color-main)]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500 ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[var(--color-main)]'
                        }`}
                      />
                      {errors.email && (
                        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="company"
                        placeholder="Entreprise"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all placeholder:text-gray-500 ${
                          errors.company ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[var(--color-main)]'
                        }`}
                      />
                      {errors.company && (
                        <div className="text-red-500 text-xs mt-1">{errors.company}</div>
                      )}
                    </div>
                    
                    {submitError && (
                      <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                        {submitError}
                      </div>
                    )}
                    
                    {isSubmitted ? (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-green-600 font-semibold mb-2">✅ Demande envoyée !</div>
                        <div className="text-green-600 text-sm">Nous vous contacterons dans les 4 heures pour votre plan d'intégration.</div>
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--color-secondary)] hover:bg-[var(--color-main)] text-white py-3 text-sm rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                      </Button>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionV1Mobile;
