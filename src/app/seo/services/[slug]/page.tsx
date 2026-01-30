/**
 * Programmatic SEO Service Page
 * Dynamic route for service/segment/location combinations
 *
 * URL pattern: /seo/services/{service}-{segment}-{location}
 * Example: /seo/services/web-development-uk-business-owner-london
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Head from 'next/head';
import { ProgrammaticServicePage } from '@/components/seo/ProgrammaticServicePage';
import {
  serviceTypes,
  businessSegments,
  locationModifiers,
  generatePageMetadata,
  generateSlug,
} from '@/lib/seo/keyword-config';
import { generatePageContent } from '@/lib/seo/content-generator';
import { generateCombinedSchema, serializeSchema } from '@/lib/seo/schema-generator';

interface PageParams {
  slug: string;
}

// Generate static params for all combinations (use getStaticPaths equivalent)
export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = [];

  // Generate combinations for high-priority pages only to avoid build issues
  // Adjust the filter as needed based on your build constraints
  for (const service of serviceTypes.slice(0, 3)) { // Top 3 services
    for (const segment of businessSegments.slice(0, 2)) { // Top 2 segments
      for (const location of locationModifiers.slice(0, 5)) { // Top 5 locations
        params.push({
          slug: generateSlug(service.id, segment.id, location.id),
        });
      }
    }
  }

  return params;
}

// Parse slug to extract components
function parseSlug(slug: string): {
  serviceType: typeof serviceTypes[0];
  businessSegment: typeof businessSegments[0];
  locationModifier: typeof locationModifiers[0];
} | null {
  // Slug format: service-segment-location
  const parts = slug.split('-');

  // Try to match service type
  const serviceType = serviceTypes.find(s => slug.startsWith(s.id));
  if (!serviceType) return null;

  // Try to match business segment
  const businessSegment = businessSegments.find(b => slug.includes(b.id));
  if (!businessSegment) return null;

  // Try to match location
  const locationModifier = locationModifiers.find(l => slug.endsWith(l.slug));
  if (!locationModifier) return null;

  return { serviceType, businessSegment, locationModifier };
}

// Generate page metadata
export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return {
      title: 'Page Not Found',
    };
  }

  const { serviceType, businessSegment, locationModifier } = parsed;
  const metadata = generatePageMetadata(serviceType, businessSegment, locationModifier);

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.url,
      siteName: 'Your Company Name',
      locale: 'en_GB',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: metadata.url,
    },
  };
}

// Page component
export default async function ProgrammaticSEOPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { serviceType, businessSegment, locationModifier } = parsed;

  // Generate page content
  const content = generatePageContent(serviceType, businessSegment, locationModifier);

  // Generate metadata
  const metadata = generatePageMetadata(serviceType, businessSegment, locationModifier);

  // Generate combined schema
  const schema = generateCombinedSchema(
    serviceType,
    businessSegment,
    locationModifier,
    content.faqs,
    metadata.url
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeSchema(schema),
        }}
      />

      <ProgrammaticServicePage
        service={serviceType}
        segment={businessSegment}
        location={locationModifier}
        content={content}
        metadata={metadata}
      />
    </>
  );
}

// Optional: Generate static pages for all combinations
// This would be run at build time or via a separate script
export const revalidate = 86400; // Revalidate once per day
