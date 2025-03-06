import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
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
import PageContainer from "@/components/PageContainer";
export default function Services() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const services = [
    {
      icon: <FaCode className="text-4xl text-blue-500" />,
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
      icon: <FaServer className="text-4xl text-green-500" />,
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
      icon: <FaMobileAlt className="text-4xl text-purple-500" />,
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
      icon: <FaDatabase className="text-4xl text-yellow-500" />,
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
      icon: <FaRocket className="text-4xl text-red-500" />,
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
      icon: <FaTools className="text-4xl text-indigo-500" />,
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
        <div className="min-h-screen bg-black/95 p-8 relative">
          <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="border-none bg-black/60 backdrop-blur-sm p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-white mb-6 font-calendas">
                  Services
                </h1>

                <p className="text-gray-300 mb-8 font-calendas max-w-3xl">
                  I offer a comprehensive range of development services to help
                  bring your digital ideas to life. Whether you need a stunning
                  website, a powerful web application, or a mobile app, I have
                  the expertise to deliver high-quality solutions tailored to
                  your specific needs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-900 rounded-lg p-6 h-full flex flex-col"
                    >
                      <div className="mb-4">{service.icon}</div>
                      <h2 className="text-xl font-bold text-white mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-300 mb-4 flex-grow">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mt-2">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="text-gray-400 flex items-start"
                          >
                            <span className="text-blue-500 mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Frequently Asked Questions
                  </h2>
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
                          <span>{faq.question}</span>
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
                            <p>{faq.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900/30 rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Ready to Start Your Project?
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Let's discuss how I can help bring your ideas to life.
                    Contact me for a free consultation and project estimate.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>
              </motion.div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
