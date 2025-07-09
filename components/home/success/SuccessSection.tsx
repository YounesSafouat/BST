import { Quote, TrendingUp, CheckCircle, X as XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  result: string;
  company?: string;
  date?: string;
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
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const response = await fetch(`${baseUrl}/api/content?type=testimonial`);
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

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => {
    // Use avatar image if available, otherwise initials
    const hasAvatarImg = testimonial.avatar && (testimonial.avatar.startsWith('http') || testimonial.avatar.startsWith('/'));
    const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();
    // Username: use a placeholder if not present
    const username = testimonial.company ? `@${testimonial.company.replace(/\s+/g, '').toLowerCase()}` : '@username';
    // Date: use a placeholder or omit if not present
    const date = testimonial.date || '';
    return (
      <div key={index} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between min-h-[250px] h-full w-full max-w-md mx-auto border border-gray-100">
        {/* Top: Avatar, Name, Username, Verified */}
        <div className="flex items-center gap-3 mb-4">
          {hasAvatarImg ? (
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 border-2 border-white shadow">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 truncate">{testimonial.name}</span>
              <CheckCircle className="w-4 h-4 ml-1" style={{ color: 'var(--color-main)' }} />
            </div>
            <div className="text-gray-500 text-sm truncate">{username}</div>
          </div>
        </div>
        {/* Testimonial Text */}
        <div className="text-gray-700 text-base mb-6 flex-1">
          {testimonial.quote}
        </div>
        {/* Bottom: See on, Icon, Date */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm text-gray-500">
          
          {date && <span>{date}</span>}
        </div>
      </div>
    );
  };

  // --- Add animation keyframes and helper ---
  const getColumns = (arr: any[], n: number) => {
    const cols = Array.from({ length: n }, () => [] as typeof arr);
    arr.forEach((item, i) => cols[i % n].push(item));
    return cols;
  };

  // Instead of carousel/grid, use 3 vertical columns with animation
  if (testimonialCount === 0) return null;
  const columns = getColumns(testimonialObjects, 3);
  const anims = ["animate-scroll-up", "animate-scroll-down", "animate-scroll-up-slow"];

  return (
    <section className="py-32 md:py-40 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-gray-200 mb-8 shadow-lg">
            <div className="w-2 h-2 bg-[var(--color-main)] rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">
              {successData.badge || "NOS RÉUSSITES"}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tight">
            {success.title || "Transformations"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {successData.intro}
          </p>
        </div>
        {/* Three Vertical Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px] relative">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="relative overflow-hidden rounded-2xl timeline-container h-full">
              <div
                className={`flex flex-col space-y-6 ${anims[colIdx % 3]} h-full`}
                style={{ willChange: 'transform' }}
              >
                {[...col, ...col].map((testimonial, idx) => (
                  <div key={idx} className="h-full flex flex-col">
                    {renderTestimonialCard(testimonial, idx)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Larger Gradient overlays for smoother masking */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-up-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scroll-up 40s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 52s linear infinite;
        }
        .animate-scroll-up-slow {
          animation: scroll-up-slow 64s linear infinite;
        }
        .timeline-container:hover .animate-scroll-up,
        .timeline-container:hover .animate-scroll-down,
        .timeline-container:hover .animate-scroll-up-slow {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}