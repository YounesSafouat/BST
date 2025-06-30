"use client"

import { useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"
import Image from "next/image"
import { ContentSection, TransformationContent } from "@/app/types/content"

function getIconComponent(name: string) {
  const Icon = LucideIcons[name as keyof typeof LucideIcons];
  if (typeof Icon === "function") return Icon as React.FC<LucideProps>;
  return LucideIcons.Star as React.FC<LucideProps>;
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

interface TransformationSectionProps {
  transformation: ContentSection;
}

export default function TransformationSection({ transformation }: TransformationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = transformation.content as TransformationContent;

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

  if (!transformation) return null;

  return (
    <section
      ref={sectionRef}
      className="scroll-section py-20 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 scroll-fade-up">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-gray-200 mb-12 shadow-lg">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray tracking-wide">
              {content.badge || "NOTRE MÉTHODOLOGIE"}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            {transformation.title}
          </h2>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            {content.intro || transformation.description}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />
          <div className="space-y-24">
            {content.steps?.map((phase, index) => {
              const Icon = getIconComponent(phase.icon);
              const useUrlIcon = phase.iconUrl && isValidUrl(phase.iconUrl);
              
              return (
                <div key={index} className="flex items-center">
                  {phase.side === "left" ? (
                    <>
                      <div className="flex-1 text-right pr-12">
                        <div className="inline-block max-w-md">
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl scroll-slide-right">
                            <div className="text-sm font-bold text-gray mb-2 tracking-wider">
                              ÉTAPE {phase.step}
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">
                              {phase.title}
                            </h3>
                            <p className="text-gray leading-relaxed">
                              {phase.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center relative z-10 shadow-lg scroll-scale-up">
                        {useUrlIcon ? (
                          <Image
                            src={phase.iconUrl}
                            alt={phase.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Icon className="w-8 h-8 text-gray" />
                        )}
                      </div>
                      <div className="flex-1 pl-12" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1 pr-12" />
                      <div className="w-16 h-16 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center relative z-10 shadow-lg scroll-scale-up">
                        {useUrlIcon ? (
                          <Image
                            src={phase.iconUrl}
                            alt={phase.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Icon className="w-8 h-8 text-gray" />
                        )}
                      </div>
                      <div className="flex-1 text-left pl-12">
                        <div className="inline-block max-w-md">
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl scroll-slide-left">
                            <div className="text-sm font-bold text-gray mb-2 tracking-wider">
                              ÉTAPE {phase.step}
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">
                              {phase.title}
                            </h3>
                            <p className="text-gray leading-relaxed">
                              {phase.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 