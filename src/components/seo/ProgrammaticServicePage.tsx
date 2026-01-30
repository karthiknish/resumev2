/**
 * Programmatic SEO Service Page Component
 * Renders dynamically generated content for service/segment/location combinations
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Shield, Award, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import type { ServiceType, BusinessSegment, LocationModifier } from '@/lib/seo/keyword-config';
import type { GeneratedContent } from '@/lib/seo/content-generator';

interface ProgrammaticServicePageProps {
  service: ServiceType;
  segment: BusinessSegment;
  location: LocationModifier;
  content: GeneratedContent;
  metadata: {
    title: string;
    description: string;
    h1: string;
    url: string;
  };
}

const featureIcons: Record<string, React.ElementType> = {
  'responsive': CheckCircle2,
  'seo': CheckCircle2,
  'fast': Zap,
  'secure': Shield,
  'scalable': Users,
  'support': Clock,
  'quality': Award,
};

export function ProgrammaticServicePage({
  service,
  segment,
  location,
  content,
  metadata,
}: ProgrammaticServicePageProps) {
  const locationText = location.id === 'across-uk' ? 'UK' : location.name;

  return (
    <article className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${service.name} for ${segment.name}`,
            description: metadata.description,
            provider: {
              '@type': 'LocalBusiness',
              name: 'Karthik Nishanth',
              description: 'Freelance engineering partner. I help founders and teams ship confident, resilient software.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Liverpool',
                addressRegion: 'Merseyside',
                addressCountry: 'GB',
              },
            },
            areaServed: locationText,
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <span>/</span>
            <Link href={`/services/${service.id}`} className="hover:text-foreground">
              {service.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{segment.name}</span>
          </nav>

          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
              <Clock className="mr-2 size-4" />
              Typical timeline: {service.timeline} • From {service.startingPrice}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              {metadata.h1}
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl mb-8">
              Professional {service.name} tailored for {segment.name.toLowerCase()} {locationText}.
              Get a free quote within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-base" asChild>
                <Link href="mailto:hello@karthiknish.com?subject=Quote for {service.name}">Get a Free Quote</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base" asChild>
                <Link href="https://karthiknish.com#work">View My Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-muted-foreground">
                {content.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <section
          key={index}
          className={`py-12 md:py-16 ${index % 2 === 1 ? 'bg-muted/30' : ''}`}
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-6">
                {section.heading}
              </h2>

              <p className="text-lg text-muted-foreground mb-6">
                {section.content}
              </p>

              {section.includeList && section.keyPoints && (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {section.keyPoints.map((point, pointIndex) => {
                    // Format markdown bolding
                    const formattedPoint = point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                    return (
                      <li
                        key={pointIndex}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="size-5 shrink-0 text-primary mt-0.5" />
                        <span
                          className="text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: formattedPoint }}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      <Separator />

      {/* Pain Points Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4 text-center">
              Common Challenges for {segment.name}s
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              We understand the unique challenges you face
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {segment.painPoints.map((painPoint, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive font-bold">
                        {index + 1}
                      </div>
                      Challenge {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{painPoint}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="font-semibold text-foreground">
                Our {service.name} directly addresses these challenges with proven solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Priorities Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4 text-center">
              What {segment.name}s Prioritise
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              We align our services with what matters most to you
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {segment.priorities.map((priority, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 font-semibold text-primary"
                >
                  <Award className="size-5" />
                  {priority}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Everything {segment.name.toLowerCase()}s need to know about {service.name}
            </p>

            {/* FAQ Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: content.faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer,
                    },
                  })),
                }),
              }}
            />

            <Accordion type="single" collapsible className="w-full">
              {content.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              {content.cta.headline}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {content.cta.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full text-base px-8">
                {content.cta.primaryButtonText}
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8" asChild>
                <Link href="/portfolio">{content.cta.secondaryButtonText}</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <span>Quote within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <span>No obligation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Internal Links Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight mb-6">
              Related Resources for {segment.name}s
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.internalLinks.map((link, index) => (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <Link
                      href={link.url}
                      className="text-primary hover:underline text-sm"
                    >
                      {link.anchorText} →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-border py-8 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">4+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">40+</div>
                <div className="text-sm text-muted-foreground">Products Shipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">5.0★</div>
                <div className="text-sm text-muted-foreground">Client Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Continents Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

// Helper component for rendering key points with icons
interface KeyPointProps {
  text: string;
}

export function KeyPoint({ text }: KeyPointProps) {
  const Icon = featureIcons['check'] || CheckCircle2;

  return (
    <li className="flex items-start gap-3">
      <Icon className="size-5 shrink-0 text-primary mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
