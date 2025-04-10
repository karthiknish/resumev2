import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link"; // Import Link
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsData";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Import Button
import { MessageSquareQuote } from "lucide-react"; // Import Icon

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
                  {/* Display Meta/Key Result */}
                  {project.meta && (
                    <p className="text-lg text-blue-400 font-medium mb-4">
                      {project.meta}
                    </p>
                  )}
                  <Separator className="my-6 bg-gray-700" />

                  {/* --- Key Achievement Highlight --- */}
                  {project.meta && (
                    <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg mb-8 shadow-lg">
                      <h3 className="text-xl font-semibold text-blue-300 mb-2">
                        Key Achievement
                      </h3>
                      <p className="text-3xl font-bold text-white">
                        {project.meta}
                      </p>
                      {/* Optional: Add a subtitle if meta needs context */}
                      {/* <p className="text-sm text-blue-400 mt-1">Context for the achievement</p> */}
                    </div>
                  )}

                  <h3 className="text-2xl font-semibold text-blue-400 mb-3 mt-8">
                    Project Overview
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    {project.description}
                  </p>

                  {/* --- Challenges Section --- */}
                  {project.challenges && project.challenges.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                        Challenges Faced
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                        {project.challenges.map((challenge, i) => (
                          <li key={i}>{challenge}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* --- Solutions Section --- */}
                  {project.solutions && project.solutions.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                        Solutions Implemented
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                        {project.solutions.map((solution, i) => (
                          <li key={i}>{solution}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* --- Results Section --- */}
                  {project.results && project.results.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                        Key Results
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
                        {project.results.map((result, i) => (
                          <li key={i}>{result}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* --- Client Testimonial Section --- */}
                  {project.testimonial && (
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg my-12 shadow-md">
                      <MessageSquareQuote className="w-8 h-8 text-blue-400 mb-3" />
                      <h3 className="text-xl font-semibold text-blue-300 mb-2">
                        Client Feedback
                      </h3>
                      <blockquote className="text-gray-300 italic text-lg border-l-4 border-blue-500 pl-4">
                        "{project.testimonial.quote}"
                      </blockquote>
                      <p className="text-right text-gray-400 mt-3">
                        - {project.testimonial.author}
                      </p>
                    </div>
                  )}

                  {/* --- Action Buttons --- */}
                  <div className="mt-12 flex flex-wrap gap-4">
                    {project.extlink && (
                      <Button
                        variant="default" // Use Button component
                        size="lg"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => window.open(project.extlink)}
                      >
                        View Live Project →
                      </Button>
                    )}
                    <Link href="/contact" passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-green-600 text-green-400 hover:bg-green-900/30 hover:text-green-300"
                      >
                        Discuss Your Project →
                      </Button>
                    </Link>
                    <Link href="/projects" passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                      >
                        ← Back to Projects
                      </Button>
                    </Link>
                  </div>
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
