import { Quote, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  result: string;
}

interface SuccessData {
  intro?: string;
  badge?: string;
  testimonials?: Testimonial[];
}

interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: any;
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
}

interface SuccessSectionProps {
  success: ContentSection;
}

export default function SuccessSection({ success }: SuccessSectionProps) {
  const [successData, setSuccessData] = useState<SuccessData>({
    intro: "Découvrez comment nous avons aidé nos clients à atteindre leurs objectifs les plus ambitieux",
    testimonials: [
      {
        quote: "Accompagnement exceptionnel et résultats au-delà de nos espérances. Partenaire de confiance.",
        name: "Youssef Kadiri",
        role: "CTO, GlobalTrade",
        avatar: "YK",
        result: "+150% ROI"
      },
      {
        quote: "Notre transformation digitale a révolutionné notre approche commerciale. Résultats exceptionnels.",
        name: "Ahmed Mansouri", 
        role: "CEO, TechCorp",
        avatar: "YO",
        result: "+900% Leads"
      },
      {
        quote: "L'intégration Odoo a unifié tous nos processus. Une efficacité opérationnelle remarquable.",
        name: "Salma Benali",
        role: "Directrice, InnovateMA", 
        avatar: "SB",
        result: "-70% Temps Gestion"
      }
    ]
  });

  useEffect(() => {
    // Use the success prop data if available, otherwise fall back to default data
    if (success && success.content) {
      setSuccessData(success.content);
    }
  }, [success]);

  // Triple the testimonials for smooth infinite scroll
  const infiniteTestimonials = [...(successData.testimonials || []), ...(successData.testimonials || []), ...(successData.testimonials || [])];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Transformations
          </h2>
          {successData.badge && (
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              {successData.badge}
            </div>
          )}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {successData.intro}
          </p>
        </div>

        {/* Infinite Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Scrolling Container */}
          <div className="flex gap-6 animate-scroll hover:pause-animation">
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-gray-700 text-base leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Result Badge */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-black">{testimonial.result}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${(successData.testimonials?.length || 3) * (320 + 24)}px);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}