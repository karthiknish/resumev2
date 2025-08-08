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
import JsonLd, { createServiceSchema } from "@/components/JsonLd"; // Import JsonLd and schema helper

// Helper function to generate slugs
const generateSlug = (title) => {
  return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
};


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
      title: "Database Design", // Note: Slug will be database-design
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

  // Generate Service schema for each service
  const serviceSchemas = services.map((service) =>
    createServiceSchema(service)
  );

  return (
    <>
      <Head>
        <title>Services - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Professional web and mobile development services offered by Karthik Nishanth. Specializing in web applications, mobile apps, and technical consultation."
        />
        <meta
          name="keywords"
          content="web development, mobile development, frontend, backend, full stack, React, Node.js, Next.js, technical consultation"
        />
        <meta
          property="og:title"
          content="Services - Karthik Nishanth | Full Stack Developer"
        />
        <meta
          property="og:description"
          content="Professional web and mobile development services offered by Karthik Nishanth. Specializing in web applications, mobile apps, and technical consultation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/services" />
        <meta
          property="og:image"
          content="https://karthiknish.com/images/og-image.jpg" // Consider updating this OG image
        />
        <meta property="og:site_name" content="Karthik Nishanth" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Services - Karthik Nishanth | Full Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Professional web and mobile development services offered by Karthik Nishanth. Specializing in web applications, mobile apps, and technical consultation."
        />
        <meta
          name="twitter:image"
          content="https://karthiknish.com/images/og-image.jpg" // Consider updating this OG image
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://karthiknish.com/services" />

        {/* Add Service JSON-LD Schemas */}
        {serviceSchemas.map((schema, index) => (
          <JsonLd key={`service-schema-${index}`} data={schema} />
        ))}

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
          className="min-h-screen bg-background py-24 md:py-32"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border text-sm font-semibold mb-8 shadow-sm rounded-full border-brandSecondary text-brandSecondary">
                <span>Professional Development Services</span>
              </div>

              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="text-foreground">My Services</span>
              </h1>

              <p className="text-2xl md:text-3xl text-foreground/70 max-w-5xl mx-auto leading-relaxed font-medium mb-12">
                Comprehensive development solutions to bring your digital vision
                to life — from modern websites to scalable applications.
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            >
              {services.map((service, index) => {
                const slug = generateSlug(service.title);
                const href = `/services/${slug}`;

                // Define unique gradient colors for each service
                const gradients = [
                  "from-primary to-brandSecondary",
                  "from-primary to-brandSecondary",
                  "from-primary to-brandSecondary",
                  "from-primary to-brandSecondary",
                  "from-primary to-brandSecondary",
                  "from-primary to-brandSecondary",
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group"
                  >
                    <Link href={href} className="block h-full">
                      <div className="bg-card border-2 border-border p-8 rounded-3xl shadow-sm hover:shadow transition-all duration-300 h-full flex flex-col">
                        {/* Service Icon with unique gradient */}
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="text-white text-3xl">
                            {React.cloneElement(service.icon, {
                              className: "text-3xl",
                              style: { color: "white" },
                            })}
                          </div>
                        </motion.div>

                        <h2
                          className="text-3xl font-black mb-4 text-foreground"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {service.title}
                        </h2>

                        <p className="text-gray-700 mb-6 flex-grow text-lg leading-relaxed">
                          {service.description}
                        </p>

                        {/* Feature List */}
                        <ul className="space-y-3 mb-6">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <motion.div
                                className={`w-6 h-6 bg-gradient-to-r ${gradients[index]} rounded-full flex items-center justify-center flex-shrink-0`}
                                whileHover={{ scale: 1.2 }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </motion.div>
                              <span className="text-gray-700 font-medium">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <motion.div
                          className="mt-auto pt-6 border-t border-border"
                          whileHover={{ x: 5 }}
                        >
                          <span className="inline-flex items-center gap-2 text-brandSecondary font-bold text-lg">
                            Learn More
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              →
                            </motion.span>
                          </span>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card border-2 border-border p-8 md:p-12 rounded-3xl shadow mb-16"
            >
              <motion.h2
                className="text-5xl md:text-6xl font-black mb-8 flex items-center gap-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-foreground">FAQ</span>
              </motion.h2>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border-b border-border pb-6 last:border-b-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full text-left font-bold text-foreground hover:text-primary transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <span
                        className="text-xl md:text-2xl pr-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        {expandedFaq === index ? (
                          <FaChevronUp className="text-primary text-xl" />
                        ) : (
                          <FaChevronDown className="text-foreground/50 group-hover:text-primary text-xl transition-colors" />
                        )}
                      </motion.div>
                    </motion.button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 bg-secondary p-6 rounded-2xl border border-border"
                      >
                        <p className="text-lg leading-relaxed text-foreground/70 font-medium">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-brandSecondary p-12 md:p-16 rounded-3xl shadow text-center relative overflow-hidden text-white"
            >
              {/* Decorative floating elements removed for a cleaner CTA */}

              <motion.h2
                className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to start?
              </motion.h2>

              <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium relative z-10">
                Let's discuss how I can help bring your ideas to life. Contact
                me for a
                <span className="font-bold text-white">
                  {" "}
                  free consultation{" "}
                </span>
                and project estimate.
              </p>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-12 py-6 bg-white text-brandSecondary border-2 border-brandSecondary font-black text-xl rounded-2xl transition-all duration-300 shadow hover:shadow-md"
                >
                  Contact me
                  <span>→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
