import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaLinkedin, FaGithub } from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import Link from "next/link";

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
      </Head>

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
                Client Testimonials
              </h1>

              <p className="text-gray-300 mb-8 font-calendas max-w-3xl">
                Here's what clients and colleagues have to say about working
                with me. I pride myself on delivering high-quality work and
                maintaining excellent professional relationships.
              </p>

              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("client")}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      filter === "client"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setFilter("colleague")}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      filter === "colleague"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Colleagues
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-gray-900 rounded-lg p-6 h-full flex flex-col">
                      <div className="flex items-start mb-4">
                        <div className="mr-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {testimonial.avatar ? (
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-white">
                                {testimonial.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-400">
                            {testimonial.title}, {testimonial.company}
                          </p>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`${
                                  i < testimonial.rating
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                } mr-1`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow">
                        <FaQuoteLeft className="text-blue-500 text-xl mb-2" />
                        <p className="text-gray-300 italic mb-4">
                          "{testimonial.text}"
                        </p>
                      </div>

                      <div className="mt-4 flex">
                        {testimonial.linkedin && (
                          <a
                            href={testimonial.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 mr-3"
                            aria-label="LinkedIn Profile"
                          >
                            <FaLinkedin size={20} />
                          </a>
                        )}
                        {testimonial.github && (
                          <a
                            href={testimonial.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300"
                            aria-label="GitHub Profile"
                          >
                            <FaGithub size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <h2 className="text-2xl text-white font-bold mb-4">
                  Ready to share your experience?
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                  If you've worked with me and would like to share your
                  feedback, I'd be honored to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Submit a Testimonial
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
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
      avatar: "/images/testimonials/sarah.jpg",
      text: "Karthik delivered our project ahead of schedule and exceeded our expectations. His technical expertise and attention to detail made our website not only visually stunning but also highly functional. We've seen a 40% increase in user engagement since launch.",
      rating: 5,
      category: "client",
      linkedin: "https://linkedin.com/in/sarahjohnson",
    },
    {
      name: "Michael Chen",
      title: "CTO",
      company: "DataFlow Systems",
      avatar: "/images/testimonials/michael.jpg",
      text: "Working with Karthik was a pleasure. He quickly understood our complex requirements and implemented elegant solutions. His knowledge of both frontend and backend technologies is impressive, and he communicates clearly throughout the development process.",
      rating: 5,
      category: "client",
      linkedin: "https://linkedin.com/in/michaelchen",
    },
    {
      name: "Priya Patel",
      title: "Senior Developer",
      company: "WebSolutions Inc",
      avatar: "/images/testimonials/priya.jpg",
      text: "As a colleague, I've had the opportunity to collaborate with Karthik on several projects. His code is clean, well-documented, and follows best practices. He's always willing to share knowledge and help team members, making him an invaluable asset to any development team.",
      rating: 5,
      category: "colleague",
      linkedin: "https://linkedin.com/in/priyapatel",
      github: "https://github.com/priyapatel",
    },
    {
      name: "David Wilson",
      title: "Marketing Director",
      company: "GrowthBrand",
      avatar: "/images/testimonials/david.jpg",
      text: "Karthik helped us revamp our entire digital presence. He not only built a beautiful website but also integrated it with our marketing tools, resulting in a seamless workflow. His understanding of both technical and business aspects made the collaboration extremely productive.",
      rating: 4,
      category: "client",
      linkedin: "https://linkedin.com/in/davidwilson",
    },
    {
      name: "Emma Rodriguez",
      title: "Project Manager",
      company: "AgileTeam",
      avatar: "/images/testimonials/emma.jpg",
      text: "I've managed several projects where Karthik was the lead developer. His ability to adapt to changing requirements, solve complex problems, and maintain a positive attitude even under pressure is remarkable. He consistently delivers high-quality work on time.",
      rating: 5,
      category: "colleague",
      linkedin: "https://linkedin.com/in/emmarodriguez",
    },
    {
      name: "James Taylor",
      title: "Founder",
      company: "EcoStart",
      avatar: "/images/testimonials/james.jpg",
      text: "As a startup founder with limited technical knowledge, I was worried about communicating my vision effectively. Karthik made the process incredibly smooth, explaining technical concepts in simple terms and providing valuable suggestions to improve our product.",
      rating: 5,
      category: "client",
      linkedin: "https://linkedin.com/in/jamestaylor",
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
