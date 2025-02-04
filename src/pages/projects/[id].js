import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsData";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
          {project?.title
            ? `${project.title} - Karthik Nishanth`
            : "Project - Karthik Nishanth"}
        </title>
        <meta
          name="description"
          content={project?.shortdescription || "Project details"}
        />
      </Head>
      <div className="min-h-screen bg-black/95 p-8 relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        {project ? (
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Left Column - Image */}
              <Card className="border-none bg-black/60 backdrop-blur-sm p-6 lg:sticky lg:top-8 h-fit">
                <div className="relative aspect-video">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-contain cursor-pointer rounded-lg hover:scale-105 transition-transform duration-300"
                    fill
                    onClick={() => window.open(project.extlink)}
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Tech Stack
                  </h3>
                  <ul className="flex flex-wrap gap-6 justify-center">
                    {project.techStack.map((tech, index) => (
                      <motion.li
                        className="relative group"
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.2 }}
                        variants={techStackVariants}
                      >
                        <tech.icon
                          className="text-3xl text-white/80 group-hover:text-white transition-colors"
                          title={tech.name}
                        />
                        <motion.span className="absolute bg-blue-500 text-white text-xs rounded-md px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          {tech.name}
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Right Column - Content */}
              <Card className="border-none bg-black/60 backdrop-blur-sm p-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {project.title}
                  </h2>
                  <Separator className="my-6 bg-gray-800" />
                  <div className="prose prose-lg prose-invert">
                    <p className="text-gray-300 text-xl leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <motion.button
                    className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(project.extlink)}
                  >
                    View Live Project →
                  </motion.button>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="text-2xl text-white animate-pulse">Loading...</div>
          </div>
        )}
      </div>
    </>
  );
}

export default Id;
