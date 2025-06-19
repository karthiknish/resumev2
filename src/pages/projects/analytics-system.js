import React from "react";
import Head from "next/head";
import Link from "next/link";
import { BarChart3 } from "lucide-react"; // Changed icon
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
// Hardcoded data for this specific sample project
const project = {
  id: "analytics-system",
  title: "Analytics System",
  meta: "25% Revenue Growth",
  description:
    "Complete overhaul of a legacy data analytics system, implementing a modern data pipeline and visualization dashboard to provide actionable business intelligence.",
  longDescription:
    "The client's previous analytics setup was slow, unreliable, and didn't provide timely insights. We designed and built a new system using a modern data stack. Data was ingested from various sources (databases, APIs, logs) into a data lake (AWS S3), processed using Spark jobs, and loaded into a Redshift data warehouse. A Tableau dashboard was created for visualization, providing key metrics and trends that led to data-driven decisions and significant revenue growth.",
  icon: <BarChart3 className="w-8 h-8 text-sky-500" />, // Changed icon and color
  status: "Live",
  tags: [
    "Analytics",
    "Business Intelligence",
    "Data Pipeline",
    "AWS",
    "Spark",
    "Redshift",
    "Tableau",
    "ETL",
  ],
  // image: "/path/to/analytics-image.png",
  extlink: "#", // Placeholder link
};

export default function AnalyticsSystemProject() {
  return (
    <>
      <Head>
        <title>{project.title} - Project Details</title>
        <meta name="description" content={project.description} />
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

          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
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

            <FadeIn>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-4xl sm:text-5xl"
                  >
                    📊
                  </motion.div>
                  <div>
                    <h1
                      className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-2 leading-tight"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {project.title}
                      </span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 px-4 py-2 text-sm font-bold">
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full mr-2"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        {project.status}
                      </Badge>
                      <span className="text-purple-600 font-bold text-lg">
                        {project.meta}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-8 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 h-0.5" />

                {/* Optional Image Section */}
                {/* {project.image && (
                <div className="mb-8">
                  <Image src={project.image} alt={project.title} width={800} height={450} className="rounded-lg shadow-lg" />
                </div>
              )} */}

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
                      📋
                    </motion.span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Project Overview
                    </span>
                  </h2>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200">
                    {project.longDescription || project.description}
                  </p>
                </motion.div>

                {/* Challenges Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-2xl"
                    >
                      ⚠️
                    </motion.span>
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      Challenges Faced
                    </span>
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    The existing analytics infrastructure presented significant
                    hurdles:
                  </p>
                  <ul className="space-y-4 text-gray-700 mb-8 text-lg">
                    <li>
                      <strong>Performance Issues:</strong> Legacy system was
                      extremely slow, making data exploration tedious.
                    </li>
                    <li>
                      <strong>Data Silos:</strong> Information was fragmented
                      across various databases and spreadsheets, preventing a
                      holistic view.
                    </li>
                    <li>
                      <strong>Lack of Timeliness:</strong> Reporting was manual
                      and infrequent, hindering agile decision-making.
                    </li>
                    <li>
                      <strong>Scalability Limits:</strong> The old system
                      couldn't handle increasing data volumes or new data source
                      integrations.
                    </li>
                  </ul>
                </motion.div>

                {/* Solutions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-2xl"
                    >
                      ⚙️
                    </motion.span>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Solutions Implemented
                    </span>
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    We architected and delivered a modern, scalable analytics
                    platform:
                  </p>
                  <ul className="space-y-4 text-gray-700 mb-8 text-lg">
                    <li>
                      <strong>Modern Data Pipeline:</strong> Built an ETL
                      (Extract, Transform, Load) pipeline using AWS S3 for data
                      lake storage, Apache Spark for processing, and Amazon
                      Redshift as the data warehouse.
                    </li>
                    <li>
                      <strong>Data Consolidation:</strong> Integrated disparate
                      data sources (SQL databases, APIs, logs) into the
                      centralized Redshift warehouse.
                    </li>
                    <li>
                      <strong>Interactive Visualization:</strong> Developed
                      dynamic and insightful dashboards using Tableau, connected
                      directly to Redshift.
                    </li>
                    <li>
                      <strong>Automation:</strong> Automated the entire data
                      ingestion, processing, and reporting workflow.
                    </li>
                    <li>
                      <strong>User Training:</strong> Empowered the client's
                      team with training on leveraging the new Tableau
                      dashboards.
                    </li>
                  </ul>
                </motion.div>

                {/* Results Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3"
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
                      🎯
                    </motion.span>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Key Results
                    </span>
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    The revamped analytics system drove significant business
                    value:
                  </p>
                  <ul className="space-y-4 text-gray-700 mb-12 text-lg">
                    <li>
                      <strong>Revenue Growth:</strong> Actionable insights
                      directly contributed to a 25% increase in revenue.
                    </li>
                    <li>
                      <strong>Timely Insights:</strong> Provided near real-time
                      access to key performance indicators (KPIs).
                    </li>
                    <li>
                      <strong>Efficiency Gains:</strong> Reduced time spent on
                      manual reporting by over 70%.
                    </li>
                    <li>
                      <strong>Scalability:</strong> Established a robust and
                      scalable foundation capable of handling future data
                      growth.
                    </li>
                  </ul>
                </motion.div>

                {/* Technologies Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-2xl"
                    >
                      🛠️
                    </motion.span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Key Technologies & Skills
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-12">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 px-4 py-2 text-sm font-semibold"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    {project.extlink && project.extlink !== "#" && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={project.extlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300"
                        >
                          <span>🚀</span>
                          Explore Dashboard
                          <span>→</span>
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 font-bold rounded-2xl shadow-lg transition-all duration-300"
                      >
                        <span>←</span>
                        Back to Projects
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.article>
            </FadeIn>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
