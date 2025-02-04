"use client";
import Link from "next/link";
import Head from "next/head";
import React, { Suspense } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BentoGrid } from "@/components/ui/bento-grid";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
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

const HomeScreen = () => {
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
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen"
      >
        <Head>
          <title>
            Karthik Nishanth - Elite Full Stack Developer & Business Problem
            Solver | Liverpool, UK
          </title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Karthik Nishanth: An elite Full Stack Developer and Business Problem Solver based in Liverpool, UK. Transforming complex business challenges into innovative digital solutions."
          />
          <meta
            name="keywords"
            content="Business Problem Solver, Full Stack Developer, Web Development Expert, React, Node.js, JavaScript, TypeScript, GraphQL, Performance Marketing, Google Ads, Meta Ads, TikTok Ads, Liverpool, UK"
          />
          <meta name="author" content="Karthik Nishanth" />
          <link rel="canonical" href="https://karthiknish.com/" />
        </Head>

        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <HeroGeometric
            badge="Experienced Full Stack Developer"
            title1="Transform Your"
            title2="Business Vision"
          />
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full bg-black h-screen overflow-hidden md:overflow-visible flex flex-col items-center justify-center relative"
          >
            <Floating sensitivity={-0.5} className="h-full">
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

            <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto">
              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4 text-white"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
              >
                <span>I Make </span>
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
                      Solutions{" "}
                    </motion.span>
                    <TextRotate
                      texts={[
                        "scalable",
                        "reliable",
                        "innovative",
                        "powerful",
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
                Transforming complex business challenges into innovative digital
                solutions with expertise in full-stack development and strategic
                problem-solving.
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
                    href="https://github.com/karthiknish"
                    className="font-calendas"
                  >
                    View GitHub <span className="font-calendas ml-1">→</span>
                  </Link>
                </motion.button>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-0">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />

              <div className="flex h-full">
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 font-calendas"
                  >
                    About Me
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-4 text-neutral-300 max-w-lg font-calendas"
                  >
                    I'm a full-stack developer passionate about building
                    innovative web solutions. With expertise in React, Node.js,
                    and cloud technologies, I create scalable applications that
                    drive business growth.
                  </motion.p>
                </div>

                <div className="flex-1 relative">
                  <Suspense fallback={<div>Loading 3D Scene...</div>}>
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="w-full h-full"
                    />
                  </Suspense>
                </div>
              </div>
            </Card>
          </motion.div>

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
                Featured Solutions
              </motion.h2>
              {(() => {
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

          <motion.section
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black mt-20 text-white py-12"
          >
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl text-center font-bold sm:text-4xl mb-8 font-calendas"
              >
                Frequently Asked Questions
              </motion.h2>
              <Accordion
                type="single"
                collapsible
                className="w-full max-w-3xl mx-auto"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium font-calendas">
                    What technologies do you specialize in?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 font-calendas">
                    I specialize in modern web technologies including React,
                    Next.js, Node.js, and TypeScript. I'm also experienced with
                    cloud platforms like AWS and Azure, and have extensive
                    knowledge of database systems including MongoDB and
                    PostgreSQL.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium font-calendas">
                    How do you approach new projects?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 font-calendas">
                    I begin with a thorough analysis of business requirements
                    and objectives. Then, I develop a strategic roadmap that
                    outlines technical solutions, timelines, and deliverables.
                    Throughout the project, I maintain clear communication and
                    adapt to changing needs while ensuring high-quality code and
                    optimal performance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium font-calendas">
                    What sets you apart from other developers?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 font-calendas">
                    My unique combination of technical expertise and business
                    acumen allows me to not just code solutions, but to truly
                    understand and solve complex business challenges. I focus on
                    delivering scalable, maintainable code while keeping
                    business objectives at the forefront.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium font-calendas">
                    How do you handle project deadlines and communication?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 font-calendas">
                    I maintain transparent communication through regular updates
                    and status reports. I use agile methodologies to ensure
                    timely delivery and adapt quickly to changes. My project
                    management skills help me balance multiple priorities while
                    maintaining high quality standards.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.section>

          <motion.main
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black mx-auto px-4 pt-20"
          >
            <section id="contact" className="py-12">
              <div className="container mx-auto">
                <div className="text-center space-y-4">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold sm:text-4xl text-white font-calendas"
                  >
                    Get in Touch
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-gray-300 max-w-[700px] mx-auto font-calendas"
                  >
                    Ready to elevate your web presence? Let's collaborate to
                    turn your vision into a digital masterpiece.
                  </motion.p>
                  <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex space-x-2 max-w-sm mx-auto"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 p-2 border rounded bg-gray-700 text-white font-calendas"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
                    >
                      Subscribe
                    </motion.button>
                  </motion.form>
                </div>
              </div>
            </section>
          </motion.main>
        </motion.div>
      </motion.div>
    </Suspense>
  );
};

export default HomeScreen;
            

