"use client";
import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsDataForComponents";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="min-h-screen bg-slate-100 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-slate-900 mb-4"
            >
              Projects
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
              A curated set of case studies that highlight the products, data platforms, and services I build for startups and scale-ups.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wide">
                  Category
                </span>
              </div>
              
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    selectedTab === "fullstack"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  } py-2.5 px-5 rounded-lg transition-all duration-300 text-sm font-medium`}
                  onClick={() => setSelectedTab("fullstack")}
                >
                  Full Stack
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    selectedTab === "analytics"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  } py-2.5 px-5 rounded-lg transition-all duration-300 text-sm font-medium`}
                  onClick={() => setSelectedTab("analytics")}
                >
                  Analytics
                </motion.button>
              </div>
            </div>
          </motion.div>
          {/* Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
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
                  <Card className="h-full bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <h3
                        className="text-xl font-heading font-semibold text-slate-900 mb-3"
                      >
                        {project.title}
                      </h3>
                      
                      {project.meta && (
                        <p className="text-sm font-medium text-slate-500 mb-3">
                          {project.meta}
                        </p>
                      )}

                      <p className="text-sm text-slate-600 mb-5 line-clamp-3">
                        {project.shortdescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack?.slice(0, 4).map((tech, i) => (
                          <Badge
                            key={i}
                            className="bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                        {project.techStack?.length > 4 && (
                          <Badge variant="outline" className="text-slate-500 border-slate-200">
                            +{project.techStack.length - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        View case study
                        <span aria-hidden="true">→</span>
                      </div>
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
