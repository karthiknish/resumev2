# PRD: Theme Centralization & Feature Improvements

## Overview
Centralize theme system with proper UI/UX updates. Fix social posting, LinkedIn features, blog improvements, and Agent Mode enhancements.

---

## Tasks

### Phase 1: Centralized Theme System
- [x] Create `src/styles/theme/tokens.css` with design tokens (colors, typography, spacing, shadows)
- [x] Update `src/styles/globals.css` to import theme files and remove commented theme classes
- [x] Update `src/components/ui/button.jsx` to use semantic color tokens
- [x] Update `src/components/ui/card.jsx` with elevation variants
- [x] Update `src/components/ui/input.jsx` with consistent focus ring styling
- [x] Update `src/components/ui/badge.jsx` with status color variants

### Phase 2: Social Posting Fixes
- [x] Create unified `src/components/SocialShare.js` component with copy-to-clipboard
- [x] Fix Open Graph meta tags in `src/pages/blog/[slug].js` (og:image, og:description)
- [x] Add Twitter card meta tags (twitter:card, twitter:creator)
- [x] Create `src/pages/api/analytics/share.js` endpoint for tracking share events
- [x] Add native Web Share API support for mobile devices
- [x] Implement share preview modal component

### Phase 3: LinkedIn Features
- [x] Add hashtag suggestions to `src/components/admin/linkedin/LinkedInPostGenerator.js`
- [x] Add character counter with LinkedIn 3000 char limit
- [x] Create emoji picker component for LinkedIn posts
- [x] Add post template library (Hook, Story, CTA formats)
- [x] Enhance `src/components/admin/linkedin/CarouselGenerator.js` with template library
- [x] Add drag-and-drop slide reordering for carousels
- [x] Create PDF export for carousel slides
- [x] Create `src/models/LinkedInContent.js` for content history persistence
- [x] Update `src/components/admin/tabs/LinkedInTab.js` to use persistent history
- [x] Add mobile swipe preview for carousels

### Phase 4: Blog System Improvements
- [x] Add drag-drop image upload to TipTapEditor
- [x] Implement auto-save indicator with timestamp in blog editor
- [x] Add real-time word count and reading time display
- [x] Create AI keyword suggestion feature in `src/pages/admin/blog/create.js`
- [x] Add SEO score indicator component
- [x] Implement scheduled publishing with date/time picker
- [x] Add version history for blog posts
- [x] Create internal link suggestion feature

### Phase 5: Agent Mode Enhancements
- [x] Add URL input support for Agent Mode context in `src/pages/admin/blog/create.js`
- [x] Implement URL content fetching in `src/pages/api/ai/agent-generate-blog.js`
- [x] Add file upload (PDF, DOCX, TXT) support for Agent Mode context
- [x] Create style/voice configuration panel (tone, audience, length)
- [x] Implement sectional generation workflow (outline first, then sections)
- [x] Add conversational chat-style UI component `src/components/admin/AgentChat.js`
- [x] Add web search integration using Exa API for topic research

### Phase 6: UI/UX Polish
- [x] Add keyboard shortcuts (⌘K command palette)
- [x] Implement skeleton loading states for all async components
- [x] Add empty state illustrations for lists and tables
- [x] Standardize error messaging across all forms
- [x] Add micro-animations for tab switching and modal transitions
- [x] Optimize admin dashboard for mobile responsiveness

---

## Typecheck Errors (2026-01-22)

### src/pages/projects/[id].tsx
- [x] Line 238: Property `extlink` does not exist on type `never`.
- [x] Line 238: Property `extlink` does not exist on type `never`.
- [x] Line 246: Property `extlink` does not exist on type `never`.

### src/pages/api/save-chat.ts
- [x] Line 63: `error` is of type `unknown`.

### src/pages/api/blog/categories/index.ts
- [x] Line 33: `error` is of type `unknown`.

### src/components/ui/parallax-floating.tsx
- [x] Line 73: Ref type mismatch.

### src/components/admin/tabs/NewsletterTab.tsx
- [x] Line 73: `error` is of type `unknown`.
- [x] Line 107: `subject` property error in `setState`.
- [x] Line 120: `error` is of type `unknown`.
- [x] Line 149: `subject` property does not exist on type `never`.
- [x] Line 152: `sentCount` property does not exist on type `never`.

### src/pages/projects/ai-integration.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.
- [ ] Line 53: Type `{ children: string; variant: string; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 62: Type `{ className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 167: Type `{ children: string; key: string; variant: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.

### src/pages/projects/analytics-system.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.
- [ ] Line 116: Type `{ children: (string | Element)[]; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 131: Type `{ className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 364: Type `{ children: string; key: string; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.

### src/pages/projects/index.tsx
- [ ] Line 156: Type `{ children: string; key: number; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.

### src/pages/projects/startup-infrastructure.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.
- [ ] Line 53: Type `{ children: string; variant: string; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 62: Type `{ className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.
- [ ] Line 171: Type `{ children: string; key: string; variant: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.

### src/pages/reset-password/index.tsx
- [ ] Line 62: `error` is of type `unknown`.
- [ ] Line 63: `error` is of type `unknown`.

### src/pages/services/backend-development.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/brochure-websites.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.

### src/pages/services/database-design.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/ecommerce-solutions.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.

### src/pages/services/frontend-development.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/mobile-app-development.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/performance-optimization.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/technical-consultation.tsx
- [ ] Line 113: Type `{ title: string; description: string; }[]` is not assignable to type `never[]`.

### src/pages/services/website-reskin.tsx
- [ ] Line 6: Cannot find module `@/components/PageContainer` or its corresponding type declarations.

### src/pages/signin/index.tsx
- [ ] Line 28: `session.user` is possibly `undefined`.
- [ ] Line 28: Property `role` does not exist on type `{ name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; }`.
- [ ] Line 42: Argument of type `{ email: string; password: string; rememberMe: boolean; }` is not assignable to parameter of type `string`.
- [ ] Line 63: Object literal may only specify known properties, and `redirect` does not exist in type `{ callbackUrl?: string | undefined; }`.

### src/pages/api/subscribers.ts
- [x] Line 73: `error` is of type `unknown`.

### src/pages/signup/index.tsx
- [ ] Line 72: `error` is of type `unknown`.

### src/pages/success.tsx
- [ ] Line 5: Cannot find module `@/components/PageContainer` or its corresponding type declarations.

### src/pages/testimonials.tsx
- [ ] Line 7: Cannot find module `@/components/PageContainer` or its corresponding type declarations.

### src/pages/uk-web-dev-glossary.tsx
- [ ] Line 4: Cannot find module `@/components/UkSeo` or its corresponding type declarations.
- [ ] Line 5: Cannot find module `@/components/JsonLd` or its corresponding type declarations.
- [ ] Line 289: Type `{ children: Element; className: string; }` is not assignable to type `IntrinsicAttributes & RefAttributes<any>`.

### src/pages/unauthorized.tsx
- [ ] Line 5: Cannot find module `@/components/PageContainer` or its corresponding type declarations.
