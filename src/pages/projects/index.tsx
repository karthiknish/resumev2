// Converted to TypeScript - migrated
"use client";
import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsDataForComponents";
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
              A detailed overview of the projects I've worked on, showcasing technical expertise and business impact across various industries.
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
          <div className="space-y-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-heading font-semibold text-slate-900 mb-3">
                      {project.title}
                    </h3>
                    
                    {project.meta && (
                      <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">
                        {project.meta}
                      </p>
                    )}

                    <p className="text-base text-slate-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.challenges && (
                    <div className="border-l-4 border-red-200 pl-6">
                      <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">Challenges</h4>
                      <ul className="space-y-2">
                        {project.challenges.slice(0, 3).map((challenge, i) => (
                          <li key={i} className="text-slate-600 text-sm">• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions && (
                    <div className="border-l-4 border-blue-200 pl-6">
                      <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">Solutions</h4>
                      <ul className="space-y-2">
                        {project.solutions.slice(0, 3).map((solution, i) => (
                          <li key={i} className="text-slate-600 text-sm">• {solution}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.results && (
                    <div className="border-l-4 border-green-200 pl-6">
                      <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">Results</h4>
                      <ul className="space-y-2">
                        {project.results.slice(0, 3).map((result, i) => (
                          <li key={i} className="text-slate-600 text-sm">• {result}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech, i) => (
                        <Badge
                          key={i}
                          className="bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;

