/**
 * Programmatic SEO Content Generator
 * Generates structured content for UK business owner service pages
 */

import type { ServiceType, BusinessSegment, LocationModifier } from './keyword-config';

export interface GeneratedContent {
  intro: string;
  sections: ContentSection[];
  faqs: FAQ[];
  cta: CTASection;
  internalLinks: InternalLink[];
}

export interface ContentSection {
  heading: string;
  content: string;
  keyPoints?: string[];
  includeList?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CTASection {
  headline: string;
  subheadline: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface InternalLink {
  title: string;
  url: string;
  anchorText: string;
}

// Content templates based on business segment
const introTemplates: Record<string, (st: ServiceType, bs: BusinessSegment, lm: LocationModifier) => string> = {
  'uk-business-owner': (service, segment, location) => `As a ${segment.name} ${location.id === 'across-uk' ? 'across the UK' : location.name}, you understand the importance of a strong digital presence. Whether you're looking to establish your first online footprint or upgrade your existing digital assets, professional ${service.name} is essential for business growth in today's competitive market.

I specialise in delivering bespoke ${service.name} tailored specifically for ${segment.name.toLowerCase()}. Based in Liverpool, I work as a freelance engineering partner, helping founders and teams ship confident, resilient software that feels impeccably crafted. With 4+ years of experience and 40+ products shipped, I offer transparent pricing and proven results that help your business stand out online.`,

  'uk-sme': (service, segment, location) => `For ${segment.name} ${location.id === 'across-uk' ? 'across the UK' : location.name}, finding the right balance between quality and affordability in ${service.name} can be challenging. I understand that SMEs need solutions that deliver value without compromising on quality or scalability.

My ${service.name} services are specifically designed with ${segment.name.toLowerCase()} in mind. Starting from ${service.startingPrice}, I provide enterprise-grade solutions with a ${service.timeline} typical delivery timeline, ensuring your business gets the digital foundation it needs to grow and compete effectively.`,

  'uk-startup': (service, segment, location) => `Launching a startup ${location.id === 'across-uk' ? 'in the UK' : location.name} requires smart decisions about where to invest your limited resources. Professional ${service.name} shouldn't drain your entire budget—yet it's crucial for making the right first impression on potential investors and customers.

I specialise in ${service.name} for ${segment.name.toLowerCase()}, offering flexible engagement models starting from ${service.startingPrice}. With an agile ${service.timeline} typical timeline, you can validate ideas quickly and iterate based on real user feedback—exactly what modern startups need.`,

  'uk-company': (service, segment, location) => `Established companies ${location.id === 'across-uk' ? 'across the UK' : location.name} require ${service.name} that meets enterprise-grade standards for security, compliance, and scalability. Your digital assets represent your brand and must deliver exceptional experiences for employees, customers, and partners alike.

My enterprise ${service.name} services provide the robustness and reliability that established companies demand. Projects typically start from ${service.startingPrice} with a ${service.timeline} delivery timeline, ensuring thorough testing and seamless integration with your existing systems.`,

  'uk-ecommerce-business': (service, segment, location) => `As an ${segment.name} ${location.id === 'across-uk' ? 'across the UK' : location.name}, your website is your primary storefront. Professional ${service.name} directly impacts your conversion rates, average order values, and customer lifetime values—making it one of the most important investments you can make.

My e-commerce-focused ${service.name} helps online retailers maximise sales through optimised user journeys, fast loading times, and seamless checkout experiences. Starting from ${service.startingPrice} with a ${service.timeline} typical timeline, I deliver solutions that turn visitors into customers.`,
};

// Section content generators
function generateWhyChooseSection(service: ServiceType, segment: BusinessSegment, location: LocationModifier): ContentSection {
  const benefits: Record<string, string[]> = {
    'web-development': [
      `Responsive designs that work perfectly on all devices your customers use`,
      `SEO-optimised architecture to help your ${segment.name.toLowerCase()} business rank higher in Google`,
      `Fast loading speeds that improve user experience and search rankings`,
      `Secure, scalable code that grows with your business needs`,
    ],
    'mobile-app-development': [
      `Native performance on both iOS and Android platforms`,
      `Intuitive user interfaces that keep users engaged`,
      `Offline capabilities for uninterrupted user experiences`,
      `Push notification integration to keep customers coming back`,
    ],
    'brochure-website': [
      `Clean, professional designs that build trust instantly`,
      `Easy-to-update content for keeping your information current`,
      `Fast loading times for better user experience and SEO`,
      `Mobile-responsive layouts for customers browsing on the go`,
    ],
    'ecommerce-solutions': [
      `Streamlined checkout processes that reduce cart abandonment`,
      `Multiple payment gateway integrations for customer convenience`,
      `Inventory management systems that sync automatically`,
      `Mobile-optimised stores for capturing mobile shoppers`,
    ],
    'default': [
      `UK-based project management for clear communication and quick responses`,
      `Transparent pricing with no hidden costs or surprise fees`,
      `Proven track record delivering for ${segment.name}s across the UK`,
      `Ongoing support and maintenance to protect your investment`,
    ],
  };

  const serviceBenefits = benefits[service.id] || benefits['default'];

  return {
    heading: `Why ${segment.name}s Choose Our ${service.name.charAt(0).toUpperCase() + service.name.slice(1)}`,
    content: `When selecting a ${service.name} partner ${location.id === 'across-uk' ? 'in the UK' : location.name}, ${segment.name.toLowerCase()}s need a team that understands their specific challenges and delivers measurable results. Here's what sets our service apart:`,
    keyPoints: serviceBenefits,
    includeList: true,
  };
}

function generateProcessSection(service: ServiceType): ContentSection {
  return {
    heading: `Our ${service.name.charAt(0).toUpperCase() + service.name.slice(1)} Process`,
    content: `We follow a proven methodology that ensures your project is delivered on time, within budget, and to the highest standards. Our collaborative approach keeps you informed at every stage.`,
    keyPoints: [
      `**Discovery**: We learn about your business, goals, target audience, and requirements`,
      `**Planning**: Detailed project planning with clear milestones and deliverables`,
      `**Design**: Visual designs and prototypes for your approval before development`,
      `**Development**: Clean, efficient code built using industry best practices`,
      `**Testing**: Rigorous testing across devices, browsers, and user scenarios`,
      `**Launch**: Smooth deployment with full support and handover documentation`,
    ],
    includeList: true,
  };
}

function generatePricingSection(service: ServiceType, segment: BusinessSegment): ContentSection {
  return {
    heading: `Transparent ${service.name.charAt(0).toUpperCase() + service.name.slice(1)} Pricing for ${segment.name}s`,
    content: `We believe in clear, upfront pricing that helps ${segment.name.toLowerCase()}s make informed decisions. Our ${service.startingPrice} starting price includes essential features, with transparent add-ons for additional functionality.`,
    keyPoints: [
      `**Starter Package** (from ${service.startingPrice}): Perfect for ${segment.name.toLowerCase()}s needing essential functionality`,
      `**Professional Package**: Enhanced features for growing businesses requiring more advanced capabilities`,
      `**Enterprise Package**: Full-featured solutions with dedicated support and custom integrations`,
      `All packages include our core guarantee: ${service.timeline} delivery timeline and satisfaction assurance`,
    ],
    includeList: true,
  };
}

function generateLocationSection(service: ServiceType, segment: BusinessSegment, location: LocationModifier): ContentSection {
  const locationText = location.id === 'across-uk'
    ? 'across the United Kingdom'
    : `in ${location.name} and surrounding areas`;

  return {
    heading: `Serving ${segment.name}s ${location.name}`,
    content: `While we proudly serve clients ${locationText}, our remote-first approach means we can deliver the same high-quality ${service.name} to ${segment.name.toLowerCase()}s anywhere in the UK. Our team understands the unique aspects of the ${location.region} market and incorporates local business insights into every project.`,
    keyPoints: location.id === 'across-uk' ? [
      `UK-wide coverage with consistent service standards`,
      `Understanding of regional market variations across the country`,
      `Flexible communication across UK time zones`,
      `Local market knowledge combined with global best practices`,
    ] : [
      `Deep understanding of the ${location.region} business landscape`,
      `Local market insights integrated into your digital solution`,
      `Face-to-face consultation available when required`,
      `Knowledge of local competitor landscape and opportunities`,
    ],
    includeList: true,
  };
}

function generateTechnicalSection(service: ServiceType): ContentSection {
  const techDetails: Record<string, { heading: string; content: string; tech: string[] }> = {
    'web-development': {
      heading: 'Technical Excellence in Modern Web Development',
      content: 'We build using the latest frameworks and technologies to ensure your website is fast, secure, and future-proof.',
      tech: ['React / Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'WordPress / Shopify (when required)'],
    },
    'mobile-app-development': {
      heading: 'Cross-Platform & Native Mobile Technologies',
      content: 'We choose the right technology stack based on your requirements, budget, and timeline.',
      tech: ['React Native', 'Flutter', 'Swift (iOS)', 'Kotlin (Android)', 'Progressive Web Apps'],
    },
    'ecommerce-solutions': {
      heading: 'E-Commerce Platforms & Integrations',
      content: 'We work with leading e-commerce platforms and can integrate with your existing business systems.',
      tech: ['Shopify', 'WooCommerce', 'Magento', 'Custom Headless Commerce', 'Payment Gateways'],
    },
    'default': {
      heading: 'Modern Technologies & Best Practices',
      content: 'We stay current with the latest technologies and methodologies to deliver superior results.',
      tech: ['Cloud Hosting (AWS/Vercel)', 'CI/CD Pipelines', 'Automated Testing', 'Performance Monitoring', 'Security Audits'],
    },
  };

  const details = techDetails[service.id] || techDetails['default'];

  return {
    heading: details.heading,
    content: details.content,
    keyPoints: details.tech.map(t => `**${t}** – Industry-leading tools and frameworks`),
    includeList: true,
  };
}

// FAQ generators
function generateFAQs(service: ServiceType, segment: BusinessSegment, location: LocationModifier): FAQ[] {
  const locationText = location.id === 'across-uk' ? 'in the UK' : location.name;

  const baseFAQs: FAQ[] = [
    {
      question: `How much does ${service.name} cost for ${segment.name}s?`,
      answer: `Our ${service.name} services for ${segment.name.toLowerCase()}s start from ${service.startingPrice}. The final cost depends on your specific requirements, the complexity of the project, and any additional features you need. We provide detailed quotes after an initial consultation so you know exactly what you're paying for.`,
    },
    {
      question: `How long does ${service.name} take for ${segment.name}s ${locationText}?`,
      answer: `Typical ${service.name} projects for ${segment.name.toLowerCase()}s take approximately ${service.timeline}. However, simpler projects may be completed sooner, while more complex requirements may extend the timeline. We always provide a detailed project schedule before starting work.`,
    },
    {
      question: `Do you work with ${segment.name}s outside ${location.id === 'across-uk' ? 'the UK' : location.name}?`,
      answer: `Yes, while we're based ${location.id === 'across-uk' ? 'in the UK' : location.name}, we serve ${segment.name.toLowerCase()}s across the entire United Kingdom. Our remote-working capabilities mean we can deliver the same high-quality service regardless of your location.`,
    },
    {
      question: `What makes your ${service.name} different for ${segment.name}s?`,
      answer: `We understand the specific challenges that ${segment.name.toLowerCase()}s face. Our ${service.name} is designed to address your pain points: ${segment.painPoints.slice(0, 2).join(', ')}. We focus on delivering solutions that provide real business value, not just technical implementation.`,
    },
    {
      question: `Do you offer ongoing support and maintenance?`,
      answer: `Yes, we offer comprehensive support and maintenance packages to ensure your ${service.name} continues to perform optimally after launch. This includes security updates, performance monitoring, content updates, and technical support. We believe in building long-term partnerships with our ${segment.name.toLowerCase()} clients.`,
    },
    {
      question: `What's included in your ${service.name} package?`,
      answer: `Our ${service.name} packages include: initial consultation and requirements gathering, design mockups for approval, development using modern technologies, testing across devices and browsers, launch and deployment, basic training, and a warranty period. Additional services like content creation, SEO optimisation, and ongoing maintenance can be added based on your needs.`,
    },
  ];

  // Add segment-specific FAQs
  if (segment.id === 'uk-startup') {
    baseFAQs.push({
      question: `Can you help startups with limited budgets?`,
      answer: `Absolutely! We have flexible engagement models specifically designed for startups. We can phase projects to spread costs, focus on MVP development to get you to market quickly, and offer deferred payment options for promising startups. Our ${service.startingPrice} starting price makes professional ${service.name} accessible for early-stage companies.`,
    });
  }

  if (segment.id === 'uk-sme') {
    baseFAQs.push({
      question: `Can you scale the solution as our business grows?`,
      answer: `Yes, scalability is a core principle of our ${service.name}. We build solutions that can grow with your SME, from additional features to increased traffic capacity. Many of our clients start with a basic package and upgrade as their business expands, without needing a complete rebuild.`,
    });
  }

  if (service.id === 'ecommerce-solutions') {
    baseFAQs.push({
      question: `Which payment gateways can you integrate?`,
      answer: `We integrate with all major UK payment gateways including Stripe, PayPal, Worldpay, Sage Pay, and many others. We can also set up multi-currency support if you sell internationally. Our team ensures all payment processing is PCI-compliant and secure.`,
    });
  }

  return baseFAQs;
}

// Internal link generator
function generateInternalLinks(
  service: ServiceType,
  segment: BusinessSegment,
  location: LocationModifier
): InternalLink[] {
  const links: InternalLink[] = [
    {
      title: `Related Services for ${segment.name}s`,
      url: `/services/${segment.id}`,
      anchorText: `View all services for ${segment.name.toLowerCase()}s`,
    },
    {
      title: 'Our Portfolio',
      url: '/portfolio',
      anchorText: 'See our recent work',
    },
    {
      title: 'Client Testimonials',
      url: '/testimonials',
      anchorText: 'Read what our clients say',
    },
    {
      title: 'Get a Quote',
      url: '/contact',
      anchorText: 'Request a free consultation',
    },
  ];

  // Add location-specific link
  if (location.id !== 'across-uk') {
    links.push({
      title: `Services in ${location.name}`,
      url: `/locations/${location.slug}`,
      anchorText: `Explore our services in ${location.name}`,
    });
  }

  return links;
}

// Main content generator function
export function generatePageContent(
  service: ServiceType,
  segment: BusinessSegment,
  location: LocationModifier
): GeneratedContent {
  // Generate intro
  const introTemplate = introTemplates[segment.id] || introTemplates['uk-business-owner'];
  const intro = introTemplate(service, segment, location);

  // Generate sections
  const sections: ContentSection[] = [
    generateWhyChooseSection(service, segment, location),
    generateProcessSection(service),
    generatePricingSection(service, segment),
    generateTechnicalSection(service),
    generateLocationSection(service, segment, location),
  ];

  // Generate FAQs
  const faqs = generateFAQs(service, segment, location);

  // Generate CTA
  const cta: CTASection = {
    headline: `Ready to Transform Your Digital Presence?`,
    subheadline: `Get professional ${service.name} for your ${segment.name.toLowerCase()} business. Get a free quote within 24 hours.`,
    primaryButtonText: 'Get a Free Quote',
    secondaryButtonText: 'View Our Portfolio',
  };

  // Generate internal links
  const internalLinks = generateInternalLinks(service, segment, location);

  return {
    intro,
    sections,
    faqs,
    cta,
    internalLinks,
  };
}

// Calculate word count for generated content
export function calculateWordCount(content: GeneratedContent): number {
  let count = 0;

  // Count intro
  count += content.intro.split(/\s+/).length;

  // Count sections
  content.sections.forEach(section => {
    count += section.heading.split(/\s+/).length;
    count += section.content.split(/\s+/).length;
    if (section.keyPoints) {
      section.keyPoints.forEach(point => {
        count += point.split(/\s+/).length;
      });
    }
  });

  // Count FAQs
  content.faqs.forEach(faq => {
    count += faq.question.split(/\s+/).length;
    count += faq.answer.split(/\s+/).length;
  });

  // Count CTA
  count += content.cta.headline.split(/\s+/).length;
  count += content.cta.subheadline.split(/\s+/).length;

  return count;
}

// Validate content meets minimum word count
export function validateContentLength(content: GeneratedContent, minWords: number = 800): boolean {
  const wordCount = calculateWordCount(content);
  return wordCount >= minWords;
}
