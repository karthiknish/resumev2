import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaGithub } from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
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
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto relative">
          <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />

          <FadeIn>
            <div className="text-center mb-10">
              <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Testimonials
              </h1>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                Here's what clients and colleagues have to say about working
                with me. I pride myself on delivering high-quality work and
                maintaining excellent professional relationships.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
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
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTestimonials.map((testimonial, index) => (
                <HoverCard key={index}>
                  <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-2xl border border-blue-500/20 h-full flex flex-col">
                    <div className="flex items-start mb-4">
                      <div className="mr-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                          <RxAvatar className="w-full h-full object-cover" />
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
                  </div>
                </HoverCard>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="mt-16 text-center">
              <h2 className="text-3xl text-white font-bold mb-4">
                Ready to share your experience?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                If you've worked with me and would like to share your feedback,
                I'd be honored to hear from you.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
              >
                Submit a Testimonial →
              </Link>
            </div>
          </FadeIn>
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
