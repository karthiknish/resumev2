import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCode,
  FaMobileAlt,
  FaServer,
  FaDatabase,
  FaRocket,
  FaTools,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FadeIn, HoverCard } from "../components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";

export default function Services() {
  const [expandedFaq, setExpandedFaq] = React.useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const services = [
    {
      icon: <FaCode className="text-5xl" style={{ color: "#5BD3F3" }} />,
      title: "Frontend Development",
      description:
        "Creating responsive, interactive, and visually appealing user interfaces using modern frameworks like React, Next.js, and Vue.js.",
      features: [
        "Responsive web design",
        "Single page applications (SPAs)",
        "Progressive web apps (PWAs)",
        "Cross-browser compatibility",
        "Performance optimization",
      ],
    },
    {
      icon: <FaServer className="text-5xl" style={{ color: "#5B9853" }} />,
      title: "Backend Development",
      description:
        "Building robust server-side applications and APIs using Node.js, Express, and other modern technologies.",
      features: [
        "RESTful API development",
        "GraphQL implementation",
        "Authentication & authorization",
        "Serverless functions",
        "Microservices architecture",
      ],
    },
    {
      icon: <FaMobileAlt className="text-5xl" style={{ color: "#E535AB" }} />,
      title: "Mobile App Development",
      description:
        "Developing cross-platform mobile applications using React Native that work seamlessly on both iOS and Android devices.",
      features: [
        "Cross-platform development",
        "Native-like performance",
        "Offline functionality",
        "Push notifications",
        "App store deployment",
      ],
    },
    {
      icon: <FaDatabase className="text-5xl" style={{ color: "#FF9900" }} />,
      title: "Database Design",
      description:
        "Designing and implementing efficient database solutions using SQL and NoSQL technologies.",
      features: [
        "Schema design",
        "Data modeling",
        "Query optimization",
        "MongoDB implementation",
        "PostgreSQL/MySQL setup",
      ],
    },
    {
      icon: <FaRocket className="text-5xl" style={{ color: "#DD4B25" }} />,
      title: "Performance Optimization",
      description:
        "Improving the speed and efficiency of web applications through various optimization techniques.",
      features: [
        "Load time reduction",
        "Code splitting",
        "Lazy loading",
        "Caching strategies",
        "Image optimization",
      ],
    },
    {
      icon: <FaTools className="text-5xl" style={{ color: "#3178C6" }} />,
      title: "Technical Consultation",
      description:
        "Providing expert advice on technology stack selection, architecture design, and best practices.",
      features: [
        "Technology stack evaluation",
        "Architecture planning",
        "Code reviews",
        "Best practices implementation",
        "Technical documentation",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is your development process?",
      answer:
        "My development process typically follows these steps: 1) Requirements gathering and analysis, 2) Planning and architecture design, 3) Development with regular check-ins, 4) Testing and quality assurance, 5) Deployment, and 6) Maintenance and support. I emphasize clear communication throughout the entire process.",
    },
    {
      question: "How long does it typically take to complete a project?",
      answer:
        "Project timelines vary based on complexity, scope, and requirements. A simple website might take 2-4 weeks, while a complex web application could take 2-6 months. I'll provide a detailed timeline estimate after understanding your specific project needs during our initial consultation.",
    },
    {
      question: "Do you offer maintenance services after project completion?",
      answer:
        "Yes, I offer ongoing maintenance and support services to ensure your application continues to run smoothly. This includes bug fixes, security updates, performance monitoring, and feature enhancements. We can discuss maintenance packages tailored to your specific needs.",
    },
    {
      question: "What technologies do you specialize in?",
      answer:
        "I specialize in modern web technologies including React, Next.js, Node.js, Express, MongoDB, PostgreSQL, and AWS/Firebase for cloud services. For mobile development, I work with React Native. I'm constantly learning and adapting to new technologies to provide the best solutions.",
    },
    {
      question: "How do you handle project communication?",
      answer:
        "Clear communication is essential for project success. I typically use a combination of regular video calls, email updates, and project management tools like Jira, Trello, or Asana. I provide weekly progress reports and am available for questions throughout the development process.",
    },
  ];

  return (
    <>
      <Head>
        <title>Services - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Professional web and mobile development services offered by Karthik Nishanth"
        />
        <meta
          name="keywords"
          content="web development, mobile development, frontend, backend, full stack, React, Node.js"
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="text-center mb-10">
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Services
                </h1>
                <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                  I offer a comprehensive range of development services to help
                  bring your digital ideas to life. Whether you need a stunning
                  website, a powerful web application, or a mobile app, I have
                  the expertise to deliver high-quality solutions tailored to
                  your specific needs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {services.map((service, index) => (
                  <HoverCard key={index}>
                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 h-full flex flex-col">
                      <div className="mb-4">{service.icon}</div>
                      <h2 className="text-2xl font-bold text-blue-400 mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-300 mb-4 flex-grow">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mt-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            </div>
                            <p className="text-gray-300">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-blue-500 mb-8 rounded-full"></div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-800 pb-4 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full text-left font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      <span className="text-lg">{faq.question}</span>
                      {expandedFaq === index ? (
                        <FaChevronUp className="text-blue-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-gray-300"
                      >
                        <p className="text-lg leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl shadow-2xl border border-blue-500/20 text-center">
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Start Your Project?
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Let's discuss how I can help bring your ideas to life. Contact
                me for a free consultation and project estimate.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
              >
                Get in Touch →
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}
