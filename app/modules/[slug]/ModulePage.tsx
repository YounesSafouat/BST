"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface Module {
  title: string;
  description: string;
  icon: string;
  features: string[];
  slug?: string;
  youtubeVideoId?: string;
  heroImage?: string;
  screenshotImage?: string;
  followUpImage?: string;
  quotationImage?: string;
  reportingImage?: string;
}

interface ModulePageProps {
  module: Module;
}

export default function ModulePage({ module }: ModulePageProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  const getYouTubeVideoId = (videoIdOrUrl: string): string => {
    let videoId = videoIdOrUrl;
    
    if (videoIdOrUrl.includes('youtu.be/')) {
      videoId = videoIdOrUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoIdOrUrl.includes('youtube.com/watch?v=')) {
      videoId = videoIdOrUrl.split('v=')[1].split('&')[0];
    } else if (videoIdOrUrl.includes('youtube.com/embed/')) {
      videoId = videoIdOrUrl.split('embed/')[1].split('?')[0];
    }
    
    return videoId;
  };

  const getYouTubeEmbedUrl = (videoIdOrUrl: string): string => {
    const videoId = getYouTubeVideoId(videoIdOrUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getYouTubeThumbnail = (videoIdOrUrl: string): string => {
    const videoId = getYouTubeVideoId(videoIdOrUrl);
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-white min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute left-8 bottom-32 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 20 60 Q 30 40, 40 30 M 20 70 Q 30 50, 40 40 M 20 80 Q 30 60, 40 50"
              stroke="#ff6b7a"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'cursive' }}>
              <span dangerouslySetInnerHTML={{ __html: module.title }} />
            </h1>
          </div>

          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong dangerouslySetInnerHTML={{ __html: module.title }} />{' '}
              <span dangerouslySetInnerHTML={{ __html: module.description }} />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              onClick={scrollToContact}
              className="px-8 py-6 bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)]/90 text-base font-semibold rounded-lg"
            >
              Commencer maintenant - C'est gratuit
            </Button>
            <Button
              variant="outline"
              onClick={scrollToContact}
              className="px-8 py-6 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 text-base font-semibold rounded-lg flex items-center gap-2"
            >
              Rencontrer un conseiller
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-16">
            <p className="text-sm text-gray-600">
              Gratuit, pour toujours, avec des utilisateurs illimités.{' '}
              <Link href="/#modules" className="text-[var(--color-secondary)] hover:underline font-medium">
                Voir pourquoi
              </Link>
            </p>
          </div>

          <div className="relative w-full h-auto bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {module.youtubeVideoId ? (
              <div className="s_panel_video relative" data-video-id={getYouTubeVideoId(module.youtubeVideoId)}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsVideoModalOpen(true);
                  }}
                  className="btn_video_play block relative cursor-pointer group"
                >
                  <Image
                    src={getYouTubeThumbnail(module.youtubeVideoId)}
                    alt={module.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority
                    onError={(e) => {
                      if (module.heroImage || module.icon) {
                        e.currentTarget.src = module.heroImage || module.icon || '';
                      }
                    }}
                  />
                  <div className="x_wd_video_play_icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white/90 group-hover:bg-white rounded-full p-6 shadow-lg transition-all group-hover:scale-110">
                      <Play className="w-12 h-12 text-[var(--color-secondary)] ml-1" fill="currentColor" />
                    </div>
                  </div>
                </a>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={module.heroImage || module.icon}
                  alt={module.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {module.youtubeVideoId && (
        <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
          <DialogContent className="max-w-5xl w-full p-0 bg-black border-0">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getYouTubeEmbedUrl(module.youtubeVideoId) + '?autoplay=1'}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={module.title}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {module.features && module.features.length > 0 && (
        <section className="py-6 py-lg-9 overflow-x-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 mb-lg-7">
              Gardez les <span className="text-[var(--color-secondary)]">opportunités</span> en vue
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
              <div className="lg:col-span-4 pb-5">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Votre pipeline en un coup d'œil.</h3>
                  <p className="mb-0 text-gray-600">
                    Chaque opportunité est listée comme une carte avec toutes les informations essentielles; et chaque étape donne un aperçu de vos revenus attendus.
                  </p>
                </div>
                <div className="w-full pt-5 pb-5">
                  <img src="/separator.svg" alt="" className="w-full pt-5 pb-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="h-px bg-gray-300"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Organisation efficace</h3>
                  <p className="mb-0 text-gray-600">
                    La vue Kanban organise les opportunités par étape. Glissez-déposez-les dans le pipeline pour les déplacer d'une étape.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-7 pb-5">
                {(module.screenshotImage || module.icon) && (
                  <img
                    src={module.screenshotImage || module.icon}
                    alt={module.title}
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {module.features && module.features.length > 1 && (
        <section className="text-center pb-7 pb-lg-9">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-5">
                  Ne manquez jamais un <span className="text-yellow-400">suivi</span>
                </h2>
                <p className="mb-7 text-lg text-gray-600">
                  <strong>Planifiez des appels, des réunions, des envois ou des devis,</strong> et {module.title} planifie automatiquement la prochaine activité en fonction de votre script de vente.
                </p>
                {module.followUpImage && (
                  <img
                    src={module.followUpImage}
                    alt="Follow-up example"
                    className="w-full max-w-4xl mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {module.features && module.features.length > 2 && (
        <section className="text-center pb-7 pb-lg-9">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center mb-5">
              <h2 className="text-4xl md:text-5xl text-center">
                Communication <span className="text-[var(--color-secondary)]">sans effort</span>
                <br />
                signifie aucune mauvaise communication
              </h2>
            </div>
            <div className="flex justify-center pb-lg-8">
              <div className="max-w-3xl">
                <p className="text-lg text-gray-600">
                  <strong>La communication est la clé.</strong> Les emails entrants sont automatiquement ajoutés à votre pipeline, et tout contact avec votre équipe et vos clients se fait depuis un seul endroit, garantissant un accès facile aux informations à tout moment.
                </p>
              </div>
            </div>
            <div className="w-full max-w-5xl mx-auto">
              <img
                src={module.icon}
                alt="Communication"
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="pb-7 pb-lg-9">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl text-center mb-5">S'intègre avec:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-gray-100 rounded-xl text-center pt-5 px-5">
            <div className="col-6 col-lg-3 pb-5">
              <img src="/icons/mail.svg" width="100" className="mx-auto mb-3" alt="Email" onError={(e) => { e.currentTarget.innerHTML = '<div class="w-24 h-24 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center"><span class="text-4xl">📧</span></div>'; }} />
              <h5 className="text-xl mb-0">Email</h5>
            </div>
            <div className="col-6 col-lg-3 pb-5">
              <img src="/icons/message.svg" width="100" className="mx-auto mb-3" alt="Live chat" onError={(e) => { e.currentTarget.innerHTML = '<div class="w-24 h-24 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center"><span class="text-4xl">💬</span></div>'; }} />
              <h5 className="text-xl mb-0">Chat en direct</h5>
            </div>
            <div className="col-6 col-lg-3 pb-5">
              <img src="/icons/vibrate.svg" width="100" className="mx-auto mb-3" alt="SMS" onError={(e) => { e.currentTarget.innerHTML = '<div class="w-24 h-24 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center"><span class="text-4xl">📱</span></div>'; }} />
              <h5 className="text-xl mb-0">SMS</h5>
            </div>
            <div className="col-6 col-lg-3 pb-5">
              <img src="/icons/call.svg" width="100" className="mx-auto mb-3" alt="VoIP" onError={(e) => { e.currentTarget.innerHTML = '<div class="w-24 h-24 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center"><span class="text-4xl">📞</span></div>'; }} />
              <h5 className="text-xl mb-0">VoIP</h5>
            </div>
          </div>
        </div>
      </section>

      {module.features && module.features.length > 0 && (
        <>
          <section className="pb-lg-7">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-5 mb-lg-6">
                Devis attractifs <br />
                en <span className="text-yellow-400">deux clics</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 justify-between">
                <div className="lg:col-span-6">
                  <p className="text-lg text-gray-600">
                    <strong>Créez des devis d'aspect professionnel</strong> en un rien de temps avec une interface conviviale. Sélectionnez vos produits dans le catalogue et laissez {module.title} gérer le reste.
                  </p>
                </div>
                <div className="lg:col-span-8 pt-6">
                  {module.quotationImage && (
                    <img
                      src={module.quotationImage}
                      alt="Quotation"
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="pb-8">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-5xl font-bold text-center py-7 py-lg-9">
                Transformez les données de reporting en argent
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
                <div className="lg:col-span-5">
                  <p className="text-lg text-gray-600">
                    <strong>Les décisions intelligentes</strong> sont basées sur des données précises et en temps réel. Creusez plus profondément dans vos métriques de vente avec des prévisions de revenus, l'analyse des performances de l'équipe et des tableaux de bord personnalisés.
                  </p>
                </div>
                <div className="lg:col-span-6 col-xl-7">
                  {module.reportingImage && (
                    <img
                      src={module.reportingImage}
                      alt="Reporting"
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="py-5 py-lg-7 bg-gray-100">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Toutes les <span className="text-[var(--color-secondary)]">fonctionnalités</span>
                <br />
                faites <span className="underline">correctement</span>
                <span className="text-[var(--color-secondary)]">.</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {module.features.slice(0, 4).map((feature, index) => {
                  const parts = feature.split(':');
                  const title = parts[0] || feature;
                  const description = parts.slice(1).join(':').trim() || feature;

                  return (
                    <div key={index} className="s_wd_features_item">
                      <div className="s_wd_features_icon mb-3">
                        <img src="/icons/yellow_star.svg" alt="" className="w-6 h-6" onError={(e) => { e.currentTarget.outerHTML = '<span class="text-3xl">⭐</span>'; }} />
                      </div>
                      <h4 className="text-xl font-semibold mb-3" dangerouslySetInnerHTML={{ __html: title }} />
                      <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                  );
                })}
              </div>
              <Link
                href="/#modules"
                className="inline-flex items-center text-2xl font-bold mt-4 text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80"
              >
                Voir toutes les fonctionnalités
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </div>
          </section>
        </>
      )}

      <section className="py-5 py-lg-7">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Un <span className="underline">besoin</span>, une <span className="underline">application</span>.
          </h3>
          <p className="text-xl mb-5">Développez-vous au fur et à mesure.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {module.features && module.features.slice(0, 4).map((feature, index) => {
              const parts = feature.split(':');
              const title = parts[0] || feature;

              return (
                <div key={index} className="bg-white shadow-sm rounded-lg p-3 h-full flex items-center hover:shadow-md transition-shadow">
                  {module.icon && (
                    <img
                      src={module.icon}
                      alt={title}
                      width="68"
                      height="68"
                      className="bg-white shadow-sm rounded p-2 m-3 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-grow my-3 me-4">
                    <h5 className="mb-1 font-semibold" dangerouslySetInnerHTML={{ __html: title }} />
                    <small className="block text-gray-500" dangerouslySetInnerHTML={{ __html: feature }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/#modules"
            className="inline-flex items-center text-2xl font-bold mt-5 text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80"
          >
            Voir toutes les applications
            <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </section>

      <section className="py-20 lg:py-24 overflow-hidden text-center">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-5xl md:text-6xl font-bold mb-5">
            <span className="text-[var(--color-secondary)]">Libérez</span>
            <br />
            votre <span className="text-[var(--color-secondary)]">potentiel de croissance</span>
          </h3>
          <Button
            onClick={scrollToContact}
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white font-semibold px-8 py-6 text-lg rounded-full mb-3"
          >
            Commencer maintenant - C'est gratuit
          </Button>
          <div className="flex justify-center mb-2">
            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
          </div>
          <small className="block text-sm text-gray-500">
            Aucune carte de crédit requise
            <br />
            Accès instantané
          </small>
        </div>
      </section>
    </div>
  );
}
