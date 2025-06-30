"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  MapPin,
  Clock
} from 'lucide-react';

export default function HubSpotPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const hubspotCapabilities = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Marketing Hub - Implémentation",
      description: "Configuration complète de l'automatisation marketing avec scoring de leads avancé, campagnes email et optimisation des conversions."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sales Hub - Configuration",
      description: "Gestion de pipeline, suivi des opportunités et automatisation des ventes pour accélérer votre croissance commerciale."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Service Hub - Intégration",
      description: "Flux de travail service client, système de ticketing et base de connaissances pour un support exceptionnel."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Operations Hub - Configuration",
      description: "Synchronisation des données, automatisation des workflows et intégrations personnalisées dans votre écosystème tech."
    }
  ];

  const trustMetrics = [
    { number: 500, suffix: "+", label: "Intégrations HubSpot" },
    { number: 98, suffix: "%", label: "Taux de Réussite" },
    { number: 5, suffix: " Ans", label: "Partenariat HubSpot" },
    { number: 24, suffix: "/7", label: "Support Expert" }
  ];

  const testimonials = [
    {
      quote: "Leur expertise HubSpot a transformé tout notre processus de vente. Nous avons vu une augmentation de 300% des leads qualifiés dès le premier trimestre.",
      author: "Sophie Martin",
      role: "Directrice Marketing",
      company: "TechScale France"
    },
    {
      quote: "Le niveau de connaissance HubSpot qu'ils ont apporté à notre implémentation était exceptionnel. La productivité de notre équipe a doublé du jour au lendemain.",
      author: "Marc Dubois",
      role: "Directeur Commercial",
      company: "Growth Dynamics"
    }
  ];

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

  const hubCards = [
    {
      icon: "/icones/MarketingHub_Icon_2023_Gradient_RGB_24px (1).svg",
      title: "Marketing Hub®",
      description: "AI-powered marketing software that helps you generate leads and automate marketing.",
      features: [
        "Breeze social media agent",
        "Marketing automation",
        "Analytics"
      ]
    },
    {
      icon: "/icones/SalesHub_Icon_Gradient_RGB_24px.svg",
      title: "Sales Hub®",
      description: "Easy-to-adopt sales software that leverages AI to build pipelines and close deals.",
      features: [
        "Sales workspace",
        "Deal management",
        "Breeze prospecting agent"
      ]
    },
    {
      icon: "/icones/ServiceHub_Icon_Gradient_RGB_24px.svg",
      title: "Service Hub®",
      description: "Customer service software powered by AI to scale support and drive retention.",
      features: [
        "Omni-channel help desk",
        "Breeze customer agent",
        "Customer success workspace"
      ]
    },
    {
      icon: "/icones/OperationsHub_Icon_Gradient_RGB_24px.svg",
      title: "Service Hub®",
      description: "Customer service software powered by AI to scale support and drive retention.",
      features: [
        "Omni-channel help desk",
        "Breeze customer agent",
        "Customer success workspace"
      ]
    },
    {
      icon: "/icones/Product Icon one-1.svg",
      title: "Service Hub®",
      description: "Customer service software powered by AI to scale support and drive retention.",
      features: [
        "Omni-channel help desk",
        "Breeze customer agent",
        "Customer success workspace"
      ]
    },
    {
      icon: "/icones/Product_Icon_Only_CommerceHub.svg",
      title: "Service Hub®",
      description: "Customer service software powered by AI to scale support and drive retention.",
      features: [
        "Omni-channel help desk",
        "Breeze customer agent",
        "Customer success workspace"
      ]
    }
  ];

  const handleConsultationClick = () => {
    router.push('/contact');
  };

  const handleCaseStudyClick = () => {
    router.push('/contact');
  };

  const handleLearnMoreClick = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden ">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-main rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-main rounded-full mr-2"></span>
                PARTENAIRE OFFICIEL HUBSPOT
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black mb-6 leading-tight">
              HubSpot CRM au <span className="text-main">Maroc</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray mb-8 max-w-4xl mx-auto leading-relaxed">
              Implémentation, formation et accompagnement complet pour transformer votre relation client avec la plateforme CRM leader mondial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={handleConsultationClick}
                className="group bg-main text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-main transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                <span>Consultation Gratuite</span>
              </button>
              
              <button 
                onClick={handleCaseStudyClick}
                className="group bg-white text-main px-8 py-4 rounded-xl font-bold text-lg border-2 border-main hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
              >
                <Play className="w-5 h-5 group-hover:animate-pulse" />
                <span>Voir Nos Cas d'Étude</span>
              </button>
            </div>

            {/* Floating icons animation */}
            <div className="absolute top-20 left-10 animate-float">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Settings className="w-8 h-8 text-main animate-spin-slow" />
              </div>
            </div>
            <div className="absolute top-32 right-10 animate-float-delayed">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-4">
              Prêt à Transformer <span className="text-main">Votre Business ?</span>
            </h2>
            <p className="text-lg text-gray max-w-3xl mx-auto leading-relaxed">
              Laissez nos experts HubSpot concevoir et implémenter une solution qui génère de vrais résultats pour votre entreprise.
            </p>
          </div>

          {/* HubSpot Cards in CTA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {hubCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 text-left flex flex-col hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Image src={card.icon} alt={`${card.title} icon`} width={28} height={28} />
                  <h3 className="text-2xl font-bold ml-3 text-black">{card.title}</h3>
                </div>
                <p className="text-gray mb-6 flex-grow h-24">{card.description}</p>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-semibold text-black mb-4">Popular Features</h4>
                  <ul className="space-y-3">
                    {card.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-gray">
                        <div className="w-5 h-5 bg-main rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className="w-full mt-auto bg-main text-white font-semibold py-3 px-4 rounded-md hover:bg-main transition-colors"
                  onClick={handleLearnMoreClick}
                >
                  Learn more
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our HubSpot Services */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-4">
              Implémentation <span className="text-main">HubSpot Complète</span>
            </h2>
            <p className="text-lg text-gray max-w-3xl mx-auto">
              Notre certification platinum signifie que nous avons une expertise approfondie dans tous les hubs HubSpot et les fonctionnalités avancées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hubspotCapabilities.map((capability, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:animate-bounce">
                    <div className="text-white">{capability.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-main transition-colors">{capability.title}</h3>
                    <p className="text-gray leading-relaxed text-sm">{capability.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
     {/* HubSpot Certifications */}
     <section className="py-16 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Partenaire HubSpot <span className="animate-pulse">platinum</span>
          </h2>
          <p className="text-lg text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Notre certification platinum représente le plus haut niveau d'expertise HubSpot, 
            avec un succès prouvé dans les implémentations d'entreprise.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Marketing Hub', 'Sales Hub', 'Service Hub', 'Operations Hub'].map((hub, index) => (
              <div key={index} className={`group bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 hover:bg-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 delay-${index * 100}`}>
                <CheckCircle className="w-10 h-10 text-white mx-auto mb-3 group-hover:animate-bounce" />
                <div className="text-white font-bold text-base">{hub}</div>
                <div className="text-orange-100 text-xs font-semibold">Certifié</div>
              </div>
            ))}
          </div>
        </div>
      </section>       
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-4">
              Approuvé par les <span className="text-main">Leaders</span>
            </h2>
            <p className="text-lg text-gray">
              Découvrez comment nous avons aidé des entreprises à transformer leur business avec HubSpot
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <Quote className="w-10 h-10 text-main mb-5 group-hover:animate-pulse" />
                <blockquote className="text-base text-black mb-5 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-main to-main rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="font-bold text-black">{testimonial.author}</div>
                    <div className="text-gray">{testimonial.role}</div>
                    <div className="text-main font-semibold">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 