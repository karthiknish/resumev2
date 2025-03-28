"use client";
import Link from "next/link";
import Head from "next/head";
import React, { useState } from "react";
// Import components directly
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";


import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { motion, LayoutGroup } from "framer-motion";

import { BentoGrid } from "@/components/ui/bento-grid";

import {
  TrendingUp,
  CheckCircle,
  Video,
  Globe,
  Code,
  Database,
  Cloud,
  Lock,
} from "lucide-react";

import Services from "@/components/Services";
import ContactForm from "@/components/Form";
import Faq from "@/components/Faq";

const HomeScreen = () => {
  // Simple loading component for lazy-loaded components
  const SimpleLoader = ({ className }) => (
    <div
      className={`flex items-center justify-center h-full w-full ${className}`}
    >
      <div className="animate-pulse bg-gradient-to-tr from-primary/20 to-primary/40 rounded-xl h-full w-full"></div>
    </div>
  );

  const exampleImages = [
    {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop",
      author: "Clement Helardot",
      title: "Coding on a laptop",
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3270&auto=format&fit=crop",
      link: "https://unsplash.com/photos/people-sitting-on-chair-in-front-of-table-with-laptop-computer-t9MP5ZyTZoM",
      title: "Team collaboration",
      author: "Leon",
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3270&auto=format&fit=crop",
      link: "https://unsplash.com/photos/white-ceramic-mug-beside-macbook-pro-YwYBNF-qw3Y",
      author: "Christin Hume",
      title: "Modern workspace setup",
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=3015&auto=format&fit=crop",
      link: "https://unsplash.com/photos/data-visualization-on-computer-monitor-15JtqeDWXRA",
      author: "Carlos Muza",
      title: "Data Analytics Dashboard",
    },
    {
      url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=3276&auto=format&fit=crop",
      link: "https://unsplash.com/photos/laptop-computer-turned-on-showing-graphs-wX2L8L-fGeA",
      author: "Luke Chesser",
      title: "Business Analytics",
    },
    {
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=3270&auto=format&fit=crop",
      link: "https://unsplash.com/photos/people-having-meeting-inside-room-QckxruozjRg",
      author: "Austin Distel",
      title: "Team Meeting",
    },
    {
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=3270&auto=format&fit=crop",
      title: "Developer workspace",
      author: "Pascal Brokmeier",
      link: "https://unsplash.com/photos/black-flat-screen-computer-monitor-turned-on-showing-computer-codes-UJbHNoVPZW0",
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=3270&auto=format&fit=crop",
      author: "Marvin Meyer",
      link: "https://unsplash.com/photos/people-using-laptop-computer-SYTO3xs06fU",
      title: "Team collaboration on laptop",
    },
  ];
  const items = [
    // This is the FAQ items array
    {
      id: "1",
      title: "What services do you offer?",
      content:
        "I offer comprehensive full-stack development services including web application development, API integration, database design, and cloud deployment. I specialize in React, Node.js, and modern JavaScript frameworks, delivering scalable and performant solutions tailored to your business needs.",
    },
    {
      id: "2",
      title: "How do you approach business problems?",
      content:
        "I take a strategic approach by first understanding your business objectives and challenges. Then, I develop custom technical solutions that address core problems while considering scalability, maintainability, and user experience. My background in both development and business allows me to bridge technical and business requirements effectively.",
    },
    {
      id: "3",
      title: "What is your development process?",
      content:
        "My development process follows an agile methodology with regular client communication. It includes requirements gathering, planning, iterative development with frequent feedback loops, thorough testing, and post-deployment support. I emphasize clean code, documentation, and best practices throughout the process.",
    },
    {
      id: "4",
      title: "What technologies do you work with?",
      content:
        "I work with modern web technologies including React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, AWS, and more. I stay current with industry trends and choose the most appropriate tech stack based on project requirements, performance needs, and long-term maintainability.",
    },
    {
      id: "5",
      title: "How do you ensure project success?",
      content:
        "Project success is ensured through clear communication, detailed planning, regular progress updates, and quality control measures. I implement automated testing, continuous integration, and monitoring to maintain high standards. Additionally, I provide comprehensive documentation and knowledge transfer to support long-term success.",
    },
  ];

  const techStack = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description: "React, Next.js, TypeScript",
      color: "text-blue-500",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Node.js, Express, MongoDB",
      color: "text-green-500",
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Services",
      description: "AWS, Azure, Google Cloud",
      color: "text-purple-500",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Security",
      description: "OAuth, JWT, HTTPS",
      color: "text-red-500",
    },
  ];

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content="Karthik Nishanth - Freelance Full Stack Developer | Liverpool, UK"
        />
        <meta
          property="og:description"
          content="Freelance web developer creating custom, scalable, and high-performance web solutions for businesses and individuals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta property="og:image" content="https://karthiknish.com/Logo.png" />
        <meta property="og:site_name" content="Karthik Nishanth" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Karthik Nishanth - Freelance Full Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Freelance web developer creating custom, scalable, and high-performance web solutions for businesses and individuals."
        />
        <meta name="twitter:image" content="https://karthiknish.com/Logo.png" />

        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="bg-black overflow-hidden relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <HeroGeometric
          className="absolute inset-0 -z-0 opacity-30"
          duration={20}
          speed={2}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10  min-h-screen py-20 flex flex-col items-center justify-center"
        >
          <Head>
            <title>
              Karthik Nishanth - Freelance Full Stack Developer | Liverpool, UK
            </title>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta
              name="description"
              content="Karthik Nishanth: A freelance Full Stack Developer based in Liverpool, UK. Specializing in creating bespoke web solutions for businesses and individuals."
            />
            <meta
              name="keywords"
              content="Freelance Web Developer, Full Stack Developer, Web Development, React, Node.js, JavaScript, TypeScript,  Liverpool, UK"
            />
            <meta name="author" content="Karthik Nishanth" />
            <link rel="canonical" href="https://karthiknish.com/" />
          </Head>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 container mx-auto mb-10 flex flex-col items-center"
          >
            <Floating sensitivity={-0.5} className="h-full w-full absolute">
              <FloatingElement
                depth={0.5}
                className="top-[15%] left-[2%] md:top-[25%] md:left-[5%]"
              >
                <motion.img
                  src={exampleImages[0].url}
                  alt={exampleImages[0].title}
                  className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-[3deg] shadow-2xl rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                />
              </FloatingElement>

              <FloatingElement
                depth={1}
                className="top-[0%] left-[8%] md:top-[6%] md:left-[11%]"
              >
                <motion.img
                  src={exampleImages[1].url}
                  alt={exampleImages[1].title}
                  className="w-40 h-28 sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-60 lg:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-12 shadow-2xl rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.1 }}
                />
              </FloatingElement>

              <FloatingElement
                depth={4}
                className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]"
              >
                <motion.img
                  src={exampleImages[2].url}
                  alt={exampleImages[2].title}
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                />
              </FloatingElement>

              <FloatingElement
                depth={2}
                className="top-[0%] left-[87%] md:top-[2%] md:left-[83%]"
              >
                <motion.img
                  src={exampleImages[3].url}
                  alt={exampleImages[3].title}
                  className="w-40 h-36 sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-64 lg:h-56 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[6deg] rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.1 }}
                />
              </FloatingElement>

              <FloatingElement
                depth={1}
                className="top-[78%] left-[83%] md:top-[68%] md:left-[83%]"
              >
                <motion.img
                  src={exampleImages[4].url}
                  alt={exampleImages[4].title}
                  className="w-44 h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[19deg] rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.1 }}
                />
              </FloatingElement>
            </Floating>

            <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto mt-10">
              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4 text-white"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
              >
                <span>I Build </span>
                <LayoutGroup>
                  <motion.span layout className="flex whitespace-pre">
                    <motion.span
                      layout
                      className="flex whitespace-pre"
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                      }}
                    >
                      Websites{" "}
                    </motion.span>
                    <TextRotate
                      texts={[
                        "that scale",
                        "that perform",
                        "with precision",
                        "with passion",
                        "⚡ fast",
                        "secure 🔒",
                        "elegant",
                        "✨ modern",
                        "robust",
                        "🚀 efficient",
                        "future-proof",
                        "seamless",
                        "strategic",
                      ]}
                      mainClassName="overflow-hidden pr-3 text-blue-500 py-0 pb-2 md:pb-4 rounded-xl"
                      staggerDuration={0.03}
                      staggerFrom="last"
                      rotationInterval={3000}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                      }}
                    />
                  </motion.span>
                </LayoutGroup>
              </motion.h1>
              <motion.p
                className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center font-calendas pt-4 sm:pt-8 md:pt-10 lg:pt-12 text-white"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
              >
                Freelance web developer creating custom, scalable, and
                high-performance web solutions for businesses and individuals.
              </motion.p>

              <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20 lg:mt-20 text-xs">
                <motion.button
                  className="sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                    delay: 0.7,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link className="text-white font-calendas" href="/contact">
                    Get in Touch <span className="font-calendas ml-1">→</span>
                  </Link>
                </motion.button>
                <motion.button
                  className="sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                    delay: 0.7,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    target="_blank"
                    href="https://github.com/karthiknish"
                    className="font-calendas"
                  >
                    View GitHub <span className="font-calendas ml-1">→</span>
                  </Link>
                </motion.button>
              </div>
            </div>
          </motion.div>
          {/* New Section: Why Choose a Freelancer? */}
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black py-16 mt-24"
          >
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl text-center font-bold sm:text-4xl mb-12 text-white font-calendas"
              >
                Why Choose a Freelancer Over an Agency?
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Benefit 1: Cost-Effectiveness */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                    Cost-Effectiveness
                  </h3>
                  <p className="text-gray-400 font-calendas">
                    Freelancers typically have lower overhead costs compared to
                    agencies, allowing for more competitive pricing without
                    compromising quality.
                  </p>
                </motion.div>

                {/* Benefit 2: Personalized Attention */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                    Personalized Attention
                  </h3>
                  <p className="text-gray-400 font-calendas">
                    Working with a freelancer means direct communication and a
                    single point of contact, ensuring your vision is understood
                    and implemented accurately.
                  </p>
                </motion.div>

                {/* Benefit 3: Flexibility and Speed */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                    Flexibility and Speed
                  </h3>
                  <p className="text-gray-400 font-calendas">
                    Freelancers can adapt quickly to changing project
                    requirements and typically deliver faster turnaround times
                    due to streamlined processes.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
          {/* New Tech Stack Section */}
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black py-16"
          >
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl text-center font-bold sm:text-4xl mb-12 text-white font-calendas"
              >
                Technical Expertise
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 * index }}
                    viewport={{ once: true }}
                    className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className={`${tech.color} mb-4`}>{tech.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                      {tech.title}
                    </h3>
                    <p className="text-gray-400 font-calendas">
                      {tech.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black py-12"
          >
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl text-center font-bold sm:text-4xl mb-8 text-white font-calendas"
              >
                Featured Projects
              </motion.h2>
              {(() => {
                // Original itemsSample for BentoGrid
                const itemsSample = [
                  {
                    title: "E-commerce Platform",
                    meta: "35% Growth",
                    description:
                      "Advanced UX design and performance optimization for increased conversions",
                    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
                    status: "Live",
                    tags: ["UX", "Performance", "Analytics"],
                    colSpan: 2,
                    hasPersistentHover: true,
                  },
                  {
                    title: "Startup Infrastructure",
                    meta: "10x Scale",
                    description:
                      "Scalable architecture supporting exponential user growth",
                    icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
                    status: "Updated",
                    tags: ["Architecture", "Scaling"],
                  },
                  {
                    title: "AI Integration",
                    meta: "40% Cost Reduction",
                    description:
                      "AI-powered chatbot implementation for customer service",
                    icon: <Video className="w-4 h-4 text-blue-500" />,
                    tags: ["AI", "Automation"],
                    colSpan: 2,
                  },
                  {
                    title: "Analytics System",
                    meta: "25% Revenue Growth",
                    description:
                      "Data analytics overhaul providing actionable insights",
                    icon: <Globe className="w-4 h-4 text-blue-500" />,
                    status: "Live",
                    tags: ["Analytics", "Business Intelligence"],
                  },
                ];

                return <BentoGrid items={itemsSample} />;
              })()}
            </div>
          </motion.section>
          <Faq items={items} /> {/* Pass FAQ items */}
          <div className="bg-black mx-auto px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Services />
            </motion.div>
          </div>
          <ContactForm />
        </motion.div>
      </div>
    </>
  );
};

export default HomeScreen;
