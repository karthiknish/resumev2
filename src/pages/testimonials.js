import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { FadeIn, HoverCard } from "@/components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";
import { RxAvatar } from "react-icons/rx";

export default function Testimonials({ testimonials }) {
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (filter === "all") {
      setFilteredTestimonials(testimonials);
    } else {
      setFilteredTestimonials(
        testimonials.filter((testimonial) => testimonial.category === filter)
      );
    }
  }, [filter, testimonials]);

  return (
    <>
      <Head>
        <title>Testimonials - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Client testimonials and endorsements for Karthik Nishanth, Full Stack Developer"
        />
        <meta
          name="keywords"
          content="testimonials, reviews, client feedback, web development, full stack developer"
        />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen relative bg-slate-50">
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-slate-50"></div>
          
          {/* Decorative Color Splashes - Removed for cleaner look */}
          
          <div className="relative z-10 p-8 md:p-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 mb-6"
                >
                  <span>What People Say</span>
                </motion.div>
                <h1 className="font-heading text-5xl md:text-7xl text-slate-900 mb-6">
                  Testimonials
                </h1>
                <div className="w-32 h-1 bg-slate-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-slate-600 mb-8 max-w-3xl mx-auto text-xl leading-relaxed">
                  Here's what clients and colleagues have to say about working
                  with me. I pride myself on delivering high-quality work and
                  maintaining excellent professional relationships.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-12">
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter("all")}
                    className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm ${
                      filter === "all"
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="mr-2"></span>
                    All Reviews
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter("client")}
                    className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm ${
                      filter === "client"
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="mr-2"></span>
                    Clients
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter("colleague")}
                    className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm ${
                      filter === "colleague"
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="mr-2">👥</span>
                    Colleagues
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="flex items-start mb-6">
                      <div className="mr-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                          <RxAvatar className="w-10 h-10 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl text-slate-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-slate-500 font-medium mb-2">
                          {testimonial.title}
                        </p>
                        <p className="text-slate-700 font-bold text-sm">
                          {testimonial.company}
                        </p>
                        <div className="flex mt-2">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + i * 0.1 }}
                            >
                              <FaStar
                                className={`${
                                  i < testimonial.rating
                                    ? "text-yellow-400"
                                    : "text-slate-200"
                                } mr-1 text-lg`}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                      >
                        <FaQuoteLeft className="text-slate-300 text-2xl mb-3" />
                      </motion.div>
                      <p className="text-slate-600 italic text-lg leading-relaxed font-medium">
                        "{testimonial.text}"
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                        testimonial.category === "client" 
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        <span>{testimonial.category === "client" ? "" : "👥"}</span>
                        {testimonial.category === "client" ? "Client" : "Colleague"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="mt-20 text-center">
                <div className="bg-slate-900 rounded-3xl p-12 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-slate-900 to-slate-900"></div>
                  
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-6xl mb-6"
                    >
                      💫
                    </motion.div>
                    <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
                      Ready to share your experience?
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg font-medium leading-relaxed">
                      If you've worked with me and would like to share your feedback,
                      I'd be honored to hear from you and feature your testimonial here.
                    </p>
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                      >
                        <span className="text-xl"></span>
                        Submit a Testimonial
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
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export async function getStaticProps() {
  // In a real application, you would fetch this data from an API or database
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "CEO",
      company: "TechInnovate",
      // Remove React component that can't be serialized
      text: "Karthik delivered our project ahead of schedule and exceeded our expectations. His technical expertise and attention to detail made our website not only visually stunning but also highly functional. We've seen a 40% increase in user engagement since launch.",
      rating: 5,
      category: "client",
    },
    {
      name: "Michael Chen",
      title: "CTO",
      company: "DataFlow Systems",
      // Remove React component that can't be serialized
      text: "Working with Karthik was a pleasure. He quickly understood our complex requirements and implemented elegant solutions. His knowledge of both frontend and backend technologies is impressive, and he communicates clearly throughout the development process.",
      rating: 5,
      category: "client",
    },
    {
      name: "Priya Patel",
      title: "Senior Developer",
      company: "WebSolutions Inc",
      // Remove React component that can't be serialized
      text: "As a colleague, I've had the opportunity to collaborate with Karthik on several projects. His code is clean, well-documented, and follows best practices. He's always willing to share knowledge and help team members, making him an invaluable asset to any development team.",
      rating: 5,
      category: "colleague",
    },
    {
      name: "David Wilson",
      title: "Marketing Director",
      company: "GrowthBrand",
      // Remove React component that can't be serialized
      text: "Karthik helped us revamp our entire digital presence. He not only built a beautiful website but also integrated it with our marketing tools, resulting in a seamless workflow. His understanding of both technical and business aspects made the collaboration extremely productive.",
      rating: 4,
      category: "client",
    },
    {
      name: "Emma Rodriguez",
      title: "Project Manager",
      company: "AgileTeam",
      // Remove React component that can't be serialized
      text: "I've managed several projects where Karthik was the lead developer. His ability to adapt to changing requirements, solve complex problems, and maintain a positive attitude even under pressure is remarkable. He consistently delivers high-quality work on time.",
      rating: 5,
      category: "colleague",
    },
    {
      name: "James Taylor",
      title: "Founder",
      company: "EcoStart",
      // Remove React component that can't be serialized
      text: "As a startup founder with limited technical knowledge, I was worried about communicating my vision effectively. Karthik made the process incredibly smooth, explaining technical concepts in simple terms and providing valuable suggestions to improve our product.",
      rating: 5,
      category: "client",
    },
  ];

  return {
    props: {
      testimonials,
    },
    // Revalidate every day
    revalidate: 86400,
  };
}
