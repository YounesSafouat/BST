export interface Challenge { icon: string; title: string; description: string; impact?: string; }
export interface Solution { icon: string; iconUrl?: string; title: string; subtitle: string; description: string; color: string; features: string[]; }
export interface HeroStatus { text: string; icon: string; }
export interface HeroStat { value: string; label: string; }
export interface HeroContent { statuses?: HeroStatus[]; stats?: HeroStat[]; mainTitle?: string; subtitle?: string; }
export interface ChallengeContent { intro?: string; badge?: string; challenges?: Challenge[]; }
export interface SolutionContent { intro?: string; badge?: string; solutions?: Solution[]; }
export interface Step { step: string; title: string; description: string; icon: string; iconUrl?: string; side: 'left' | 'right'; }
export interface TransformationContent { intro?: string; badge?: string; steps?: Step[]; }
export interface Testimonial { name: string; role: string; quote: string; result: string; avatar: string; company?: string; }
export interface SuccessContent { intro?: string; badge?: string; testimonials?: string[]; }
export interface TestimonialsContent { 
  headline: string; 
  description: string; 
  testimonials: Testimonial[]; 
}
export interface Action { label: string; icon: string; }
export interface Location { icon: string; title: string; subtitle: string; }
export interface CTAContent { intro?: string; actions?: Action[]; locations?: Location[]; }

export type ContentData = HeroContent | ChallengeContent | SolutionContent | TransformationContent | SuccessContent | TestimonialsContent | CTAContent | Record<string, unknown>;

export interface ContentSection {
  _id: string;
  type: string;
  title: string;
  description: string;
  content: ContentData;
  metadata?: {
    color?: string;
    image?: string;
    order?: number;
  };
  isActive: boolean;
} 