"use client"

import { useRef, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import AnimatedScrollArrow from "../AnimatedScrollArrow"

interface Solution {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features: string[];
}

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: {
    intro?: string;
    solutions?: Solution[];
  };
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
}

function getIconComponent(name: string) {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons];
  return IconComponent || LucideIcons.Star;
}

interface SolutionSectionProps {
  solution: ContentSection;
}

export default function SolutionSection({ solution }: SolutionSectionProps) {
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

  if (!solution) return null;

  return (
    <section
      ref={sectionRef}
      className="scroll-section py-20 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 scroll-fade-up">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            {solution.description?.split(" ")[0]}{" "}
            <span className="text-[#ff5c35]">
              {solution.description?.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {solution.content?.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solution.content?.solutions?.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);
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
                  {IconComponent && (
                    <IconComponent
                      className="w-8 h-8"
                      style={{ color: item.color }}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <h4 className="text-sm font-medium text-gray-500 mb-4 tracking-wide uppercase">
                  {item.subtitle}
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
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