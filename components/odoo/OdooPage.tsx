"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  ShoppingCart, 
  Package, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Quote, 
  Rocket,
  Check,
  X
} from 'lucide-react';
import OdooHeroSplit from './OdooHeroSplit';
import Image from 'next/image';
import Loader from '@/components/home/Loader';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  result: string;
  avatar: string;
  company?: string;
}

interface OdooData {
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
  };
  trustMetrics: Array<{
    number: number;
    suffix: string;
    label: string;
  }>;
  platformSection: {
    headline: string;
    subheadline: string;
    apps: Array<{
      icon: string;
      title: string;
      description: string;
      features: string[];
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
    plans: Array<{
      name: string;
      description: string;
      monthlyPrice: number;
      yearlyPrice: number;
      popular: boolean;
      consultantHours: string;
      features: string[];
      cta: string;
    }>;
  };
  partnership: {
    headline: string;
    description: string;
    modules: string[];
    expertiseText: string;
  };
  testimonials: string[];
  testimonialsSection: {
    headline: string;
    description: string;
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

interface OdooPageNewProps {
  isPreview?: boolean;
}

function OdooPage({ isPreview = false }: OdooPageNewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');
  const [odooData, setOdooData] = useState<OdooData | null>(null);
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    
    // Fetch Odoo data
    fetchOdooData();
    fetchTestimonials();
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const fetchOdooData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const response = await fetch(`${baseUrl}/api/content?type=odoo-page`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          setOdooData(data[0].content);
        }
      }
    } catch (error) {
      console.error('Error fetching Odoo data:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const response = await fetch(`${baseUrl}/api/content?type=testimonial`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTestimonials(data.map((item: any) => ({ ...item.content, _id: item._id })));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  if (!odooData) {
    return <Loader />;
  }

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
      Calculator: <Calculator className="w-8 h-8" />,
      ShoppingCart: <ShoppingCart className="w-8 h-8" />,
      Package: <Package className="w-8 h-8" />,
      Users: <Users className="w-8 h-8" />,
      Rocket: <Rocket className="w-5 h-5" />,
      ArrowRight: <ArrowRight className="w-5 h-5" />,
      Check: <Check className="w-3 h-3" />,
      CheckCircle: <CheckCircle className="w-10 h-10" />,
      Quote: <Quote className="w-10 h-10" />
    };
    return iconMap[iconName] || <Calculator className="w-8 h-8" />;
  };

  const renderAvatar = (testimonialId: string) => {
    const testimonial = availableTestimonials.find(t => t._id === testimonialId);
    if (!testimonial) return null;

    // Check if avatar is a URL (starts with http or /)
    if (testimonial.avatar && (testimonial.avatar.startsWith('http') || testimonial.avatar.startsWith('/'))) {
      return (
        <Image 
          src={testimonial.avatar} 
          alt={testimonial.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    } else {
      // Use initials
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{testimonial.avatar || testimonial.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
      );
    }
  };

  // Split apps into 3 columns for timelines
  const timeline1 = odooData?.platformSection?.apps?.slice(0, 6) || [];
  const timeline2 = odooData?.platformSection?.apps?.slice(6, 12) || [];
  const timeline3 = odooData?.platformSection?.apps?.slice(12, 18) || [];

  const handleAsyncAction = async (action: () => Promise<void>, type: string) => {
    setIsLoading(true);
    setLoadingType(type);
    try {
      await action();
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleConsultationClick = async () => {
    await handleAsyncAction(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // router.push('/contact');
    }, 'appointment');
  };

  const handleCaseStudyClick = async () => {
    await handleAsyncAction(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // router.push('/contact');
    }, 'projects');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('MAD', 'Dhs');
  };

  function PricingCardsSection() {
    const [isYearly, setIsYearly] = useState(false);

    // Add null check for odooData
    if (!odooData) {
      return <Loader />;
    }

    // Get all features from the Ultra pack (last plan)
    const ultraFeatures = odooData.pricing.plans[odooData.pricing.plans.length - 1].features;

    return (
      <>
        {/* Billing Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative px-6 py-2 text-sm font-medium rounded-md transition-all ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative px-6 py-2 text-sm font-medium rounded-md transition-all ${
                isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-green-800" style={{ background: 'var(--color-secondary)', color: 'white' }}>
                Économisez 17%
              </span>
            </button>
          </div>
        </div>
        {/* Pricing Cards */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-4">
          {odooData.pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 ${
                plan.popular
                  ? 'ring-2'
                  : 'hover:shadow-xl transition-shadow duration-300'
              }`}
              style={plan.popular ? { borderColor: 'var(--color-secondary)', transform: 'scale(1.05)' } : {}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold text-white"
                    style={{ background: 'var(--color-secondary)' }}
                  >
                    Recommandé
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              {/* Consultant Hours */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Consultant dédié</p>
                <p
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {plan.consultantHours}
                </p>
              </div>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /mois
                </span>
              </p>
              {isYearly && (
                <p className="mt-1 text-sm text-gray-500">
                  {formatPrice(plan.yearlyPrice * 12)} facturé annuellement
                </p>
              )}
              <ul role="list" className="mt-6 space-y-2 text-sm leading-6 text-gray-600">
                {ultraFeatures.map((feature) => {
                  const hasFeature = plan.features.includes(feature);
                  return (
                    <li key={feature} className="flex gap-x-2 items-center">
                      {hasFeature ? (
                        <Check className="h-5 w-4 flex-none text-green-600" aria-hidden="true" />
                      ) : (
                        <X className="h-5 w-4 flex-none text-red-500" aria-hidden="true" />
                      )}
                      <span className={`text-xs ${hasFeature ? '' : 'text-red-500 line-through'}`}>{feature}</span>
                    </li>
                  );
                })}
              </ul>
              <button
                className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors`}
                style={
                  plan.popular
                    ? {
                        background: 'var(--color-secondary)',
                        color: 'white',
                        borderColor: 'var(--color-secondary)'
                      }
                    : {
                        background: 'white',
                        color: 'var(--color-secondary)',
                        border: '1px solid var(--color-secondary)'
                      }
                }
              >
                {plan.cta}
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <OdooHeroSplit heroData={odooData.hero} isPreview={isPreview} />

      {/* Trust Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {odooData.trustMetrics.map((metric, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-2">
                  <AnimatedCounter target={metric.number} suffix={metric.suffix} />
                </div>
                <div className="text-gray-600 font-medium text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Timeline Carousels */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              {odooData.platformSection.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.platformSection.headline.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              {odooData.platformSection.subheadline}
            </p>
          </div>

          {/* Three Vertical Timelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px] relative">
            {/* Timeline 1 - Scrolling Up */}
            <div className="relative overflow-hidden rounded-2xl timeline-container">
              <div className="flex flex-col space-y-6 animate-scroll-up">
                {[...timeline1, ...timeline1].map((app, index) => (
                  <div 
                    key={`timeline1-${index}`}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <img 
                        src={app.icon} 
                        alt={app.title}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback to a default icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                          <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline 2 - Scrolling Down */}
            <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
              <div className="flex flex-col space-y-6 animate-scroll-down">
                {[...timeline2, ...timeline2].map((app, index) => (
                  <div 
                    key={`timeline2-${index}`}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <img 
                        src={app.icon} 
                        alt={app.title}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback to a default icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                          <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline 3 - Scrolling Up (Slower) */}
            <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
              <div className="flex flex-col space-y-6 animate-scroll-up-slow">
                {[...timeline3, ...timeline3].map((app, index) => (
                  <div 
                    key={`timeline3-${index}`}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <img 
                        src={app.icon} 
                        alt={app.title}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback to a default icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[var(--color-secondary)] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                          <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlays for smooth infinite effect */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Our Odoo Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              {odooData.services.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.services.headline.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              {odooData.services.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {odooData.services.capabilities.map((capability, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-secondary)]/20 transition-colors">
                    <div className="text-[var(--color-secondary)]">{getIconComponent(capability.icon)}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{capability.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{capability.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarification Odoo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              {odooData.pricing.headline.split(' ')[0]} <span style={{ color: 'var(--color-secondary)' }}>{odooData.pricing.headline.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              {odooData.pricing.subheadline}
            </p>
          </div>
          <PricingCardsSection />
        </div>
      </section>

      {/* Odoo Partnership */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-main)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="rounded-2xl p-4 bg-white">
              <div className="text-2xl font-bold text-[var(--color-secondary)]">ODOO</div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {odooData.partnership.headline.split(' ')[0]} <span className="font-semibold">{odooData.partnership.headline.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            {odooData.partnership.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {odooData.partnership.modules.map((module, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-4 group-hover:animate-pulse" />
                <div className="text-white font-semibold text-lg">{module}</div>
                <div className="text-white/80 text-sm font-medium">{odooData.partnership.expertiseText || 'Expertise Certifiée'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {odooData && odooData.testimonials && odooData.testimonials.length > 0 && (
        <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                Approuvé par les <span className="text-orange-600">Leaders</span>
            </h2>
              <p className="text-lg text-gray-600">
                Découvrez comment nous avons aidé des entreprises à transformer leur business avec Odoo
            </p>
          </div>

            <div className="grid md:grid-cols-2 gap-6">
              {odooData.testimonials.map((testimonialId: string, index: number) => {
                const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                if (!testimonial) return null;
                
                return (
                  <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <Quote className="w-10 h-10 text-orange-600 mb-5 group-hover:animate-pulse" />
                    <blockquote className="text-base text-gray-800 mb-5 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                      {renderAvatar(testimonialId)}
                  <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                        {testimonial.result && (
                          <div className="text-orange-600 font-semibold">{testimonial.result}</div>
                        )}
                  </div>
                </div>
              </div>
                );
              })}
          </div>
        </div>
      </section>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {odooData.finalCta.headline.split(' ')[0]} <span className="text-[var(--color-secondary)]">{odooData.finalCta.headline.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            {odooData.finalCta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="group bg-[var(--color-secondary)] text-white px-8 py-4 rounded-lg hover:bg-[var(--color-secondary)]/90 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
              onClick={handleConsultationClick}
              disabled={isLoading}
            >
              {getIconComponent(odooData.finalCta.ctaPrimary.icon)}
              <span>{loadingType === 'appointment' ? 'CHARGEMENT...' : odooData.finalCta.ctaPrimary.text}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
              onClick={handleCaseStudyClick}
              disabled={isLoading}
            >
              {getIconComponent(odooData.finalCta.ctaSecondary.icon)}
              <span>{loadingType === 'projects' ? 'CHARGEMENT...' : odooData.finalCta.ctaSecondary.text}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-secondary)]"></div>
            <span className="text-lg font-semibold text-gray-700">Chargement...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes scroll-up-slow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll-up {
          animation: scroll-up 60s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 60s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up-slow 80s linear infinite;
        }

        .timeline-container:hover .animate-scroll-up,
        .timeline-container:hover .animate-scroll-down,
        .timeline-container:hover .animate-scroll-up-slow {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default OdooPage;