/**
 * Programmatic SEO Configuration for UK Business Owners
 * Focused on Web & Mobile Development Services
 */

export interface ServiceType {
  id: string;
  name: string;
  singular: string;
  description: string;
  startingPrice: string;
  timeline: string;
}

export interface BusinessSegment {
  id: string;
  name: string;
  demographic: string;
  painPoints: string[];
  priorities: string[];
}

export interface LocationModifier {
  id: string;
  name: string;
  slug: string;
  region: string;
}

export interface KeywordTemplate {
  template: string;
  searchIntent: 'informational' | 'commercial' | 'transactional';
  priority: 'high' | 'medium' | 'low';
}

// Service Types - Core offerings
export const serviceTypes: ServiceType[] = [
  {
    id: 'web-development',
    name: 'web development',
    singular: 'web development',
    description: 'Custom websites and web applications built with modern technologies',
    startingPrice: '£2,500',
    timeline: '4-8 weeks',
  },
  {
    id: 'mobile-app-development',
    name: 'mobile app development',
    singular: 'mobile app development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    startingPrice: '£5,000',
    timeline: '8-16 weeks',
  },
  {
    id: 'brochure-website',
    name: 'brochure website design',
    singular: 'brochure website',
    description: 'Professional informational websites to showcase your business',
    startingPrice: '£1,500',
    timeline: '2-4 weeks',
  },
  {
    id: 'ecommerce-solutions',
    name: 'e-commerce solutions',
    singular: 'e-commerce solution',
    description: 'Online stores with payment integration and inventory management',
    startingPrice: '£3,500',
    timeline: '6-12 weeks',
  },
  {
    id: 'custom-web-application',
    name: 'custom web application development',
    singular: 'custom web application',
    description: 'Tailored web applications for specific business needs',
    startingPrice: '£7,500',
    timeline: '10-20 weeks',
  },
  {
    id: 'saas-development',
    name: 'SaaS development',
    singular: 'SaaS platform',
    description: 'Software as a Service products with subscription models',
    startingPrice: '£15,000',
    timeline: '16-24 weeks',
  },
  {
    id: 'website-redesign',
    name: 'website redesign',
    singular: 'website redesign',
    description: 'Modernising existing websites with improved UX and performance',
    startingPrice: '£2,000',
    timeline: '3-6 weeks',
  },
  {
    id: 'landing-page',
    name: 'landing page design',
    singular: 'landing page',
    description: 'High-converting single pages for marketing campaigns',
    startingPrice: '£800',
    timeline: '1-2 weeks',
  },
  {
    id: 'progressive-web-app',
    name: 'progressive web app development',
    singular: 'progressive web app',
    description: 'Web apps with native-like functionality and offline capabilities',
    startingPrice: '£4,000',
    timeline: '6-10 weeks',
  },
  {
    id: 'cms-website',
    name: 'CMS website development',
    singular: 'CMS website',
    description: 'Content-managed websites for easy updates',
    startingPrice: '£2,200',
    timeline: '4-6 weeks',
  },
];

// Business Segments - Target audiences
export const businessSegments: BusinessSegment[] = [
  {
    id: 'uk-business-owner',
    name: 'UK business owner',
    demographic: 'Established business owners looking to expand their digital presence',
    painPoints: [
      'Outdated website affecting credibility',
      'Losing customers to competitors with better websites',
      'Difficulty managing online enquiries',
      'Poor mobile experience for customers',
      'No online visibility or search presence',
    ],
    priorities: ['Reliability', 'Professionalism', 'ROI', 'Ongoing support'],
  },
  {
    id: 'uk-sme',
    name: 'UK SME',
    demographic: 'Small to medium enterprises seeking scalable digital solutions',
    painPoints: [
      'Limited budget for digital transformation',
      'Need cost-effective solutions that grow with the business',
      'Limited internal technical expertise',
      'Concerns about ongoing maintenance costs',
      'Integration with existing business systems',
    ],
    priorities: ['Value for money', 'Scalability', 'Ease of use', 'Quick turnaround'],
  },
  {
    id: 'uk-startup',
    name: 'UK startup',
    demographic: 'Early-stage companies building MVP and digital products',
    painPoints: [
      'Limited funding requiring lean development',
      'Need to validate ideas quickly',
      'Time pressure to launch before competitors',
      'Uncertainty about technical requirements',
      'Need for investor-ready digital presence',
    ],
    priorities: ['Speed to market', 'Flexibility', 'Modern tech stack', 'Future-proofing'],
  },
  {
    id: 'uk-company',
    name: 'UK company',
    demographic: 'Established companies requiring enterprise-grade solutions',
    painPoints: [
      'Complex business requirements',
      'Need for robust security and compliance',
      'Multi-stakeholder approval processes',
      'Integration with legacy systems',
      'Scalability for growing user bases',
    ],
    priorities: ['Security', 'Compliance', 'Scalability', 'Vendor reliability'],
  },
  {
    id: 'uk-ecommerce-business',
    name: 'UK e-commerce business',
    demographic: 'Online retailers selling physical or digital products',
    painPoints: [
      'Cart abandonment issues',
      'Payment processing complications',
      'Inventory management challenges',
      'Mobile conversion optimisation needs',
      'Shipping calculation complexities',
    ],
    priorities: ['Conversion rate', 'Payment reliability', 'Stock management', 'Mobile experience'],
  },
];

// Location Modifiers - UK regions and cities
export const locationModifiers: LocationModifier[] = [
  { id: 'london', name: 'in London', slug: 'london', region: 'Greater London' },
  { id: 'manchester', name: 'in Manchester', slug: 'manchester', region: 'Greater Manchester' },
  { id: 'birmingham', name: 'in Birmingham', slug: 'birmingham', region: 'West Midlands' },
  { id: 'leeds', name: 'in Leeds', slug: 'leeds', region: 'West Yorkshire' },
  { id: 'glasgow', name: 'in Glasgow', slug: 'glasgow', region: 'Scotland' },
  { id: 'edinburgh', name: 'in Edinburgh', slug: 'edinburgh', region: 'Scotland' },
  { id: 'bristol', name: 'in Bristol', slug: 'bristol', region: 'South West England' },
  { id: 'liverpool', name: 'in Liverpool', slug: 'liverpool', region: 'Merseyside' },
  { id: 'sheffield', name: 'in Sheffield', slug: 'sheffield', region: 'South Yorkshire' },
  { id: 'newcastle', name: 'in Newcastle', slug: 'newcastle', region: 'North East England' },
  { id: 'nottingham', name: 'in Nottingham', slug: 'nottingham', region: 'Nottinghamshire' },
  { id: 'leicester', name: 'in Leicester', slug: 'leicester', region: 'Leicestershire' },
  { id: 'brighton', name: 'in Brighton', slug: 'brighton', region: 'East Sussex' },
  { id: 'cardiff', name: 'in Cardiff', slug: 'cardiff', region: 'Wales' },
  { id: 'belfast', name: 'in Belfast', slug: 'belfast', region: 'Northern Ireland' },
  { id: 'across-uk', name: 'across UK', slug: 'uk', region: 'United Kingdom' },
];

// Keyword Templates - Long-tail variations
export const keywordTemplates: KeywordTemplate[] = [
  // Primary - Commercial intent
  { template: '{ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'high' },
  { template: 'Affordable {ServiceType} for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'high' },
  { template: 'Best {ServiceType} companies for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'high' },
  { template: 'Top rated {ServiceType} for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'high' },
  { template: 'Professional {ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'high' },

  // Secondary - Research/Comparison intent
  { template: 'How much does {ServiceType} cost for {BusinessSegment} UK', searchIntent: 'informational', priority: 'medium' },
  { template: '{ServiceType} pricing for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'medium' },
  { template: 'Reliable {ServiceType} providers for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'medium' },
  { template: 'Custom {ServiceType} solutions for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'medium' },
  { template: 'Expert {ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'medium' },

  // Long-tail - Specific needs
  { template: 'Fast {ServiceType} for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'low' },
  { template: 'Local {ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'low' },
  { template: 'Enterprise {ServiceType} for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'low' },
  { template: 'Small business {ServiceType} for {BusinessSegment} UK', searchIntent: 'commercial', priority: 'low' },
  { template: 'Budget-friendly {ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'commercial', priority: 'low' },

  // Question-based - Informational intent
  { template: 'Why {BusinessSegment} need professional {ServiceType} UK', searchIntent: 'informational', priority: 'low' },
  { template: 'What to look for in {ServiceType} for {BusinessSegment} UK', searchIntent: 'informational', priority: 'low' },
  { template: 'Choosing the right {ServiceType} for {BusinessSegment} {LocationModifier}', searchIntent: 'informational', priority: 'low' },
];

// Generate all keyword combinations
export function generateKeywordCombinations(): Array<{
  keyword: string;
  serviceType: ServiceType;
  businessSegment: BusinessSegment;
  locationModifier: LocationModifier;
  template: KeywordTemplate;
}> {
  const combinations: Array<{
    keyword: string;
    serviceType: ServiceType;
    businessSegment: BusinessSegment;
    locationModifier: LocationModifier;
    template: KeywordTemplate;
  }> = [];

  for (const serviceType of serviceTypes) {
    for (const businessSegment of businessSegments) {
      for (const locationModifier of locationModifiers) {
        // Only use a subset of templates to avoid keyword cannibalisation
        const relevantTemplates = keywordTemplates.filter(t => t.priority === 'high');

        for (const template of relevantTemplates) {
          let keyword = template.template
            .replace('{ServiceType}', serviceType.name)
            .replace('{BusinessSegment}', businessSegment.name)
            .replace('{LocationModifier}', locationModifier.name);

          // Clean up multiple spaces
          keyword = keyword.replace(/\s+/g, ' ').trim();

          combinations.push({
            keyword,
            serviceType,
            businessSegment,
            locationModifier,
            template,
          });
        }
      }
    }
  }

  return combinations;
}

// Generate URL slug from keyword components
export function generateSlug(
  serviceTypeId: string,
  businessSegmentId: string,
  locationModifierId: string
): string {
  const service = serviceTypes.find(s => s.id === serviceTypeId);
  const segment = businessSegments.find(b => b.id === businessSegmentId);
  const location = locationModifiers.find(l => l.id === locationModifierId);

  if (!service || !segment || !location) return '';

  // Clean and format for URL
  const parts = [
    service.id.replace(/-/g, '-'),
    segment.id.replace(/-/g, '-'),
    location.slug,
  ];

  return parts.join('-');
}

// Generate page metadata
export function generatePageMetadata(
  serviceType: ServiceType,
  businessSegment: BusinessSegment,
  locationModifier: LocationModifier,
  baseUrl: string = 'https://yourdomain.co.uk'
) {
  const location = locationModifier.id === 'across-uk' ? 'UK' : locationModifier.name;
  const capitalisedService = serviceType.name.charAt(0).toUpperCase() + serviceType.name.slice(1);

  return {
    title: `${capitalisedService} for ${businessSegment.name} ${location} | From ${serviceType.startingPrice}`,
    description: `Professional ${serviceType.name} for ${businessSegment.name} ${location}. ${serviceType.description}. Get a free quote today. ${serviceType.timeline} typical turnaround.`,
    url: `${baseUrl}/services/${generateSlug(serviceType.id, businessSegment.id, locationModifier.id)}`,
    h1: `${capitalisedService} for ${businessSegment.name} ${location}`,
  };
}
