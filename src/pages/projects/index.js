"use client";
import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Router from "next/router";
import { projectsData } from "../../lib/projectsData";
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
      <div className="min-h-screen bg-black/95 p-8 relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-black/60 backdrop-blur-sm p-6">
            <div className="flex justify-center my-4">
              <motion.button
                initial={{ x: 10 }}
                animate={{ x: 0 }}
                whileTap={{ y: 10 }}
                className={`${
                  selectedTab === "fullstack"
                    ? "bg-blue-500 text-white font-semibold"
                    : "bg-gray-800 text-gray-300"
                } py-2 px-6 rounded-l transition-colors`}
                onClick={() => setSelectedTab("fullstack")}
              >
                Full Stack
              </motion.button>
              <motion.button
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                whileTap={{ y: 10 }}
                className={`${
                  selectedTab === "analytics"
                    ? "bg-blue-500 text-white font-semibold"
                    : "bg-gray-800 text-gray-300"
                } py-2 px-6 rounded-r transition-colors`}
                onClick={() => setSelectedTab("analytics")}
              >
                Analytics
              </motion.button>
            </div>
            <div className="flex flex-col gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-black/60 backdrop-blur-sm border border-gray-800 gap-4 shadow-md cursor-pointer rounded-lg p-6 hover:border-blue-500 transition-all grid md:grid-flow-col items-center w-full"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ duration: 0.5 }}
                  // Removed onClick from the main div
                >
                  <Image
                    className="md:h-48 h-full object-contain mb-4 md:mb-0 md:mr-6 rounded-md" // Adjusted styling
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={300}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="flex flex-col w-full justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-white">
                        {project.title}
                      </h3>
                      {/* Display Meta/Key Result */}
                      {project.meta && (
                        <p className="text-sm text-blue-400 font-medium mb-2">
                          {project.meta}
                        </p>
                      )}
                      <p className="text-gray-300 mb-4 text-sm">
                        {project.shortdescription}
                      </p>
                      {/* Display Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.techStack?.slice(0, 4).map(
                          (
                            tech,
                            i // Show first 4 tags
                          ) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech.name}
                            </Badge>
                          )
                        )}
                        {project.techStack?.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            ...
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* View Case Study Button */}
                    <Link href={project.link} passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-auto self-start border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                      >
                        View Case Study →
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
