import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsDataForComponents";
import PageContainer from "@/components/PageContainer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote } from "lucide-react";

function Id() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);

  const techStackVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.2 } }),
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
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24 md:py-32 relative overflow-hidden"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-rose-200/15 to-pink-200/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-200/15 to-purple-200/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-88 h-88 bg-gradient-to-tr from-teal-200/15 to-green-200/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-76 h-76 bg-gradient-to-tl from-amber-200/15 to-orange-200/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <Link href="/projects" passHref legacyBehavior>
                <motion.a
                  className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-bold shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, -5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </motion.svg>
                  <span className="text-base sm:text-lg">Back to projects</span>
                </motion.a>
              </Link>
            </motion.div>

            {project ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Column - Image and Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl group">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        onClick={() => project.extlink && window.open(project.extlink)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Tech Stack Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 sm:p-8 rounded-3xl border-2 border-purple-200">
                      <h3
                        className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-2xl"
                        >
                          
                        </motion.span>
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Tech Stack
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {project.techStack?.map((tech, index) => (
                          <motion.div
                            key={index}
                            className="relative group"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.1, y: -5 }}
                            variants={techStackVariants}
                          >
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-purple-200 shadow-lg group-hover:shadow-xl group-hover:border-purple-300 transition-all duration-300">
                              <tech.icon
                                className="text-3xl sm:text-4xl text-purple-600 group-hover:text-blue-600 transition-colors mb-2"
                                title={tech.name}
                              />
                              <p className="text-sm font-semibold text-gray-700 text-center">
                                {tech.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-4xl sm:text-5xl"
                      >
                        
                      </motion.div>
                      <div>
                        <h1
                          className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 leading-tight"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {project.title}
                          </span>
                        </h1>
                        {project.meta && (
                          <div className="flex items-center gap-3">
                            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 px-4 py-2 text-lg font-bold">
                              <motion.div
                                className="w-2 h-2 bg-green-500 rounded-full mr-2"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              {project.meta}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 h-0.5" />

                    {/* Project Overview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <h2
                        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-2xl"
                        >
                          
                        </motion.span>
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Project Overview
                        </span>
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200">
                        {project.description}
                      </p>
                    </motion.div>

                    {/* Key Achievement Highlight */}
                    {project.meta && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 sm:p-8 rounded-3xl shadow-lg"
                      >
                        <h3
                          className="text-xl sm:text-2xl font-bold text-green-700 mb-3 flex items-center gap-3"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-2xl"
                          >
                            
                          </motion.span>
                          Key Achievement
                        </h3>
                        <p className="text-2xl sm:text-3xl font-black text-green-800">
                          {project.meta}
                        </p>
                      </motion.div>
                    )}

                    {/* Client Testimonial */}
                    {project.testimonial && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-6 sm:p-8 rounded-3xl shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <MessageSquareQuote className="w-8 h-8 text-blue-600" />
                          <h3
                            className="text-xl sm:text-2xl font-bold text-blue-700"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                          >
                            Client Feedback
                          </h3>
                        </div>
                        <blockquote className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-6 mb-4">
                          "{project.testimonial.quote}"
                        </blockquote>
                        <p className="text-right text-blue-600 font-semibold">
                          - {project.testimonial.author}
                        </p>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-4 pt-8"
                    >
                      {project.extlink && project.extlink !== "#" && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 px-6 py-3"
                            onClick={() => window.open(project.extlink)}
                          >
                            <span className="mr-2"></span>
                            View Live Project
                            <span className="ml-2">→</span>
                          </Button>
                        </motion.div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link href="/contact">
                          <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 font-bold rounded-2xl shadow-lg transition-all duration-300 px-6 py-3"
                          >
                            <span className="mr-2"></span>
                            Discuss Your Project
                            <span className="ml-2">→</span>
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link href="/projects">
                          <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 font-bold rounded-2xl shadow-lg transition-all duration-300 px-6 py-3"
                          >
                            <span className="mr-2">←</span>
                            Back to Projects
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-32"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mb-4"
                  >
                    
                  </motion.div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-700"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Loading project details...
                  </h2>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default Id;