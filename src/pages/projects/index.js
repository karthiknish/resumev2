"use client";
import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Router from "next/router";
import { projectsData } from "../../lib/projectsData";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";

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
                  onClick={() => Router.push(project.link)}
                >
                  <Image
                    className="md:h-48 h-full object-contain mb-4 mr-4"
                    src={project.image}
                    alt={project.title}
                  />
                  <div className="flex flex-col w-full">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-300">{project.shortdescription}</p>
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
