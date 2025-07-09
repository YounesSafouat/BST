"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  Mail
} from 'lucide-react';
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

function HubSpotPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hubspotData, setHubspotData] = useState<HubSpotData | null>(null);
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    
    // Fetch HubSpot data
    fetchHubSpotData();
    fetchTestimonials();
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const fetchHubSpotData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const response = await fetch(`${baseUrl}/api/content?type=hubspot-page`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content) {
          setHubspotData(data[0].content);
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

  if (!hubspotData) {
    return (
      <Loader/>
    );
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
        <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main)] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{testimonial.avatar || testimonial.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-main)]/10 via-white to-[var(--color-main)]/10 pb-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 md:mt-[15em]">
          <div className="text-center">
            
            {/* Main Headline */}
            <h1 className={`text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text ">
                  {hubspotData.hero.headline.split(' ')[0]}
                </span>
                <Image
                  src={hubspotData.hero.logo}
                  alt="HubSpot Logo"
                  className="w-32 md:w-60 h-auto align-text-bottom"
                  width={240}
                  height={60}
                  priority
                />
              </span>
              <br />
              <span className="bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main)] bg-clip-text text-transparent animate-gradient">
                {hubspotData.hero.headline.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className={`text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {hubspotData.hero.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="group bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main)] text-white px-6 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 font-bold transform hover:scale-105 hover:-translate-y-1">
                {getIconComponent(hubspotData.hero.ctaPrimary.icon)}
                <span>{hubspotData.hero.ctaPrimary.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-[var(--color-main)] hover:text-[var(--color-main)] transition-all duration-300 flex items-center justify-center space-x-2 font-bold transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                {getIconComponent(hubspotData.hero.ctaSecondary.icon)}
                <span>{hubspotData.hero.ctaSecondary.text}</span>
              </button>
            </div>

            {/* Floating icons animation */}
            <div className="absolute top-20 left-10 animate-float hidden md:block">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Settings className="w-8 h-8 text-[var(--color-main)] animate-spin-slow" />
              </div>
            </div>
            <div className="absolute top-32 right-10 animate-float-delayed hidden md:block">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trust Metrics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {hubspotData.trustMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-[var(--color-main)] mb-2">
                  <AnimatedCounter target={metric.number} suffix={metric.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-[var(--color-main)]/10 via-white to-[var(--color-main)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              {hubspotData.finalCta.headline}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {hubspotData.finalCta.description}
            </p>
          </div>

          {/* HubSpot Cards in CTA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {hubspotData.hubCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 text-left flex flex-col hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Image src={card.icon} alt={`${card.title} icon`} width={28} height={28} />
                  <h3 className="text-2xl font-bold ml-3 text-gray-800">{card.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 flex-grow h-24">{card.description}</p>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Popular Features</h4>
                  <ul className="space-y-3">
                    {card.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-gray-700">
                        <div className="w-5 h-5 bg-[var(--color-main)] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full mt-auto bg-[var(--color-main)] text-white font-semibold py-3 px-4 rounded-md hover:bg-[var(--color-main)]/90 transition-colors">
                  Learn more
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our HubSpot Services */}
      <section className="py-16 bg-gradient-to-br from-[var(--color-main)]/10 to-[var(--color-main)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Implémentation <span className="text-[var(--color-main)]">HubSpot Complète</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre certification platinum signifie que nous avons une expertise approfondie dans tous les hubs HubSpot et les fonctionnalités avancées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hubspotData.hubspotCapabilities.map((capability, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 border-2 border-[var(--color-main)]/20 hover:border-[var(--color-main)]/40 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main)] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:animate-bounce">
                    <div className="text-white">{getIconComponent(capability.icon)}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-main)] transition-colors">{capability.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{capability.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* HubSpot Certifications */}
     <section className="py-16 bg-gradient-to-r from-[var(--color-main)] via-[var(--color-main)] to-[var(--color-main)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            {hubspotData.partnership.headline}
          </h2>
          <p className="text-lg text-[var(--color-main)]/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {hubspotData.partnership.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {hubspotData.partnership.hubs.map((hub, index) => (
              <div key={index} className={`group bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 hover:bg-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 delay-${index * 100}`}>
                <CheckCircle className="w-10 h-10 text-white mx-auto mb-3 group-hover:animate-bounce" />
                <div className="text-white font-bold text-base">{hub}</div>
                <div className="text-[var(--color-main)]/90 text-xs font-semibold">Certifié</div>
              </div>
            ))}
          </div>
        </div>
      </section>       

      {/* Testimonials */}
      {hubspotData.testimonials.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Approuvé par les <span className="text-[var(--color-main)]">Leaders</span>
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez comment nous avons aidé des entreprises à transformer leur business avec HubSpot
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
              {hubspotData.testimonials.map((testimonialId, index) => {
                const testimonial = availableTestimonials.find(t => t._id === testimonialId);
                if (!testimonial) return null;
                
                return (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <Quote className="w-10 h-10 text-[var(--color-main)] mb-5 group-hover:animate-pulse" />
                <blockquote className="text-base text-gray-800 mb-5 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                      {renderAvatar(testimonialId)}
                  <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                        {testimonial.result && (
                          <div className="text-[var(--color-main)] font-semibold">{testimonial.result}</div>
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

     
    </div>
  );
}

export default HubSpotPage;