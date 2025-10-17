/**
 * ContactSection.tsx
 * 
 * Main contact form component with advanced lead tracking and user behavior analysis.
 * This component is the core contact form used across the website for lead generation
 * and customer inquiries. It automatically detects user location and provides
 * country-specific phone number formatting and validation.
 * 
 * WHERE IT'S USED:
 * - Homepage (/app/page.tsx) - Main contact section
 * - About page (/app/about/page.tsx) - Contact form section
 * - Odoo page (/app/odoo-article/page.tsx) - Contact form section
 * - Any other page that needs a contact form
 * 
 * KEY FEATURES:
 * - Multi-country phone number support with automatic geolocation detection
 * - Real-time form validation with country-specific phone rules
 * - Partial lead storage - saves user progress as they type
 * - User behavior tracking (scroll depth, time on page, button clicks, mouse movements)
 * - Automatic partial lead submission to HubSpot after 30 minutes of inactivity
 * - LocalStorage progress persistence for better user experience
 * - Smart lead qualification based on user engagement metrics
 * - Automatic country detection based on IP geolocation
 * - Support for 50+ countries with proper phone formatting
 * 
 * TECHNICAL DETAILS:
 * - Uses framer-motion for smooth animations
 * - Integrates with HubSpot CRM via API endpoints
 * - Stores partial leads in MongoDB database
 * - Implements progressive form completion tracking
 * - Handles form abandonment scenarios intelligently
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Phone, Mail, Calendar, CheckCircle, Award, Zap, Shield, CheckCircle as CheckCircleIcon, AlertCircle, User, Building, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CountryCodeSelector from "./CountryCodeSelector";
import { useGeolocationSingleton } from "@/hooks/useGeolocationSingleton";
import { useFormSubmit, StandardFormData } from "@/hooks/use-form-submit";

interface Country {
     code: string;
     name: string;
     dialCode: string;
     flag: string;
}

interface ContactData {
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
}

interface ContactSectionProps {
     contactData?: ContactData;
}

/**
 * ContactSection - Main contact form component with lead tracking
 * @param contactData - Optional contact form configuration data
 * @returns Contact form with user behavior tracking and partial lead storage
 */
export default function ContactSection({ contactData }: ContactSectionProps) {
     const { submitForm } = useFormSubmit();
     const [formData, setFormData] = useState({
          name: '',
          firstname: '',
          lastname: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          countryCode: 'MA'
     });

     const [selectedCountry, setSelectedCountry] = useState<Country>({
          code: 'MA',
          name: 'Maroc',
          dialCode: '+212',
          flag: '🇲🇦'
     });
     const [errors, setErrors] = useState<{ [key: string]: string }>({});
     const [isSubmitted, setIsSubmitted] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [submitError, setSubmitError] = useState('');
     const { toast } = useToast();

     const partialLeadTimer = useRef<NodeJS.Timeout | null>(null);
     const localStorageKey = 'contact_progress';

     const [userBehavior, setUserBehavior] = useState({
          pagesVisited: [] as string[],
          timeOnPage: 0,
          formInteractions: 0,
          lastActivity: Date.now(),
          buttonClicks: [] as Array<{ button: string, timestamp: number, page: string }>,
          callButtonClicks: 0,
          whatsappButtonClicks: 0,
          scrollDepth: 0,
          mouseMovements: 0
     });

     const { region, data: locationData, loading: geolocationLoading } = useGeolocationSingleton();
     const country = locationData?.country || '';
     const countryCode = locationData?.countryCode || '';
     const city = locationData?.city || '';

;

     useEffect(() => {
          return () => {
               if (partialLeadTimer.current) {
                    clearTimeout(partialLeadTimer.current);
                    partialLeadTimer.current = null;
               }
          };
     }, []);

    

     const [, forceUpdate] = useState({});
     const triggerReRender = () => forceUpdate({});

     useEffect(() => {
          // Track current page
          const currentPage = window.location.pathname;
          setUserBehavior(prev => ({
               ...prev,
               pagesVisited: [...new Set([...prev.pagesVisited, currentPage])]
          }));

          // Track time on page
          const startTime = Date.now();
          const interval = setInterval(() => {
               setUserBehavior(prev => ({
                    ...prev,
                    timeOnPage: Date.now() - startTime
               }));
          }, 1000);

          // Track form interactions
          const trackFormInteraction = () => {
               setUserBehavior(prev => ({
                    ...prev,
                    formInteractions: prev.formInteractions + 1,
                    lastActivity: Date.now()
               }));
          };

          // Add event listeners for form interactions
          const form = document.querySelector('form');
          if (form) {
               form.addEventListener('input', trackFormInteraction);
               form.addEventListener('focus', trackFormInteraction);
          }

          try {
               const existingProgress = localStorage.getItem(localStorageKey);
               if (existingProgress) {
                    const progress = JSON.parse(existingProgress);
                    console.log('Found existing progress in LocalStorage:', progress);

                    if (progress.formCompleted) {
                         console.log('Form was previously completed, clearing progress and resetting form');
                         clearProgressFromLocalStorage();
                         setIsSubmitted(false);
                         setFormData({
                              name: '',
                              firstname: '',
                              lastname: '',
                              email: '',
                              company: '',
                              phone: '',
                              message: '',
                              countryCode: 'MA'
                         });
                    } else {
                         console.log('Restoring partial progress, keeping inputs editable');

                         const restoredFormData = {
                              name: progress.name || '',
                              firstname: progress.firstname || (progress.name ? progress.name.split(' ')[0] : '') || '',
                              lastname: progress.lastname || (progress.name ? progress.name.split(' ').slice(1).join(' ') : '') || '',
                              email: progress.email || '',
                              phone: progress.phone || '',
                              company: progress.company || '',
                              message: progress.message || '',
                              countryCode: progress.countryCode || 'MA'
                         };

                         console.log('Restoring form data:', restoredFormData);
                         setFormData(restoredFormData);

                         if (progress.phone && !progress.phone.startsWith(selectedCountry.dialCode)) {
                              console.log('Fixing phone number country code');
                              const phoneWithoutCountry = progress.phone.replace(/^\+?\d+\s*/, '');
                              const correctedPhone = selectedCountry.dialCode + ' ' + phoneWithoutCountry;
                              setFormData(prev => ({ ...prev, phone: correctedPhone }));
                         }

                         const updatedProgress = {
                              ...progress,
                              timestamp: Date.now()
                         };
                         localStorage.setItem(localStorageKey, JSON.stringify(updatedProgress));
                    }
               }
          } catch (error) {
               console.log('Error loading LocalStorage progress:', error);
               clearProgressFromLocalStorage();
               setIsSubmitted(false);
          }

          const trackButtonClick = (event: MouseEvent) => {
               const target = event.target as HTMLElement;
               let buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || '';

               const isButton = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
               if (!isButton) return;

               buttonText = buttonText.replace(/\s+/g, ' ').trim();

               if (buttonText.length > 100) return;

               if (!buttonText) return;

               const currentPage = window.location.pathname;

               let buttonType = 'other';
               if (buttonText.toLowerCase().includes('appel') || buttonText.toLowerCase().includes('call') || target.closest('a[href^="tel:"]')) {
                    buttonType = 'call';
               } else if (buttonText.toLowerCase().includes('whatsapp') || target.closest('a[href*="wa.me"]')) {
                    buttonType = 'navigation';
               } else if (target.closest('button') || target.closest('a')) {
                    buttonType = 'navigation';
               }

               setUserBehavior(prev => ({
                    ...prev,
                    buttonClicks: [...prev.buttonClicks, {
                         button: buttonText,
                         timestamp: Date.now(),
                         page: currentPage
                    }],
                    callButtonClicks: buttonType === 'call' ? prev.callButtonClicks + 1 : prev.callButtonClicks,
                    whatsappButtonClicks: buttonType === 'whatsapp' ? prev.whatsappButtonClicks + 1 : prev.whatsappButtonClicks,
                    lastActivity: Date.now()
               }));
          };

          const trackScroll = () => {
               const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
               const docHeight = document.documentElement.scrollHeight - window.innerHeight;
               const scrollPercent = Math.round((scrollTop / docHeight) * 100);

               setUserBehavior(prev => ({
                    ...prev,
                    scrollDepth: Math.max(prev.scrollDepth, scrollPercent),
                    lastActivity: Date.now()
               }));
          };

          let mouseMoveCount = 0;
          const trackMouseMove = () => {
               mouseMoveCount++;
               if (mouseMoveCount % 10 === 0) {
                    setUserBehavior(prev => ({
                         ...prev,
                         mouseMovements: mouseMoveCount,
                         lastActivity: Date.now()
                    }));
               }
          };

          document.addEventListener('click', trackButtonClick);
          document.addEventListener('scroll', trackScroll);
          document.addEventListener('mousemove', trackMouseMove);

          return () => {
               clearInterval(interval);
               if (form) {
                    form.removeEventListener('input', trackFormInteraction);
                    form.removeEventListener('focus', trackFormInteraction);
               }
               document.removeEventListener('click', trackButtonClick);
               document.removeEventListener('scroll', trackScroll);
               document.removeEventListener('mousemove', trackMouseMove);
          };
     }, []);

     useEffect(() => {
          setFormData(prev => ({ ...prev, phone: '' }));
          setErrors(prev => ({ ...prev, phone: '' }));
     }, [selectedCountry.code]);

     useEffect(() => {
         

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
                    case 'ZW':
                         detectedCountry = {
                              code: 'ZW',
                              name: 'Zimbabwe',
                              dialCode: '+263',
                              flag: '🇿🇼'
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
                    case 'GB':
                         detectedCountry = {
                              code: 'GB',
                              name: 'Royaume-Uni',
                              dialCode: '+44',
                              flag: '🇬🇧'
                         };
                         break;
                    case 'DE':
                         detectedCountry = {
                              code: 'DE',
                              name: 'Allemagne',
                              dialCode: '+49',
                              flag: '🇩🇪'
                         };
                         break;
                    case 'IT':
                         detectedCountry = {
                              code: 'IT',
                              name: 'Italie',
                              dialCode: '+39',
                              flag: '🇮🇹'
                         };
                         break;
                    case 'ES':
                         detectedCountry = {
                              code: 'ES',
                              name: 'Espagne',
                              dialCode: '+34',
                              flag: '🇪🇸'
                         };
                         break;
                    case 'PT':
                         detectedCountry = {
                              code: 'PT',
                              name: 'Portugal',
                              dialCode: '+351',
                              flag: '🇵🇹'
                         };
                         break;
                    case 'NL':
                         detectedCountry = {
                              code: 'NL',
                              name: 'Pays-Bas',
                              dialCode: '+31',
                              flag: '🇳🇱'
                         };
                         break;
                    case 'AT':
                         detectedCountry = {
                              code: 'AT',
                              name: 'Autriche',
                              dialCode: '+43',
                              flag: '🇦🇹'
                         };
                         break;
                    case 'SE':
                         detectedCountry = {
                              code: 'SE',
                              name: 'Suède',
                              dialCode: '+46',
                              flag: '🇸🇪'
                         };
                         break;
                    case 'NO':
                         detectedCountry = {
                              code: 'NO',
                              name: 'Norvège',
                              dialCode: '+47',
                              flag: '🇳🇴'
                         };
                         break;
                    case 'DK':
                         detectedCountry = {
                              code: 'DK',
                              name: 'Danemark',
                              dialCode: '+45',
                              flag: '🇩🇰'
                         };
                         break;
                    case 'FI':
                         detectedCountry = {
                              code: 'FI',
                              name: 'Finlande',
                              dialCode: '+358',
                              flag: '🇫🇮'
                         };
                         break;
                    case 'PL':
                         detectedCountry = {
                              code: 'PL',
                              name: 'Pologne',
                              dialCode: '+48',
                              flag: '🇵🇱'
                         };
                         break;
                    case 'CZ':
                         detectedCountry = {
                              code: 'CZ',
                              name: 'République tchèque',
                              dialCode: '+420',
                              flag: '🇨🇿'
                         };
                         break;
                    case 'SK':
                         detectedCountry = {
                              code: 'SK',
                              name: 'Slovaquie',
                              dialCode: '+421',
                              flag: '🇸🇰'
                         };
                         break;
                    case 'HU':
                         detectedCountry = {
                              code: 'HU',
                              name: 'Hongrie',
                              dialCode: '+36',
                              flag: '🇭🇺'
                         };
                         break;
                    case 'RO':
                         detectedCountry = {
                              code: 'RO',
                              name: 'Roumanie',
                              dialCode: '+40',
                              flag: '🇷🇴'
                         };
                         break;
                    case 'BG':
                         detectedCountry = {
                              code: 'BG',
                              name: 'Bulgarie',
                              dialCode: '+359',
                              flag: '🇧🇬'
                         };
                         break;
                    case 'HR':
                         detectedCountry = {
                              code: 'HR',
                              name: 'Croatie',
                              dialCode: '+385',
                              flag: '🇭🇷'
                         };
                         break;
                    case 'SI':
                         detectedCountry = {
                              code: 'SI',
                              name: 'Slovénie',
                              dialCode: '+386',
                              flag: '🇸🇮'
                         };
                         break;
                    case 'EE':
                         detectedCountry = {
                              code: 'EE',
                              name: 'Estonie',
                              dialCode: '+372',
                              flag: '🇪🇪'
                         };
                         break;
                    case 'LV':
                         detectedCountry = {
                              code: 'LV',
                              name: 'Lettonie',
                              dialCode: '+371',
                              flag: '🇱🇻'
                         };
                         break;
                    case 'LT':
                         detectedCountry = {
                              code: 'LT',
                              name: 'Lituanie',
                              dialCode: '+370',
                              flag: '🇱🇹'
                         };
                         break;
                    case 'GR':
                         detectedCountry = {
                              code: 'GR',
                              name: 'Grèce',
                              dialCode: '+30',
                              flag: '🇬🇷'
                         };
                         break;
                    case 'CY':
                         detectedCountry = {
                              code: 'CY',
                              name: 'Chypre',
                              dialCode: '+357',
                              flag: '🇨🇾'
                         };
                         break;
                    case 'MT':
                         detectedCountry = {
                              code: 'MT',
                              name: 'Malte',
                              dialCode: '+356',
                              flag: '🇲🇹'
                         };
                         break;
                    case 'IE':
                         detectedCountry = {
                              code: 'IE',
                              name: 'Irlande',
                              dialCode: '+353',
                              flag: '🇮🇪'
                         };
                         break;
                    case 'IS':
                         detectedCountry = {
                              code: 'IS',
                              name: 'Islande',
                              dialCode: '+354',
                              flag: '🇮🇸'
                         };
                         break;
                    case 'RU':
                         detectedCountry = {
                              code: 'RU',
                              name: 'Russie',
                              dialCode: '+7',
                              flag: '🇷🇺'
                         };
                         break;
                    case 'UA':
                         detectedCountry = {
                              code: 'UA',
                              name: 'Ukraine',
                              dialCode: '+380',
                              flag: '🇺🇦'
                         };
                         break;
                    case 'BY':
                         detectedCountry = {
                              code: 'BY',
                              name: 'Biélorussie',
                              dialCode: '+375',
                              flag: '🇧🇾'
                         };
                         break;
                    case 'MD':
                         detectedCountry = {
                              code: 'MD',
                              name: 'Moldavie',
                              dialCode: '+373',
                              flag: '🇲🇩'
                         };
                         break;
                    case 'GE':
                         detectedCountry = {
                              code: 'GE',
                              name: 'Géorgie',
                              dialCode: '+995',
                              flag: '🇬🇪'
                         };
                         break;
                    case 'AM':
                         detectedCountry = {
                              code: 'AM',
                              name: 'Arménie',
                              dialCode: '+374',
                              flag: '🇦🇲'
                         };
                         break;
                    case 'AZ':
                         detectedCountry = {
                              code: 'AZ',
                              name: 'Azerbaïdjan',
                              dialCode: '+994',
                              flag: '🇦🇿'
                         };
                         break;
                    case 'TR':
                         detectedCountry = {
                              code: 'TR',
                              name: 'Turquie',
                              dialCode: '+90',
                              flag: '🇹🇷'
                         };
                         break;
                    case 'IL':
                         detectedCountry = {
                              code: 'IL',
                              name: 'Israël',
                              dialCode: '+972',
                              flag: '🇮🇱'
                         };
                         break;
                    case 'LB':
                         detectedCountry = {
                              code: 'LB',
                              name: 'Liban',
                              dialCode: '+961',
                              flag: '🇱🇧'
                         };
                         break;
                    case 'SY':
                         detectedCountry = {
                              code: 'SY',
                              name: 'Syrie',
                              dialCode: '+963',
                              flag: '🇸🇾'
                         };
                         break;
                    case 'IQ':
                         detectedCountry = {
                              code: 'IQ',
                              name: 'Irak',
                              dialCode: '+964',
                              flag: '🇮🇶'
                         };
                         break;
                    case 'IR':
                         detectedCountry = {
                              code: 'IR',
                              name: 'Iran',
                              dialCode: '+98',
                              flag: '🇮🇷'
                         };
                         break;
                    case 'AF':
                         detectedCountry = {
                              code: 'AF',
                              name: 'Afghanistan',
                              dialCode: '+93',
                              flag: '🇦🇫'
                         };
                         break;
                    case 'PK':
                         detectedCountry = {
                              code: 'PK',
                              name: 'Pakistan',
                              dialCode: '+92',
                              flag: '🇵🇰'
                         };
                         break;
                    case 'IN':
                         detectedCountry = {
                              code: 'IN',
                              name: 'Inde',
                              dialCode: '+91',
                              flag: '🇮🇳'
                         };
                         break;
                    case 'BD':
                         detectedCountry = {
                              code: 'BD',
                              name: 'Bangladesh',
                              dialCode: '+880',
                              flag: '🇧🇩'
                         };
                         break;
                    case 'LK':
                         detectedCountry = {
                              code: 'LK',
                              name: 'Sri Lanka',
                              dialCode: '+94',
                              flag: '🇱🇰'
                         };
                         break;
                    case 'NZ':
                         detectedCountry = {
                              code: 'NZ',
                              name: 'Nouvelle-Zélande',
                              dialCode: '+64',
                              flag: '🇳🇿'
                         };
                         break;
                    case 'BR':
                         detectedCountry = {
                              code: 'BR',
                              name: 'Brésil',
                              dialCode: '+55',
                              flag: '🇧🇷'
                         };
                         break;
                    case 'AR':
                         detectedCountry = {
                              code: 'AR',
                              name: 'Argentine',
                              dialCode: '+54',
                              flag: '🇦🇷'
                         };
                         break;
                    case 'CL':
                         detectedCountry = {
                              code: 'CL',
                              name: 'Chili',
                              dialCode: '+56',
                              flag: '🇨🇱'
                         };
                         break;
                    case 'PE':
                         detectedCountry = {
                              code: 'PE',
                              name: 'Pérou',
                              dialCode: '+51',
                              flag: '🇵🇪'
                         };
                         break;
                    case 'CO':
                         detectedCountry = {
                              code: 'CO',
                              name: 'Colombie',
                              dialCode: '+57',
                              flag: '🇨🇴'
                         };
                         break;
                    case 'VE':
                         detectedCountry = {
                              code: 'VE',
                              name: 'Venezuela',
                              dialCode: '+58',
                              flag: '🇻🇪'
                         };
                         break;
                    case 'EC':
                         detectedCountry = {
                              code: 'EC',
                              name: 'Équateur',
                              dialCode: '+593',
                              flag: '🇪🇨'
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
     }, [countryCode, geolocationLoading, region, city]);

     /**
      * Saves form progress to localStorage
      * @param field - Field name to save
      * @param value - Field value to save
      */
     const saveProgressToLocalStorage = (field: string, value: string) => {
          try {
               console.log(`saveProgressToLocalStorage called for ${field}:`, value);
               const existing = localStorage.getItem(localStorageKey);
               const progress = existing ? JSON.parse(existing) : {};

               // Save the specific field
               progress[field] = value;

               // If saving firstname or lastname, also update the combined name
               if (field === 'firstname' || field === 'lastname') {
                    const currentFirstname = field === 'firstname' ? value : (progress.firstname || formData.firstname || '');
                    const currentLastname = field === 'lastname' ? value : (progress.lastname || formData.lastname || '');
                    progress.name = `${currentFirstname} ${currentLastname}`.trim();
               }

               progress.timestamp = Date.now();
               localStorage.setItem(localStorageKey, JSON.stringify(progress));
               console.log('Progress saved to LocalStorage:', progress);
          } catch (error) {
               console.error('Error saving progress to LocalStorage:', error);
          }
     };

     const clearProgressFromLocalStorage = () => {
          try {
               localStorage.removeItem(localStorageKey);
          } catch (error) {
               console.log('LocalStorage clear error:', error);
          }
     };

     /**
      * Generates French description of user behavior for sales team
      * @returns Formatted behavior analysis string
      */
     const generateBehaviorDescription = () => {
          const minutes = Math.floor(userBehavior.timeOnPage / 60000);
          const seconds = Math.floor((userBehavior.timeOnPage % 60000) / 1000);

          let description = `**Analyse détaillée du comportement utilisateur :**\n\n`;

          if (minutes > 0) {
               description += `⏱️ **Temps passé sur le site :** ${minutes} minute${minutes > 1 ? 's' : ''} et ${seconds} seconde${seconds > 1 ? 's' : ''}\n\n`;
          } else {
               description += `⏱️ **Temps passé sur le site :** ${seconds} seconde${seconds > 1 ? 's' : ''}\n\n`;
          }

          if (userBehavior.pagesVisited.length > 1) {
               const pageNames = userBehavior.pagesVisited.map(page => {
                    switch (page) {
                         case '/': return 'Page d\'accueil';
                         case '/about': return 'À propos';
                         case '/blog': return 'Blog';
                         case '/cas-client': return 'Cas clients';
                         default: return page.replace('/', '');
                    }
               });
               description += `📄 **Pages consultées :** ${pageNames.join(', ')}\n\n`;
          } else {
               description += `📄 **Page consultée :** ${userBehavior.pagesVisited[0] === '/' ? 'Page d\'accueil' : userBehavior.pagesVisited[0]}\n\n`;
          }

          if (userBehavior.formInteractions > 0) {
               description += `🎯 **Interactions avec le formulaire :** ${userBehavior.formInteractions} interaction${userBehavior.formInteractions > 1 ? 's' : ''}\n\n`;
          }

          if (userBehavior.buttonClicks.length > 0) {
               description += `🔘 **Boutons cliqués :** ${userBehavior.buttonClicks.length} clic${userBehavior.buttonClicks.length > 1 ? 's' : ''}\n`;

               if (userBehavior.callButtonClicks > 0) {
                    description += `📞 **Bouton d'appel utilisé :** ${userBehavior.callButtonClicks} fois - Utilisateur très intéressé !\n\n`;
               }

               if (userBehavior.whatsappButtonClicks > 0) {
                    description += `💬 **Bouton WhatsApp utilisé :** ${userBehavior.whatsappButtonClicks} fois - Préfère la communication directe\n\n`;
               }

               const recentClicks = userBehavior.buttonClicks.slice(-3);
               if (recentClicks.length > 0) {
                    const clickDetails = recentClicks.map(click => {
                         let cleanButtonText = click.button;

                         if (cleanButtonText.length > 50) {
                              cleanButtonText = cleanButtonText.substring(0, 50) + '...';
                         }

                         cleanButtonText = cleanButtonText.replace(/<[^>]*>/g, '');

                         return `${cleanButtonText} (${click.page})`;
                    }).join(', ');

                    description += `🎯 **Derniers clics :** ${clickDetails}\n\n`;
               }
          }

          if (userBehavior.scrollDepth > 0) {
               if (userBehavior.scrollDepth > 80) {
                    description += `📜 **Profondeur de défilement :** ${userBehavior.scrollDepth}% - Utilisateur très engagé, a lu tout le contenu\n\n`;
               } else if (userBehavior.scrollDepth > 50) {
                    description += `📜 **Profondeur de défilement :** ${userBehavior.scrollDepth}% - Utilisateur modérément engagé\n\n`;
               } else {
                    description += `📜 **Profondeur de défilement :** ${userBehavior.scrollDepth}% - Utilisateur peu engagé\n\n`;
               }
          }

          if (userBehavior.mouseMovements > 100) {
               description += `🖱️ **Mouvements de souris :** ${userBehavior.mouseMovements} - Utilisateur très actif et engagé\n\n`;
          } else if (userBehavior.mouseMovements > 50) {
               description += `🖱️ **Mouvements de souris :** ${userBehavior.mouseMovements} - Utilisateur modérément actif\n\n`;
          }

          let engagementScore = 0;
          if (userBehavior.timeOnPage > 300000) engagementScore += 3;
          else if (userBehavior.timeOnPage > 120000) engagementScore += 2;
          else engagementScore += 1;

          if (userBehavior.scrollDepth > 80) engagementScore += 2;
          else if (userBehavior.scrollDepth > 50) engagementScore += 1;

          if (userBehavior.callButtonClicks > 0) engagementScore += 3;
          if (userBehavior.whatsappButtonClicks > 0) engagementScore += 2;
          if (userBehavior.formInteractions > 5) engagementScore += 2;

          if (engagementScore >= 8) {
               description += `🔥 **Niveau d'engagement :** TRÈS ÉLEVÉ - Lead qualifié de haute qualité !\n`;
          } else if (engagementScore >= 5) {
               description += `🔥 **Niveau d'engagement :** Élevé - Utilisateur très intéressé\n`;
          } else if (engagementScore >= 3) {
               description += `🔥 **Niveau d'engagement :** Moyen - Utilisateur modérément intéressé\n`;
          } else {
               description += `🔥 **Niveau d'engagement :** Faible - Utilisateur peu engagé\n`;
          }


          description += `\n💡 **Recommandations commerciales :**\n`;

          if (userBehavior.callButtonClicks > 0) {
               description += `• Appeler rapidement - Utilisateur a montré un intérêt immédiat\n`;
          } else if (userBehavior.whatsappButtonClicks > 0) {
               description += `• Contacter via WhatsApp - Préfère ce canal de communication\n`;
          } else if (userBehavior.scrollDepth > 80) {
               description += `• Utilisateur a lu tout le contenu - Très bien informé\n`;
          } else if (userBehavior.timeOnPage > 300000) {
               description += `• Temps d'engagement élevé - Lead qualifié\n`;
          } else if (userBehavior.formInteractions > 10) {
               description += `• Utilisateur très actif sur le formulaire - Intérêt confirmé\n`;
          } else if (userBehavior.mouseMovements > 100) {
               description += `• Utilisateur très actif sur la page - Engagement élevé\n`;
          } else {
               description += `• Contacter dans les 4h - Lead standard à qualifier\n`;
          }

          return description;
     };

     /**
      * Stores partial contact info for API calls and lead tracking
      * @param field - Field being updated
      * @param value - New field value
      */
     const storePartialContact = async (field: string, value: string) => {
          if (!value.trim()) return;

          if (field !== 'firstname' && field !== 'lastname' && field !== 'email' && field !== 'phone' && field !== 'company' && field !== 'message') return;

          if (field === 'email') {
               if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    console.log('Email not complete yet, skipping partial storage');
                    return;
               }
               if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    console.log('Email format not valid, skipping partial storage');
                    return;
               }
          }

          if (field === 'phone' && !isPhoneValid(value)) {
               console.log('Phone not valid yet, skipping partial storage');
               return;
          }

          console.log(`Storing partial contact info for ${field}:`, value);

          saveProgressToLocalStorage(field, value);

          if (field === 'firstname' || field === 'lastname') {
               const newName = `${formData.firstname || ''} ${formData.lastname || ''}`.trim();
               setFormData(prev => ({ ...prev, name: newName }));

               const existing = localStorage.getItem(localStorageKey);
               const progress = existing ? JSON.parse(existing) : {};
               progress.name = newName;
               localStorage.setItem(localStorageKey, JSON.stringify(progress));
          }

          const progress = JSON.parse(localStorage.getItem(localStorageKey) || '{}');

          if (!progress.email && !progress.phone) {
               console.log('No email or phone yet - saving to LocalStorage only, will call API later');
               return;
          }

          console.log(`Calling API for ${field} - we have email: ${progress.email}, phone: ${progress.phone}`);

          try {
               const partialData = {
                    ...progress,
                    [field]: value,
                    phone: progress.phone ? ensurePhoneWithCountryCode(progress.phone) : progress.phone,
                    countryCode: selectedCountry.code,
                    countryName: selectedCountry.name,
                    city: city || '',
                    source: 'website_contact_form',
                    page: window.location.pathname === '/' ? 'home' : window.location.pathname.replace('/', ''),
                    timestamp: Date.now(),
                    brief_description: generateBehaviorDescription()
               };

               console.log('Sending partial data to API:', partialData);

               const response = await fetch('/api/contact/partial', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(partialData)
               });

               if (response.ok) {
                    const result = await response.json();
                    console.log(`Partial contact info stored successfully for ${field}:`, result);

                    if (progress.email || progress.phone) {
                         startPartialLeadTimer();
                    }
               } else {
                    console.error(`Failed to store partial contact info for ${field}:`, response.status);
               }
          } catch (error) {
               console.error('Error storing partial contact info:', error);
          }
     };

     const fallbackContactData: ContactData = {
          headline: "TRANSFORMONS ENSEMBLE",
          description: "Prêt à révolutionner votre entreprise ?",
          subdescription: "+112 entreprises nous font confiance. Rejoignez-les et découvrez pourquoi Odoo change la donne.",
          formTitle: "Parlons de votre projet",
          formDescription: "Échangeons sur vos défis et explorons ensemble comment Odoo peut transformer votre entreprise.",
          benefits: [
               {
                    title: "Partenaire Silver Officiel",
                    description: "Certification garantissant notre expertise technique reconnue par Odoo",
                    icon: "Award"
               },
               {
                    title: "Transformation Express",
                    description: "Digitalisez vos processus en quelques semaines, pas en mois",
                    icon: "Zap"
               },
               {
                    title: "Accompagnement Sécurisé",
                    description: "De l'audit stratégique à la mise en production, nous restons à vos côtés",
                    icon: "Shield"
               }
          ],
          consultation: {
               title: "Consultation Stratégique Offerte",
               description: "Recevez une analyse de vos besoins et une feuille de route claire pour votre transformation digitale, sans aucun engagement."
          },
          contactInfo: {
               phone: "",
               email: ""
          },
          guarantee: "Réponse garantie sous 4h en journée • Échange sans engagement"
     };

     const data = contactData || fallbackContactData;

     /**
      * Validates all form fields
      * @returns true if form is valid, false otherwise
      */
     const validateForm = () => {
          const newErrors: { [key: string]: string } = {};

          if (!formData.name.trim()) {
               newErrors.name = 'Le nom est requis';
          } else if (formData.name.trim().length < 2) {
               newErrors.name = 'Le nom doit contenir au moins 2 caractères';
          }

          if (!formData.email.trim()) {
               newErrors.email = 'L\'email est requis';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
               newErrors.email = 'Veuillez entrer un email valide (ex: john@example.com)';
          } else if (formData.email.length > 254) {
               newErrors.email = 'L\'email est trop long (maximum 254 caractères)';
          } else if (!/^[a-zA-Z0-9._%+-]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
               newErrors.email = 'Format d\'email invalide. Utilisez des caractères alphanumériques, points, tirets et underscores';
          } else if (formData.email.includes('..') || formData.email.includes('@@')) {
               newErrors.email = 'L\'email contient des caractères invalides consécutifs';
          } else {
               // Additional validation: check for common invalid TLDs and patterns
               const emailParts = formData.email.split('@');
               const domain = emailParts[1];
               const tld = domain.split('.').pop();

               // Check for invalid TLDs (common test domains)
               const invalidTlds = ['xr', 'test', 'invalid', 'fake', 'example'];
               if (invalidTlds.includes(tld?.toLowerCase() || '')) {
                    newErrors.email = 'Veuillez entrer un email valide avec un domaine réel';
               }

               // Check for suspicious patterns
               if (domain.includes('test.') || domain.includes('fake.') || domain.includes('invalid.')) {
                    newErrors.email = 'Veuillez entrer un email valide avec un domaine réel';
               }
          }

          if (!formData.phone.trim()) {
               newErrors.phone = 'Le téléphone est requis';
          } else {
               // Check if the phone number starts with the country code
               let phoneWithoutCountry: string;
               if (formData.phone.startsWith(selectedCountry.dialCode)) {
                    // Remove country code and spaces for validation
                    phoneWithoutCountry = formData.phone.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
               } else {
                    // If no country code, assume the entire number is the phone part
                    phoneWithoutCountry = formData.phone.replace(/\s/g, '');
               }

               // Specific validation for Morocco (9 digits)
               if (selectedCountry.code === 'MA') {
                    if (phoneWithoutCountry.length !== 9) {
                         newErrors.phone = 'Le numéro de téléphone marocain doit contenir exactement 9 chiffres';
                    } else if (!/^[0-9]+$/.test(phoneWithoutCountry)) {
                         newErrors.phone = 'Le numéro de téléphone ne peut contenir que des chiffres';
                    }
               } else {
                    // General validation for other countries
                    if (phoneWithoutCountry.length < 8) {
                         newErrors.phone = 'Le numéro de téléphone doit contenir au moins 8 chiffres';
                    } else if (phoneWithoutCountry.length > 15) {
                         newErrors.phone = 'Le numéro de téléphone est trop long';
                    } else if (!/^[0-9\s\-\(\)]+$/.test(phoneWithoutCountry)) {
                         newErrors.phone = 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets et parenthèses';
                    }
               }
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     /**
      * Validates phone number format for selected country
      * @param phoneNumber - Phone number to validate
      * @returns true if valid, false otherwise
      */
     const isPhoneValid = (phoneNumber: string) => {
          if (!phoneNumber.trim()) return false;

          // Check if the phone number starts with the country code
          let phoneWithoutCountry: string;
          if (phoneNumber.startsWith(selectedCountry.dialCode)) {
               // Remove country code and spaces for validation
               phoneWithoutCountry = phoneNumber.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
          } else {
               // If no country code, assume the entire number is the phone part
               phoneWithoutCountry = phoneNumber.replace(/\s/g, '');
          }

          // Specific validation for Morocco (9 digits)
          if (selectedCountry.code === 'MA') {
               return phoneWithoutCountry.length === 9 && /^[0-9]+$/.test(phoneWithoutCountry);
          }

          // General validation for other countries (8-15 digits)
          return phoneWithoutCountry.length >= 8 &&
               phoneWithoutCountry.length <= 15 &&
               /^[0-9\s\-\(\)]+$/.test(phoneWithoutCountry);
     };

     /**
      * Checks if form has minimum required data for submission
      * @returns true if form can be submitted, false otherwise
      */
     const isFormValid = () => {
          // Only require essential fields: name and email for basic submission
          const hasValidName = formData.name.trim().length >= 2;
          const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
               formData.email.length <= 254 &&
               /^[a-zA-Z0-9._%+-]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
               !formData.email.includes('..') &&
               !formData.email.includes('@@') &&
               !['xr', 'test', 'invalid', 'fake', 'example'].includes(formData.email.split('@')[1]?.split('.').pop()?.toLowerCase() || '') &&
               !formData.email.split('@')[1]?.includes('test.') &&
               !formData.email.split('@')[1]?.includes('fake.') &&
               !formData.email.split('@')[1]?.includes('invalid.');

          // Phone is recommended but not required for basic submission
          const hasValidPhone = isPhoneValid(formData.phone);

          // Basic validation: name and email are required
          const basicValid = hasValidName && hasValidEmail;

          // Full validation: name, email, and phone are all valid
          const fullValid = basicValid && hasValidPhone;

          // Check if geolocation is loaded (city should be available)
          const geolocationReady = !geolocationLoading && city;

         

          return basicValid && geolocationReady; // Require geolocation to be ready
     };

     /**
      * Starts 30-minute timer for partial lead tracking
      */
     const startPartialLeadTimer = useCallback(() => {
          if (!isFormValid()) return;

          const allFormData = {
               email: formData.email,
               firstname: formData.firstname,
               lastname: formData.lastname,
               phone: formData.phone,
               company: formData.company,
               message: formData.message,
               brief_description: generateBehaviorDescription(),
               hs_analytics_source: 'DIRECT_TRAFFIC',
               lifecyclestage: 'lead',
               hs_lead_status: 'NEW',
               country: countryCode || '',
               hs_country_region_code: countryCode || '',
               city: city || '',
               contact_status: 'partial lead',
               submission_count: '1',
               first_submission_date: new Date().toISOString().split('T')[0],
               last_submission_date: new Date().toISOString().split('T')[0]
          };

          if (partialLeadTimer.current) {
               clearTimeout(partialLeadTimer.current);
          }

          partialLeadTimer.current = setTimeout(async () => {
               try {
                    console.log('30-minute timer expired, checking if form was completed...');

                    const progress = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
                    if (progress.formCompleted) {
                         console.log('Form was already completed, skipping partial lead send');
                         return;
                    }

                    console.log('Form not completed, sending partial lead to HubSpot');

                    // Send partial lead to HubSpot
                    const response = await fetch('/api/contact/partial-hubspot', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(allFormData)
                    });

                    if (response.ok) {
                         const result = await response.json();
                         console.log('Partial lead sent to HubSpot successfully:', result);

                         if (result.submission && result.submission._id) {
                              try {
                                   const updateResponse = await fetch(`/api/contact/${result.submission._id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                             sentToHubSpot: true,
                                             hubspotContactId: result.hubspotResult?.contactId,
                                             hubspotSyncDate: new Date().toISOString(),
                                             status: 'partial_lead_sent'
                                        })
                                   });

                                   if (updateResponse.ok) {
                                        console.log('Database record updated successfully to mark as sent to HubSpot');
                                   } else {
                                        console.error('Failed to update database record:', updateResponse.status);
                                   }
                              } catch (updateError) {
                                   console.error('Error updating database record:', updateError);
                              }
                         }

                         clearProgressFromLocalStorage();
                    } else {
                         const errorData = await response.json();
                         console.error('Failed to send partial lead to HubSpot:', response.status, errorData);
                    }
               } catch (error) {
                    console.error('Error sending partial lead to HubSpot:', error);
               }
          }, 30 * 60 * 1000);
     }, [formData, countryCode, city, isFormValid]);

     /**
      * Ensures phone number has proper country code format
      * @param phone - Phone number to format
      * @returns Formatted phone number with country code
      */
     const ensurePhoneWithCountryCode = (phone: string) => {
          if (!phone) return '';

          // If phone already starts with country code, return as is
          if (phone.startsWith(selectedCountry.dialCode)) {
               return phone;
          }

          // If phone starts with +, it might have a different country code, extract just the number
          if (phone.startsWith('+')) {
               const numberPart = phone.replace(/^\+\d+\s*/, '');
               return `${selectedCountry.dialCode} ${numberPart}`;
          }

          // Otherwise, add country code
          return `${selectedCountry.dialCode} ${phone}`;
     };

     /**
      * Handles country selection change
      * @param country - Selected country object
      */
     const handleCountryChange = (country: Country) => {
          setSelectedCountry(country);

          setFormData(prev => ({ ...prev, phone: '' }));
          setErrors(prev => ({ ...prev, phone: '' }));

          try {
               const existing = localStorage.getItem(localStorageKey);
               if (existing) {
                    const progress = JSON.parse(existing);
                    progress.phone = '';
                    localStorage.setItem(localStorageKey, JSON.stringify(progress));
               }
          } catch (error) {
               console.log('Error clearing phone from LocalStorage:', error);
          }
     };

     /**
      * Formats phone number with proper spacing
      * @param value - Raw phone number input
      * @returns Formatted phone number string
      */
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
          } else if (digits.length <= 10) {
               return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
          } else {
               // For longer numbers, just add spaces every 2 digits
               return digits.match(/.{1,2}/g)?.join(' ') || digits;
          }
     };

     /**
      * Handles phone number input changes with validation
      * @param value - New phone number value
      */
     const handlePhoneChange = (value: string) => {
          const formatted = formatPhoneNumber(value);
          const fullNumber = selectedCountry.dialCode + ' ' + formatted;
          handleInputChange('phone', fullNumber);

          if (fullNumber.trim()) {
               if (!isPhoneValid(fullNumber)) {
                    const phoneWithoutCountry = fullNumber.replace(selectedCountry.dialCode, '').replace(/\s/g, '');
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
                              errorMessage = 'Le numéro de téléphone est trop long';
                         } else {
                              errorMessage = 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets et parenthèses';
                         }
                    }

                    setErrors(prev => ({
                         ...prev,
                         phone: errorMessage
                    }));
               } else {
                    setErrors(prev => ({
                         ...prev,
                         phone: ''
                    }));
               }
          } else {
               setErrors(prev => ({
                    ...prev,
                    phone: ''
               }));
          }
     };

     /**
      * Handles form submission with validation and API calls
      * @param e - Form submit event
      */
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (!validateForm()) {
               toast({
                    variant: "destructive",
                    title: "Erreur de validation",
                    description: "Veuillez corriger les erreurs dans le formulaire.",
               });
               return;
          }

          if (!isPhoneValid(formData.phone)) {
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
                         errorMessage = 'Le numéro de téléphone est trop long';
                    } else {
                         errorMessage = 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets et parenthèses';
                    }
               }

               setErrors(prev => ({
                    ...prev,
                    phone: errorMessage
               }));
               toast({
                    variant: "destructive",
                    title: "Erreur de validation",
                    description: "Veuillez corriger le numéro de téléphone.",
               });
               return;
          }

          setIsSubmitting(true);
          setSubmitError('');

          try {
               // Create standardized form data
               const standardFormData: StandardFormData = {
                    name: formData.name || `${formData.firstname || ''} ${formData.lastname || ''}`.trim().replace(/\s+/g, ' '),
                    company: formData.company,
                    email: formData.email,
                    phone: ensurePhoneWithCountryCode(formData.phone),
                    message: formData.message
               };

               // Additional data for tracking
               const additionalData = {
                    countryCode: selectedCountry.code,
                    countryName: selectedCountry.name,
                    city: city || '',
                    source: 'website_contact_form',
                    page: window.location.pathname === '/' ? 'home' : window.location.pathname.replace('/', ''),
                    submitted_at: new Date().toISOString(),
                    userBehavior: generateBehaviorDescription(),
                    brief_description: generateBehaviorDescription(),
                    firstname: formData.firstname || '',
                    lastname: formData.lastname || ''
               };

               console.log('Standardized form data:', standardFormData);
               console.log('Additional data:', additionalData);

               // Use the standardized form submission
               const result = await submitForm(
                    standardFormData,
                    additionalData,
                    '/api/contact',
                    'contact_form'
               );

               if (result.success) {
                    console.log('Contact form submitted successfully:', result.data);

                    if (partialLeadTimer.current) {
                         clearTimeout(partialLeadTimer.current);
                         partialLeadTimer.current = null;
                         console.log('1-minute timer cleared - form completed successfully');
                    }

                    try {
                         const progress = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
                         progress.formCompleted = true;
                         progress.completedAt = Date.now();
                         localStorage.setItem(localStorageKey, JSON.stringify(progress));
                         console.log('Form marked as completed in LocalStorage');
                    } catch (error) {
                         console.log('Error updating LocalStorage completion status:', error);
                    }

                    clearProgressFromLocalStorage();

                    setIsSubmitted(true);
                    setFormData({
                         name: '',
                         firstname: '',
                         lastname: '',
                         email: '',
                         company: '',
                         phone: '',
                         message: '',
                         countryCode: 'MA'
                    });

                    toast({
                         title: "Message envoyé !",
                         description: "Nous vous répondrons dans les 4 heures.",
                         duration: 5000,
                    });
               } else {
                    console.error('Form submission failed:', result.error);
                    const errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
                    setSubmitError(errorMessage);

                    toast({
                         variant: "destructive",
                         title: "Erreur d'envoi",
                         description: errorMessage,
                    });
               }
          } catch (error) {
               console.error('Error submitting form:', error);
               const errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
               setSubmitError(errorMessage);

               toast({
                    variant: "destructive",
                    title: "Erreur de connexion",
                    description: errorMessage,
               });
          } finally {
               setIsSubmitting(false);
          }
     };

     /**
      * Handles input field changes with validation and storage
      * @param field - Field name being changed
      * @param value - New field value
      */
     const handleInputChange = (field: string, value: string) => {
          console.log(`=== INPUT CHANGE DEBUG ===`);
          console.log(`Field: ${field}`);
          console.log(`Value: ${value}`);
          console.log(`Previous form data:`, formData);

          // Update form state directly
          const newFormData = { ...formData, [field]: value };
          console.log(`New form data:`, newFormData);

          setFormData(newFormData);

          if (errors[field]) {
               setErrors(prev => ({ ...prev, [field]: '' }));
          }

          try {
               const existing = localStorage.getItem(localStorageKey);
               const progress = existing ? JSON.parse(existing) : {};

               progress[field] = value;
               progress.timestamp = Date.now();
               progress.fieldsFilled = progress.fieldsFilled || [];

               if (!progress.fieldsFilled.includes(field)) {
                    progress.fieldsFilled.push(field);
               }

               console.log(`Saving to LocalStorage:`, progress);
               localStorage.setItem(localStorageKey, JSON.stringify(progress));

               const saved = localStorage.getItem(localStorageKey);
               console.log(`Verification - saved:`, saved);

          } catch (error) {
               console.error('LocalStorage error:', error);
          }

          if (value.trim() && (field === 'name' || field === 'email' || field === 'phone' || field === 'company' || field === 'message')) {
               storePartialContact(field, value);
          }

          console.log(`=== END INPUT CHANGE DEBUG ===`);
     };

     const benefits = [
          {
               icon: Award,
               title: "Partenaire Silver Officiel",
               description: "Certification garantissant notre expertise technique reconnue par Odoo"
          },
          {
               icon: Zap,
               title: "Transformation Express",
               description: "Digitalisez vos processus en quelques semaines, pas en mois"
          },
          {
               icon: Shield,
               title: "Accompagnement Sécurisé",
               description: "De l'audit stratégique à la mise en production, nous restons à vos côtés"
          }
     ];

     return (
          <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-[var(--odoo-purple-light)]">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         className="text-center mb-12 sm:mb-16"
                    >
                         <div 
                              className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2"
                              dangerouslySetInnerHTML={{ __html: data.headline }}
                         />
                         <h2 
                              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                              dangerouslySetInnerHTML={{ __html: data.description }}
                         />
                         <p 
                              className="text-lg text-gray-600 max-w-3xl mx-auto"
                              dangerouslySetInnerHTML={{ __html: data.subdescription || '' }}
                         />
                    </motion.div>

                    <div className="max-w-6xl mx-auto">
                         <Card className="border border-gray-200 hover:border-[var(--color-secondary)] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-white rounded-2xl p-8">
                              {/* Form Side */}                                 
                             <div className="iclosed-widget" data-url="https://app.iclosed.io/e/warrenblackswan/rendez-vous-avec-warren-blackswan" title="Rendez-vous avec Warren"></div> <script type="text/javascript" src="https://app.iclosed.io/assets/widget.js" async></script> 
                         </Card>
                   </div>
               </div>
          </section>
     );
}