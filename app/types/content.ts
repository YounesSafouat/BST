export interface Challenge { icon: string; title: string; description: string; impact?: string; }
export interface Solution { icon: string; iconUrl?: string; title: string; subtitle: string; description: string; color: string; features: string[]; }
export interface HeroStatus { text: string; icon: string; }
export interface HeroStat { value: string; label: string; }
export interface HeroContent { statuses?: HeroStatus[]; stats?: HeroStat[]; mainTitle?: string; subtitle?: string; }
export interface ChallengeContent { intro?: string; badge?: string; challenges?: Challenge[]; }
export interface SolutionContent { intro?: string; badge?: string; solutions?: Solution[]; }
export interface Step { step: string; title: string; description: string; icon: string; iconUrl?: string; side: 'left' | 'right'; }
export interface TransformationContent { intro?: string; badge?: string; steps?: Step[]; }
export interface Testimonial { _id: string; name: string; role: string; quote: string; result: string; avatar: string; company?: string; }
export interface SuccessContent { intro?: string; badge?: string; testimonials?: string[]; }
export interface TestimonialsContent { 
  headline: string; 
  description: string; 
  testimonials: Testimonial[]; 
}

// Services Section Types
export interface Service {
  icon: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesData {
  headline: string;
  subheadline: string;
  description: string;
  services: Service[];
}

export interface Action { label: string; icon: string; }
export interface Location { icon: string; title: string; subtitle: string; }
export interface CTAContent { intro?: string; actions?: Action[]; locations?: Location[]; }

// Contact Page Types
export interface ContactField {
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox-group';
  name: string;
  label: string;
  required: boolean;
  options?: string[];
}

export interface ContactStep {
  label: string;
  description: string;
  fields: ContactField[];
}

export interface ContactCard {
  icon: string;
  title: string;
  description: string;
  contact: string;
  subDescription: string;
}

export interface ContactHero {
  headline: string;
  highlight: string;
  description: string;
}

export interface ContactContent {
  hero: ContactHero;
  steps: ContactStep[];
  cards: ContactCard[];
}

export type ContentData = HeroContent | ChallengeContent | SolutionContent | TransformationContent | SuccessContent | TestimonialsContent | ServicesData | CTAContent | ContactContent | Record<string, unknown>;

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