"use client"

import { useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { LucideIcon } from "lucide-react"
import AnimatedScrollArrow from "../AnimatedScrollArrow"

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: {
    items?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    challenges?: Array<{
      icon: string;
      title: string;
      description: string;
      impact?: string;
    }>;
  };
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
}

function getIconComponent(name: string): LucideIcon {
  return (LucideIcons[name as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Star;
}

interface ChallengeSectionProps {
  challenge: ContentSection;
}

export default function ChallengeSection({ challenge }: ChallengeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!challenge) return null;

  return (
    <section
      ref={sectionRef}
      id="defi"
      className="relative z-10 py-32 px-6 lg:px-8 bg-gray-50 scroll-section mt-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 scroll-fade-up">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-gray-200 mb-12 shadow-lg">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700 tracking-wide">
              {challenge.title ? `${challenge.title.toUpperCase()}` : 'CHAPITRE 2 : LE DÉFI'}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            {challenge.title || 'Le Chaos'} <span className="text-gray-400">Organisé</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {challenge.description || 'Avant la transformation, il y a toujours le chaos. Voici les défis que nous résolvons quotidiennement.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenge.content?.challenges?.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl scroll-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-3xl"></div>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                {item.impact && (
                  <div className="text-gray-800 font-bold text-lg">{item.impact}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Scroll Indicator */}
      <AnimatedScrollArrow />
    </section>
  );
} 