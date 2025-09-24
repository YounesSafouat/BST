# 🚀 Quick Start Guide - BlackSwan Technology

## ⚡ Get Up and Running in 5 Minutes

This guide will help you set up the BlackSwan Technology project on your local machine quickly.

## 📋 Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **MongoDB** - Local installation or MongoDB Atlas account
- **Code Editor** - VS Code recommended

## 🚀 Quick Setup

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/BST.git
cd BST

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/blackswan
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/blackswan

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# HubSpot (Optional for development)
HUBSPOT_ACCESS_TOKEN=your-hubspot-token

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Seed initial data
npm run seed:content
npm run seed:companies
npm run seed:contact
```

### 4. Start Development Server
```bash
# Standard development
npm run dev

# Fast development (recommended)
npm run dev:fast

# With bundle analysis
npm run dev:analyze
```

**Your site is now running at:** http://localhost:3000

## 🎯 What You'll See

### Frontend (http://localhost:3000)
- **Homepage** - Company showcase with Odoo & HubSpot expertise
- **Blog** - Content management system
- **About** - Company information
- **Contact** - Lead generation forms

### Dashboard (http://localhost:3000/dashboard)
- **Analytics** - Button clicks, page views, engagement metrics
- **Traffic Sources** - Google Ads, Meta Ads, LinkedIn, organic search analytics
- **Content Management** - Edit website content
- **SEO Settings** - Meta tags and optimization
- **User Management** - Admin and editor accounts


## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:fast         # Turbo mode (faster)
npm run dev:analyze      # Bundle analysis

# Building
npm run build            # Production build
npm run start            # Production server
npm run export           # Static export

# Code Quality
npm run lint             # ESLint checking
npm run type-check       # TypeScript checking

# Database
npm run seed:content     # Seed content pages
npm run seed:companies   # Seed company data
npm run seed:contact     # Seed contact info
```

## 📁 Key Files to Know

```
BST/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── dashboard/               # Admin dashboard
│   └── api/                     # API endpoints
├── components/                   # React components
│   ├── home/                    # Homepage components
│   ├── dashboard/               # Dashboard components
│   └── ui/                      # Base UI components
├── lib/                         # Utilities
│   ├── mongodb.ts               # Database connection
│   ├── auth.ts                  # Authentication
│   └── seo.ts                   # SEO utilities
└── models/                      # Database models
```

## 🎨 Customization

### 1. Change Company Information
Edit `app/layout.tsx` for global company details:
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Your Company Name - Official Odoo & HubSpot Partner',
    template: '%s | Your Company Name'
  },
  description: 'Your company description here...',
  // ... other metadata
};
```

### 2. Modify Homepage Content
Update content in the dashboard or edit `components/home/HomePage.tsx` directly.

### 3. Change Colors & Styling
Edit `tailwind.config.ts` and `app/globals.css` for branding.

## 🔍 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Verify connection string in .env.local
MONGODB_URI=mongodb://localhost:27017/blackswan
```

#### 2. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### 3. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 4. Authentication Issues
```bash
# Check environment variables
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# Verify MongoDB user exists
npm run seed:users
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check console for detailed logs
```

## 📚 Next Steps

### 1. Explore the Codebase
- **Components** - Understand the UI structure
- **API Routes** - Learn the backend endpoints
- **Database Models** - See data structure



### 2. Learn the Architecture
- Read `TECHNICAL_DOCUMENTATION.md` for deep dive
- Check `README.md` for project overview
- Explore the dashboard features

### 3. Deploy
- **IONOS + GitHub Actions** (Current): Push to main branch for automatic deployment
  ```bash
  # Deploy by pushing to main branch
  git add .
  git commit -m "Update website content"
  git push origin main
  # 🚀 Automatic deployment triggered!
  ```
- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repo
- **Self-hosted**: `npm run build && npm run start`

## 🆘 Need Help?

- **Documentation**: Check `README.md` and `TECHNICAL_DOCUMENTATION.md`
- **Issues**: Create a GitHub issue
- **Code**: Review the source code and comments

## 🎉 You're All Set!

You now have a fully functional business website with:
- ✅ Modern Next.js frontend
- ✅ Admin dashboard with analytics
- ✅ Content management system
- ✅ SEO optimization
- ✅ Performance monitoring
- ✅ Multi-region support

**Happy coding! 🚀**

---

*For detailed technical information, see `TECHNICAL_DOCUMENTATION.md`*
