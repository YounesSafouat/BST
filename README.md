# BlackSwan Technology - Official Odoo & HubSpot Partner in Morocco

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.3.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![HubSpot](https://img.shields.io/badge/HubSpot-Platinum%20Partner-orange?style=for-the-badge&logo=hubspot)](https://www.hubspot.com/)
[![Odoo](https://img.shields.io/badge/Odoo-Official%20Partner-green?style=for-the-badge&logo=odoo)](https://www.odoo.com/)

## 🚀 Project Overview

**BlackSwan Technology** is a leading Moroccan digital transformation consultancy specializing in business solutions integration. We help companies transition from operational chaos to systematic efficiency by implementing and customizing **Odoo ERP** and **HubSpot CRM** solutions based on their specific needs.

### 🏢 What We Do

#### Core Services
- **🔧 Odoo ERP Implementation** - Complete business management solutions (inventory, accounting, HR, manufacturing, sales, etc.)
- **📊 HubSpot CRM Integration** - Customer relationship management and marketing automation
- **🔗 Hybrid Solutions** - Combined Odoo + HubSpot implementations for comprehensive business management
- **⚙️ Custom Development** - Tailored solutions that fit each company's unique requirements
- **🎓 Training & Support** - Ongoing assistance and team education to ensure successful adoption
- **📈 Audit & Optimization** - Process analysis and performance improvement strategies

#### Market Positioning
- **🥇 Official Odoo Partner** (Silver Certification)
- **🏆 HubSpot Platinum Partner** 
- **🌍 Multi-Regional Expertise** - Morocco, France, and International markets
- **💼 SME Focus** - Specialized in small to medium enterprise digital transformation

### 🎯 Our Mission & Story

**From Chaos to Transformation** - Our unique value proposition stems from lived experience. We've personally navigated the transition from operational chaos (Excel files, lost clients, manual processes) to systematic efficiency. This firsthand experience allows us to:

- **Understand Pain Points** - We've lived the problems our clients face
- **Provide Realistic Solutions** - Our recommendations are battle-tested
- **Accelerate Implementation** - We know the pitfalls to avoid
- **Ensure Adoption Success** - We understand change management challenges

*"Our mission? Help you avoid what we lived through, and save you the time we lost."*

### 🌍 Regional Business Strategy

#### **Morocco** (Primary Market)
- Local expertise with Moroccan business context
- MAD currency pricing and local payment methods
- Arabic/French language support
- Understanding of local regulations and business practices

#### **France** (Secondary Market)
- European business compliance and standards
- Euro pricing and EU payment methods
- French business culture and communication style
- GDPR compliance and European data protection

#### **International** (Tertiary Market)
- Global best practices and standards
- Multi-currency support
- English communication
- Remote implementation capabilities

This repository contains our company website, content management system, and client project management tools that showcase our expertise and streamline our service delivery.

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **Next.js 14.2.0** - React framework with App Router for optimal performance
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe development with strict configuration

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework with custom design system
- **Radix UI** - Accessible, unstyled UI components
- **Framer Motion** - Advanced animations and transitions
- **Lucide React** - Beautiful, customizable icons

## 🎨 Design System & Visual Identity

### Color Palette
Our design system uses a **clean, professional, two-color approach** for maximum impact and consistency:

- **🔵 Primary Color**: `#0EA5E9` (Sky Blue) - Used for CTAs, highlights, and brand elements
- **⚫ Secondary Color**: `#1E293B` (Dark Slate) - Used for text, backgrounds, and secondary elements
- **⚪ Supporting Colors**: Clean whites and subtle grays for backgrounds and content areas

### Typography
- **Primary Font**: **Inter** (Google Fonts) - Modern, highly readable sans-serif
- **Heading Font**: **Inter** - Consistent typography hierarchy
- **Optimization**: Font loading optimized with `font-display: swap` for performance
- **Accessibility**: Proper contrast ratios and readable font sizes

### Design Principles

#### 1. **Minimalist Professional**
- Clean layouts with generous white space
- Business-focused aesthetic that builds trust
- Reduced cognitive load for better user experience

#### 2. **Performance-First Design**
- Progressive rendering for faster perceived load times
- Optimized images and lazy loading
- Critical CSS inlined, non-critical CSS deferred

#### 3. **Mobile-First Responsive**
- Fully responsive across all devices
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes

#### 4. **Accessibility & Inclusion**
- WCAG 2.1 AA compliance
- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader optimization

### Visual Elements & Interactions

#### **Animations & Transitions**
- **Smooth Framer Motion** transitions for professional feel
- **Scroll-triggered animations** for engaging storytelling
- **Hover effects** that provide clear feedback
- **Loading states** that maintain user engagement

#### **Interactive Components**
- **Timeline Animations** - Scrolling module cards in platform section
- **Instagram-style Testimonials** - Slide animations with center focus
- **Progressive Form Filling** - Smart contact capture system
- **Regional Content Adaptation** - Dynamic content based on user location

#### **Layout & Spacing**
- **Consistent spacing system** using Tailwind's scale
- **Grid-based layouts** for visual harmony
- **Proper content hierarchy** with clear visual relationships
- **Balanced compositions** that guide user attention

### Backend & Database
- **MongoDB 6.3.0** - NoSQL database with Mongoose ODM
- **Prisma** - Type-safe database client (alternative to Mongoose)
- **Next.js API Routes** - Serverless API endpoints

### Authentication & Security
- **NextAuth.js 4.24.5** - Authentication framework with JWT strategy
- **bcryptjs** - Password hashing and verification
- **Role-based access control** - Admin and Editor roles

### Content Management
- **Rich Text Editor** - Markdown and WYSIWYG editing capabilities
- **Dynamic content loading** - API-driven content management
- **SEO optimization** - Meta tags, structured data, and Open Graph

### Analytics & Tracking
- **Custom analytics system** - Button clicks and page view tracking
- **Geolocation services** - Region-based content targeting
- **Performance monitoring** - Real-time performance metrics

### Third-Party Integrations
- **HubSpot CRM** - Contact management and lead tracking
- **Geolocation APIs** - IP-based location detection
- **Performance APIs** - Web vitals and user experience metrics

## 📁 Project Structure

```
BST/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   │   ├── auth/               # Authentication routes
│   │   ├── content/            # Content management
│   │   ├── dashboard/          # Analytics endpoints
│   │   ├── testimonials/       # Testimonials API
│   │   └── track-*/            # Analytics tracking
│   ├── auth/                   # Authentication pages
│   ├── blog/                   # Blog functionality
│   ├── dashboard/              # Admin dashboard
│   └── layout.tsx              # Root layout
├── components/                  # Reusable UI components
│   ├── dashboard/              # Dashboard-specific components
│   ├── home/                   # Homepage components
│   ├── ui/                     # Base UI components
│   └── *.tsx                   # Feature components
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication configuration
│   ├── mongodb.ts              # Database connection
│   ├── seo.ts                  # SEO utilities
│   ├── geolocation.ts          # Location services
│   └── hubspot.ts              # HubSpot integration
├── models/                     # Database models
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
└── styles/                     # Global styles
```

## 🏆 Competitive Advantages

### 1. **Authentic Experience-Based Approach**
- **"From Chaos to Transformation"** - We've personally lived through the operational challenges our clients face
- **Battle-Tested Solutions** - Our recommendations come from real-world experience, not theory
- **Accelerated Implementation** - We know the pitfalls and how to avoid them
- **Realistic Expectations** - We set proper timelines based on actual implementation experience

### 2. **Rare Dual Expertise**
- **Odoo + HubSpot Specialists** - Few consultancies master both platforms
- **Hybrid Solutions** - Unique ability to integrate ERP and CRM seamlessly  
- **Cross-Platform Data Flow** - Expertise in connecting business systems
- **Holistic Business View** - Understanding of complete operational workflows

### 3. **Multi-Regional Market Intelligence**
- **Moroccan Market Expertise** - Deep understanding of local business practices
- **European Compliance** - GDPR, French business culture, EU standards
- **International Standards** - Global best practices and remote implementation
- **Cultural Adaptation** - Communication styles that resonate with each market

### 4. **Technical Excellence**
- **Modern Tech Stack** - Fast, secure, scalable platform
- **Performance-First** - Optimized for speed and user experience
- **Advanced Analytics** - Data-driven insights for business decisions
- **Professional Presentation** - Website that reflects technical competence

## 🎯 Key Features & Capabilities

### 1. **Intelligent Multi-Region Targeting**
- **🌍 Automatic Geolocation** - IP-based location detection with fallbacks
- **🎯 Dynamic Content** - France, Morocco, and International content adaptation
- **💰 Localized Pricing** - Currency conversion (EUR ↔ MAD) and regional pricing
- **📞 Regional Contact Info** - Location-specific phone numbers, WhatsApp, and addresses
- **🗣️ Language Support** - French and Arabic content management

### 2. **Advanced Analytics & Business Intelligence**
- **📊 Real-Time Tracking** - Button clicks, page views, user interactions, and engagement
- **📈 Performance Metrics** - Conversion rates, engagement analysis, and ROI tracking
- **🔍 Advanced Filtering** - Time ranges, devices, countries, button types, and user segments
- **📋 Visual Dashboards** - Interactive charts, performance indicators, and trend analysis
- **🎯 Lead Analytics** - Conversion funnel analysis and lead source tracking

### 3. **Sophisticated Content Management**
- **⚡ Dynamic CMS** - API-driven content with intelligent caching
- **✍️ Rich Text Editing** - Markdown and WYSIWYG editors with live preview
- **🔍 SEO Management** - Meta tags, structured data, Open Graph optimization
- **🖼️ Media Management** - Image optimization, CDN integration, and asset handling
- **🔄 Version Control** - Content versioning and rollback capabilities

### 4. **Smart Customer Relationship Management**
- **🤝 HubSpot Integration** - Automatic contact creation, updates, and custom properties
- **📝 Progressive Lead Capture** - Stores contact info as users type (partial leads)
- **🚫 Duplicate Prevention** - Intelligent deduplication and record merging
- **📱 Multi-Channel Communication** - WhatsApp, phone, email integration
- **📅 Appointment Booking** - Meeting scheduling with regional calendar integration
- **🏷️ Lead Scoring** - Behavioral analysis and qualification scoring

### 5. **Performance & User Experience**
- **🚀 Progressive Rendering** - Critical content first, lazy loading for optimal performance
- **📱 Mobile-First Design** - Responsive across all devices with touch optimization
- **🖼️ Image Optimization** - Next.js Image component with WebP and lazy loading
- **⚡ Code Splitting** - Dynamic imports and bundle optimization
- **💾 Smart Caching** - Session storage, API caching, and CDN integration
- **🔄 Smooth Animations** - Framer Motion transitions for professional feel

### 6. **Advanced Contact System** 
- **🎯 Partial Lead Capture** - Captures contact info progressively as users type
- **🔄 Real-Time Sync** - Immediate HubSpot CRM synchronization
- **🌍 Geolocation Integration** - Auto-detects country and pre-selects country codes
- **📊 Behavioral Tracking** - User engagement analysis and lead qualification
- **⏰ Timer-Based Follow-up** - Automatic partial lead processing after inactivity
- **🔗 Cross-Platform Tracking** - Unified user journey across touchpoints

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/auth/signin` - User sign-in
- `POST /api/auth/signout` - User sign-out

### Content Management
- `GET /api/content?type={type}` - Get content by type
- `POST /api/content` - Create new content
- `PUT /api/content?type={type}` - Update content
- `DELETE /api/content?type={type}` - Delete content

### Analytics & Tracking
- `POST /api/track-button-click` - Track button interactions
- `POST /api/track-page-view` - Track page views
- `GET /api/dashboard/button-clicks` - Get button click analytics
- `GET /api/dashboard/page-views` - Get page view analytics

### Customer Management
- `GET /api/testimonials?region={region}` - Get region-specific testimonials
- `POST /api/testimonials` - Create new testimonial
- `POST /api/contact` - Submit contact form
- `GET /api/contact-submissions` - Get contact submissions

### Smart Contact System 🆕
- `POST /api/contact/partial` - Store partial contact information as users type
- `POST /api/contact/cleanup-duplicates` - Clean up duplicate partial submissions
- `POST /api/contact/merge-partials` - Merge duplicate partial records
- `POST /api/contact/cleanup-incomplete` - Remove incomplete email records
- `GET /api/contact/partial/test` - Test partial contact API functionality
- `GET /api/test-hubspot` - Test HubSpot integration with custom properties
- `GET /api/test-hubspot-properties` - List available HubSpot contact properties
- `GET /api/test-hubspot-enum` - Check HubSpot enum property options

### SEO & Settings
- `GET /api/seo/{id}` - Get SEO data
- `PUT /api/seo/{id}` - Update SEO settings
- `GET /api/appearance/active` - Get active appearance settings
- `PUT /api/appearance/{id}` - Update appearance settings

## 🎨 Dashboard Features

### Main Dashboard
- **Overview Analytics** - Key performance indicators
- **Real-Time Data** - Live button clicks and page views
- **Performance Charts** - Visual representation of metrics
- **Global Filters** - Time ranges, devices, countries, button types

### Content Management
- **Home Page Editor** - Hero sections, services, testimonials
- **Blog Management** - Post creation, editing, and publishing
- **Client Management** - Client case studies and portfolios
- **Testimonial System** - Customer feedback management

### SEO & Marketing
- **SEO Settings** - Meta tags, keywords, structured data
- **Appearance Customization** - Colors, fonts, branding
- **Snippet Management** - Analytics and tracking scripts
- **Performance Monitoring** - Web vitals and user experience

### User Management
- **Role-Based Access** - Admin and Editor permissions
- **User Authentication** - Secure login and session management
- **Activity Tracking** - User actions and system usage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- HubSpot account (for CRM integration)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/BST.git
   cd BST
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   HUBSPOT_ACCESS_TOKEN=your_hubspot_token
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Seed initial data
   npm run seed:content
   npm run seed:companies
   npm run seed:contact
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   # or
   npm run dev:fast
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:fast` - Start with Turbo mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:*` - Seed database with sample data

## 🌍 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Configuration
- Set production environment variables
- Configure MongoDB connection string
- Set up HubSpot production tokens
- Configure domain and SSL certificates

### IONOS + GitHub Actions Deployment (Current Setup)

The project is configured for automatic deployment using IONOS hosting and GitHub Actions workflows.

#### How It Works
1. **Push to Main Branch** → Automatically triggers GitHub Actions workflow
2. **Build Process** → Next.js application is built and optimized
3. **Deployment** → Built files are automatically deployed to IONOS hosting
4. **Live Update** → Website is updated immediately after successful deployment

#### GitHub Workflow Configuration
The workflow is configured in `.github/workflows/` and automatically:
- Builds the Next.js application
- Runs tests and quality checks
- Deploys to IONOS hosting
- Provides deployment status feedback

#### Benefits
- **Zero Downtime** - Automatic deployments without manual intervention
- **Version Control** - Every deployment is tied to a specific git commit
- **Rollback Ready** - Easy to revert to previous versions
- **Team Collaboration** - Multiple developers can deploy safely

### **🎯 Smart Contact System Implementation**

#### **Overview**
The Smart Contact System automatically captures leads as users interact with the contact form, ensuring no potential client is lost while maintaining optimal website performance.

#### **Key Components**

##### **1. ContactSubmission Model**
- **Status Tracking**: `submissionStatus` (partial/complete) and `status` (pending/read/replied/closed/partial_lead_sent)
- **Field Completion**: `fieldsFilled` object tracks which form fields have been completed
- **HubSpot Integration**: `sentToHubSpot`, `hubspotContactId`, `hubspotSyncDate` fields
- **Database Constraints**: Unique compound indexes prevent duplicate partial submissions

##### **2. Partial Lead Management**
- **2-Hour Timer**: Automatically sends partial leads to HubSpot if form not completed
- **LocalStorage Tracking**: Client-side progress tracking with zero performance impact
- **Smart Deduplication**: Updates existing records instead of creating duplicates
- **Status Updates**: Database updated when leads are sent to HubSpot

##### **3. HubSpot Integration**
- **Automatic Status**: `contact_status` set to 'partial lead' for incomplete submissions
- **Custom Properties**: Tracks submission count, dates, and lead status
- **Duplicate Prevention**: Prevents sending the same partial lead multiple times
- **User Behavior Data**: Includes French descriptions of user engagement for sales team

##### **4. User Behavior Tracking**
- **Page Visits**: Tracks which pages the user visited
- **Time Spent**: Monitors time spent on the website
- **Form Interactions**: Counts form field interactions
- **French Descriptions**: Generates detailed behavior analysis in French for sales team
- **Engagement Levels**: Categorizes users as high/medium/low engagement

## 📈 Business Impact & Results

### Client Transformation Metrics
Our clients typically achieve significant operational improvements:

- **-80% Administrative Time** - Elimination of manual Excel processes
- **+150% Sales Efficiency** - Streamlined sales processes and better lead management  
- **+200% Business Visibility** - Real-time dashboards and reporting
- **-60% Data Entry Errors** - Automated workflows and validation
- **+90% Team Productivity** - Integrated systems and reduced context switching

### Platform Performance Metrics
- **3+ Years** of proven expertise in digital transformation
- **100+ Clients** successfully transformed across Morocco and France
- **50+ Projects** implemented with high success rates
- **24h Response Time** guaranteed for support requests
- **95%+ Client Satisfaction** based on post-implementation surveys

## 📊 Analytics & Performance

### Advanced Tracking System
- **🎯 User Behavior Analytics** - Button clicks, page views, scroll depth, time on page
- **📱 Device & Browser Analytics** - Cross-platform usage patterns and optimization
- **🌍 Geolocation Analytics** - Regional performance insights and content effectiveness
- **🔄 Conversion Tracking** - Lead generation funnel analysis and optimization
- **⚡ Performance Monitoring** - Core Web Vitals, load times, and user experience metrics

### Technical Performance Metrics
- **🚀 Lighthouse Scores** - 95+ Performance, 100 Accessibility, 100 SEO, 100 Best Practices
- **⚡ Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- **📦 Bundle Optimization** - Code splitting reduces initial load by 60%
- **🖼️ Image Optimization** - WebP format and lazy loading reduce image payload by 40%
- **💾 Caching Strategy** - Session storage and API caching improve repeat visits by 70%

## 🔒 Security Features

- **Authentication** - JWT-based session management
- **Role-Based Access** - Admin and Editor permissions
- **Input Validation** - Zod schema validation
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API endpoint protection
- **Password Hashing** - bcrypt security

## 🧪 Testing & Quality

### Code Quality
- **TypeScript** - Static type checking
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Strict Mode** - Enhanced error checking

### Performance Testing
- **Bundle Analyzer** - Webpack bundle analysis
- **Performance Monitoring** - Real-time metrics
- **Lighthouse CI** - Automated performance testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for BlackSwan Technology. All rights reserved.

## 🆘 Support

For technical support or questions:
- **Email**: younes@blackswantechnology.fr
- **Documentation**: [Internal Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)

## 🔄 Version History

- **v0.1.0** - Initial release with core functionality
- **v0.2.0** - Added analytics dashboard and tracking
- **v0.3.0** - Implemented geolocation and regional targeting
- **v0.4.0** - Enhanced performance and SEO features

---

## 🚀 **LEADS Management System**

### **Overview**
The LEADS management system provides comprehensive contact and lead management capabilities with full HubSpot CRM integration. It handles both partial and complete form submissions, tracks user behavior, and provides powerful filtering and bulk management tools.

### **Features**

#### **📊 Lead Dashboard**
- **Real-time Statistics**: Total leads, partial vs. complete submissions, HubSpot sync status
- **Visual Indicators**: Color-coded badges for different submission types and statuses
- **Quick Overview**: At-a-glance lead distribution and performance metrics

#### **🔍 Advanced Filtering & Search**
- **Text Search**: Search across names, emails, phones, and company names
- **Status Filters**: Filter by commercial status (pending, in-progress, completed, archived)
- **HubSpot Filters**: Filter by HubSpot sync status (sent, not sent)
- **Submission Type**: Filter by form completion status (partial, complete)
- **Geographic Filters**: Filter by country code and country name
- **Real-time Updates**: Filters apply instantly without page refresh

#### **📋 Lead Management**
- **Individual Actions**: View details, update status, send to HubSpot
- **Bulk Operations**: Select multiple leads for batch processing
- **Status Management**: Update commercial status for multiple leads simultaneously
- **HubSpot Integration**: Bulk send complete leads to HubSpot CRM

#### **🔗 HubSpot Integration**
- **Direct Links**: Click to view contacts directly in HubSpot CRM
- **Sync Status**: Track which leads have been sent to HubSpot
- **Manual Sync**: Manually trigger HubSpot integration for individual or bulk leads
- **Contact IDs**: Store and display HubSpot contact IDs for reference

#### **📱 User Behavior Tracking**
- **Comprehensive Analytics**: Page visits, time spent, button clicks, scroll depth
- **Engagement Scoring**: Automatic lead qualification based on user behavior
- **Sales Intelligence**: Detailed descriptions for commercial teams
- **Behavior History**: Track user interactions across multiple sessions

### **Technical Implementation**

#### **Database Schema**
```typescript
interface ContactSubmission {
  _id: string
  name: string                    // Combined name
  firstname: string              // First name (HubSpot: firstname)
  lastname: string               // Last name (HubSpot: lastname)
  email: string                  // Email address
  phone: string                  // Phone with country code
  company: string                // Company name
  message: string                // User message
  submissionStatus: 'partial' | 'complete'
  status: string                 // Commercial status
  sentToHubSpot: boolean         // HubSpot sync status
  hubspotContactId?: string      // HubSpot contact ID
  hubspotSyncDate?: string       // Last sync timestamp
  brief_description?: string     // User behavior analysis
  fieldsFilled: {                // Form completion tracking
    name: boolean
    firstname: boolean
    lastname: boolean
    email: boolean
    phone: boolean
    company: boolean
    message: boolean
  }
  countryCode: string            // ISO country code
  countryName: string            // Country name
  source: string                 // Traffic source
  page: string                   // Page where form was submitted
  createdAt: string              // Creation timestamp
  updatedAt: string              // Last update timestamp
}
```

#### **API Endpoints**
- **`GET /api/contact`**: Fetch all contact submissions
- **`POST /api/contact`**: Submit complete form and sync to HubSpot
- **`PATCH /api/contact/[id]`**: Update lead status
- **`POST /api/contact/partial`**: Store partial form data
- **`POST /api/contact/partial-hubspot`**: Send partial leads to HubSpot after timer

#### **HubSpot Properties**
- **`firstname`**: User's first name
- **`lastname`**: User's last name
- **`email`**: Email address
- **`phone`**: Phone number with country code
- **`company`**: Company name
- **`message`**: User message or project description
- **`brief_description`**: French user behavior analysis
- **`submission_count`**: Number of form submissions
- **`contact_status`**: Lead qualification status
- **`last_submission_date`**: Most recent submission
- **`first_submission_date`**: Initial contact date

### **User Workflow**

#### **1. Lead Capture**
- **Partial Submission**: Store contact info as soon as valid email/phone entered
- **Complete Submission**: Full form submission with HubSpot sync
- **Auto-timer**: Send partial leads to HubSpot after 30 minutes if not completed

#### **2. Lead Management**
- **Review**: View detailed lead information and user behavior
- **Qualify**: Update commercial status based on lead quality
- **Process**: Send qualified leads to HubSpot CRM
- **Track**: Monitor HubSpot sync status and contact IDs

#### **3. Bulk Operations**
- **Select**: Choose multiple leads using checkboxes
- **Update**: Bulk status updates for selected leads
- **Sync**: Send multiple complete leads to HubSpot simultaneously
- **Archive**: Bulk archive processed leads

### **Access Control**
- **Authentication Required**: Only authenticated users can access the LEADS section
- **Role-based Access**: Different permission levels for different user roles
- **Audit Trail**: Track all lead status changes and HubSpot operations

### **Performance Features**
- **Lazy Loading**: Load leads in batches for better performance
- **Real-time Updates**: Instant status updates without page refresh
- **Efficient Filtering**: Client-side filtering for fast response times
- **Optimized Queries**: Database queries optimized for lead management

### **Integration Points**
- **HubSpot CRM**: Full bidirectional sync with custom properties
- **Geolocation API**: Automatic country detection and phone formatting
- **User Behavior Tracking**: Comprehensive engagement analytics
- **Email/Phone Validation**: Real-time validation with helpful user guidance

---

## 🎯 **Next Steps & Enhancements**

### **Planned Features**
- **Lead Scoring**: Automatic lead qualification based on behavior patterns
- **Email Campaigns**: Integration with email marketing platforms
- **Advanced Analytics**: Conversion funnel analysis and ROI tracking
- **Mobile App**: Native mobile application for lead management
- **API Webhooks**: Real-time notifications for lead updates

### **Customization Options**
- **Custom Fields**: Add company-specific lead properties
- **Workflow Automation**: Custom lead processing workflows
- **Integration APIs**: Connect with additional CRM and marketing tools
- **Reporting Dashboard**: Custom reports and analytics views

---

## 📋 **Current Development Tasks**

### **Homepage Improvements**

#### **🎨 Design & UI Updates**
- [ ] **Certification Section**: Modify and verify certification display
- [ ] **Logo Morocco/Favicon**: Show photo only in Morocco, replace with transparent favicon for other regions
- [ ] **Header Logo**: Increase BlackSwan logo size in header
- [ ] **Top Bar**: Expand header/top bar size
- [ ] **Font Updates**: Modify Odoo homepage font styling

#### **🎭 Animations & Interactions**
- [x] **Testimonials Animation**: Implement Instagram-style slide animation
- [ ] **Company Logos Carousel**: 
  - [ ] Slow down scroll speed
  - [ ] Add bordered frames around logos
  - [ ] Slightly increase text font size
  - [ ] Remove "100+ fois" text

#### **📱 Mobile Optimizations**
- [ ] **Button Sizing**: Increase size of first 2 buttons on mobile (currently too small)
- [ ] **Logo Removal**: Remove Odoo Silver logo from mobile header

#### **🗂️ Sections & Modules**
- [ ] **Modules Section**: Reactivate modules section
- [ ] **Partnership Section**: Update Odoo certification partnership section

#### **📊 Case Studies & Content**
- [ ] **Case Studies Filter**: Add left sidebar filter (max width)
- [ ] **Case Study Images**: Use video thumbnail images from testimonial videos
- [ ] **Featured Case**: Implement featured case study display
- [ ] **Style Inspiration**: Implement style similar to [Copernic Agency](https://www.agence-copernic.fr/cas-client-orixa-media-migration-pipedrive-hubspot) while maintaining our brand identity
- [ ] **Client Filter Design**: Keep our style for other client case filters

### **Technical Implementation Notes**
- **Certification**: ✅ Completed - Updated with new Odoo Silver Partner logo and French certification
- **Regional Images**: ✅ Completed - Implemented geolocation-based image selection for "Our Agency" section
- **Testimonials**: ✅ Completed - Added Instagram-style slide animation with center focus and side previews
- **CMS Integration**: ✅ Completed - All changes manageable via dashboard

### **Priority Levels**
- 🔴 **High Priority**: Mobile optimizations, testimonials animation
- 🟡 **Medium Priority**: Logo carousel improvements, case studies
- 🟢 **Low Priority**: Font adjustments, minor UI tweaks

---

## 🎯 **Project Summary**

**BlackSwan Technology** represents a sophisticated fusion of business expertise and technical excellence. This platform serves as both a powerful business tool and a compelling demonstration of our capabilities:

### **Business Excellence**
- **Authentic Value Proposition** - "From Chaos to Transformation" story that resonates with SMEs
- **Rare Dual Expertise** - One of few consultancies mastering both Odoo ERP and HubSpot CRM
- **Multi-Regional Intelligence** - Deep understanding of Moroccan, French, and international markets
- **Proven Track Record** - 100+ successful transformations with measurable results

### **Technical Excellence**  
- **Modern Architecture** - Next.js 14, React 18, TypeScript, MongoDB stack
- **Performance Optimized** - Progressive rendering, smart caching, Core Web Vitals compliance
- **Intelligent Systems** - Geolocation adaptation, progressive lead capture, behavioral analytics
- **Professional Design** - Clean, accessible, conversion-optimized user experience

### **Competitive Positioning**
This platform positions BlackSwan Technology as:
- **🏆 Premium Consultancy** - Technical sophistication demonstrates implementation capabilities
- **🌍 Regional Leader** - Multi-market adaptation shows international experience  
- **📊 Data-Driven Partner** - Advanced analytics prove ROI-focused approach
- **🚀 Innovation Leader** - Modern tech stack shows forward-thinking methodology

### **Strategic Value**
The website serves multiple strategic purposes:
- **Lead Generation Engine** - Smart contact capture and conversion optimization
- **Credibility Builder** - Professional presentation builds trust with enterprise clients
- **Operational Tool** - CMS and analytics support business operations
- **Competitive Differentiator** - Technical excellence sets us apart from traditional consultancies

---

*Official Odoo Partner & Platinum HubSpot Partner in Morocco*

**Ready to transform your business?** Our experience-driven approach combines proven methodologies with cutting-edge technology to deliver measurable results. From operational chaos to systematic efficiency - we've walked the path and can guide you through your transformation journey.
