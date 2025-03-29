import Head from "next/head";
import React from "react"; // Keep React import if needed elsewhere or for context
import { motion } from "framer-motion";

// Import the extracted section components
import HeroSection from "@/components/home/HeroSection";
import WhyFreelancerSection from "@/components/home/WhyFreelancerSection";
import TechStackSection from "@/components/home/TechStackSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";

// Import existing components used on the page
import Services from "@/components/Services";
import ContactForm from "@/components/Form";
import Faq from "@/components/Faq";

// FAQ items data (can be moved to a data file if preferred)
const faqItems = [
  {
    id: "1",
    title: "What services do you offer?",
    content:
      "I offer comprehensive full-stack development services including web application development, API integration, database design, and cloud deployment. I specialize in React, Node.js, and modern JavaScript frameworks, delivering scalable and performant solutions tailored to your business needs.",
  },
  {
    id: "2",
    title: "How do you approach business problems?",
    content:
      "I take a strategic approach by first understanding your business objectives and challenges. Then, I develop custom technical solutions that address core problems while considering scalability, maintainability, and user experience. My background in both development and business allows me to bridge technical and business requirements effectively.",
  },
  {
    id: "3",
    title: "What is your development process?",
    content:
      "My development process follows an agile methodology with regular client communication. It includes requirements gathering, planning, iterative development with frequent feedback loops, thorough testing, and post-deployment support. I emphasize clean code, documentation, and best practices throughout the process.",
  },
  {
    id: "4",
    title: "What technologies do you work with?",
    content:
      "I work with modern web technologies including React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, AWS, and more. I stay current with industry trends and choose the most appropriate tech stack based on project requirements, performance needs, and long-term maintainability.",
  },
  {
    id: "5",
    title: "How do you ensure project success?",
    content:
      "Project success is ensured through clear communication, detailed planning, regular progress updates, and quality control measures. I implement automated testing, continuous integration, and monitoring to maintain high standards. Additionally, I provide comprehensive documentation and knowledge transfer to support long-term success.",
  },
];

const HomeScreen = () => {
  return (
    <>
      {/* Keep Head component for page-specific metadata */}
      <Head>
        <title>
          Karthik Nishanth - Freelance Full Stack Developer | Liverpool, UK
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Karthik Nishanth: A freelance Full Stack Developer based in Liverpool, UK. Specializing in creating bespoke web solutions for businesses and individuals."
        />
        <meta
          name="keywords"
          content="Freelance Web Developer, Full Stack Developer, Web Development, React, Node.js, JavaScript, TypeScript,  Liverpool, UK"
        />
        <meta name="author" content="Karthik Nishanth" />
        <link rel="canonical" href="https://karthiknish.com/" />
        {/* OG and Twitter tags */}
        <meta
          property="og:title"
          content="Karthik Nishanth - Freelance Full Stack Developer | Liverpool, UK"
        />
        <meta
          property="og:description"
          content="Freelance web developer creating custom, scalable, and high-performance web solutions for businesses and individuals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta property="og:image" content="https://karthiknish.com/Logo.png" />
        <meta property="og:site_name" content="Karthik Nishanth" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Karthik Nishanth - Freelance Full Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Freelance web developer creating custom, scalable, and high-performance web solutions for businesses and individuals."
        />
        <meta name="twitter:image" content="https://karthiknish.com/Logo.png" />
        {/* Other meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        {/* Preconnect links might be better placed in _document.js */}
      </Head>
      {/* Render the extracted sections */}
      <HeroSection />
      <WhyFreelancerSection />
      <TechStackSection />
      <FeaturedProjectsSection />
      {/* Render existing components */}
      <Faq items={faqItems} /> {/* Pass FAQ items */}
      {/* Wrap Services in a section for consistent spacing/background if needed */}
      <div className="bg-black mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} // Use whileInView for scroll-triggered animation
          viewport={{ once: true }} // Trigger animation only once
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Services />
        </motion.div>
      </div>
      <ContactForm />
    </>
  );
};

export default HomeScreen;
