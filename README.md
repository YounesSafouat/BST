# BlackSwan Technology - Official Odoo & HubSpot Partner in Morocco

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.3.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![HubSpot](https://img.shields.io/badge/HubSpot-Platinum%20Partner-orange?style=for-the-badge&logo=hubspot)](https://www.hubspot.com/)
[![Odoo](https://img.shields.io/badge/Odoo-Official%20Partner-green?style=for-the-badge&logo=odoo)](https://www.odoo.com/)

## 🚀 Project Overview

**BlackSwan Technology** is a leading Moroccan company specializing in business solutions integration and digital transformation. We help companies manage their operations more efficiently by implementing and customizing **Odoo ERP** and **HubSpot CRM** solutions based on their specific needs.

### What We Do
- **Odoo ERP Implementation** - Complete business management solutions (inventory, accounting, HR, manufacturing, etc.)
- **HubSpot CRM Integration** - Customer relationship management and marketing automation
- **Hybrid Solutions** - Sometimes both Odoo and HubSpot when clients need comprehensive business management
- **Custom Development** - Tailored solutions that fit each company's unique requirements
- **Training & Support** - Ongoing assistance to ensure successful adoption

### Our Mission
We transform how companies operate by implementing the right tools and processes that streamline their business operations, improve customer relationships, and drive growth.

This repository contains our company website and internal content management system that showcases our expertise and helps us manage our client projects effectively.

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

## 🎯 Key Features

### 1. Multi-Region Content Targeting
- **Geolocation Detection** - Automatic user location detection via IP
- **Region-Based Content** - France, Morocco, and International targeting
- **Localized Pricing** - Currency conversion and regional pricing
- **Language Support** - French and English content management

### 2. Advanced Analytics Dashboard
- **Real-Time Tracking** - Button clicks, page views, and user interactions
- **Performance Metrics** - Engagement rates, conversion tracking
- **Filtering & Segmentation** - Time ranges, devices, countries, button types
- **Visual Charts** - Bar charts, pie charts, and performance indicators

### 3. Content Management System
- **Dynamic Content** - API-driven content loading with caching
- **Rich Text Editing** - Markdown and WYSIWYG editors
- **SEO Management** - Meta tags, structured data, Open Graph
- **Media Management** - Image optimization and asset handling

### 4. Customer Relationship Management
- **HubSpot Integration** - Automatic contact creation and updates
- **Lead Tracking** - Contact form submissions and lead scoring
- **Communication Tools** - WhatsApp, phone, and email integration
- **Appointment Booking** - Meeting scheduling and calendar integration

### 5. Performance Optimization
- **Progressive Rendering** - Critical content first, lazy loading
- **Image Optimization** - Next.js Image component with optimization
- **Code Splitting** - Dynamic imports and bundle optimization
- **Caching Strategies** - Session storage and Next.js caching

### 6. Smart Contact System 🆕
- **Partial Lead Capture** - Stores contact info as users type (name, email, phone, company, message)
- **Duplicate Prevention** - Unique database constraints prevent multiple records per contact
- **Geolocation Integration** - Auto-detects user's country and pre-selects country code
- **HubSpot CRM Sync** - Real-time contact creation and updates with custom properties
- **Status Tracking** - Monitors partial vs. complete form submissions
- **Smart Record Updates** - Updates existing records instead of creating duplicates
- **Custom Properties** - Tracks submission count, contact status, and submission dates

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

## 📊 Analytics & Performance

### Tracking System
- **Button Click Tracking** - User interaction analytics
- **Page View Analytics** - Traffic and engagement metrics
- **Performance Monitoring** - Core Web Vitals tracking
- **Geolocation Analytics** - Regional performance insights

### Performance Metrics
- **Lighthouse Scores** - Performance, accessibility, SEO
- **Core Web Vitals** - LCP, FID, CLS optimization
- **Bundle Analysis** - Code splitting and optimization
- **Image Optimization** - WebP format and lazy loading

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


*Official Odoo Partner & Platinum HubSpot Partner in Morocco*
