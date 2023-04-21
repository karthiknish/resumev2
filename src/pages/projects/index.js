import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Router from "next/router";
import { projectsData } from "../../lib/projectsData";
import Image from "next/image";
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
        <title>projects // karthik nishanth.</title>
      </Head>
      <div className="container mx-auto px-4">
        <div className="flex justify-center my-4">
          <motion.button
            initial={{ x: 10 }}
            animate={{ x: 0 }}
            whileTap={{ y: 10 }}
            className={`${
              selectedTab === "fullstack"
                ? "bg-gradient-to-r from-yellow-400 to-pink-700 text-white font-semibold font-display"
                : "bg-gray-200 text-gray-600 font-display"
            } py-2 px-4 rounded-l`}
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
                ? "bg-gradient-to-r from-yellow-400 to-pink-700 text-white font-semibold font-display"
                : "bg-gray-200 text-gray-600 font-display"
            } py-2 px-4 rounded-r`}
            onClick={() => setSelectedTab("analytics")}
          >
            Analytics
          </motion.button>
        </div>
        <div className="flex flex-col gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 gap-4 shadow-md cursor-pointer rounded p-4 hover:shadow-lg transition-shadow grid md:grid-flow-col items-center w-full duration-300"
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
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.shortdescription}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
