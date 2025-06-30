"use client"

import { useRef, useEffect, ComponentType } from "react"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"
import Image from "next/image"
import AnimatedScrollArrow from "../AnimatedScrollArrow"
import { ContentSection, SolutionContent } from "@/app/types/content"
import { CheckCircle } from "lucide-react"

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

interface SolutionSectionProps {
  solution: ContentSection;
}

export default function SolutionSection({ solution }: SolutionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const content = solution.content as SolutionContent;

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

  if (!solution) return null;

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
              {content.badge || "NOS SOLUTIONS"}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            {solution.title}
          </h2>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            {content.intro || solution.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.solutions?.map((item, index) => {
            const Icon = getIconComponent(item.icon);
            const useUrlIcon = item.iconUrl && isValidUrl(item.iconUrl);
            
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl scroll-scale-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                  style={{ backgroundColor: item.color }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  {useUrlIcon ? (
                    <Image
                      src={String(item.iconUrl || "/placeholder.svg")}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Icon
                      className="w-8 h-8"
                      style={{ color: item.color }}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <h4 className="text-sm font-medium text-gray mb-4 tracking-wide uppercase">
                  {item.subtitle}
                </h4>
                <p className="text-gray mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-2">
                  {item.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[--color-main]" />
                      <span className="text-sm text-gray">{feature}</span>
                    </div>
                  ))}
                </div>
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