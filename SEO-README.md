# Programmatic SEO System for Karthik Nishanth

A comprehensive programmatic SEO solution for generating targeted service pages for UK business owners seeking web and mobile development services.

**Business**: Karthik Nishanth - Freelance Engineering Partner
**Location**: Liverpool, UK
**Website**: https://karthiknish.com

## Overview

This system generates dynamic, SEO-optimised pages targeting long-tail keywords for:
- **Service Types**: 10 different web/mobile development services
- **Business Segments**: 5 UK business owner demographics
- **Locations**: 16 UK regions and cities

**Total Possible Pages**: ~800 unique combinations

## File Structure

```
src/lib/seo/
├── keyword-config.ts         # Service types, segments, locations, templates
├── content-generator.ts      # Content structure and text generation
├── schema-generator.ts       # JSON-LD structured data
└── keyword-combinations.ts   # Pre-generated keyword combinations

src/components/seo/
└── ProgrammaticServicePage.tsx  # Page template component

src/app/seo/services/
└── [slug]/page.tsx           # Dynamic route handler
```

## Template Variables

| Variable | Description | Examples |
|----------|-------------|----------|
| `{ServiceType}` | Core service offering | "web development", "mobile app development", "e-commerce solutions" |
| `{BusinessSegment}` | Target audience | "UK business owner", "UK SME", "UK startup", "UK company" |
| `{LocationModifier}` | Geographic target | "in London", "in Manchester", "across UK" |

## Keyword Templates

### High Priority (Commercial Intent)
```
{ServiceType} for {BusinessSegment} {LocationModifier}
Affordable {ServiceType} for {BusinessSegment} UK
Best {ServiceType} companies for {BusinessSegment} {LocationModifier}
Top rated {ServiceType} for {BusinessSegment} UK
Professional {ServiceType} for {BusinessSegment} {LocationModifier}
```

### Medium Priority (Research/Comparison)
```
How much does {ServiceType} cost for {BusinessSegment} UK
{ServiceType} pricing for {BusinessSegment} {LocationModifier}
Reliable {ServiceType} providers for {BusinessSegment} UK
Custom {ServiceType} solutions for {BusinessSegment} UK
```

## Page Content Structure

Each generated page includes:

1. **Hero Section** - Title, tagline, starting price, timeline, CTAs
2. **Introduction** - 150-200 words addressing the specific segment
3. **Why Choose Us** - 4-6 benefit bullet points
4. **Our Process** - 6-step methodology
5. **Pricing** - 3-tier pricing structure
6. **Technical Details** - Technology stack information
7. **Location Section** - Local business focus
8. **Pain Points** - Segment-specific challenges addressed
9. **Priorities** - What matters to this segment
10. **FAQ Section** - 6-8 Q&A with JSON-LD schema
11. **CTA Section** - Conversion-focused call to action
12. **Internal Links** - Cross-linking to related pages
13. **Trust Signals** - Stats, ratings, testimonials

**Word Count**: 800-1200 words per page

## JSON-LD Schema

Each page includes structured data for:

1. **LocalBusiness** - Company details, address, contact info
2. **FAQPage** - Questions and answers
3. **Product** - Service offering with pricing
4. **BreadcrumbList** - Page navigation
5. **AggregateRating** - Customer ratings

## URL Pattern

```
/seo/services/{service-id}-{segment-id}-{location-slug}

Examples:
/seo/services/web-development-uk-business-owner-london
/seo/services/mobile-app-development-uk-startup-uk
/seo/services/ecommerce-solutions-uk-sme-manchester
```

## Usage

### 1. Generate a Single Page

```typescript
import { generatePageContent, generatePageMetadata } from '@/lib/seo/keyword-config';
import { generateCombinedSchema } from '@/lib/seo/schema-generator';

const content = generatePageContent(serviceType, businessSegment, location);
const metadata = generatePageMetadata(serviceType, businessSegment, location);
const schema = generateCombinedSchema(serviceType, businessSegment, location, content.faqs);
```

### 2. Access Dynamic Pages

Navigate to any valid URL combination:
```
https://yourdomain.co.uk/seo/services/web-development-uk-business-owner-london
```

### 3. Generate Static Pages (Optional)

Run the generation script to pre-build pages:

```bash
npm run generate:seo-pages
```

## Service Types

| ID | Name | Starting Price | Timeline |
|----|------|----------------|----------|
| web-development | Web Development | £2,500 | 4-8 weeks |
| mobile-app-development | Mobile App Development | £5,000 | 8-16 weeks |
| brochure-website | Brochure Website Design | £1,500 | 2-4 weeks |
| ecommerce-solutions | E-commerce Solutions | £3,500 | 6-12 weeks |
| custom-web-application | Custom Web Application | £7,500 | 10-20 weeks |
| saas-development | SaaS Development | £15,000 | 16-24 weeks |
| website-redesign | Website Redesign | £2,000 | 3-6 weeks |
| landing-page | Landing Page Design | £800 | 1-2 weeks |
| progressive-web-app | Progressive Web App | £4,000 | 6-10 weeks |
| cms-website | CMS Website Development | £2,200 | 4-6 weeks |

## Business Segments

| ID | Name | Key Priorities |
|----|------|----------------|
| uk-business-owner | UK Business Owner | Reliability, Professionalism, ROI |
| uk-sme | UK SME | Value for money, Scalability, Ease of use |
| uk-startup | UK Startup | Speed to market, Flexibility, Modern tech |
| uk-company | UK Company | Security, Compliance, Scalability |
| uk-ecommerce-business | UK E-commerce Business | Conversion rate, Payment reliability |

## Location Modifiers

**Major Cities**: London, Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Bristol, Liverpool, Sheffield, Newcastle, Nottingham, Leicester, Brighton

**Nations**: Cardiff (Wales), Belfast (Northern Ireland)

**Nationwide**: Across UK

## Configuration

Update `src/lib/seo/schema-generator.ts` with your business details:

```typescript
export const companyInfo = {
  name: 'Your Company Name Ltd',
  legalName: 'Your Company Name Limited',
  url: 'https://yourdomain.co.uk',
  email: 'hello@yourdomain.co.uk',
  telephone: '+44-20-XXXX-XXXX',
  // ... more fields
};
```

## SEO Best Practices Implemented

1. **Long-tail keyword targeting** - Specific, commercial-intent phrases
2. **Unique content per page** - No duplicate content issues
3. **Internal linking** - Cross-linking between related pages
4. **Structured data** - Comprehensive JSON-LD schema
5. **Mobile optimisation** - Responsive design throughout
6. **Page speed** - Optimised images and minimal JavaScript
7. **UK English** - Proper spelling and terminology
8. **Local SEO** - Location-specific content and schema

## Example Generated Page Metadata

```
Title: Web Development for UK Business Owner in London | From £2,500
Description: Professional web development for UK business owner in London.
Custom websites and web applications built with modern technologies.
Get a free quote today. 4-8 weeks typical turnaround.
H1: Web Development for UK Business Owner in London
URL: /seo/services/web-development-uk-business-owner-london
```

## Sitemap Integration

Add these pages to your sitemap.xml:

```xml
<url>
  <loc>https://yourdomain.co.uk/seo/services/web-development-uk-business-owner-london</loc>
  <lastmod>2024-01-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

## Monitoring & Optimization

1. **Google Search Console** - Monitor indexing and performance
2. **Analytics** - Track organic traffic and conversions
3. **A/B Testing** - Test different CTAs and content variations
4. **Content Updates** - Refresh content quarterly based on performance

## License

This programmatic SEO system is part of your project and can be customised as needed.
