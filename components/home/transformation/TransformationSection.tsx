"use client"

import { useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import { LucideIcon } from "lucide-react"

interface Step {
  icon: string;
  title: string;
  description: string;
  step: number;
  side: "left" | "right";
}

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: {
    intro?: string;
    steps?: Step[];
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

interface TransformationSectionProps {
  transformation: ContentSection;
}

export default function TransformationSection({ transformation }: TransformationSectionProps) {
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

  if (!transformation) return null;

  return (
    <section
      ref={sectionRef}
      className="scroll-section py-20 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 scroll-fade-up">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            {transformation.description?.split(" ")[0]}{" "}
            <span className="text-[#714b67]">
              {transformation.description?.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {transformation.content?.intro}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />
          <div className="space-y-24">
            {transformation.content?.steps?.map((phase, index) => {
              const IconComponent = getIconComponent(phase.icon);
              return (
                <div key={index} className="flex items-center">
                  {phase.side === "left" ? (
                    <>
                      <div className="flex-1 text-right pr-12">
                        <div className="inline-block max-w-md">
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl scroll-slide-right">
                            <div className="text-sm font-bold text-gray-400 mb-2 tracking-wider">
                              ÉTAPE {phase.step}
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">
                              {phase.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {phase.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center relative z-10 shadow-lg scroll-scale-up">
                        <IconComponent className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1 pl-12" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1 pr-12" />
                      <div className="w-16 h-16 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center relative z-10 shadow-lg scroll-scale-up">
                        <IconComponent className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left pl-12">
                        <div className="inline-block max-w-md">
                          <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-xl scroll-slide-left">
                            <div className="text-sm font-bold text-gray-400 mb-2 tracking-wider">
                              ÉTAPE {phase.step}
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">
                              {phase.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
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