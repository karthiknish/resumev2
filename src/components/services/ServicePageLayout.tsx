// Converted to TypeScript - migrated
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground ${className}`.trim()}
    >
      {children}
    </span>
  );
}

function HighlightCard({ title, description }) {
  return (
    <div className="h-full rounded-2xl border border-border/50 bg-card/90 p-6 shadow-sm shadow-black/5">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureList({ heading, items }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-8">
      {heading ? (
        <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
      ) : null}
      <ul className="grid gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brandSecondary/20 text-brandSecondary">
              <FaCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProcessSection({ heading, steps }) {
  if (!steps?.length) return null;

  return (
    <section className="rounded-2xl border border-border/50 bg-card/80 p-8">
      {heading ? (
        <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
      ) : null}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="relative rounded-xl border border-border/40 bg-muted/30 p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brandSecondary/15 text-sm font-semibold text-brandSecondary">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OutcomeSection({ heading, items }) {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-border/50 bg-card/80 p-8">
      {heading ? (
        <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
      ) : null}
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/30 p-4">
            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-brandSecondary/20 text-brandSecondary">
              <FaCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ToolsetSection({ heading, items }) {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-border/50 bg-card/80 p-8">
      {heading ? (
        <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ heading, body, primaryAction, secondaryAction }) {
  if (!heading && !body) return null;

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center p-10 text-center shadow-lg shadow-black/30"
      style={{ backgroundImage: "url('/hero-back.jpeg')" }}
    >
      <div className="absolute inset-0 bg-[#0c1b38]/65 mix-blend-multiply" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-white">
        {heading ? (
          <h2 className="text-3xl font-semibold md:text-4xl">
            {heading}
          </h2>
        ) : null}
        {body ? (
          <p className="text-base text-white/80">{body}</p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function ServicePageLayout({
  seo,
  hero,
  highlights = [],
  keyFeatures,
  process,
  outcomes,
  toolset,
  cta,
}) {
  return (
    <>
      {seo ? (
        <Head>
          <title>{seo.title}</title>
          {seo.description ? (
            <meta name="description" content={seo.description} />
          ) : null}
          {seo.canonical ? (
            <link rel="canonical" href={seo.canonical} />
          ) : null}
        </Head>
      ) : null}

      <PageContainer>
        <div className="min-h-screen bg-gradient-to-b from-background via-background pt-14 to-muted/40">
          <FadeIn>
            <section className="w-full overflow-hidden bg-[#0c1b38] px-6 py-16 text-primary-foreground md:px-10">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  {hero?.icon ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brandSecondary">
                      {hero.icon}
                    </div>
                  ) : null}
                  <div className="space-y-4">
                    {hero?.eyebrow ? (
                      <Badge className="border-white/20 bg-white/10 text-white">
                        {hero.eyebrow}
                      </Badge>
                    ) : null}
                    <div className="space-y-4">
                      <h1 className="text-4xl font-bold text-white md:text-5xl">
                        {hero?.title}
                      </h1>
                      {hero?.description ? (
                        <p className="text-lg leading-relaxed text-white/80">
                          {hero.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {highlights.length ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {highlights.map((card, index) => (
                      <div
                        key={index}
                        className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20"
                      >
                        <h3 className="text-lg font-semibold text-white">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/75">
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <div className="px-6 pt-12 md:px-10">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 pb-16">
                <FeatureList heading="Core capabilities" items={keyFeatures} />
                <ProcessSection heading="How we’ll work together" steps={process} />
                <OutcomeSection heading="What you’ll walk away with" items={outcomes} />
                <ToolsetSection heading="Tooling & stack" items={toolset} />
              </div>
            </div>

            <div>
              <CtaSection
                heading={cta?.heading}
                body={cta?.body}
                primaryAction={cta?.primaryAction}
                secondaryAction={cta?.secondaryAction}
              />
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

