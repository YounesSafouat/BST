# BlackSwan Technology - Technical Documentation

## 🏗️ System Architecture

### Overview
The BlackSwan Technology platform is built using a modern, scalable architecture that combines Next.js 14 App Router with MongoDB for data persistence and a comprehensive analytics system. The platform follows a microservices-like approach within a monolithic Next.js application.

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js       │    │   MongoDB       │
│   (React)       │◄──►│   API Routes    │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Authentication│    │   Analytics     │
│   (Admin)       │    │   (NextAuth)    │    │   (Custom)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HubSpot       │    │   Geolocation   │    │   Performance   │
│   Integration   │    │   Services      │    │   Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow Architecture

### 1. User Request Flow
```
User Request → Next.js Router → Page Component → API Call → MongoDB → Response → UI Update
```

### 2. Content Management Flow
```
Admin Input → Dashboard Form → API Endpoint → MongoDB Update → Cache Invalidation → Frontend Update
```

### 3. Analytics Flow
```
User Action → Event Tracking → API Call → MongoDB Storage → Dashboard Query → Chart Rendering
```

### 4. Authentication Flow
```
Login Request → NextAuth.js → Credential Validation → JWT Token → Session Management → Protected Route Access
```

## 🗄️ Database Schema

### Content Collection
```typescript
interface Content {
  _id: ObjectId;
  type: string;           // 'home-page', 'blog', 'clients-page', etc.
  title: string;
  description: string;
  content: {
    // Dynamic content structure based on type
    hero?: HeroSection;
    services?: Service[];
    testimonials?: string[];
    // ... other type-specific fields
  };
  metadata?: {
    seo?: SEOData;
    appearance?: AppearanceSettings;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Collection
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;        // Hashed with bcrypt
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}
```

### Analytics Collections

#### ButtonClick Collection
```typescript
interface ButtonClick {
  _id: ObjectId;
  buttonId: string;        // Unique identifier for each button
  path: string;            // Page path where click occurred
  count: number;           // Total clicks for this button+path combination
  buttonType: string;      // 'whatsapp', 'phone', 'email', etc.
  buttonText: string;      // Display text of the button
  device: string;          // 'desktop', 'mobile', 'tablet'
  country: string;         // Country code from geolocation
  firstClicked: Date;      // First click timestamp
  lastClicked: Date;       // Most recent click timestamp
  conversionRate: number;  // Conversion rate if applicable
  avgTimeToClick: number;  // Average time from page load to click
}
```

#### PageView Collection
```typescript
interface PageView {
  _id: ObjectId;
  path: string;            // Page path
  page: string;            // Page name/identifier
  count: number;           // Total views for this page
  device: string;          // Device type
  country: string;         // Country code
  firstViewed: Date;       // First view timestamp
  lastViewed: Date;        // Most recent view timestamp
  avgTimeOnPage: number;   // Average time spent on page
  bounceRate: number;      // Bounce rate percentage
}
```

### Testimonials Collection
```typescript
interface Testimonial {
  _id: ObjectId;
  author: string;          // Author name
  role: string;            // Author role/position
  text: string;            // Testimonial content
  photo: string;           // Author photo URL
  targetRegions: string[]; // ['all', 'france', 'morocco', 'international']
  company?: string;        // Company name
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Architecture

### RESTful API Design
The API follows REST principles with consistent patterns across all endpoints:

#### Standard Response Format
```typescript
// Success Response
{
  success: true,
  data: any,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  statusCode: number
}
```

#### API Endpoint Patterns

##### Content Management
```typescript
// GET /api/content?type={type}&search={query}
// Retrieves content by type with optional search
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  
  // Build MongoDB query with filters
  const query: any = {};
  if (type) query.type = type;
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }
  
  const contents = await Content.find(query);
  return NextResponse.json(contents);
}
```

##### Analytics Tracking
```typescript
// POST /api/track-button-click
// Tracks button interactions with upsert logic
export async function POST(req: NextRequest) {
  const { buttonId, path, device, country } = await req.json();
  
  await ButtonClick.findOneAndUpdate(
    { buttonId, path },
    { 
      $inc: { count: 1 },
      $set: { 
        lastClicked: new Date(),
        device,
        country
      },
      $setOnInsert: { firstClicked: new Date() }
    },
    { upsert: true, new: true }
  );
  
  return NextResponse.json({ success: true });
}
```

##### Dashboard Analytics
```typescript
// GET /api/dashboard/button-clicks?timeRange={range}&device={device}
// Aggregates analytics data with filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get('timeRange') || '7d';
  
  // Calculate date range
  const now = new Date();
  const startDate = calculateStartDate(timeRange, now);
  
  // Build aggregation pipeline
  const stats = await ButtonClick.aggregate([
    { $match: { lastClicked: { $gte: startDate } } },
    {
      $group: {
        _id: '$buttonId',
        buttonId: { $first: '$buttonId' },
        count: { $sum: '$count' },
        totalClicks: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  return NextResponse.json(stats);
}
```

## 🎨 Component Architecture

### Component Hierarchy
```
LayoutWrapper
├── Header
│   ├── Navigation
│   ├── MobileHeader
│   └── BottomNavigation
├── Main Content
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── ServicesSection
│   │   ├── TestimonialsSection
│   │   └── ContactSection
│   ├── Blog
│   ├── About
│   └── Dashboard
└── Footer
```

### Component Patterns

#### 1. Server Components (Default)
```typescript
// app/page.tsx - Server Component
export default async function HomePage() {
  const seoData = await getSEOData('home');
  return <HomePageClient seoData={seoData} />;
}
```

#### 2. Client Components (Interactive)
```typescript
// components/home/HomePage.tsx - Client Component
"use client"
export default function HomePageClient({ seoData }) {
  const [homePageData, setHomePageData] = useState(null);
  
  useEffect(() => {
    fetchHomePageData();
  }, []);
  
  // Component logic and state management
}
```

#### 3. Hybrid Components (Server + Client)
```typescript
// components/layout-wrapper.tsx
export default function LayoutWrapper({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Analytics /> {/* Client component for tracking */}
    </>
  );
}
```

## 🚀 Performance Optimization

### 1. Progressive Rendering
```typescript
const [renderPhase, setRenderPhase] = useState<'critical' | 'above-fold' | 'below-fold'>('critical');

// Phase 1: Critical content (header + hero)
useEffect(() => {
  if (mounted) {
    setRenderPhase('above-fold');
  }
}, [mounted]);

// Phase 2: Above-fold content after hero
useEffect(() => {
  if (renderPhase === 'above-fold') {
    const timer = setTimeout(() => setRenderPhase('below-fold'), 200);
    return () => clearTimeout(timer);
  }
}, [renderPhase]);
```

### 2. Lazy Loading
```typescript
// Lazy load non-critical components
const LazyFAQSection = lazy(() => import('../FAQSection'));
const LazyOdooCertificationSection = lazy(() => import('../OdooCertificationSection'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyFAQSection faqData={homePageData?.faq} />
</Suspense>
```

### 3. Caching Strategies
```typescript
// Session storage caching for API responses
const fetchHomePageData = async () => {
  const cachedData = sessionStorage.getItem('homePageData');
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    if (parsed.timestamp && (Date.now() - parsed.timestamp) < 5 * 60 * 1000) {
      setHomePageData(parsed.data);
      return;
    }
  }
  
  // Fetch fresh data and cache
  const response = await fetch('/api/content?type=home-page');
  const data = await response.json();
  
  sessionStorage.setItem('homePageData', JSON.stringify({
    data: data.content,
    timestamp: Date.now()
  }));
};
```

### 4. Image Optimization
```typescript
// Next.js Image component with optimization
<Image
  src={heroImage}
  alt="Hero Image"
  width={1200}
  height={600}
  priority={true} // Preload critical images
  className="object-cover"
/>
```

## 🔐 Security Implementation

### 1. Authentication Flow
```typescript
// lib/auth.ts
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        const isPasswordValid = await user.comparePassword(credentials.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};
```

### 2. Role-Based Access Control
```typescript
// components/dashboard/layout.tsx
function DashboardLayoutContent({ children }) {
  const { data: session, status } = useSession();
  
  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }
  
  // Additional role checks can be added here
  return <div>{children}</div>;
}
```

### 3. Input Validation
```typescript
// API route with validation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.type || !body.content) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Sanitize and process data
    const content = await Content.create(body);
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}
```

## 📊 Analytics System

### 1. Event Tracking
```typescript
// Track button clicks
const trackButtonClick = async (buttonId: string, path: string) => {
  try {
    await fetch('/api/track-button-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buttonId,
        path,
        device: getDeviceType(),
        country: userCountry
      })
    });
  } catch (error) {
    console.error('Failed to track button click:', error);
  }
};
```

### 2. Performance Monitoring
```typescript
// components/PerformanceMonitor.tsx
export default function PerformanceMonitor() {
  useEffect(() => {
    if ('performance' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }, []);
  
  return null;
}
```

### 3. Geolocation Services
```typescript
// lib/geolocation.ts
export async function getUserLocation(): Promise<GeolocationData | null> {
  try {
    // Try multiple services for reliability
    const fastService = 'https://ipinfo.io/json';
    const fallbackService = 'https://ipapi.co/json/';
    
    // Fast service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(fastService, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country,
        countryCode: data.country,
        region: data.region,
        city: data.city,
        timezone: data.timezone,
      };
    }
  } catch (error) {
    // Fallback to cached data or default
  }
}
```

## 🌍 Internationalization & Localization

### 1. Region-Based Content
```typescript
// Filter content based on user region
const shouldShowTestimonial = (testimonial: Testimonial): boolean => {
  if (!testimonial.targetRegions || testimonial.targetRegions.length === 0) {
    return true; // Show to all if no specific regions defined
  }
  
  return testimonial.targetRegions.includes('all') || 
         testimonial.targetRegions.includes(userRegion);
};

const filteredTestimonials = availableTestimonials.filter(shouldShowTestimonial);
```

### 2. Localized Pricing
```typescript
export function getLocalizedPricing(region: Region, basePrice: string): string {
  switch (region) {
    case 'france':
      return basePrice.replace(/€/g, '€').replace(/EUR/g, '€');
    case 'morocco':
      const numericPrice = parseFloat(basePrice.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(numericPrice)) {
        const madPrice = Math.round(numericPrice * 11); // EUR to MAD conversion
        return `${madPrice.toLocaleString()} MAD`;
      }
      return basePrice;
    case 'international':
      return basePrice;
    default:
      return basePrice;
  }
}
```

## 🔧 Development Workflow

### 1. Environment Configuration
```bash
# Development
npm run dev              # Standard development server
npm run dev:fast         # Turbo mode for faster builds
npm run dev:analyze      # Bundle analysis

# Production
npm run build            # Production build
npm run start            # Production server
npm run export           # Static export
```

### 2. Database Seeding
```bash
# Seed different types of data
npm run seed:content     # Seed content pages
npm run seed:companies   # Seed company data
npm run seed:contact     # Seed contact information
npm run seed:odoo        # Seed Odoo-related data
```

### 3. Code Quality
```bash
npm run lint             # ESLint checking
npm run type-check       # TypeScript type checking
npm run format           # Prettier formatting
```

## 🚀 Deployment Strategy

### 1. Build Optimization
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};
```

### 2. Environment Variables
```bash
# Production environment
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
HUBSPOT_ACCESS_TOKEN=your-hubspot-token
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Monitoring & Analytics
- **Performance Monitoring** - Real-time Core Web Vitals
- **Error Tracking** - Client and server error logging
- **User Analytics** - Button clicks, page views, engagement
- **SEO Monitoring** - Meta tags, structured data validation

## 🔍 Troubleshooting & Debugging

### 1. Common Issues

#### MongoDB Connection Issues
```typescript
// lib/mongodb.ts
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  try {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
  
  return cached.conn;
}
```

#### Authentication Issues
```typescript
// Check session status
const { data: session, status } = useSession();

if (status === "loading") {
  return <Loader />;
}

if (status === "unauthenticated") {
  redirect("/auth/signin");
}
```

#### Performance Issues
```typescript
// Monitor bundle size
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
}
```

### 2. Debug Tools
- **Next.js DevTools** - Built-in debugging
- **React DevTools** - Component inspection
- **MongoDB Compass** - Database visualization
- **Chrome DevTools** - Performance profiling

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [HubSpot API Documentation](https://developers.hubspot.com)

### Best Practices
- **Performance** - Core Web Vitals optimization
- **Security** - Authentication and authorization
- **SEO** - Meta tags and structured data
- **Accessibility** - ARIA labels and keyboard navigation

---

*This technical documentation provides a comprehensive overview of the BlackSwan Technology platform architecture. For specific implementation details, refer to the individual component files and API endpoints.*
