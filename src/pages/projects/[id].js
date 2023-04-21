import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import MedblocksUI from "../../../public/medblocksui.png";
import Medblocks from "../../../public/medblocks.png";
import { motion } from "framer-motion";
import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaNode,
  FaBootstrap,
  FaPython,
  FaAngular,
  FaGitAlt,
} from "react-icons/fa";
import Head from "next/head";
import { DiJavascript1, DiDatabase, DiDocker } from "react-icons/di";
import { TbBrandNextjs } from "react-icons/tb";
import {
  SiTailwindcss,
  SiAdobeillustrator,
  SiWebcomponentsdotorg,
  SiAdobephotoshop,
  SiAdobexd,
  SiAdobedreamweaver,
  SiTestinglibrary,
  SiMysql,
  SiGoogleanalytics,
  SiTableau,
  SiMicrosoftexcel,
  SiFigma,
  SiGatsby,
  SiRedux,
  SiVite,
  SiPostgresql,
  SiMongodb,
  SiJupyter,
  SiSvelte,
  SiTypescript,
} from "react-icons/si";
function Id() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);

  // Dummy data for demonstration purposes
  const projectsData = [
    {
      id: "medblocks",
      title: "Medblocks",
      description:
        "Medblocks provides healthcare developers with a cutting-edge platform for creating modern healthcare applications using vendor-neutral APIs, enabling them to develop clinical decision support and consolidated clinical knowledge apps that can be easily installed. The platform offers a comprehensive ecosystem for data migration and analytics, and features the user-friendly Medblocks UI, an open-source openEHR form builder that streamlines clinical workflows. It also supports the latest industry standards in terminology, and boasts seamless data operations through the use of Nifi on Apache Kafka. With a reputation for delivering excellent care, Medblocks is the go-to operating system for healthcare apps, trusted by a diverse range of organizations.",
      image: Medblocks,
      link: "https://medblocks.org/",
      techStack: [
        { icon: FaReact, name: "React" },
        { icon: DiJavascript1, name: "JavaScript" },
        { icon: DiDatabase, name: "Database" },
      ],
    },
    {
      id: "medblocksui",
      title: "Medblocks UI",
      description:
        "Medblocks UI is a powerful tool for healthcare application developers, consisting of a set of web components designed for capturing data. It enables developers to easily convert openEHR templates into web components, and offers experimental support for FHIR Resources. The components are built according to web components standards using Lit, and are published as ES modules in adherence with open-wc guidelines. Developers can customize the set of default UI components, which are available for each data type, by adjusting CSS variables. The most important component in the collection is the mb-form component, which can generate structured openEHR or FHIR compositions, helping developers to streamline their workflows. Medblocks UI can be imported as a custom element in any framework that supports web components.",
      image: MedblocksUI,
      link: "https://medblocks-ui.vercel.app/?path=/story/introduction--page",
      techStack: [
        { icon: SiSvelte, name: "Svelte" },
        { icon: SiTypescript, name: "TypeScript" },
        { icon: SiWebcomponentsdotorg, name: "Web Components" },
        { icon: SiTestinglibrary, name: "Web Test Runner" },
      ],
    },
  ];
  const techStackVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.2 } }),
  };
  const tooltipVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  useEffect(() => {
    if (id) {
      const project = projectsData.find((p) => p.id === id);
      setProject(project);
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>
          {project?.title + " // karthik nishanth." || "My project"}
        </title>
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col justify-center"
      >
        {project ? (
          <>
            <h2 className="text-4xl font-bold font-mono">{project.title}</h2>
            <Image
              onClick={() => window.open(project.link)}
              src={project.image}
              alt={project.title}
              className="w-full max-h-96 object-contain cursor-pointer"
              layout="responsive"
            />
            <p className="font-display p-4">{project.description}</p>
            <h3 className="text-2xl">Tech Stack:</h3>
            <ul className="flex flex-wrap gap-4 mt-2">
              {project.techStack.map((tech, index) => (
                <motion.li
                  className="text-2xl relative"
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.2 }}
                  variants={techStackVariants}
                >
                  <tech.icon className="text-2xl" title={tech.name} />
                  <motion.span
                    className="absolute bg-white text-black text-xs rounded p-1 -bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity pointer-events-none"
                    initial="hidden"
                    animate={tooltipVariants.hidden}
                    whileHover={tooltipVariants.visible}
                  >
                    {tech.name}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </motion.div>
    </>
  );
}

export default Id;
