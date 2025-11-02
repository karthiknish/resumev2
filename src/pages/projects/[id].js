import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { projectsData } from "../../lib/projectsDataForComponents";
import PageContainer from "@/components/PageContainer";
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
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-slate-100 py-20 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <Link href="/projects" passHref legacyBehavior>
                <motion.a
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
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
                  <span className="text-sm font-medium">Back to projects</span>
                </motion.a>
              </Link>
            </motion.div>

            {project ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white border border-slate-200 p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Column - Image and Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm group">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        onClick={() => project.extlink && window.open(project.extlink)}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>

                    {/* Tech Stack Section */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-xl font-heading font-semibold text-slate-900 mb-4">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-3">
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
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                              <tech.icon
                                className="text-2xl text-slate-700"
                                title={tech.name}
                              />
                              <p className="text-xs font-medium text-slate-600 text-center mt-2">
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
                        <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-slate-900 mb-3">
                          {project.title}
                        </h1>
                        {project.meta && (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
                              {project.meta}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* Project Overview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">
                        Project Overview
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200">
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
                        className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl"
                      >
                        <h3 className="text-sm font-heading font-semibold text-emerald-700 mb-2">
                          Key Achievement
                        </h3>
                        <p className="text-lg font-semibold text-emerald-800">
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
                        className="bg-slate-50 border border-slate-200 p-5 rounded-2xl"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <MessageSquareQuote className="w-6 h-6 text-slate-600" />
                          <h3 className="text-sm font-heading font-semibold text-slate-800">
                            Client Feedback
                          </h3>
                        </div>
                        <blockquote className="text-sm text-slate-600 italic border-l-4 border-slate-300 pl-4 mb-3">
                          "{project.testimonial.quote}"
                        </blockquote>
                        <p className="text-right text-slate-500 text-xs font-medium">
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
                      className="flex flex-wrap gap-3 pt-6"
                    >
                      {project.extlink && project.extlink !== "#" && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="lg"
                            className="rounded-xl"
                            onClick={() => window.open(project.extlink)}
                          >
                            View Live Project
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
                            className="rounded-xl"
                          >
                            Discuss Your Project
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
                            className="rounded-xl"
                          >
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
                className="flex items-center justify-center py-24"
              >
                <div className="text-center">
                  <h2 className="text-sm font-medium text-slate-500">
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