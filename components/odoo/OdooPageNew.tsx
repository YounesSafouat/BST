"use client"

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ShoppingCart, 
  Package, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Quote, 
  Rocket 
} from 'lucide-react';
import OdooHeroSplit from './OdooHeroSplit';



function OdooPageNew() {
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');

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
      icon: <Calculator className="w-8 h-8" />,
      title: "Comptabilité & Finance",
      description: "Configuration complète de la comptabilité avec facturation automatisée, rapports financiers et gestion de trésorerie intégrée."
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Ventes & CRM",
      description: "Gestion commerciale complète avec pipeline de ventes, devis automatiques et suivi client pour optimiser vos revenus."
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Inventaire & Logistique",
      description: "Contrôle des stocks en temps réel, gestion d'entrepôt et optimisation de la chaîne d'approvisionnement."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Ressources Humaines",
      description: "Gestion RH complète avec paie, congés, évaluations et recrutement dans une interface unifiée."
    }
  ];

  const trustMetrics = [
    { number: 1000, suffix: "+", label: "Implémentations Odoo" },
    { number: 99, suffix: "%", label: "Satisfaction Client" },
    { number: 7, suffix: " Ans", label: "Partenaire Officiel" },
    { number: 24, suffix: "/7", label: "Support Technique" }
  ];

  const testimonials = [
    {
      quote: "L'implémentation Odoo a révolutionné notre gestion d'entreprise. Nous avons économisé 40% de temps administratif et augmenté notre efficacité opérationnelle.",
      author: "Marie Dubois",
      role: "Directrice Générale",
      company: "InnovateTech Solutions"
    },
    {
      quote: "Avec Odoo, nous avons enfin une vue d'ensemble de notre business. La plateforme unique nous permet de gérer toutes nos opérations sans friction.",
      author: "Pierre Martin",
      role: "Responsable Opérations",
      company: "GrowthCorp France"
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

  const odooApps = [
    {
      icon: "/icones/odoo/accounting.svg",
      title: "Accounting",
      description: "Gestion financière complète avec rapports automatisés et conformité fiscale.",
      features: [
        "Facturation automatique",
        "Rapports financiers",
        "Gestion de trésorerie"
      ]
    },
    {
      icon: "/icones/odoo/knowledge.svg",
      title: "Knowledge",
      description: "Base de connaissances centralisée pour votre équipe et vos clients.",
      features: [
        "Articles structurés",
        "Recherche avancée",
        "Collaboration équipe"
      ]
    },
    {
      icon: "/icones/odoo/sign.svg",
      title: "Sign",
      description: "Signature électronique sécurisée pour tous vos documents.",
      features: [
        "Signature légale",
        "Workflow validation",
        "Traçabilité complète"
      ]
    },
    {
      icon: "/icones/odoo/CRM.svg",
      title: "CRM",
      description: "Gestion de la relation client avec pipeline de ventes intégré.",
      features: [
        "Pipeline de ventes",
        "Suivi des opportunités",
        "Automatisation marketing"
      ]
    },
    {
      icon: "/icones/odoo/studio.svg",
      title: "Studio",
      description: "Personnalisation avancée de votre plateforme Odoo.",
      features: [
        "Interface personnalisée",
        "Champs sur mesure",
        "Workflows adaptés"
      ]
    },
    {
      icon: "/icones/odoo/sudscriptions.svg",
      title: "Subscriptions",
      description: "Gestion des abonnements et facturation récurrente.",
      features: [
        "Facturation récurrente",
        "Gestion des contrats",
        "Métriques SaaS"
      ]
    },
    {
      icon: "/icones/odoo/rental.svg",
      title: "Rental",
      description: "Gestion complète de la location d'équipements.",
      features: [
        "Planning de location",
        "Gestion des retours",
        "Maintenance préventive"
      ]
    },
    {
      icon: "/icones/odoo/point of sale.svg",
      title: "Point of Sale",
      description: "Solution de caisse moderne pour vos points de vente.",
      features: [
        "Interface tactile",
        "Gestion multi-magasins",
        "Synchronisation temps réel"
      ]
    },
    {
      icon: "/icones/odoo/discuss.svg",
      title: "Discuss",
      description: "Communication d'équipe intégrée à votre ERP.",
      features: [
        "Chat en temps réel",
        "Canaux thématiques",
        "Intégration documents"
      ]
    },
    {
      icon: "/icones/odoo/ducuments.svg",
      title: "Documents",
      description: "Gestion électronique de documents centralisée.",
      features: [
        "Stockage sécurisé",
        "Workflow validation",
        "OCR automatique"
      ]
    },
    {
      icon: "/icones/odoo/project.svg",
      title: "Project",
      description: "Gestion de projets avec suivi temps et ressources.",
      features: [
        "Planification Gantt",
        "Suivi du temps",
        "Gestion des ressources"
      ]
    },
    {
      icon: "/icones/odoo/timesheets.svg",
      title: "Timesheets",
      description: "Suivi du temps de travail et analyse de productivité.",
      features: [
        "Saisie temps simplifiée",
        "Rapports détaillés",
        "Facturation au temps"
      ]
    },
    {
      icon: "/icones/odoo/field service.svg",
      title: "Field Service",
      description: "Gestion des interventions terrain et maintenance.",
      features: [
        "Planning interventions",
        "Géolocalisation",
        "Rapports d'intervention"
      ]
    },
    {
      icon: "/icones/odoo/planning.svg",
      title: "Planning",
      description: "Planification des ressources et gestion des équipes.",
      features: [
        "Vue planning globale",
        "Allocation ressources",
        "Optimisation charge"
      ]
    },
    {
      icon: "/icones/odoo/helpdesk.svg",
      title: "Helpdesk",
      description: "Service client avec système de tickets intégré.",
      features: [
        "Gestion des tickets",
        "SLA automatiques",
        "Base de connaissances"
      ]
    },
    {
      icon: "/icones/odoo/website.svg",
      title: "Website",
      description: "Création de sites web avec e-commerce intégré.",
      features: [
        "Site responsive",
        "E-commerce natif",
        "SEO optimisé"
      ]
    },
    {
      icon: "/icones/odoo/social marketing.svg",
      title: "Social Marketing",
      description: "Gestion des réseaux sociaux et campagnes marketing.",
      features: [
        "Publication multi-canaux",
        "Analyse performance",
        "Engagement client"
      ]
    },
    {
      icon: "/icones/odoo/email marketing.svg",
      title: "Email Marketing",
      description: "Campagnes email automatisées et personnalisées.",
      features: [
        "Templates responsive",
        "Segmentation avancée",
        "A/B testing"
      ]
    }
  ];


  // Split apps into 3 columns for timelines
  const timeline1 = odooApps.slice(0, 6);
  const timeline2 = odooApps.slice(6, 12);
  const timeline3 = odooApps.slice(12, 18);

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

  return (
    <div className="min-h-screen bg-white overflow-hidden mt-10">
      {/* Hero Section */}
      <OdooHeroSplit />

      {/* Trust Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[#ff5c35] mb-2">
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
              Plateforme <span className="text-[#ff5c35]">Tout-en-Un</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Plus de 30 applications intégrées pour couvrir tous vos besoins métier, 
              de la comptabilité au marketing en passant par la production.
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
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#ff5c35] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
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
                      <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[#ff5c35] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[#ff5c35]">
                          <div className="w-1.5 h-1.5 bg-[#ff5c35] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline 2 - Scrolling Down */}
            <div className="relative overflow-hidden rounded-2xl timeline-container">
              <div className="flex flex-col space-y-6 animate-scroll-down">
                {[...timeline2, ...timeline2].map((app, index) => (
                  <div 
                    key={`timeline2-${index}`}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[#ff5c35] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
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
                      <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[#ff5c35] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[#ff5c35]">
                          <div className="w-1.5 h-1.5 bg-[#ff5c35] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline 3 - Scrolling Up (Slower) */}
            <div className="relative overflow-hidden rounded-2xl timeline-container">
              <div className="flex flex-col space-y-6 animate-scroll-up-slow">
                {[...timeline3, ...timeline3].map((app, index) => (
                  <div 
                    key={`timeline3-${index}`}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#ff5c35] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
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
                      <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center hidden">
                        <span className="text-[#ff5c35] font-bold text-lg">{app.title.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {app.description}
                    </p>
                    <div className="space-y-2">
                      {app.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-[#ff5c35]">
                          <div className="w-1.5 h-1.5 bg-[#ff5c35] rounded-full mr-2"></div>
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
              Implémentation <span className="text-[#ff5c35]">Odoo Experte</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Notre statut de partenaire officiel garantit une expertise approfondie 
              dans tous les modules Odoo et les meilleures pratiques d'implémentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {odooCapabilities.map((capability, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#ff5c35] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-[#ff5c35]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff5c35]/20 transition-colors">
                    <div className="text-[#ff5c35]">{capability.icon}</div>
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

      {/* Odoo Partnership */}
      <section className="py-20 bg-gradient-to-r from-[#714b67] to-[#8b5a7d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="rounded-2xl p-4 bg-white">
              <div className="text-2xl font-bold text-[#714b67]">ODOO</div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Partenaire Officiel <span className="font-semibold">Odoo</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Notre certification officielle représente le plus haut niveau d'expertise Odoo, 
            avec un succès prouvé dans les implémentations d'entreprise.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Comptabilité', 'Ventes & CRM', 'Inventaire', 'RH & Paie'].map((module, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-4 group-hover:animate-pulse" />
                <div className="text-white font-semibold text-lg">{module}</div>
                <div className="text-white/80 text-sm font-medium">Expertise Certifiée</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Approuvé par les <span className="text-[#ff5c35]">Entreprises</span>
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Découvrez comment nous avons aidé des entreprises à transformer leurs opérations avec Odoo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Quote className="w-12 h-12 text-[#ff5c35] mb-6" />
                <blockquote className="text-lg text-gray-800 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ff5c35] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-[#ff5c35] font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Prêt à Unifier <span className="text-[#ff5c35]">Votre Entreprise ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            Laissez nos experts Odoo concevoir et implémenter une solution qui simplifie 
            et optimise tous vos processus métier sur une seule plateforme.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="group bg-[#ff5c35] text-white px-8 py-4 rounded-lg hover:bg-[#ff5c35]/90 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
              onClick={handleConsultationClick}
              disabled={isLoading}
            >
              <Rocket className="w-5 h-5" />
              <span>{loadingType === 'appointment' ? 'CHARGEMENT...' : 'Commencer Gratuitement'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-[#ff5c35] hover:text-[#ff5c35] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
              onClick={handleCaseStudyClick}
              disabled={isLoading}
            >
              <Users className="w-5 h-5" />
              <span>{loadingType === 'projects' ? 'CHARGEMENT...' : 'Rencontrer un Expert'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c35]"></div>
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
          animation: scroll-up 20s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 25s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up-slow 30s linear infinite;
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

export default OdooPageNew;