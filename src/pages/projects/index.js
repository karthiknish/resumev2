"use client";
import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Router from "next/router";
import { projectsData } from "../../lib/projectsDataForComponents";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Assuming Button component exists

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("fullstack");
  const filteredProjects = projectsData.filter(
    (project) => project.category === selectedTab
  );

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <Head>
        <title>Projects - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of full-stack and analytics projects by Karthik Nishanth"
        />
      </Head>
      <div 
        className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24 md:py-32 relative overflow-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Decorative Color Splashes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
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
              <span>Explore my work</span>
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="text-xl"
              >
                💼
              </motion.span>
            </motion.div>
            
            <h1
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                My Projects
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
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium px-4">
              A collection of{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                whileHover={{ scale: 1.05 }}
              >
                innovative solutions
              </motion.span>{" "}
              and digital experiences I've crafted
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
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-purple-200 mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-semibold text-lg whitespace-nowrap">
                   Category:
                </span>
              </div>
              
              <div className="flex bg-gray-100 rounded-2xl p-1 border-2 border-purple-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    selectedTab === "fullstack"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  } py-3 px-6 rounded-xl transition-all duration-300 text-base font-semibold`}
                  onClick={() => setSelectedTab("fullstack")}
                >
                  <span className="mr-2"></span>
                  Full Stack
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    selectedTab === "analytics"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  } py-3 px-6 rounded-xl transition-all duration-300 text-base font-semibold`}
                  onClick={() => setSelectedTab("analytics")}
                >
                  <span className="mr-2"></span>
                  Analytics
                </motion.button>
              </div>
            </div>
          </motion.div>
          {/* Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={project.link}>
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-3xl shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Project Status Badge */}
                      <motion.span
                        className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10"
                        whileHover={{ scale: 1.1 }}
                      >
                        {selectedTab === "fullstack" ? " Full Stack" : " Analytics"}
                      </motion.span>
                    </div>
                    
                    <div className="p-8">
                      <h3
                        className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300 leading-tight"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {project.title}
                      </h3>
                      
                      {/* Key Result */}
                      {project.meta && (
                        <div className="flex items-center gap-2 mb-4">
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-lg"
                          >
                            
                          </motion.span>
                          <span className="text-purple-600 font-bold text-lg">
                            {project.meta}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-6 line-clamp-3 text-base leading-relaxed">
                        {project.shortdescription}
                      </p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack?.slice(0, 4).map((tech, i) => (
                          <Badge
                            key={i}
                            className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                        {project.techStack?.length > 4 && (
                          <Badge variant="outline" className="text-purple-600 border-purple-300">
                            +{project.techStack.length - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <motion.div
                        className="mt-4 inline-flex items-center gap-2 text-purple-600 font-bold text-lg group-hover:text-blue-600 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        View Case Study
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
