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
    { name: "Next.js", icon: <SiNextdotjs className="text-white w-5 h-5" /> },
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
  Backend: [
    { name: "Node.js", icon: <FaNodeJs className="text-green-500 w-5 h-5" /> },
    { name: "Express.js", icon: <SiExpress className="text-white w-5 h-5" /> },
    { name: "Python", icon: <FaPython className="text-yellow-400 w-5 h-5" /> },
    { name: "GraphQL", icon: <SiGraphql className="text-pink-500 w-5 h-5" /> },
    {
      name: "RESTful APIs",
      icon: <TbApi className="text-orange-400 w-5 h-5" />,
    },
  ],
  Databases: [
    { name: "MongoDB", icon: <SiMongodb className="text-green-600 w-5 h-5" /> },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql className="text-blue-600 w-5 h-5" />,
    },
    {
      name: "SQL & NoSQL",
      icon: <FaDatabase className="text-purple-400 w-5 h-5" />,
    },
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
    { name: "Vercel", icon: <SiVercel className="text-white w-5 h-5" /> },
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
};

function About() {
  return (
    <>
      <Head>
        <title>About Me - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Learn more about Karthik Nishanth, a freelance Full Stack Developer based in Liverpool, UK, specializing in React, Node.js, and creating high-impact web solutions."
        />
        <meta
          property="og:title"
          content="About Me - Karthik Nishanth | Full Stack Developer"
        />
        <meta
          property="og:description"
          content="Full Stack Developer specializing in modern web technologies, based in Liverpool. Expertise in React, Node.js, and cloud technologies."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/about" />
        <meta
          property="og:image"
          content="https://karthiknish.com/images/og-image.jpg" // Consider updating OG image
        />
        <link rel="canonical" href="https://karthiknish.com/about" />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-black text-white pt-24 pb-16 md:pt-32 md:pb-24">
          <FadeIn>
            <div className="container mx-auto px-4 max-w-5xl">
              {/* Intro Section */}
              <section className="mb-16 md:mb-24 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent font-calendas"
                >
                  About Me
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                >
                  Hello! I'm Karthik Nishanth, a passionate Full Stack Developer
                  based in Liverpool. I specialize in crafting elegant,
                  high-performance web applications that solve real-world
                  problems and drive business growth. With a blend of technical
                  expertise and creative thinking, I transform ideas into
                  impactful digital experiences.
                </motion.p>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-700/50" />

              {/* My Philosophy Section */}
              <section className="mb-16 md:mb-24">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-center text-white mb-10 font-calendas"
                >
                  My Approach
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <FaUserCog className="w-8 h-8 text-blue-400" />,
                      title: "User-Centric Solutions",
                      desc: "Building intuitive interfaces focused on delivering seamless user experiences.",
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center"
                    >
                      <div className="inline-block p-3 bg-gray-700/70 rounded-full mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-700/50" />

              {/* Skills Section - Redesigned */}
              <section className="mb-16 md:mb-24">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-center text-white mb-10 font-calendas"
                >
                  Core Technologies & Skills
                </motion.h2>
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
                        <h3 className="text-xl font-semibold text-blue-300 mb-4 border-b border-blue-800/50 pb-2">
                          {category}
                        </h3>
                        <ul className="space-y-3">
                          {skills.map((skill) => (
                            <li
                              key={skill.name}
                              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                            >
                              <span className="flex-shrink-0">
                                {React.cloneElement(skill.icon)}
                              </span>
                              <span className="text-sm">{skill.name}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  )}
                </div>
              </section>

              <Separator className="my-12 md:my-16 bg-gray-700/50" />

              {/* Journey & CTA */}
              <section className="text-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-6 font-calendas"
                >
                  My Journey
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8"
                >
                  With over 5 years navigating the dynamic tech landscape, I've
                  honed my skills across the full development stack. From
                  collaborating with innovative startups to enhancing systems
                  for established businesses, my focus remains on delivering
                  value, quality, and solutions that truly resonate with user
                  needs and business goals.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors text-lg"
                  >
                    Let's Build Something Great →
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
