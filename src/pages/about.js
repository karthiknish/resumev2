import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaMobileAlt,
  FaCodeBranch,
  FaRocket,
  FaReact,
  FaNodeJs,
  FaAws,
  FaGlobe,
  FaDocker,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiGraphql,
  SiPostgresql,
  SiGoogleanalytics,
  SiJest,
  SiFramer,
  SiExpo,
  SiGithubactions,
  SiVercel,
  SiSentry,
  SiCloudflare,
  SiNotion,
  SiLinear,
  SiSlack,
  SiFigma,
  SiJira,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageContainer from "@/components/PageContainer";

const stats = [
  {
    label: "Years building cross-platform products",
    value: "5+",
  },
  {
    label: "Launches shipped across web & mobile",
    value: "40+",
  },
  {
    label: "Teams partnered with",
    value: "Startups → Enterprise",
  },
];

const focusAreas = [
  "Discovery & product strategy",
  "Design systems & UI engineering",
  "Native-feel parity across platforms",
  "Performance, analytics & growth loops",
];

const approachPrinciples = [
  {
    title: "User-first delivery",
    description:
      "Every feature starts with real customer goals. Interfaces are crafted to feel effortless, inclusive, and high trust.",
    icon: FaUserCog,
  },
  {
    title: "Cross-platform excellence",
    description:
      "React, Next.js, and React Native work in lockstep so web, iOS, and Android experiences behave like a single product.",
    icon: FaMobileAlt,
  },
  {
    title: "Scalable architecture",
    description:
      "Strong foundations—typed APIs, dependable data layers, and automated pipelines—so momentum doesn’t crumble as you grow.",
    icon: FaCodeBranch,
  },
  {
    title: "Performance obsessed",
    description:
      "Budgets, monitoring, and profiling keep apps fast, accessible, and a delight to use, even under load.",
    icon: FaRocket,
  },
];

const toolkit = [
  {
    title: "Frontend craft",
    skills: [
      { name: "React.js", icon: FaReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Framer Motion", icon: SiFramer },
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      { name: "Node.js", icon: FaNodeJs },
      { name: "Express", icon: SiExpress },
      { name: "GraphQL", icon: SiGraphql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
    ],
  },
  {
    title: "Mobile & cloud",
    skills: [
      { name: "React Native", icon: TbBrandReactNative },
      { name: "Expo", icon: SiExpo },
      { name: "AWS", icon: FaAws },
      { name: "Automated releases", icon: FaCodeBranch },
    ],
  },
  {
    title: "Product operations",
    skills: [
      { name: "Analytics & attribution", icon: SiGoogleanalytics },
      { name: "Meta Ads & LinkedIn", icon: FaGlobe },
      { name: "Google Ads", icon: SiGoogleanalytics },
      { name: "QA automation", icon: SiJest },
      { name: "Performance budgets", icon: FaRocket },
    ],
  },
  {
    title: "Delivery & operations",
    skills: [
      { name: "GitHub Actions", icon: SiGithubactions },
      { name: "Docker & containers", icon: FaDocker },
      { name: "Vercel edge deploys", icon: SiVercel },
      { name: "Sentry monitoring", icon: SiSentry },
      { name: "Cloudflare caching", icon: SiCloudflare },
    ],
  },
  {
    title: "Collaboration & workflow",
    skills: [
      { name: "Notion playbooks", icon: SiNotion },
      { name: "Linear roadmaps", icon: SiLinear },
      { name: "Slack async updates", icon: SiSlack },
      { name: "Figma design reviews", icon: SiFigma },
      { name: "Jira QA rituals", icon: SiJira },
    ],
  },
];

const journeyHighlights = [
  {
    title: "Outcome-driven partner",
    description:
      "Over five years I’ve guided founders and product teams from zero to launch with clear roadmaps, async-friendly updates, and measurable progress every week.",
  },
  {
    title: "Cross-platform fluency",
    description:
      "Web, mobile, and cloud work together. I lead discovery, UX, and engineering so experiences feel consistent regardless of form factor or network conditions.",
  },
  {
    title: "Calm, collaborative process",
    description:
      "Expect recorded demos, written updates, and a transparent backlog. Decisions stay visible, feedback loops stay short, and shipping stays predictable.",
  },
];

function About() {
  return (
    <>
      <Head>
        <title>About Me - Karthik Nishanth | Cross Platform Developer</title>
        <meta
          name="description"
          content="Learn more about Karthik Nishanth, a freelance Cross Platform Developer based in Liverpool, UK, specializing in React, React Native, Node.js, and creating high-impact web and mobile solutions."
        />
        <meta
          property="og:title"
          content="About Me - Karthik Nishanth | Cross Platform Developer"
        />
        <meta
          property="og:description"
          content="Cross Platform Developer specializing in modern web and mobile technologies, based in Liverpool. Expertise in React, React Native, Node.js, and cloud technologies."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/about" />
        <meta
          property="og:image"
          content="https://karthiknish.com/Logo.png"
        />
        <link rel="canonical" href="https://karthiknish.com/about" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Me - Karthik Nishanth | Cross Platform Developer" />
        <meta name="twitter:description" content="Cross Platform Developer specializing in modern web and mobile technologies, based in Liverpool." />
        <meta name="twitter:image" content="https://karthiknish.com/Logo.png" />
        <meta name="twitter:site" content="@karthiknish" />
      </Head>
      <PageContainer>
        <div className="min-h-screen overflow-x-hidden">
          <section className="relative overflow-hidden bg-slate-950 text-white">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,118,110,0.22),_transparent_70%)]" />
            <div className="relative mx-auto grid max-w-6xl items-start gap-16 px-6 py-28 sm:px-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:px-12 md:py-32">
              <div className="space-y-10">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
                >
                  About
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-heading text-4xl leading-tight text-white sm:text-5xl md:text-6xl"
                >
                  I help teams ship cross-platform products that feel cohesive, resilient, and unmistakably premium.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
                >
                  From product discovery to cloud operations, I blend strategy, design systems, and engineering craft so web and mobile experiences launch with confidence—and keep improving after release.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Link href="/contact">
                    <Button className="bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90">
                      Partner with me
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button
                      variant="outline"
                      className="border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-white"
                    >
                      Explore services
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3"
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p style={{fontFamily:"Instrument Serif"}} className="font-heading text-2xl text-white">{stat.value}</p>
                      <p className="text-sm leading-snug text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <Card className="border-white/15 bg-white/10 backdrop-blur">
                  <CardContent className="space-y-8 p-8">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                        Focus areas
                      </p>
                      <ul className="space-y-2 text-sm text-white/75">
                        {focusAreas.map((area) => (
                          <li key={area} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-white/50" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                        What partners notice
                      </p>
                      <ul className="space-y-2 text-sm text-white/75">
                        <li>• Thoughtful product guidance with measurable outcomes.</li>
                        <li>• Cross-platform cohesion built into the roadmap.</li>
                        <li>• Calm delivery cadence, transparent communication.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-background">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <div className="max-w-3xl mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-xs uppercase text-muted-foreground tracking-[0.3em]"
                >
                  Approach
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-heading text-3xl sm:text-4xl leading-snug text-foreground"
                >
                  Momentum without the scramble. Strategy, design, and engineering move in lockstep.
                </motion.h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {approachPrinciples.map((principle, index) => {
                  const Icon = principle.icon;
                  return (
                    <motion.div
                      key={principle.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-secondary p-3">
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="font-heading text-xl text-foreground mb-2">{principle.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-secondary">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-12"
              >
                <p className="text-xs uppercase text-muted-foreground tracking-[0.3em]">
                  Toolkit
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-foreground">
                  A pragmatic stack built for velocity, quality, and scale.
                </h2>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {toolkit.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-heading text-xl text-foreground mb-4">{category.title}</h3>
                    <ul className="space-y-3">
                      {category.skills.map((skill) => {
                        const Icon = skill.icon;
                        return (
                          <li key={skill.name} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                              <Icon className="h-5 w-5 text-foreground" />
                            </span>
                            <span className="font-medium text-foreground">{skill.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-background">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-12"
              >
                <p className="text-xs uppercase text-muted-foreground tracking-[0.3em]">
                  Journey
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-foreground">
                  Five years of shipping products with founders, product teams, and growth leaders.
                </h2>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-3">
                {journeyHighlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-heading text-xl text-foreground mb-3">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden py-20 md:py-28 bg-slate-950 text-slate-100 text-center shadow-lg shadow-black/30"
           
          >
            <div className="absolute inset-0 bg-[#0c1b38]/70 mix-blend-multiply" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-white sm:px-10 md:px-12">
              <h2 className="font-heading text-3xl leading-snug sm:text-4xl">
                Ready to build the next chapter of your product?
              </h2>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                Share the challenges, constraints, or ambition behind your product. I’ll help design a roadmap and ship the first wins quickly.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact">
                  <Button className="bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90">
                    Start a project conversation
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-white"
                  >
                    See how I can help
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </PageContainer>
    </>
  );
}

export default About;
