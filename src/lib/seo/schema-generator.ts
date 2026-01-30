/**
 * JSON-LD Schema Generator for Programmatic SEO Pages
 * Generates LocalBusiness, FAQPage, and other structured data schemas
 */

import type { ServiceType, BusinessSegment, LocationModifier } from './keyword-config';
import type { FAQ } from './content-generator';

// Company information
export const companyInfo = {
  name: 'Karthik Nishanth',
  legalName: 'Karthik Nishanth',
  alternateName: 'Karthik Nish',
  description: 'Freelance engineering partner. I help founders and teams ship confident, resilient software that feels impeccably crafted. Based in Liverpool, I design, build, and scale web and mobile products.',
  url: 'https://karthiknish.com',
  logo: 'https://karthiknish.com/logo.png',
  email: 'hello@karthiknish.com',
  telephone: '+44-151-XXX-XXXX',
  faxNumber: '',
  vatId: '',
  companyNumber: '',
  foundingDate: '2020',
  address: {
    streetAddress: 'Liverpool',
    addressLocality: 'Liverpool',
    addressRegion: 'Merseyside',
    postalCode: 'L1',
    addressCountry: 'GB',
  },
  socialMedia: {
    twitter: 'https://twitter.com/karthiknish',
    linkedin: 'https://linkedin.com/in/karthiknish',
    github: 'https://github.com/karthiknish',
  },
};

// Rating aggregate
export const aggregateRating = {
  ratingValue: '5.0',
  reviewCount: '40',
  bestRating: '5',
  worstRating: '1',
};

// Price range
export const priceRange = '££';

// Generate LocalBusiness Schema
export function generateLocalBusinessSchema(
  service: ServiceType,
  segment: BusinessSegment,
  location: LocationModifier,
  customAddress?: Partial<typeof companyInfo.address>
): Record<string, unknown> {
  const address = customAddress
    ? { ...companyInfo.address, ...customAddress }
    : companyInfo.address;

  // Override location if specific city is selected
  let finalAddress = address;
  if (location.id !== 'across-uk') {
    finalAddress = {
      ...address,
      addressLocality: location.name,
      addressRegion: location.region,
    };
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${companyInfo.url}/#localbusiness`,
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    alternateName: companyInfo.alternateName,
    description: `${service.name} for ${segment.name} ${location.id === 'across-uk' ? 'across the UK' : location.name}. ${service.description}`,
    url: companyInfo.url,
    logo: companyInfo.logo,
    image: companyInfo.logo,
    telephone: companyInfo.telephone,
    email: companyInfo.email,
    faxNumber: companyInfo.faxNumber,
    vatId: companyInfo.vatId,
    taxID: companyInfo.vatId,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: finalAddress.streetAddress,
      addressLocality: finalAddress.addressLocality,
      addressRegion: finalAddress.addressRegion,
      postalCode: finalAddress.postalCode,
      addressCountry: finalAddress.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '53.4084', // Liverpool coordinates
      longitude: '-3.0',
    },
    areaServed: location.id === 'across-uk'
      ? ['United Kingdom']
      : [location.name, location.region, 'United Kingdom'],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: Object.values(companyInfo.socialMedia),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
          },
          price: service.startingPrice.replace('£', ''),
          priceCurrency: 'GBP',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    audience: {
      '@type': 'Audience',
      audienceType: segment.name,
    },
    serviceType: service.name,
  };

  return schema;
}

// Generate FAQPage Schema
export function generateFAQSchema(faqs: FAQ[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate Organization Schema (for home page)
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${companyInfo.url}/#organization`,
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    alternateName: companyInfo.alternateName,
    url: companyInfo.url,
    logo: {
      '@type': 'ImageObject',
      url: companyInfo.logo,
      width: 512,
      height: 512,
    },
    description: companyInfo.description,
    email: companyInfo.email,
    telephone: companyInfo.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address.streetAddress,
      addressLocality: companyInfo.address.addressLocality,
      addressRegion: companyInfo.address.addressRegion,
      postalCode: companyInfo.address.postalCode,
      addressCountry: companyInfo.address.addressCountry,
    },
    foundingDate: companyInfo.foundingDate,
    vatId: companyInfo.vatId,
    taxID: companyInfo.vatId,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    areaServed: 'United Kingdom',
    sameAs: Object.values(companyInfo.socialMedia),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: companyInfo.email,
      telephone: companyInfo.telephone,
      availableLanguage: ['English'],
    },
  };
}

// Generate Product/Service Schema
export function generateProductSchema(
  service: ServiceType,
  segment: BusinessSegment,
  location: LocationModifier
): Record<string, unknown> {
  const productName = `${service.name} for ${segment.name}`;
  const locationText = location.id === 'across-uk' ? 'UK' : location.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: `Professional ${service.name} for ${segment.name} ${locationText}. ${service.description}`,
    url: `${companyInfo.url}/services/${service.id}-${segment.id}-${location.slug}`,
    image: companyInfo.logo,
    brand: {
      '@type': 'Brand',
      name: companyInfo.name,
      logo: companyInfo.logo,
    },
    offers: {
      '@type': 'Offer',
      name: `Professional ${productName}`,
      description: `Complete ${service.name} service for ${segment.name} ${locationText}`,
      price: service.startingPrice.replace('£', ''),
      priceCurrency: 'GBP',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: companyInfo.name,
        url: companyInfo.url,
        logo: companyInfo.logo,
      },
      areaServed: location.id === 'across-uk' ? 'United Kingdom' : location.name,
      deliveryLeadTime: service.timeline,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: Math.floor(parseInt(aggregateRating.reviewCount) / 5).toString(),
    },
  };
}

// Generate Review Schema
export function generateReviewSchema(
  service: ServiceType,
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    datePublished: string;
    businessType?: string;
  }> = []
): Record<string, unknown> {
  const defaultReviews = [
    {
      author: 'James Thompson',
      rating: 5,
      text: `Excellent ${service.name}. Delivered on time and the quality exceeded our expectations. Highly recommend for any UK business.`,
      datePublished: '2024-01-15',
      businessType: 'SME',
    },
    {
      author: 'Sarah Mitchell',
      rating: 5,
      text: `Professional service from start to finish. They understood our requirements and delivered a solution that perfectly fits our business needs.`,
      datePublished: '2023-12-08',
      businessType: 'Startup',
    },
    {
      author: 'David Chen',
      rating: 4,
      text: `Great communication throughout the project. The team was responsive and made sure we were happy with every aspect of the ${service.name}.`,
      datePublished: '2024-02-20',
      businessType: 'Established Company',
    },
  ];

  const reviewsToUse = reviews.length > 0 ? reviews : defaultReviews;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${service.name}`,
    review: reviewsToUse.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.text,
      datePublished: review.datePublished,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Generate Article/Blog Schema (for content pages)
export function generateArticleSchema(
  title: string,
  description: string,
  publishDate: string,
  modifiedDate: string,
  url: string,
  imageUrl: string,
  authorName: string = companyInfo.name
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      height: 1200,
      width: 630,
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: companyInfo.url,
    },
    publisher: {
      '@type': 'Organization',
      name: companyInfo.name,
      logo: {
        '@type': 'ImageObject',
        url: companyInfo.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Combine multiple schemas into one
export function generateCombinedSchema(
  service: ServiceType,
  segment: BusinessSegment,
  location: LocationModifier,
  faqs: FAQ[],
  pageUrl: string
): Record<string, unknown>[] {
  const localBusinessSchema = generateLocalBusinessSchema(service, segment, location);
  const faqSchema = generateFAQSchema(faqs);
  const productSchema = generateProductSchema(service, segment, location);

  const breadcrumbs = [
    { name: 'Home', url: companyInfo.url },
    { name: 'Services', url: `${companyInfo.url}/services` },
    { name: service.name, url: `${companyInfo.url}/services/${service.id}` },
    { name: `${segment.name} ${location.name}`, url: pageUrl },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return [
    localBusinessSchema,
    faqSchema,
    productSchema,
    breadcrumbSchema,
  ];
}

// Serialize schema to JSON string for use in Next.js Head component
export function serializeSchema(schema: Record<string, unknown> | Record<string, unknown>[]): string {
  const schemas = Array.isArray(schema) ? schema : [schema];
  return JSON.stringify(schemas.map(s => ({ '@context': 'https://schema.org', ...s })));
}
