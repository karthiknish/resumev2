# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version (includes sitemap generation)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests (uses --passWithNoTests flag)

### Image and Performance Optimization
- `npm run optimize-images` - Optimize images in public directory using Sharp
- `npm run perf` - Run image optimization then build (recommended before production)
- `npm run analyze` - Build with webpack bundle analyzer (opens on ports 8888/8889)

### Development Setup
- `npm run setup` - Install and configure all dependencies including patches
- Node.js version: ^18 (specified in engines)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with React 18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with role-based access control
- **AI Integration**: Google Gemini API for content generation
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Image Management**: Pexels API integration with Next.js Image optimization

### Project Structure
- `src/pages/` - Next.js pages and API routes
  - `src/pages/api/ai/` - AI-powered content generation endpoints
  - `src/pages/api/auth/` - Authentication endpoints
  - `src/pages/admin/` - Protected admin dashboard pages
- `src/components/` - Reusable React components
  - `src/components/ui/` - shadcn/ui components
  - `src/components/admin/` - Admin-specific components
  - `src/components/home/` - Homepage sections
- `src/lib/` - Utility libraries and services
- `src/models/` - Mongoose database models
- `src/middleware.js` - NextAuth middleware protecting /admin routes

### Key Features Architecture

#### AI Content Generation
- Multiple Gemini model fallback system in `src/lib/gemini.js`
- AI endpoints in `src/pages/api/ai/` for blog generation, content formatting, and suggestions
- Blog creation from URLs, outlines, or topics

#### Authentication & Authorization
- NextAuth.js configuration in `src/pages/api/auth/[...nextauth].js`
- Middleware protects `/admin/*` routes
- Role-based access control with admin user management

#### Database Models
Key models in `src/models/`:
- `Blog.js` - Blog posts with draft/published status, categories, SEO fields
- `User.js` - User accounts with role-based permissions
- `Comment.js` - Blog comments system
- `Subscriber.js` - Newsletter subscribers
- `Contact.js` - Contact form submissions

#### Image Management
- Pexels API integration for stock photos (`src/pages/api/pexels/search.js`)
- Next.js Image optimization with multiple formats (AVIF, WebP)
- Custom image optimization script (`scripts/optimize-images.js`)

## Development Guidelines

### Component Architecture
- Uses shadcn/ui component system (configured in `components.json`)
- Dynamic imports for performance-critical components (ChatBot, PageTransitionWrapper)
- Consistent use of Tailwind CSS with custom color system and CSS variables

### API Design Patterns
- Consistent error handling across API routes
- Database connection pooling via `src/lib/dbConnect.js`
- Input validation and sanitization for all endpoints
- Rate limiting and usage tracking for AI endpoints

### Performance Optimizations
- Image optimization pipeline with multiple device sizes
- Bundle analysis available via `npm run analyze`
- CSS minimization and compression enabled
- Static asset caching headers configured

### Testing Setup
- Jest with jsdom environment
- Path mapping configured for `@/` imports
- Testing Library React for component testing
- Axe-core integration for accessibility testing

## Environment Configuration

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Application URL for NextAuth

## Common Workflows

### Adding New Blog Features
1. Define database schema in `src/models/Blog.js`
2. Create API endpoints in `src/pages/api/blog/`
3. Build admin UI in `src/components/admin/`
4. Add public-facing components in `src/components/`

### AI Feature Development
1. Add AI service functions in `src/lib/gemini.js`
2. Create API endpoint in `src/pages/api/ai/`
3. Integrate in admin dashboard or user-facing components

### Authentication Changes
1. Modify NextAuth configuration in `src/pages/api/auth/[...nextauth].js`
2. Update middleware in `src/middleware.js` for route protection
3. Adjust role checks in protected API routes

## Important Notes

- Always run `npm run lint` before committing
- Use the custom build script with `npm run perf` for production deployments
- MongoDB connection is cached globally for performance
- AI model fallback system handles API failures gracefully
- Image optimization is essential - use `npm run optimize-images` for new assets