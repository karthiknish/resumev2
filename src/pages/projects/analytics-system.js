import React from "react";
import Head from "next/head";
import Link from "next/link";
import { BarChart3 } from "lucide-react"; // Changed icon
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <span className="mr-4">{project.icon}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {project.title}
                </h1>
              </div>
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="text-sky-400 border-sky-400 mr-2"
                >
                  {project.status}
                </Badge>
                <span className="text-sm text-gray-400">{project.meta}</span>
              </div>

              <Separator className="my-6 bg-gray-700" />

              {/* Optional Image Section */}
              {/* {project.image && (
                <div className="mb-8">
                  <Image src={project.image} alt={project.title} width={800} height={450} className="rounded-lg shadow-lg" />
                </div>
              )} */}

              <h2 className="text-2xl font-semibold text-sky-400 mb-3">
                Project Overview
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* --- Added Sections Start --- */}
              <h2 className="text-2xl font-semibold text-sky-400 mt-8 mb-3">
                Challenges Faced
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The existing analytics infrastructure presented significant
                hurdles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Performance Issues:</strong> Legacy system was
                  extremely slow, making data exploration tedious.
                </li>
                <li>
                  <strong>Data Silos:</strong> Information was fragmented across
                  various databases and spreadsheets, preventing a holistic
                  view.
                </li>
                <li>
                  <strong>Lack of Timeliness:</strong> Reporting was manual and
                  infrequent, hindering agile decision-making.
                </li>
                <li>
                  <strong>Scalability Limits:</strong> The old system couldn't
                  handle increasing data volumes or new data source
                  integrations.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-sky-400 mt-8 mb-3">
                Solutions Implemented
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                We architected and delivered a modern, scalable analytics
                platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Modern Data Pipeline:</strong> Built an ETL (Extract,
                  Transform, Load) pipeline using AWS S3 for data lake storage,
                  Apache Spark for processing, and Amazon Redshift as the data
                  warehouse.
                </li>
                <li>
                  <strong>Data Consolidation:</strong> Integrated disparate data
                  sources (SQL databases, APIs, logs) into the centralized
                  Redshift warehouse.
                </li>
                <li>
                  <strong>Interactive Visualization:</strong> Developed dynamic
                  and insightful dashboards using Tableau, connected directly to
                  Redshift.
                </li>
                <li>
                  <strong>Automation:</strong> Automated the entire data
                  ingestion, processing, and reporting workflow.
                </li>
                <li>
                  <strong>User Training:</strong> Empowered the client's team
                  with training on leveraging the new Tableau dashboards.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-sky-400 mt-8 mb-3">
                Key Results
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The revamped analytics system drove significant business value:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
                <li>
                  <strong>Revenue Growth:</strong> Actionable insights directly
                  contributed to a 25% increase in revenue.
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
                  scalable foundation capable of handling future data growth.
                </li>
              </ul>
              {/* --- Added Sections End --- */}

              <h2 className="text-2xl font-semibold text-sky-400 mb-3">
                Key Technologies & Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-12">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                {project.extlink && project.extlink !== "#" && (
                  <Link
                    href={project.extlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md transition-colors"
                  >
                    Explore Dashboard → {/* Changed CTA */}
                  </Link>
                )}
                <Link
                  href="/#projects"
                  className="inline-block px-6 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold rounded-md transition-colors"
                >
                  ← Back to Projects
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}
