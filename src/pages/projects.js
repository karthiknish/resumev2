import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaSearch,
  FaCode,
  FaLaptopCode,
  FaMobileAlt,
  FaServer,
  FaDatabase,
} from "react-icons/fa";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Apps", icon: <FaLaptopCode /> },
    { id: "mobile", name: "Mobile Apps", icon: <FaMobileAlt /> },
    { id: "backend", name: "Backend", icon: <FaServer /> },
    { id: "database", name: "Database", icon: <FaDatabase /> },
  ];

  const projects = [
    {
      id: 1,
      title: "Personal Blog & Portfolio",
      description:
        "A full-stack Next.js application featuring a personal blog with admin dashboard, portfolio showcase, and contact form. Includes features like markdown support, image optimization, and responsive design.",
      image: "/images/projects/blog-portfolio.jpg",
      technologies: [
        "Next.js",
        "React",
        "MongoDB",
        "Tailwind CSS",
        "Framer Motion",
      ],
      category: ["web", "backend", "database"],
      github: "https://github.com/username/blog-portfolio",
      liveDemo: "https://your-portfolio-url.com",
      featured: true,
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description:
        "A comprehensive e-commerce solution with product catalog, shopping cart, user authentication, payment processing, and order management. Includes admin dashboard for inventory management.",
      image: "/images/projects/ecommerce.jpg",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Redux",
        "Stripe API",
      ],
      category: ["web", "backend", "database"],
      github: "https://github.com/username/ecommerce-platform",
      liveDemo: "https://your-ecommerce-demo.com",
      featured: true,
    },
    {
      id: 3,
      title: "Task Management App",
      description:
        "A productivity application for managing tasks, projects, and deadlines. Features include drag-and-drop task organization, priority levels, due dates, and team collaboration.",
      image: "/images/projects/task-manager.jpg",
      technologies: [
        "React",
        "Firebase",
        "Material UI",
        "React DnD",
        "Chart.js",
      ],
      category: ["web", "database"],
      github: "https://github.com/username/task-management",
      liveDemo: "https://your-task-app.com",
      featured: true,
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description:
        "A weather application that provides current conditions and forecasts for locations worldwide. Features include interactive maps, hourly and daily forecasts, and weather alerts.",
      image: "/images/projects/weather-app.jpg",
      technologies: [
        "JavaScript",
        "HTML5",
        "CSS3",
        "OpenWeatherMap API",
        "Chart.js",
      ],
      category: ["web"],
      github: "https://github.com/username/weather-dashboard",
      liveDemo: "https://your-weather-app.com",
      featured: false,
    },
    {
      id: 5,
      title: "Fitness Tracker Mobile App",
      description:
        "A cross-platform mobile application for tracking workouts, nutrition, and fitness goals. Includes features like custom workout plans, progress tracking, and social sharing.",
      image: "/images/projects/fitness-app.jpg",
      technologies: [
        "React Native",
        "Expo",
        "Firebase",
        "Redux",
        "Victory Charts",
      ],
      category: ["mobile", "database"],
      github: "https://github.com/username/fitness-tracker",
      liveDemo: "https://expo.dev/@username/fitness-tracker",
      featured: false,
    },
    {
      id: 6,
      title: "Real-time Chat Application",
      description:
        "A real-time messaging platform with private and group chats, file sharing, and user presence indicators. Supports text, image, and video messages.",
      image: "/images/projects/chat-app.jpg",
      technologies: [
        "Socket.io",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "WebRTC",
      ],
      category: ["web", "backend", "database"],
      github: "https://github.com/username/chat-application",
      liveDemo: "https://your-chat-app.com",
      featured: false,
    },
    {
      id: 7,
      title: "Content Management System",
      description:
        "A custom CMS built for content creators and small businesses. Features include content creation, media management, user roles, and analytics dashboard.",
      image: "/images/projects/cms.jpg",
      technologies: [
        "Next.js",
        "GraphQL",
        "PostgreSQL",
        "Prisma",
        "NextAuth.js",
      ],
      category: ["web", "backend", "database"],
      github: "https://github.com/username/custom-cms",
      liveDemo: "https://your-cms-demo.com",
      featured: false,
    },
    {
      id: 8,
      title: "API Gateway Service",
      description:
        "A microservice that handles API routing, request validation, rate limiting, and authentication for a distributed system. Includes monitoring and logging capabilities.",
      image: "/images/projects/api-gateway.jpg",
      technologies: [
        "Node.js",
        "Express",
        "Redis",
        "JWT",
        "Docker",
        "Kubernetes",
      ],
      category: ["backend"],
      github: "https://github.com/username/api-gateway",
      liveDemo: null,
      featured: false,
    },
  ];

  // Filter projects based on search term and active filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      activeFilter === "all" || project.category.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  // Get featured projects
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <Head>
        <title>Projects - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of web and mobile development projects by Karthik Nishanth"
        />
        <meta
          name="keywords"
          content="web development, portfolio, projects, react, next.js, full stack"
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
                My Projects
              </h1>

              <p className="text-gray-300 mb-8 font-calendas max-w-3xl">
                A showcase of my development work, including web applications,
                mobile apps, and backend services. Each project represents
                different skills and technologies I've worked with.
              </p>

              {/* Featured Projects */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: project.id * 0.1 }}
                      className="bg-gray-900 rounded-lg overflow-hidden h-full flex flex-col"
                    >
                      <div className="relative h-48 w-full">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-blue-900/30 h-full w-full flex items-center justify-center">
                            <FaCode className="text-4xl text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-grow">
                        <h3 className="text-xl font-bold text-white mb-3">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-6 pt-0 flex justify-between">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                            aria-label="View GitHub repository"
                          >
                            <FaGithub className="text-xl" />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                            aria-label="View live demo"
                          >
                            <FaExternalLinkAlt className="text-xl" />
                          </a>
                        )}
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center bg-gray-900 rounded-lg px-4 py-2 w-full md:w-auto">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-white focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                          activeFilter === filter.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {filter.icon && (
                          <span className="mr-2">{filter.icon}</span>
                        )}
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Grid */}
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-900 rounded-lg overflow-hidden flex flex-col"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-48 md:h-auto md:w-1/3">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="bg-blue-900/30 h-full w-full flex items-center justify-center">
                                <FaCode className="text-4xl text-blue-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-6 md:w-2/3">
                            <h3 className="text-xl font-bold text-white mb-3">
                              {project.title}
                            </h3>
                            <p className="text-gray-300 mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4">
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-white transition-colors"
                                  aria-label="View GitHub repository"
                                >
                                  <FaGithub className="text-xl" />
                                </a>
                              )}
                              {project.liveDemo && (
                                <a
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-white transition-colors"
                                  aria-label="View live demo"
                                >
                                  <FaExternalLinkAlt className="text-xl" />
                                </a>
                              )}
                              <Link
                                href={`/projects/${project.id}`}
                                className="text-blue-400 hover:text-blue-300 ml-auto"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-8 text-center">
                    <p className="text-gray-300 mb-4">
                      No projects found matching your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilter("all");
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Contact CTA */}
              <div className="bg-blue-900/30 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Interested in working together?
                </h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}
