import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaDocker,
  FaAws,
  FaLinux,
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
  SiAdobexd,
  SiGoogleanalytics,
  SiMailchimp,
  SiHubspot,
  SiGoogleads,
  SiMeta,
  SiSemrush,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiSketch,
  SiInvision,
  SiGitlab,
} from "react-icons/si";
import { TbBrandNextjs, TbApi } from "react-icons/tb";
import { FadeIn, HoverCard } from "../components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";

function About() {
  const Skill = ({ title, Icon, color }) => (
    <HoverCard>
      <div className="flex flex-col items-center bg-black bg-opacity-50 p-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-opacity-70 hover:shadow-blue-500/20">
        <p className="mb-3 text-lg font-bold">{title}</p>
        <Icon className="text-5xl" style={{ color }} />
      </div>
    </HoverCard>
  );

  const frontendSkills = [
    { title: "React.js", Icon: FaReact, color: "#5BD3F3" },
    { title: "Next.js", Icon: TbBrandNextjs, color: "#FFFFFF" },
    { title: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
    { title: "Tailwind CSS", Icon: SiTailwindcss, color: "#38B2AC" },
    { title: "HTML5", Icon: SiHtml5, color: "#DD4B25" },
    { title: "CSS3", Icon: SiCss3, color: "#3594CF" },
    { title: "JavaScript", Icon: SiJavascript, color: "#EFD81D" },
  ];

  const backendSkills = [
    { title: "Node.js", Icon: FaNodeJs, color: "#5B9853" },
    { title: "Express.js", Icon: SiExpress, color: "#FFFFFF" },
    { title: "MongoDB", Icon: SiMongodb, color: "#47A248" },
    { title: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
    { title: "GraphQL", Icon: SiGraphql, color: "#E535AB" },
    { title: "RESTful APIs", Icon: TbApi, color: "#EFD81D" },
  ];

  const devopsSkills = [
    { title: "Git", Icon: FaGithub, color: "#F05032" },
    { title: "Docker", Icon: FaDocker, color: "#2496ED" },
    { title: "AWS", Icon: FaAws, color: "#FF9900" },
    { title: "CI/CD", Icon: SiGitlab, color: "#FC6D26" },
    { title: "Linux", Icon: FaLinux, color: "#FCC624" },
    { title: "Vercel", Icon: SiVercel, color: "#FFFFFF" },
  ];

  const designSkills = [
    { title: "Figma", Icon: SiFigma, color: "#F76D60" },
    { title: "Adobe XD", Icon: SiAdobexd, color: "#F75EEE" },
    { title: "Photoshop", Icon: SiAdobephotoshop, color: "#31A8FF" },
    { title: "Illustrator", Icon: SiAdobeillustrator, color: "#FF9A00" },
    { title: "Sketch", Icon: SiSketch, color: "#F7B500" },
    { title: "InVision", Icon: SiInvision, color: "#FF3366" },
  ];

  const marketingSkills = [
    { title: "Analytics", Icon: SiGoogleanalytics, color: "#F8981D" },
    { title: "SEO", Icon: SiSemrush, color: "#F8981D" },
    { title: "Google Ads", Icon: SiGoogleads, color: "#4285F4" },
    { title: "Meta Ads", Icon: SiMeta, color: "#0668E1" },
    { title: "Email", Icon: SiMailchimp, color: "#FFE01B" },
    { title: "CRM", Icon: SiHubspot, color: "#FF7A59" },
  ];

  return (
    <>
      <Head>
        <title>About Me - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Full Stack Developer specializing in modern web technologies, based in Liverpool. Expertise in React, Node.js, and cloud technologies."
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="text-center mb-10">
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  About Me
                </h1>
                <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 transform hover:scale-[1.02] transition-all duration-300">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    Hello, I'm Karthik
                  </h2>
                  <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                    A passionate Full Stack Developer based in Liverpool,
                    dedicated to crafting elegant, efficient, and user-friendly
                    web applications that make a difference.
                  </p>
                  <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                    Currently freelancing and open to new opportunities, I
                    combine technical expertise with creative problem-solving to
                    deliver outstanding digital solutions.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    With over 5 years of experience, I've collaborated with
                    diverse clients across various industries, blending
                    technical excellence with a deep understanding of business
                    needs.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl shadow-2xl border border-blue-500/20">
                  <h2 className="text-2xl font-bold text-blue-400 mb-6">
                    What I Bring to the Table
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-300 text-lg">
                        Modern, responsive web applications with cutting-edge
                        technologies
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-300 text-lg">
                        End-to-end development from concept to deployment
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-300 text-lg">
                        Performance optimization and scalable architecture
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-300 text-lg">
                        User-centered design principles and accessibility
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="mb-8 text-white text-4xl font-bold border-b border-blue-500 pb-2 inline-block">
              Frontend Development
            </h2>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-gradient-to-br from-gray-900 to-black text-white p-6 gap-6 rounded-lg shadow-xl"
            >
              {frontendSkills.map((skill) => (
                <Skill key={skill.title} {...skill} />
              ))}
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="mt-16 text-white mb-8 text-4xl font-bold border-b border-blue-500 pb-2 inline-block">
              Backend Development
            </h2>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-gradient-to-br from-gray-900 to-black text-white p-6 gap-6 rounded-lg shadow-xl"
            >
              {backendSkills.map((skill) => (
                <Skill key={skill.title} {...skill} />
              ))}
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h2 className="mt-16 text-white mb-8 text-4xl font-bold border-b border-blue-500 pb-2 inline-block">
              DevOps & Tools
            </h2>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-gradient-to-br from-gray-900 to-black text-white p-6 gap-6 rounded-lg shadow-xl"
            >
              {devopsSkills.map((skill) => (
                <Skill key={skill.title} {...skill} />
              ))}
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <h2 className="mt-16 text-white mb-8 text-4xl font-bold border-b border-blue-500 pb-2 inline-block">
              Design & Other
            </h2>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-gradient-to-br from-gray-900 to-black text-white p-6 gap-6 rounded-lg shadow-xl"
            >
              {designSkills.map((skill) => (
                <Skill key={skill.title} {...skill} />
              ))}
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.7}>
            <h2 className="mt-16 text-white mb-8 text-4xl font-bold border-b border-blue-500 pb-2 inline-block">
              Marketing & Growth
            </h2>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-gradient-to-br from-gray-900 to-black text-white p-6 gap-6 rounded-lg shadow-xl"
            >
              {marketingSkills.map((skill) => (
                <Skill key={skill.title} {...skill} />
              ))}
            </motion.div>
            <div className="mt-8 bg-black bg-opacity-50 p-6 rounded-lg text-gray-300">
              <p>
                Beyond development, I help businesses grow their digital
                presence through strategic marketing initiatives. I leverage
                these tools to drive traffic, increase conversions, and build
                meaningful customer relationships.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="mt-16 bg-gradient-to-br from-blue-900 to-black p-8 rounded-lg shadow-xl">
              <h2 className="text-white text-3xl font-bold mb-4">
                Work Philosophy
              </h2>
              <p className="text-gray-300 mb-4">
                I believe in writing clean, maintainable code that scales. My
                development approach focuses on three core principles:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Performance First
                  </h4>
                  <p className="text-gray-300">
                    Optimizing for speed and efficiency at every level of the
                    application stack.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    User-Centered Design
                  </h4>
                  <p className="text-gray-300">
                    Creating intuitive interfaces that provide excellent user
                    experiences.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Future-Proof Solutions
                  </h4>
                  <p className="text-gray-300">
                    Building scalable applications that can grow with your
                    business.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={1.0}>
            <div className="mt-16 bg-black bg-opacity-50 p-8 rounded-lg shadow-xl">
              <h2 className="text-white text-3xl font-bold mb-4">
                Professional Journey
              </h2>
              <p className="text-gray-300">
                My journey in tech has been driven by continuous learning and
                adaptation to new technologies. I've worked with startups,
                established businesses, and everything in between, helping them
                achieve their digital transformation goals.
              </p>
              <p className="text-gray-300 mt-4">
                Whether it's building complex web applications, optimizing
                performance, or implementing robust backend systems, I bring a
                wealth of experience and a problem-solving mindset to every
                project.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={1.2}>
            <div className="mt-16 text-center space-y-4">
              <p className="text-xl text-gray-300">
                Ready to bring your project to life?
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
              >
                Let&apos;s Work Together →
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

export default About;
