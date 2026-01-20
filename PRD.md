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
- [ ] Implement auto-save indicator with timestamp in blog editor
- [ ] Add real-time word count and reading time display
- [ ] Create AI keyword suggestion feature in `src/pages/admin/blog/create.js`
- [ ] Add SEO score indicator component
- [ ] Implement scheduled publishing with date/time picker
- [ ] Add version history for blog posts
- [ ] Create internal link suggestion feature

### Phase 5: Agent Mode Enhancements
- [ ] Add URL input support for Agent Mode context in `src/pages/admin/blog/create.js`
- [ ] Implement URL content fetching in `src/pages/api/ai/agent-generate-blog.js`
- [ ] Add file upload (PDF, DOCX, TXT) support for Agent Mode context
- [ ] Create style/voice configuration panel (tone, audience, length)
- [ ] Implement sectional generation workflow (outline first, then sections)
- [ ] Add conversational chat-style UI component `src/components/admin/AgentChat.js`
- [ ] Add web search integration using Exa API for topic research

### Phase 6: UI/UX Polish
- [ ] Add keyboard shortcuts (⌘K command palette)
- [ ] Implement skeleton loading states for all async components
- [ ] Add empty state illustrations for lists and tables
- [ ] Standardize error messaging across all forms
- [ ] Add micro-animations for tab switching and modal transitions
- [ ] Optimize admin dashboard for mobile responsiveness
