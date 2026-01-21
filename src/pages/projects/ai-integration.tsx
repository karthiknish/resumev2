// Converted to TypeScript - migrated
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Bot } from "lucide-react"; // Changed icon
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Hardcoded data for this specific sample project
const project = {
  id: "ai-integration",
  title: "AI Integration",
  meta: "40% Cost Reduction",
  description:
    "Implemented an AI-powered chatbot using OpenAI's GPT models to handle customer service inquiries, significantly reducing response times and operational costs.",
  longDescription:
    "The client faced challenges with high volumes of repetitive customer support questions, leading to long wait times and high staffing costs. We integrated an AI chatbot by fine-tuning a GPT model on the client's knowledge base and support documentation. The chatbot was embedded into their website and mobile app. It successfully handled over 60% of incoming queries automatically, allowing human agents to focus on complex issues. Key aspects included prompt engineering, context management, and seamless handover to human agents when necessary.",
  icon: <Bot className="w-8 h-8 text-purple-500" />, // Changed icon and color
  status: "Completed", // Changed status
  tags: [
    "AI",
    "Automation",
    "Chatbot",
    "OpenAI",
    "Customer Service",
    "NLP",
    "Fine-tuning",
  ], // Added tag
  // image: "/path/to/ai-chatbot-image.png",
  extlink: "#", // Placeholder link
};

export default function AiIntegrationProject() {
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
                  className="text-purple-400 border-purple-400 mr-2"
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

              <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                Project Overview
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* --- Added Sections Start --- */}
              <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-3">
                Challenges Faced
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The customer support team was overwhelmed, leading to several
                issues:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>High Query Volume:</strong> Difficulty handling the
                  sheer number of repetitive support requests efficiently.
                </li>
                <li>
                  <strong>Long Wait Times:</strong> Customers experienced
                  significant delays, especially during peak hours.
                </li>
                <li>
                  <strong>Rising Costs:</strong> Increasing operational costs
                  associated with scaling the human support team.
                </li>
                <li>
                  <strong>Inconsistent Responses:</strong> Variations in answers
                  provided by different support agents.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-3">
                Solutions Implemented
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                We leveraged AI to automate and enhance customer support:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>AI Chatbot Development:</strong> Built and integrated
                  a chatbot powered by OpenAI's GPT models.
                </li>
                <li>
                  <strong>Model Fine-Tuning:</strong> Trained the AI model on
                  the client's specific product documentation and support
                  knowledge base for accurate responses.
                </li>
                <li>
                  <strong>Context Management:</strong> Implemented techniques to
                  maintain conversation context for more natural interactions.
                </li>
                <li>
                  <strong>Human Handover:</strong> Designed a seamless
                  escalation path to human agents for complex or sensitive
                  issues.
                </li>
                <li>
                  <strong>Multi-Channel Integration:</strong> Embedded the
                  chatbot widget across the website and mobile app.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-3">
                Key Results
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The AI integration yielded substantial benefits:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
                <li>
                  <strong>Cost Reduction:</strong> Achieved a 40% reduction in
                  customer service operational costs.
                </li>
                <li>
                  <strong>Automation Rate:</strong> Successfully automated over
                  60% of incoming support queries.
                </li>
                <li>
                  <strong>Response Time:</strong> Drastically decreased average
                  customer response time for common questions.
                </li>
                <li>
                  <strong>Agent Focus:</strong> Freed up human agents to
                  concentrate on higher-value, complex customer interactions.
                </li>
              </ul>
              {/* --- Added Sections End --- */}

              <h2 className="text-2xl font-semibold text-purple-400 mb-3">
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
                    className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md transition-colors"
                  >
                    View Case Study → {/* Changed CTA */}
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

