import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaMobileAlt,
  FaServer,
  FaDatabase,
  FaRocket,
  FaTools,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaPaintBrush,
  FaStore,
} from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGraphql,
  SiNodedotjs,
  SiAmazonaws,
  SiVercel,
  SiJest,
  SiGoogleanalytics,
  SiMeta,
  SiLinkedin,
  SiGoogleads,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import PageContainer from "@/components/PageContainer";
import JsonLd, { createServiceSchema } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";

// Helper function to generate slugs
const generateSlug = (title) => {
  return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
};


export default function Services() {
  const [expandedFaq, setExpandedFaq] = React.useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const services = [
    {
      icon: <FaCode className="text-5xl text-brandSecondary" />,
      title: "Frontend Development",
      description:
        "Creating responsive, interactive, and visually appealing user interfaces using modern frameworks like React, Next.js, and Vue.js.",
      features: [
        "Responsive web design",
        "Single page applications (SPAs)",
        "Progressive web apps (PWAs)",
        "Cross-browser compatibility",
        "Performance optimization",
      ],
    },
    {
      icon: <FaServer className="text-5xl text-brandSecondary" />,
      title: "Backend Development",
      description:
        "Building robust server-side applications and APIs using Node.js, Express, and other modern technologies.",
      features: [
        "RESTful API development",
        "GraphQL implementation",
        "Authentication & authorization",
        "Serverless functions",
        "Microservices architecture",
      ],
    },
    {
      icon: <FaMobileAlt className="text-5xl text-brandSecondary" />,
      title: "Mobile App Development",
      description:
        "Developing cross-platform mobile applications using React Native that work seamlessly on both iOS and Android devices.",
      features: [
        "Cross-platform development",
        "Native-like performance",
        "Offline functionality",
        "Push notifications",
        "App store deployment",
      ],
    },
    {
      icon: <FaDatabase className="text-5xl text-brandSecondary" />,
      title: "Database Design", // Note: Slug will be database-design
      description:
        "Designing and implementing efficient database solutions using SQL and NoSQL technologies.",
      features: [
        "Schema design",
        "Data modeling",
        "Query optimization",
        "MongoDB implementation",
        "PostgreSQL/MySQL setup",
      ],
    },
    {
      icon: <FaRocket className="text-5xl text-brandSecondary" />,
      title: "Performance Optimization",
      description:
        "Improving the speed and efficiency of web applications through various optimization techniques.",
      features: [
        "Load time reduction",
        "Code splitting",
        "Lazy loading",
        "Caching strategies",
        "Image optimization",
      ],
    },
    {
      icon: <FaTools className="text-5xl text-brandSecondary" />,
      title: "Technical Consultation",
      description:
        "Providing expert advice on technology stack selection, architecture design, and best practices.",
      features: [
        "Technology stack evaluation",
        "Architecture planning",
        "Code reviews",
        "Best practices implementation",
        "Technical documentation",
      ],
    },
    {
      icon: <FaGlobe className="text-5xl text-brandSecondary" />,
      title: "Professional Brochure Websites",
      description:
        "Establish your online presence with a stunning, custom-built website that showcases your services and attracts new customers.",
      features: [
        "Unique Custom Design",
        "Mobile-First Responsive layout",
        "Basic SEO Optimization",
        "Clear Calls-to-Action",
      ],
    },
    {
      icon: <FaPaintBrush className="text-5xl text-brandSecondary" />,
      title: "Website Reskin & Modernization",
      description:
        "Transform your outdated website into a high-performing conversion machine without the cost and time of a full rebuild.",
      features: [
        "Stunning Visual Redesign",
        "Fully Responsive layout",
        "Performance Optimization",
        "Improved User Experience",
      ],
    },
    {
      icon: <FaStore className="text-5xl text-brandSecondary" />,
      title: "E-commerce Solutions",
      description:
        "Build a powerful online store that drives sales and growth with a seamless shopping experience.",
      features: [
        "Product Catalog Management",
        "Secure Payment Integration",
        "Order Management System",
        "Mobile-Optimized Design",
      ],
    },
  ];

  const toolingStack = [
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "React Native", icon: TbBrandReactNative },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Tailwind CSS", icon: SiTailwindcss },
    { name: "GraphQL", icon: SiGraphql },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "AWS", icon: SiAmazonaws },
    { name: "Vercel", icon: SiVercel },
    { name: "Automated QA", icon: SiJest },
    { name: "Analytics", icon: SiGoogleanalytics },
    { name: "Meta Ads", icon: SiMeta },
    { name: "LinkedIn Ads", icon: SiLinkedin },
    { name: "Google Ads", icon: SiGoogleads },
  ];

  const faqs = [
    {
      question: "What is your development process?",
      answer:
        "My development process typically follows these steps: 1) Requirements gathering and analysis, 2) Planning and architecture design, 3) Development with regular check-ins, 4) Testing and quality assurance, 5) Deployment, and 6) Maintenance and support. I emphasize clear communication throughout the entire process.",
    },
    {
      question: "How long does it typically take to complete a project?",
      answer:
        "Project timelines vary based on complexity, scope, and requirements. A simple website might take 2-4 weeks, while a complex web application could take 2-6 months. I'll provide a detailed timeline estimate after understanding your specific project needs during our initial consultation.",
    },
    {
      question: "Do you offer maintenance services after project completion?",
      answer:
        "Yes, I offer ongoing maintenance and support services to ensure your application continues to run smoothly. This includes bug fixes, security updates, performance monitoring, and feature enhancements. We can discuss maintenance packages tailored to your specific needs.",
    },
    {
      question: "What technologies do you specialize in?",
      answer:
        "I specialize in modern web technologies including React, Next.js, Node.js, Express, MongoDB, PostgreSQL, and AWS/Firebase for cloud services. For mobile development, I work with React Native. I'm constantly learning and adapting to new technologies to provide the best solutions.",
    },
    {
      question: "How do you handle project communication?",
      answer:
        "Clear communication is essential for project success. I typically use a combination of regular video calls, email updates, and project management tools like Jira, Trello, or Asana. I provide weekly progress reports and am available for questions throughout the development process.",
    },
  ];

  // Generate Service schema for each service
  const serviceSchemas = services.map((service) =>
    createServiceSchema(service)
  );

  return (
    <>
      <Head>
        <title>Services - Karthik Nishanth | Cross Platform Partner</title>
        <meta
          name="description"
          content="Explore the product, engineering, and growth engagements I lead for teams shipping modern web and mobile software."
        />
        <meta
          property="og:title"
          content="Services - Karthik Nishanth | Cross Platform Partner"
        />
        <meta
          property="og:description"
          content="From discovery to launch, partner with Karthik Nishanth for React, Next.js, React Native, and cloud expertise."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/services" />
        <meta
          property="og:image"
          content="https://karthiknish.com/Logo.png"
        />
        <link rel="canonical" href="https://karthiknish.com/services" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services - Karthik Nishanth | Cross Platform Partner" />
        <meta name="twitter:description" content="Explore product, engineering, and growth engagements for modern web and mobile software." />
        <meta name="twitter:image" content="https://karthiknish.com/Logo.png" />
        <meta name="twitter:site" content="@karthiknish" />

        {serviceSchemas.map((schema, index) => (
          <JsonLd key={`service-schema-${index}`} data={schema} />
        ))}

      </Head>
      <PageContainer>
        <div className="min-h-screen overflow-x-hidden">
          <section className="relative overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,118,110,0.22),_transparent_70%)]" />

            <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 py-28 md:py-32">
              <div className="grid gap-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
                <div className="space-y-10">
                  <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
                  >
                    Services
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-white"
                  >
                    Product, design, and engineering partnerships tailored to how modern teams ship.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed"
                  >
                    Whether you need an end-to-end build, a native-quality mobile app, or a strategic engineering partner, we’ll assemble the right blend of discovery, design systems, and delivery to compounding outcomes.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link href="/contact">
                      <Button className="bg-white text-slate-900 hover:bg-slate-200">
                        Plan a project call
                      </Button>
                    </Link>
                    <Link href="/projects">
                      <Button variant="outline" className="bg-transparent border-white/20 text-slate-200 hover:bg-white/15 hover:text-white">
                        View case studies
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid gap-6 sm:grid-cols-3 border-t border-white/10 pt-8"
                  >
                    {[
                      { label: "Launches supported", value: "40+" },
                      { label: "Team types", value: "Seed → Enterprise" },
                      { label: "Delivery model", value: "Async-first" },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <p className="font-heading text-2xl text-white">{stat.value}</p>
                        <p className="text-sm text-slate-300 leading-snug">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs uppercase text-slate-300 tracking-[0.3em]">
                      Engagement formats
                    </p>
                    <ul className="space-y-3 text-sm text-slate-200">
                      <li>• Fixed-scope product delivery with weekly demos</li>
                      <li>• Retained engineering partner for velocity and polish</li>
                      <li>• Advisory sprints for architecture, performance, and DX</li>
                    </ul>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs uppercase text-slate-300 tracking-[0.3em] mb-3">
                        Tooling stack includes
                      </p>
                      <p className="text-sm text-slate-200/80 leading-relaxed mb-4">
                        A proven toolkit that covers design systems, delivery pipelines, observability, and paid growth instrumentation.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {toolingStack.map(({ name, icon: Icon }) => (
                          <div
                            key={name}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-medium text-slate-100/90">
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
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
                  className="text-xs uppercase text-slate-500 tracking-[0.3em]"
                >
                  Core capabilities
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900"
                >
                  Services crafted to keep discovery, design, and engineering aligned from day one.
                </motion.h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => {
                  const slug = generateSlug(service.title);
                  const href = `/services/${slug}`;
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="group h-full"
                    >
                      <Link href={href} className="block h-full">
                        <div className="h-full rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 text-3xl">
                            {React.cloneElement(service.icon, {
                              className: "text-3xl",
                            })}
                          </div>
                          <h3 className="font-heading text-2xl text-slate-900 mb-3">
                            {service.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            {service.description}
                          </p>
                          <ul className="space-y-3 text-sm text-slate-600">
                            {service.features.slice(0, 3).map((feature) => (
                              <li key={feature} className="flex items-center gap-3">
                                <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                            Learn more
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-12"
              >
                <p className="text-xs uppercase text-slate-500 tracking-[0.3em]">
                  How engagements run
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900">
                  A calm delivery cadence designed for async collaboration and measurable progress.
                </h2>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Discovery & roadmap",
                    description:
                      "Kick-off workshops, success metrics, and architectural decisions packaged into a transparent plan before code ships.",
                  },
                  {
                    title: "Design & build sprints",
                    description:
                      "Weekly increments with design system parity, typed APIs, automated QA, and recorded walkthroughs for easy stakeholder review.",
                  },
                  {
                    title: "Launch & optimisation",
                    description:
                      "Observability, performance budgets, and growth instrumentation keep releases stable and insights actionable post-launch.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-heading text-xl text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-background">
            <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <p className="text-xs uppercase text-slate-500 tracking-[0.3em]">
                  FAQs
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900">
                  Answers to common partnership questions.
                </h2>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="text-lg font-semibold text-slate-900">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <FaChevronUp className="text-slate-500" />
                        ) : (
                          <FaChevronDown className="text-slate-500" />
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-slate-950 text-slate-100">
            <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-heading text-3xl sm:text-4xl leading-snug"
              >
                Let’s translate your roadmap into shipped outcomes.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-base text-slate-300 leading-relaxed max-w-2xl mx-auto"
              >
                Share your goals, constraints, and milestones. I&apos;ll propose a plan, assemble the right stack, and keep momentum visible at every step.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link href="/contact">
                  <Button className="bg-slate-100 text-slate-900 hover:bg-slate-300">
                    Start a project conversation
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="bg-transparent border-slate-400/70 text-slate-200 hover:bg-slate-800/70 hover:text-white">
                    Learn about my approach
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
