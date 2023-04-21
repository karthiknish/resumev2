import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Router from "next/router";
import Medblocks from "../../../public/medblocks.png";
import MedblocksUI from "../../../public/medblocksui.png";
import Covergenerator from "../../../public/covergenerator.png";
import InitioSol from "../../../public/initiosol.png";
import Acaa from "../../../public/acaa.png";
import Dreamedcons from "../../../public/dreamedcons.png";
import Image from "next/image";
const Index = () => {
  const [selectedTab, setSelectedTab] = useState("fullstack");

  const projectsData = [
    {
      title: "Medblocks",
      description:
        "Medblocks is a platform for building modern healthcare applications using industry-standard vendor-neutral APIs, allowing developers to create installable apps for clinical decision support and consolidated clinical knowledge. ",
      image: Medblocks,
      category: "fullstack",
      link: "/projects/medblocks",
    },
    {
      title: "MedblocksUI",
      description:
        "Medblocks UI is a set of web components for data capture in healthcare applications. It allows developers to convert openEHR templates into web components and provides experimental support for FHIR Resources. ",
      image: MedblocksUI,
      category: "fullstack",
      link: "/projects/medblocksui",
    },
    {
      title: "Cover Letter Generator",
      description:
        "The cover letter generator is a software tool that takes in the role and company information provided by the user and generates a personalized cover letter in PDF format using openAI and Google. The generator is designed to create a professional cover letter that highlights the user's skills and experience, helping them to stand out in the job market.",
      image: Covergenerator,
      category: "fullstack",
      link: "/projects/covergenerator",
    },
    {
      title: "Initio Solutions",
      description:
        "Initio Solutions is a technology pioneer that specializes in web and app solutions designed to transform new concepts into driving forces for businesses. With expertise in web development, app development, SEO, social media marketing, content writing, cloud and data management, data entry, and graphic design.",
      image: InitioSol,
      category: "fullstack",
      link: "/projects/initiosolutions",
    },
    {
      title: "ACAA",
      description:
        "The Afghanistan and Central Asian Association (ACAA) is a charity that supports Afghans and Central Asians living away from their homeland, helping them to live and prosper in the UK with their wide range of services includes language classes, employment workshops, women`s support groups. ",
      image: Acaa,
      category: "fullstack",
      link: "/projects/acaa",
    },
    {
      title: "Dreamed Consultancy",
      description:
        "Dream Education is an education consultancy that empowers students to achieve their full potential through personalized guidance and expert support in navigating the complex world of education.",
      image: Dreamedcons,
      category: "fullstack",
      link: "/projects/dreamedconsultancy",
    },
    {
      title: "Analytics Project 1",
      description: "A short description of Analytics Project 1.",
      image: "https://via.placeholder.com/150",
      category: "analytics",
      link: "/projects/analytics/1",
    },
  ];

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
                <p className="text-gray-600">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
