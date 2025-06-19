import Head from "next/head";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  SparklesIcon,
  CheckCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  RocketLaunchIcon,
  StarIcon,
  PlayIcon,
  LightBulbIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import JsonLd, {
  createWebsiteSchema,
  createPersonSchema,
} from "@/components/JsonLd";

const technologies = [
  {
    name: "React",
    icon: "⚛️",
    category: "Frontend",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    name: "React Native",
    icon: "📱",
    category: "Mobile",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    name: "Next.js",
    icon: "▲",
    category: "Framework",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  {
    name: "TypeScript",
    icon: "🔷",
    category: "Language",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    name: "Node.js",
    icon: "🟢",
    category: "Backend",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    name: "Python",
    icon: "🐍",
    category: "Language",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    name: "AWS",
    icon: "☁️",
    category: "Cloud",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    name: "Docker",
    icon: "🐳",
    category: "DevOps",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
];

const capabilities = [
  {
    icon: "🎨✨",
    title: "Beautiful Interfaces",
    description:
      "Crafting pixel-perfect user experiences that users love to interact with",
    cartoon: "👩‍🎨🖼️",
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  },
  {
    icon: "📱🌟",
    title: "Cross-Platform Apps",
    description:
      "Building native-quality mobile apps that work seamlessly across iOS and Android",
    cartoon: "📲🔄📲",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    icon: "⚡🚄",
    title: "High Performance",
    description:
      "Optimizing applications for speed, efficiency, and scalability at enterprise level",
    cartoon: "🏃‍♂️💨⚡",
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
  {
    icon: "🔧🎯",
    title: "Custom Solutions",
    description:
      "Developing tailored software solutions that perfectly fit your business needs",
    cartoon: "🛠️✂️📐",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    icon: "☁️🌈",
    title: "Cloud Infrastructure",
    description:
      "Setting up robust, scalable cloud environments that grow with your business",
    cartoon: "🏗️☁️🌍",
    color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  },
  {
    icon: "🚀⭐",
    title: "Rapid Development",
    description:
      "Delivering high-quality products quickly using modern development practices",
    cartoon: "👨‍💻💻⚡",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
];

const projects = [
  {
    title: "E-commerce Platform",
    description:
      "A complete e-commerce solution built with React and Node.js, featuring real-time inventory, payment processing, and admin dashboard.",
    image: "/netflix.png",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "/projects/ecommerce-solutions",
    color: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    title: "Banking Mobile App",
    description:
      "Cross-platform mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management.",
    image: "/credcard.png",
    tech: ["React Native", "TypeScript", "AWS", "Firebase"],
    link: "/projects/mobile-app-development",
    color: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time data visualization platform with interactive charts, custom reporting, and advanced filtering capabilities.",
    image: "/medblocks.png",
    tech: ["Next.js", "D3.js", "PostgreSQL", "Redis"],
    link: "/projects/analytics-system",
    color: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    content:
      "Karthik delivered our mobile app ahead of schedule. The quality was exceptional and the user experience is exactly what we envisioned.",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content:
      "Working with Karthik transformed our idea into a production-ready platform. His cross-platform expertise saved us months of development time.",
    rating: 5,
    avatar: "👨‍💻",
  },
  {
    name: "Emma Davis",
    role: "CTO at InnovateLab",
    content:
      "The cloud infrastructure Karthik built for us has been rock-solid. Zero downtime and scales beautifully with our growing user base.",
    rating: 5,
    avatar: "👩‍🔬",
  },
];

const HomeScreen = () => {
  const websiteSchema = createWebsiteSchema();
  const personSchema = createPersonSchema();

  return (
    <>
      <Head>
        <title>
          Karthik Nishanth - Cross Platform Developer | Liverpool, UK
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Cross platform developer specializing in web and mobile applications. Building modern, scalable solutions with React, React Native, and cloud technologies."
        />
        <meta
          name="keywords"
          content="Cross Platform Developer, Mobile App Development, Web Development, React, React Native, Node.js, TypeScript, Liverpool, UK"
        />
        <meta name="author" content="Karthik Nishanth" />
        <link rel="canonical" href="https://karthiknish.com/" />

        <meta
          property="og:title"
          content="Karthik Nishanth - Cross Platform Developer | Liverpool, UK"
        />
        <meta
          property="og:description"
          content="Cross platform developer creating modern, scalable web and mobile solutions for businesses."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta property="og:image" content="https://karthiknish.com/Logo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Karthik Nishanth - Cross Platform Developer"
        />
        <meta
          name="twitter:description"
          content="Cross platform developer creating modern, scalable web and mobile solutions for businesses."
        />

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

        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
      </Head>

      <div
        className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Hero Section */}
        <section className="relative py-28 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          {/* Animated Background Blobs */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          {/* Floating Tech Icons */}
          <motion.div
            className="absolute top-32 left-32 text-6xl opacity-70"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            💻
          </motion.div>
          <motion.div
            className="absolute top-20 right-40 text-5xl opacity-60"
            animate={{
              y: [0, 20, 0],
              x: [0, 15, 0],
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            🚀
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-40 text-4xl opacity-50"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            ⚛️
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-32 text-5xl opacity-60"
            animate={{
              scale: [1, 1.3, 1],
              y: [0, -15, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            📱
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-20 text-3xl opacity-40"
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-20 text-4xl opacity-50"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, -20, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            🎨
          </motion.div>

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            {/* Animated Introduction */}
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
                👋
              </motion.span>
              <span>Hey there! I'm Karthik</span>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Available for work
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-300"
              >
                <span className="mr-1">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                Liverpool, UK
              </Badge>
            </motion.div>

            {/* Main Headline with Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Cross Platform
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Developer
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
                ⚡
              </motion.span>
            </motion.h1>

            {/* Dynamic Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              I create{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                whileHover={{ scale: 1.05 }}
              >
                magical digital experiences
              </motion.span>{" "}
              that work everywhere — from web to mobile,
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block ml-2"
              >
                ✨
              </motion.span>
            </motion.p>

            {/* Fun tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-gray-600 mb-12 flex items-center justify-center gap-3"
            >
              <span>Building the future, one pixel at a time</span>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-2xl"
              >
                🎯
              </motion.span>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 border-0"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mr-3 text-2xl"
                  >
                    🚀
                  </motion.span>
                  Let's build something amazing
                  <ArrowRightIcon className="ml-3 h-6 w-6" />
                </Button>
              </Link>

              <Link href="#work">
                <Button
                  size="lg"
                  className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 px-10 py-5 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mr-3 text-2xl"
                  >
                    👀
                  </motion.span>
                  See my magic in action
                </Button>
              </Link>
            </motion.div>

            {/* Enhanced Technology Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center"
            >
              <p className="text-gray-600 text-lg mb-6 font-medium">
                My magical toolkit includes:
              </p>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      className={`px-6 py-3 text-base font-semibold rounded-2xl border-2 transition-all duration-300 cursor-pointer ${tech.color}`}
                    >
                      <span className="mr-3 text-xl">{tech.icon}</span>
                      {tech.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-4xl"
              >
                👇
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-white to-purple-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
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
                    🔮
                  </motion.span>
                  What I can create for you
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
                    💫
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  From wild ideas to polished products — I bring your vision to
                  life
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card
                    className={`h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl ${capability.color}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <motion.div
                        className="text-5xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {capability.icon}
                      </motion.div>
                      <motion.div
                        className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {capability.cartoon}
                      </motion.div>
                    </div>
                    <h3
                      className="text-2xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {capability.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {capability.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section
          id="work"
          className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-cyan-50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
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
                    🎨
                  </motion.span>
                  My featured work
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-4xl"
                  >
                    ⭐
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Recent projects that showcase the magic of modern development
                </p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.03 }}
                >
                  <Link href={project.link}>
                    <Card
                      className={`h-full overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer rounded-3xl ${project.color}`}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-8">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {project.title}
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.tech.map((tech) => (
                            <Badge
                              key={tech}
                              className="bg-white/80 text-gray-700 border border-gray-200 text-sm px-3 py-1 font-medium"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/projects">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl border-0"
                >
                  View all my creations
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    💬
                  </motion.span>
                  Kind words from happy clients
                  <motion.span
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="text-4xl"
                  >
                    😊
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Here's what amazing people say about working with me
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full p-8 border-2 border-pink-200 shadow-lg hover:shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{testimonial.avatar}</div>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg italic font-medium">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div
                        className="font-bold text-gray-900 text-lg"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {testimonial.role}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Freelancer Advantage Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    💼
                  </motion.span>
                  Why Choose a Freelancer?
                  <motion.span
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 15, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="text-4xl"
                  >
                    💡
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Discover the advantages of working directly with talent
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-green-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    💰
                  </motion.div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Save 40-60%
                  </h3>
                  <p className="text-gray-700 text-lg">
                    No agency markup or overhead costs. Get premium quality at freelance prices.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-6"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    ⚡
                  </motion.div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    2x Faster
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Direct communication and streamlined processes mean faster delivery.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    🎯
                  </motion.div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Personal Touch
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Your project gets dedicated attention, not split focus across dozens of clients.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <Link href="/freelancer-advantage">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 border-0"
                >
                  <motion.span
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mr-3 text-2xl"
                  >
                    🚀
                  </motion.span>
                  Learn Why Freelancers Win
                  <ArrowRightIcon className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
          {/* Floating Elements */}
          <motion.div
            className="absolute top-10 left-10 text-4xl opacity-30"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🌟
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
            🎯
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-20 text-3xl opacity-25"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            ✨
          </motion.div>

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-5xl md:text-6xl font-black text-white mb-8 flex items-center justify-center gap-6"
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
                  🚀
                </motion.span>
                Ready for some magic?
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
                  🎉
                </motion.span>
              </h2>
              <p className="text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                Let's turn your wildest ideas into stunning reality. I promise
                it'll be more fun than you expect!
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl border-0"
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
                      💌
                    </motion.span>
                    Let's create magic together
                  </Button>
                </Link>

                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300"
                  >
                    <HeartIcon className="mr-3 h-6 w-6" />
                    Explore my services
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;