import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsData";
function Id() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);

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
            <h2 className="text-4xl font-bold font-mono mb-2">
              {project.title}
            </h2>
            <Image
              onClick={() => window.open(project.extlink)}
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
