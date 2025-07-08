import { Quote, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  result: string;
  company?: string;
}

interface SuccessData {
  intro?: string;
  badge?: string;
  testimonials?: string[];
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
    testimonials: []
  });
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (success && success.content) {
      setSuccessData(success.content);
    }
    fetchTestimonials();
  }, [success]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/content?type=testimonial');
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((item: any) => ({ 
          ...item.content, 
          _id: typeof item._id === 'object' && item._id.$oid ? item._id.$oid : item._id.toString()
        }));
        setAvailableTestimonials(mapped);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const testimonialObjects = successData.testimonials?.map(id => {
    return availableTestimonials.find(t => t._id === id);
  }).filter(Boolean) as Testimonial[] || [];

  const testimonialCount = testimonialObjects.length;
  const shouldUseCarousel = testimonialCount > 4;

  // For carousel, triple the testimonials for smooth infinite scroll
  const infiniteTestimonials = shouldUseCarousel 
    ? [...testimonialObjects, ...testimonialObjects, ...testimonialObjects]
    : testimonialObjects;

  // Grid layout classes
  const getGridLayout = () => {
    if (testimonialCount === 1) return "grid-cols-1 max-w-xl mx-auto";
    if (testimonialCount === 2) return "grid-cols-2 max-w-3xl mx-auto";
    if (testimonialCount === 3) return "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto";
    if (testimonialCount === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
  };

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => (
    <div 
      key={index}
      className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 flex flex-col h-full"
    >
      {/* Quote Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Quote className="w-6 h-6 text-white" />
      </div>
      {/* Quote Text */}
      <blockquote className="text-gray-700 text-base leading-relaxed mb-6 font-medium flex-1">
        "{testimonial.quote}"
      </blockquote>
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-base">
            {testimonial.avatar || testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-bold text-black text-base">{testimonial.name}</h4>
          <p className="text-gray-600 text-xs">{testimonial.role}</p>
          {testimonial.company && (
            <p className="text-gray-500 text-xs">{testimonial.company}</p>
          )}
        </div>
      </div>
      {/* Result Badge */}
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800 text-sm">{testimonial.result}</span>
      </div>
    </div>
  );

  return (
    <section className="py-32 md:py-40 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white border border-gray-200 mb-6 shadow-md">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">
              {successData.badge || "NOS RÉUSSITES"}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tight">
            {success.title || "Transformations"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {successData.intro}
          </p>
        </div>
        {/* Testimonials Container */}
        {shouldUseCarousel ? (
          // Carousel Layout for 5+ testimonials
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll">
              {infiniteTestimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0" style={{ flexBasis: '340px', maxWidth: '340px' }}>
                  {renderTestimonialCard(testimonial, index)}
                </div>
              ))}
            </div>
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
            <style jsx>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-${testimonialCount * (340 + 24)}px);
                }
              }
              .animate-scroll {
                animation: scroll ${Math.max(20, testimonialCount * 5)}s linear infinite;
                transition: animation-play-state 0.2s;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        ) : (
          // Grid Layout for 1-4 testimonials
          <div className={`grid ${getGridLayout()} gap-8`}> 
            {testimonialObjects.map((testimonial, index) => 
              renderTestimonialCard(testimonial, index)
            )}
          </div>
        )}
      </div>
    </section>
  );
}