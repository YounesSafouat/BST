"use client";

import React, { useState, useEffect } from 'react';
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
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Database,
  ShoppingCart,
  FileText,
  CreditCard,
  Truck,
  Factory,
  Warehouse
} from 'lucide-react';

function OdooPageOriginal() {
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const odooCapabilities = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "E-commerce - Configuration",
      description: "Création de boutiques en ligne performantes avec gestion des produits, paniers et paiements sécurisés."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "ERP - Implémentation",
      description: "Système de gestion intégré pour optimiser tous vos processus métier et améliorer la productivité."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "CRM - Intégration",
      description: "Gestion de la relation client avec suivi des opportunités et automatisation des processus de vente."
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: "Manufacturing - Configuration",
      description: "Gestion de la production, planification des ressources et optimisation des chaînes logistiques."
    }
  ];

  const trustMetrics = [
    { number: 300, suffix: "+", label: "Implémentations Odoo" },
    { number: 95, suffix: "%", label: "Taux de Réussite" },
    { number: 4, suffix: " Ans", label: "Expertise Odoo" },
    { number: 24, suffix: "/7", label: "Support Technique" }
  ];

  const testimonials = [
    {
      quote: "L'implémentation Odoo par Black Swan Technology a révolutionné notre gestion d'entreprise. Nous avons réduit nos coûts opérationnels de 40% et amélioré notre productivité de manière significative.",
      author: "Pierre Durand",
      role: "Directeur Général",
      company: "ManufacturePlus"
    },
    {
      quote: "Leur expertise Odoo est exceptionnelle. Ils ont su adapter la solution à nos besoins spécifiques et former notre équipe efficacement. Un partenaire de confiance.",
      author: "Marie Laurent",
      role: "Directrice Administrative",
      company: "TechSolutions"
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

  const odooModules = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "E-commerce",
      description: "Boutique en ligne complète avec gestion des produits, commandes et paiements.",
      features: [
        "Catalogue produits avancé",
        "Gestion des commandes",
        "Paiements sécurisés"
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "ERP",
      description: "Système de gestion intégré pour optimiser tous vos processus métier.",
      features: [
        "Gestion comptable",
        "Gestion des stocks",
        "Planification des ressources"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "CRM",
      description: "Gestion de la relation client avec suivi des opportunités.",
      features: [
        "Pipeline de vente",
        "Gestion des contacts",
        "Automatisation marketing"
      ]
    },
    {
      icon: <Factory className="w-6 h-6" />,
      title: "Manufacturing",
      description: "Gestion de la production et planification des ressources.",
      features: [
        "Planification production",
        "Gestion des BOM",
        "Contrôle qualité"
      ]
    },
    {
      icon: <Warehouse className="w-6 h-6" />,
      title: "Inventory",
      description: "Gestion des stocks et logistique optimisée.",
      features: [
        "Gestion multi-entrepôts",
        "Traçabilité produits",
        "Gestion des fournisseurs"
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Accounting",
      description: "Comptabilité complète et gestion financière.",
      features: [
        "Comptabilité générale",
        "Gestion des factures",
        "Rapports financiers"
      ]
    }
  ];

  const handleConsultationClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleCaseStudyClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleLearnMoreClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Expert Odoo Certifié
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Solutions Odoo
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Sur Mesure
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Transformez votre entreprise avec des solutions Odoo personnalisées. 
                De l'E-commerce à l'ERP, nous implémentons des systèmes qui s'adaptent 
                à vos besoins spécifiques.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleConsultationClick}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Consultation Gratuite
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={handleCaseStudyClick}
                  className="inline-flex items-center px-8 py-4 border border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-300"
                >
                  Voir nos Réalisations
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/odoo.webp"
                  alt="Odoo Solutions"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter target={metric.number} suffix={metric.suffix} />
                </div>
                <div className="text-gray-400 text-sm lg:text-base">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Nos Expertises Odoo
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nous maîtrisons tous les modules Odoo pour vous offrir une solution complète 
              et personnalisée selon vos besoins métier.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {odooCapabilities.map((capability, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="text-purple-400 mb-4">{capability.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{capability.title}</h3>
                <p className="text-gray-300">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Modules Odoo Disponibles
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez notre gamme complète de modules Odoo pour optimiser 
              tous les aspects de votre entreprise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {odooModules.map((module, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="text-purple-400 mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{module.title}</h3>
                <p className="text-gray-300 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les témoignages de nos clients qui ont transformé 
              leur entreprise avec nos solutions Odoo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <Quote className="w-8 h-8 text-purple-400 mb-4" />
                <p className="text-gray-300 text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre entreprise avec Odoo ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour une consultation gratuite et découvrez comment 
            nos solutions Odoo peuvent optimiser vos processus métier.
          </p>
          <button
            onClick={handleLearnMoreClick}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Commencer Maintenant
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default OdooPageOriginal; 