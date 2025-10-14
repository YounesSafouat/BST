"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Play } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import CompaniesCarouselV3 from '../../CompaniesCarouselV3V1';
import CountryCodeSelector from '../../CountryCodeSelector';
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

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

interface HeroSectionProps {
  heroData: HeroData;
  userRegion?: string;
  isPreview?: boolean;
}

function HeroSectionV1({ heroData, userRegion, isPreview = false }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { region, data: locationData, loading: geolocationLoading } = useGeolocationSingleton();
  const countryCode = locationData?.countryCode || '';

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(loadTimer);
  }, []);

  // Auto-detect country based on IP geolocation
  useEffect(() => {
    if (!geolocationLoading && countryCode) {
      let detectedCountry: Country;
      switch (countryCode) {
        case 'FR':
          detectedCountry = { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' };
          break;
        case 'MA':
          detectedCountry = { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' };
          break;
        case 'US':
          detectedCountry = { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' };
          break;
        case 'CA':
          detectedCountry = { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' };
          break;
        case 'BE':
          detectedCountry = { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' };
          break;
        case 'CH':
          detectedCountry = { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' };
          break;
        case 'LU':
          detectedCountry = { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' };
          break;
        case 'TN':
          detectedCountry = { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' };
          break;
        case 'DZ':
          detectedCountry = { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' };
          break;
        case 'SN':
          detectedCountry = { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' };
          break;
        case 'CI':
          detectedCountry = { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' };
          break;
        case 'ML':
          detectedCountry = { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' };
          break;
        case 'BF':
          detectedCountry = { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' };
          break;
        case 'NE':
          detectedCountry = { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' };
          break;
        case 'TD':
          detectedCountry = { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩' };
          break;
        case 'CM':
          detectedCountry = { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' };
          break;
        case 'CF':
          detectedCountry = { code: 'CF', name: 'République centrafricaine', dialCode: '+236', flag: '🇨🇫' };
          break;
        case 'CG':
          detectedCountry = { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' };
          break;
        case 'CD':
          detectedCountry = { code: 'CD', name: 'République démocratique du Congo', dialCode: '+243', flag: '🇨🇩' };
          break;
        case 'GA':
          detectedCountry = { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' };
          break;
        case 'GQ':
          detectedCountry = { code: 'GQ', name: 'Guinée équatoriale', dialCode: '+240', flag: '🇬🇶' };
          break;
        case 'ST':
          detectedCountry = { code: 'ST', name: 'Sao Tomé-et-Principe', dialCode: '+239', flag: '🇸🇹' };
          break;
        case 'AO':
          detectedCountry = { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' };
          break;
        case 'NA':
          detectedCountry = { code: 'NA', name: 'Namibie', dialCode: '+264', flag: '🇳🇦' };
          break;
        case 'BW':
          detectedCountry = { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' };
          break;
        case 'ZW':
          detectedCountry = { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' };
          break;
        case 'ZM':
          detectedCountry = { code: 'ZM', name: 'Zambie', dialCode: '+260', flag: '🇿🇲' };
          break;
        case 'MW':
          detectedCountry = { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' };
          break;
        case 'MZ':
          detectedCountry = { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' };
          break;
        case 'LS':
          detectedCountry = { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' };
          break;
        case 'SZ':
          detectedCountry = { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' };
          break;
        case 'MG':
          detectedCountry = { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' };
          break;
        case 'MU':
          detectedCountry = { code: 'MU', name: 'Maurice', dialCode: '+230', flag: '🇲🇺' };
          break;
        case 'SC':
          detectedCountry = { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' };
          break;
        case 'KM':
          detectedCountry = { code: 'KM', name: 'Comores', dialCode: '+269', flag: '🇰🇲' };
          break;
        case 'DJ':
          detectedCountry = { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' };
          break;
        case 'SO':
          detectedCountry = { code: 'SO', name: 'Somalie', dialCode: '+252', flag: '🇸🇴' };
          break;
        case 'ET':
          detectedCountry = { code: 'ET', name: 'Éthiopie', dialCode: '+251', flag: '🇪🇹' };
          break;
        case 'ER':
          detectedCountry = { code: 'ER', name: 'Érythrée', dialCode: '+291', flag: '🇪🇷' };
          break;
        case 'SD':
          detectedCountry = { code: 'SD', name: 'Soudan', dialCode: '+249', flag: '🇸🇩' };
          break;
        case 'SS':
          detectedCountry = { code: 'SS', name: 'Soudan du Sud', dialCode: '+211', flag: '🇸🇸' };
          break;
        case 'EG':
          detectedCountry = { code: 'EG', name: 'Égypte', dialCode: '+20', flag: '🇪🇬' };
          break;
        case 'LY':
          detectedCountry = { code: 'LY', name: 'Libye', dialCode: '+218', flag: '🇱🇾' };
          break;
        case 'GB':
          detectedCountry = { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' };
          break;
        case 'DE':
          detectedCountry = { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' };
          break;
        case 'IT':
          detectedCountry = { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' };
          break;
        case 'ES':
          detectedCountry = { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' };
          break;
        case 'PT':
          detectedCountry = { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' };
          break;
        case 'NL':
          detectedCountry = { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' };
          break;
        case 'AT':
          detectedCountry = { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹' };
          break;
        case 'SE':
          detectedCountry = { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪' };
          break;
        case 'NO':
          detectedCountry = { code: 'NO', name: 'Norvège', dialCode: '+47', flag: '🇳🇴' };
          break;
        case 'DK':
          detectedCountry = { code: 'DK', name: 'Danemark', dialCode: '+45', flag: '🇩🇰' };
          break;
        case 'FI':
          detectedCountry = { code: 'FI', name: 'Finlande', dialCode: '+358', flag: '🇫🇮' };
          break;
        case 'PL':
          detectedCountry = { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱' };
          break;
        case 'CZ':
          detectedCountry = { code: 'CZ', name: 'République tchèque', dialCode: '+420', flag: '🇨🇿' };
          break;
        case 'SK':
          detectedCountry = { code: 'SK', name: 'Slovaquie', dialCode: '+421', flag: '🇸🇰' };
          break;
        case 'HU':
          detectedCountry = { code: 'HU', name: 'Hongrie', dialCode: '+36', flag: '🇭🇺' };
          break;
        case 'RO':
          detectedCountry = { code: 'RO', name: 'Roumanie', dialCode: '+40', flag: '🇷🇴' };
          break;
        case 'BG':
          detectedCountry = { code: 'BG', name: 'Bulgarie', dialCode: '+359', flag: '🇧🇬' };
          break;
        case 'HR':
          detectedCountry = { code: 'HR', name: 'Croatie', dialCode: '+385', flag: '🇭🇷' };
          break;
        case 'SI':
          detectedCountry = { code: 'SI', name: 'Slovénie', dialCode: '+386', flag: '🇸🇮' };
          break;
        case 'EE':
          detectedCountry = { code: 'EE', name: 'Estonie', dialCode: '+372', flag: '🇪🇪' };
          break;
        case 'LV':
          detectedCountry = { code: 'LV', name: 'Lettonie', dialCode: '+371', flag: '🇱🇻' };
          break;
        case 'LT':
          detectedCountry = { code: 'LT', name: 'Lituanie', dialCode: '+370', flag: '🇱🇹' };
          break;
        case 'GR':
          detectedCountry = { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷' };
          break;
        case 'CY':
          detectedCountry = { code: 'CY', name: 'Chypre', dialCode: '+357', flag: '🇨🇾' };
          break;
        case 'MT':
          detectedCountry = { code: 'MT', name: 'Malte', dialCode: '+356', flag: '🇲🇹' };
          break;
        case 'IE':
          detectedCountry = { code: 'IE', name: 'Irlande', dialCode: '+353', flag: '🇮🇪' };
          break;
        case 'IS':
          detectedCountry = { code: 'IS', name: 'Islande', dialCode: '+354', flag: '🇮🇸' };
          break;
        case 'RU':
          detectedCountry = { code: 'RU', name: 'Russie', dialCode: '+7', flag: '🇷🇺' };
          break;
        case 'UA':
          detectedCountry = { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' };
          break;
        case 'BY':
          detectedCountry = { code: 'BY', name: 'Biélorussie', dialCode: '+375', flag: '🇧🇾' };
          break;
        case 'MD':
          detectedCountry = { code: 'MD', name: 'Moldavie', dialCode: '+373', flag: '🇲🇩' };
          break;
        case 'GE':
          detectedCountry = { code: 'GE', name: 'Géorgie', dialCode: '+995', flag: '🇬🇪' };
          break;
        case 'AM':
          detectedCountry = { code: 'AM', name: 'Arménie', dialCode: '+374', flag: '🇦🇲' };
          break;
        case 'AZ':
          detectedCountry = { code: 'AZ', name: 'Azerbaïdjan', dialCode: '+994', flag: '🇦🇿' };
          break;
        case 'TR':
          detectedCountry = { code: 'TR', name: 'Turquie', dialCode: '+90', flag: '🇹🇷' };
          break;
        case 'IL':
          detectedCountry = { code: 'IL', name: 'Israël', dialCode: '+972', flag: '🇮🇱' };
          break;
        case 'LB':
          detectedCountry = { code: 'LB', name: 'Liban', dialCode: '+961', flag: '🇱🇧' };
          break;
        case 'SY':
          detectedCountry = { code: 'SY', name: 'Syrie', dialCode: '+963', flag: '🇸🇾' };
          break;
        case 'IQ':
          detectedCountry = { code: 'IQ', name: 'Irak', dialCode: '+964', flag: '🇮🇶' };
          break;
        case 'IR':
          detectedCountry = { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' };
          break;
        case 'AF':
          detectedCountry = { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' };
          break;
        case 'PK':
          detectedCountry = { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' };
          break;
        case 'IN':
          detectedCountry = { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳' };
          break;
        case 'BD':
          detectedCountry = { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' };
          break;
        case 'LK':
          detectedCountry = { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' };
          break;
        case 'NZ':
          detectedCountry = { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64', flag: '🇳🇿' };
          break;
        case 'BR':
          detectedCountry = { code: 'BR', name: 'Brésil', dialCode: '+55', flag: '🇧🇷' };
          break;
        case 'AR':
          detectedCountry = { code: 'AR', name: 'Argentine', dialCode: '+54', flag: '🇦🇷' };
          break;
        case 'CL':
          detectedCountry = { code: 'CL', name: 'Chili', dialCode: '+56', flag: '🇨🇱' };
          break;
        case 'PE':
          detectedCountry = { code: 'PE', name: 'Pérou', dialCode: '+51', flag: '🇵🇪' };
          break;
        case 'CO':
          detectedCountry = { code: 'CO', name: 'Colombie', dialCode: '+57', flag: '🇨🇴' };
          break;
        case 'VE':
          detectedCountry = { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' };
          break;
        case 'EC':
          detectedCountry = { code: 'EC', name: 'Équateur', dialCode: '+593', flag: '🇪🇨' };
          break;
        case 'BO':
          detectedCountry = { code: 'BO', name: 'Bolivie', dialCode: '+591', flag: '🇧🇴' };
          break;
        case 'PY':
          detectedCountry = { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' };
          break;
        case 'UY':
          detectedCountry = { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' };
          break;
        case 'GY':
          detectedCountry = { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' };
          break;
        case 'SR':
          detectedCountry = { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' };
          break;
        case 'FK':
          detectedCountry = { code: 'FK', name: 'Îles Malouines', dialCode: '+500', flag: '🇫🇰' };
          break;
        default:
          detectedCountry = { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' };
      }
      setSelectedCountry(detectedCountry);
    }
  }, [countryCode, geolocationLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Add API call to submit form
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: ''
      });
      
      // Show success message or redirect
      alert('Merci ! Nous vous contacterons bientôt.');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      ArrowRight: <ArrowRight className="w-5 h-5" />,
      Users: <Users className="w-5 h-5" />,
      Play: <Play className="w-5 h-5" />
    };
    return iconMap[iconName] || <ArrowRight className="w-5 h-5" />;
  };

  const formatTextWithOdoo = (text: string) => {
    if (!text) return text;
    const odooRegex = /(\b)(odoo)(\b)/gi;
    return text.replace(odooRegex, (match, before, odoo, after) => {
      return `${before}<span style=" font-weight: italic; display: inline-block;"><span style="color: #714B67">O</span><span style="color: #8F8F8F">doo</span></span>${after}`;
    });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--color-main)] lg:min-h-screen min-h-[400vh] pt-[5rem]">
      <div className="relative w-full py-0 pt-0 lg:py-4 lg:pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          

          {/* Desktop Layout - Two Columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-[250px] h-[100px] flex items-center justify-center" >
                 <img src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/odooSilverBadge-2.png" alt="Odoo Silver Partner Badge" />

                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight"
                  style={{ lineHeight: '1.1' }}
                >
                  Intégrez <span className="text-[var(--color-secondary)]">Odoo</span> avec un partenaire Silver de <span className="text-[var(--color-secondary)]">confiance</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white leading-relaxed max-w-3xl"
                >
                  Passez à un ERP performant, paramétré par un partenaire expert. <br />
                  Centralisez vos ventes, stocks, projets et finances <br />
                   — sans complexité inutile.
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-row gap-4 justify-start max-w-lg mx-auto"
              >
                <Link href="/cas-client">
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-8 py-4 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-base sm:text-base lg:text-lg font-semibold text-[var(--color-main)] bg-white hover:bg-[var(--color-secondary)] hover:text-[var(--color-white)] rounded-full h-16 sm:h-12 lg:h-14 bg-white"
                  >
                    Voir nos cas clients
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Form instead of Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-4 sm:mx-6 lg:mx-0">
                <div className="bg-white p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-[var(--color-main)]">
                  <h3 className="text-2xl font-bold text-[var(--color-main)] mb-6 text-center">
                  Obtenez votre plan d’intégration <span className="text-[var(--color-secondary)]">gratuitement</span>
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-0">
                        <CountryCodeSelector
                          selectedCountry={selectedCountry}
                          onCountryChange={setSelectedCountry}
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Téléphone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="flex-1 px-4 py-3 rounded-r-lg border border-l-0 focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)] h-11 sm:h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="company"
                        placeholder="Entreprise"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-[var(--color-main)]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--color-secondary)]  text-white py-3 rounded-lg font-semibold transition-all text-lg border-2 border-transparent hover:border-white"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Companies Carousel - Reduced text size */}
      <div className="hidden lg:block bg-[var(--color-main)] pt-1 sm:pt-2 md:pt-4 lg:pt-4 xl:pt-12 2xl:pt-16 pb-8">
        <CompaniesCarouselV3
          companies={heroData?.carousel?.companies}
          userRegion={userRegion}
          speed={heroData?.carousel?.speed ? Math.min(heroData.carousel.speed, 100) : 75}
          text={heroData?.carousel?.text}
          layout="carousel"
          theme="modern"
          showCount={true}
        />
      </div>
    </section>
  );
}

export default HeroSectionV1;

