import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaLinux,
  FaGithub,
  FaPaintBrush,
  FaCodeBranch,
  FaUserCog,
  FaPython,
  FaRocket,
  FaHandshake,
  FaLightbulb,
  FaSyncAlt,
  FaBalanceScale,
  FaDatabase,
  FaBug,
  FaMobileAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGraphql,
  SiVercel,
  SiFigma,
  SiGoogleanalytics,
  SiSemrush,
  SiGoogleads,
  SiMeta,
  SiMailchimp,
  SiHubspot,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiSketch,
  SiInvision,
  SiGitlab,
  SiNextdotjs,
  SiJest,
  SiCypress,
  SiJira,
  SiTrello,
  SiAsana, // Added PM tool icons
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { FadeIn } from "../components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";
import { Separator } from "@/components/ui/separator";
// Removed Badge import

// Combine skills into categories for easier mapping
const skillsByCategory = {
  Frontend: [
    { name: "React.js", icon: <FaReact className="text-sky-400 w-5 h-5" /> },
    { name: "Next.js", icon: <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">▲</div> },
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-blue-500 w-5 h-5" />,
    },
    {
      name: "JavaScript (ES6+)",
      icon: <SiJavascript className="text-yellow-400 w-5 h-5" />,
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="text-cyan-400 w-5 h-5" />,
    },
    { name: "HTML5", icon: <SiHtml5 className="text-orange-500 w-5 h-5" /> },
    { name: "CSS3", icon: <SiCss3 className="text-blue-600 w-5 h-5" /> },
  ],
  "Mobile Development": [
    { name: "React Native", icon: <FaReact className="text-sky-400 w-5 h-5" /> },
    { name: "iOS Development", icon: <div className="w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-bold">📱</div> },
    { name: "Android Development", icon: <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🤖</div> },
    { name: "Cross-Platform Apps", icon: <div className="w-5 h-5 bg-purple-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "Expo", icon: <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">E</div> },
    { name: "App Store Publishing", icon: <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🏪</div> },
  ],
  "Backend & Database": [
    { name: "Node.js", icon: <FaNodeJs className="text-green-500 w-5 h-5" /> },
    { name: "Express.js", icon: <div className="w-5 h-5 bg-gray-700 rounded-sm flex items-center justify-center text-white text-xs font-bold">E</div> },
    { name: "Python", icon: <FaPython className="text-yellow-400 w-5 h-5" /> },
    { name: "GraphQL", icon: <SiGraphql className="text-pink-500 w-5 h-5" /> },
    {
      name: "RESTful APIs",
      icon: <TbApi className="text-orange-400 w-5 h-5" />,
    },
    { name: "MongoDB", icon: <SiMongodb className="text-green-600 w-5 h-5" /> },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql className="text-blue-600 w-5 h-5" />,
    },
    { name: "Convex", icon: <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">C</div> },
    {
      name: "SQL & NoSQL",
      icon: <FaDatabase className="text-purple-400 w-5 h-5" />,
    },
  ],
  "Auth & Analytics": [
    { name: "Clerk Auth", icon: <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "PostHog", icon: <div className="w-5 h-5 bg-yellow-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "NextAuth.js", icon: <div className="w-5 h-5 bg-purple-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "Firebase Auth", icon: <div className="w-5 h-5 bg-orange-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">🔥</div> },
  ],
  "DevOps & Cloud": [
    { name: "AWS", icon: <FaAws className="text-orange-500 w-5 h-5" /> },
    { name: "Docker", icon: <FaDocker className="text-blue-600 w-5 h-5" /> },
    {
      name: "Git/GitHub",
      icon: <FaGithub className="text-gray-300 w-5 h-5" />,
    },
    {
      name: "CI/CD (GitLab)",
      icon: <SiGitlab className="text-orange-600 w-5 h-5" />,
    },
    { name: "Linux", icon: <FaLinux className="text-yellow-500 w-5 h-5" /> },
    { name: "Vercel", icon: <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">▲</div> },
  ],

  "Design & Other Tools": [
    { name: "Figma", icon: <SiFigma className="text-pink-500 w-5 h-5" /> },
    {
      name: "Photoshop",
      icon: <SiAdobephotoshop className="text-blue-500 w-5 h-5" />,
    },
    { name: "Sketch", icon: <SiSketch className="text-yellow-500 w-5 h-5" /> },
  ],
  "Marketing & Growth": [
    {
      name: "Google Analytics",
      icon: <SiGoogleanalytics className="text-orange-400 w-5 h-5" />,
    },
    {
      name: "SEO (Semrush)",
      icon: <SiSemrush className="text-orange-500 w-5 h-5" />,
    },
    {
      name: "Google Ads",
      icon: <SiGoogleads className="text-blue-400 w-5 h-5" />,
    },
    { name: "Meta Ads", icon: <SiMeta className="text-blue-600 w-5 h-5" /> },
    {
      name: "Mailchimp",
      icon: <SiMailchimp className="text-yellow-500 w-5 h-5" />,
    },
    {
      name: "HubSpot (CRM)",
      icon: <SiHubspot className="text-orange-600 w-5 h-5" />,
    },
  ],
  "AI & Machine Learning": [
    { name: "OpenAI GPT", icon: <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">🤖</div> },
    { name: "Google Gemini", icon: <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "Claude AI", icon: <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🧠</div> },
    { name: "LangChain", icon: <div className="w-5 h-5 bg-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">🔗</div> },
    { name: "AI Integration", icon: <div className="w-5 h-5 bg-indigo-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
    { name: "Vector Databases", icon: <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
  ],
  "Testing & Quality": [
    { name: "Jest", icon: <SiJest className="text-red-500 w-5 h-5" /> },
    { name: "Cypress", icon: <SiCypress className="text-green-600 w-5 h-5" /> },
    { name: "React Testing Library", icon: <div className="w-5 h-5 bg-red-400 rounded-sm flex items-center justify-center text-white text-xs font-bold">🧪</div> },
    { name: "Playwright", icon: <div className="w-5 h-5 bg-green-700 rounded-sm flex items-center justify-center text-white text-xs font-bold">🎭</div> },
    { name: "Unit Testing", icon: <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">✓</div> },
    { name: "E2E Testing", icon: <div className="w-5 h-5 bg-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold"></div> },
  ],
};

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
          content="https://karthiknish.com/images/og-image.jpg" // Consider updating OG image
        />
        <link rel="canonical" href="https://karthiknish.com/about" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-800 pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-200/15 to-purple-200/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-88 h-88 bg-gradient-to-tr from-emerald-200/15 to-green-200/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-rose-200/15 to-pink-200/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <FadeIn>
            <div className="container mx-auto px-4 max-w-5xl relative z-10">
              {/* Intro Section */}
              <section className="mb-16 md:mb-24 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight tracking-tight"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    About Me
                  </span>
                  <motion.span
                    animate={{
                      rotate: [0, 20, -20, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="inline-block ml-4 text-yellow-400"
                  >
                    
                  </motion.span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-8 shadow-lg"
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-xl"
                  >
                    
                  </motion.span>
                  <span>Hey there! Let me tell you my story</span>
                  <span className="text-xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium mb-8"
                >
                  I create{" "}
                  <motion.span
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                    whileHover={{ scale: 1.05 }}
                  >
                    magical digital experiences
                  </motion.span>{" "}
                  that work everywhere — from stunning web applications to native-quality mobile apps, transforming ideas into cross-platform solutions that drive real business growth.
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block ml-2"
                  >
                    
                  </motion.span>
                </motion.p>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-200" />

              {/* My Philosophy Section */}
              <section className="mb-16 md:mb-24 bg-gradient-to-br from-white to-purple-50 py-20 px-8 rounded-3xl">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-black text-center text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    
                  </motion.span>
                  My Approach
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="text-4xl"
                  >
                    
                  </motion.span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium text-center mb-16"
                >
                  Building the future with passion, precision, and a touch of magic
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: <FaUserCog className="w-8 h-8 text-blue-400" />,
                      title: "User-Centric Solutions",
                      desc: "Building intuitive interfaces focused on delivering seamless user experiences.",
                    },
                    {
                      icon: <FaMobileAlt className="w-8 h-8 text-pink-400" />,
                      title: "Cross-Platform Excellence",
                      desc: "Creating seamless experiences across web and mobile platforms with React and React Native.",
                    },
                    {
                      icon: (
                        <FaCodeBranch className="w-8 h-8 text-emerald-400" />
                      ),
                      title: "Scalable Architecture",
                      desc: "Designing robust, maintainable systems that can grow with your business needs.",
                    },
                    {
                      icon: <FaRocket className="w-8 h-8 text-purple-400" />,
                      title: "Performance Driven",
                      desc: "Optimizing for speed and efficiency across the entire application stack.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-purple-200 shadow-lg hover:shadow-2xl text-center transition-all duration-300 group"
                    >
                      <motion.div
                        className="inline-block p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3
                        className="text-2xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-200" />

              {/* Skills Section - Redesigned */}
              <section className="mb-16 md:mb-24 bg-gradient-to-br from-blue-50 to-cyan-50 py-20 px-8 rounded-3xl">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-black text-center text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    
                  </motion.span>
                  My magical toolkit
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-4xl"
                  >
                    ⚛️
                  </motion.span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium text-center mb-16"
                >
                  Technologies and tools that power innovation
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {Object.entries(skillsByCategory).map(
                    ([category, skills]) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3
                          className="text-2xl font-bold text-purple-600 mb-6 pb-3 border-b-2 border-gradient-to-r from-purple-300 to-blue-300"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {category}
                        </h3>
                        <ul className="space-y-3">
                          {skills.map((skill) => (
                            <motion.li
                              key={skill.name}
                              className="flex items-center gap-4 text-gray-700 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-white/50"
                              whileHover={{ scale: 1.05, x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="flex-shrink-0 p-2 bg-white/80 rounded-lg shadow-sm">
                                {React.cloneElement(skill.icon)}
                              </span>
                              <span className="text-base font-medium">{skill.name}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  )}
                </div>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-200" />

              {/* Journey & CTA */}
              <section className="text-center bg-gradient-to-br from-purple-600 to-blue-600 py-20 px-8 rounded-3xl text-white relative overflow-hidden">
                {/* Floating Elements */}
                <motion.div
                  className="absolute top-10 left-10 text-4xl opacity-30"
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  
                </motion.div>
                <motion.div
                  className="absolute top-20 right-20 text-5xl opacity-20"
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-black mb-8 flex items-center justify-center gap-6 relative z-10"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-5xl"
                  >
                    
                  </motion.span>
                  My Journey
                  <motion.span
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 25, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="text-5xl"
                  >
                    
                  </motion.span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl text-purple-100 leading-relaxed max-w-3xl mx-auto mb-12 font-medium relative z-10"
                >
                  With over 5 years navigating the dynamic tech landscape, I've honed my skills across web and mobile development. From building cross-platform React Native apps to creating powerful web applications, I collaborate with innovative startups and established businesses, delivering solutions that truly resonate with user needs and business goals across all platforms.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10"
                >
                  <Link
                    href="/contact"
                    className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl border-0 transition-all duration-300"
                  >
                    <motion.span
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mr-3 text-2xl"
                    >
                      
                    </motion.span>
                    Let's create magic together
                  </Link>
                </motion.div>
              </section>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

export default About;
