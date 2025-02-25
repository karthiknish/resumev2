import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import {
  FaBook,
  FaTools,
  FaVideo,
  FaCode,
  FaExternalLinkAlt,
  FaSearch,
} from "react-icons/fa";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources" },
    { id: "tools", name: "Development Tools", icon: <FaTools /> },
    { id: "tutorials", name: "Tutorials & Guides", icon: <FaBook /> },
    { id: "videos", name: "Video Courses", icon: <FaVideo /> },
    { id: "code", name: "Code Snippets", icon: <FaCode /> },
  ];

  const resources = [
    {
      title: "React Performance Optimization Techniques",
      description:
        "Learn how to optimize your React applications for better performance with practical techniques and examples.",
      link: "https://reactjs.org/docs/optimizing-performance.html",
      category: "tutorials",
      tags: ["react", "performance", "optimization"],
      featured: true,
    },
    {
      title: "Next.js Documentation",
      description:
        "Comprehensive documentation for Next.js, the React framework for production.",
      link: "https://nextjs.org/docs",
      category: "tutorials",
      tags: ["nextjs", "react", "documentation"],
      featured: true,
    },
    {
      title: "VS Code Extensions for Web Developers",
      description:
        "A curated list of essential VS Code extensions that every web developer should consider using.",
      link: "https://marketplace.visualstudio.com/",
      category: "tools",
      tags: ["vscode", "extensions", "productivity"],
      featured: false,
    },
    {
      title: "Modern JavaScript Explained For Dinosaurs",
      description:
        "A comprehensive guide to modern JavaScript development for those who might feel left behind by the rapid evolution of the ecosystem.",
      link: "https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70",
      category: "tutorials",
      tags: ["javascript", "ecosystem", "beginners"],
      featured: true,
    },
    {
      title: "CSS Grid Complete Guide",
      description:
        "Everything you need to know about CSS Grid Layout in one comprehensive guide.",
      link: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      category: "tutorials",
      tags: ["css", "grid", "layout"],
      featured: false,
    },
    {
      title: "Figma - Design Tool",
      description:
        "A collaborative interface design tool that's taking the design world by storm.",
      link: "https://www.figma.com/",
      category: "tools",
      tags: ["design", "ui", "collaboration"],
      featured: true,
    },
    {
      title: "JavaScript Testing Best Practices",
      description:
        "Comprehensive and exhaustive JavaScript & Node.js testing best practices.",
      link: "https://github.com/goldbergyoni/javascript-testing-best-practices",
      category: "tutorials",
      tags: ["testing", "javascript", "best practices"],
      featured: false,
    },
    {
      title: "Full Stack Open",
      description:
        "Deep dive into modern web development with React, Redux, Node.js, MongoDB, GraphQL and TypeScript.",
      link: "https://fullstackopen.com/en/",
      category: "tutorials",
      tags: ["fullstack", "react", "nodejs", "mongodb"],
      featured: true,
    },
    {
      title: "React Hooks Explained",
      description:
        "A comprehensive video course on React Hooks with practical examples.",
      link: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
      category: "videos",
      tags: ["react", "hooks", "functional components"],
      featured: false,
    },
    {
      title: "Responsive Navigation Bar",
      description:
        "A responsive navigation bar implementation with HTML, CSS, and JavaScript.",
      link: "/code-snippets/responsive-navbar",
      category: "code",
      tags: ["html", "css", "javascript", "responsive"],
      featured: false,
    },
    {
      title: "JWT Authentication in Node.js",
      description:
        "A complete guide to implementing JWT authentication in Node.js applications.",
      link: "https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs",
      category: "tutorials",
      tags: ["nodejs", "authentication", "jwt", "security"],
      featured: false,
    },
    {
      title: "Tailwind CSS",
      description:
        "A utility-first CSS framework for rapidly building custom user interfaces.",
      link: "https://tailwindcss.com/",
      category: "tools",
      tags: ["css", "framework", "utility-first"],
      featured: true,
    },
    {
      title: "Advanced React Patterns",
      description:
        "Learn advanced React patterns to build more flexible and reusable components.",
      link: "https://www.youtube.com/watch?v=WV0UUcSPk-0",
      category: "videos",
      tags: ["react", "patterns", "advanced"],
      featured: false,
    },
    {
      title: "Infinite Scroll Component",
      description:
        "A reusable infinite scroll component implementation in React.",
      link: "/code-snippets/infinite-scroll",
      category: "code",
      tags: ["react", "infinite scroll", "performance"],
      featured: false,
    },
    {
      title: "MongoDB Atlas",
      description:
        "Cloud-hosted MongoDB service with free tier for small projects.",
      link: "https://www.mongodb.com/cloud/atlas",
      category: "tools",
      tags: ["database", "mongodb", "cloud"],
      featured: false,
    },
    {
      title: "TypeScript Handbook",
      description:
        "The official TypeScript documentation and guide for learning the language from basics to advanced concepts.",
      link: "https://www.typescriptlang.org/docs/handbook/intro.html",
      category: "tutorials",
      tags: ["typescript", "javascript", "documentation"],
      featured: true,
    },
    {
      title: "Storybook",
      description:
        "A frontend workshop for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.",
      link: "https://storybook.js.org/",
      category: "tools",
      tags: ["ui", "components", "documentation", "testing"],
      featured: false,
    },
    {
      title: "Web.dev by Google",
      description:
        "Guidance and analysis to help developers build modern web experiences that are fast, reliable, and accessible.",
      link: "https://web.dev/",
      category: "tutorials",
      tags: ["performance", "accessibility", "best practices", "pwa"],
      featured: true,
    },
    {
      title: "Framer Motion Documentation",
      description:
        "Comprehensive guide to using Framer Motion for adding animations to React applications.",
      link: "https://www.framer.com/motion/",
      category: "tutorials",
      tags: ["react", "animation", "ui", "framer"],
      featured: false,
    },
    {
      title: "Vercel",
      description:
        "Platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.",
      link: "https://vercel.com/",
      category: "tools",
      tags: ["deployment", "hosting", "serverless", "nextjs"],
      featured: true,
    },
    {
      title: "CSS Flexbox Guide",
      description:
        "A complete guide to CSS flexbox layout with visual examples and code snippets.",
      link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      category: "tutorials",
      tags: ["css", "flexbox", "layout"],
      featured: false,
    },
    {
      title: "GitHub Copilot",
      description:
        "AI pair programmer that helps you write code faster with less work.",
      link: "https://github.com/features/copilot",
      category: "tools",
      tags: ["ai", "productivity", "coding", "pair programming"],
      featured: true,
    },
    {
      title: "Responsive Image Gallery",
      description:
        "A responsive image gallery implementation with CSS Grid and JavaScript.",
      link: "/code-snippets/responsive-gallery",
      category: "code",
      tags: ["css", "javascript", "responsive", "gallery"],
      featured: false,
    },
    {
      title: "Docker for Beginners",
      description:
        "A comprehensive guide to getting started with Docker containerization.",
      link: "https://docker-curriculum.com/",
      category: "tutorials",
      tags: ["docker", "containers", "devops", "deployment"],
      featured: false,
    },
    {
      title: "Postman",
      description:
        "API platform for building and using APIs. Simplifies each step of the API lifecycle and streamlines collaboration.",
      link: "https://www.postman.com/",
      category: "tools",
      tags: ["api", "testing", "development", "collaboration"],
      featured: false,
    },
    {
      title: "The Net Ninja - Full React Tutorial",
      description:
        "Complete React tutorial series covering all the fundamentals and advanced concepts.",
      link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
      category: "videos",
      tags: ["react", "javascript", "frontend", "tutorial"],
      featured: false,
    },
    {
      title: "Dark Mode Toggle",
      description:
        "Implementation of a dark mode toggle with CSS variables and JavaScript.",
      link: "/code-snippets/dark-mode-toggle",
      category: "code",
      tags: ["css", "javascript", "dark mode", "accessibility"],
      featured: false,
    },
    {
      title: "GraphQL Documentation",
      description:
        "Learn about GraphQL, a query language for APIs and a runtime for fulfilling those queries with your existing data.",
      link: "https://graphql.org/learn/",
      category: "tutorials",
      tags: ["graphql", "api", "query language", "data fetching"],
      featured: false,
    },
    {
      title: "Cypress",
      description:
        "Fast, easy and reliable testing for anything that runs in a browser.",
      link: "https://www.cypress.io/",
      category: "tools",
      tags: ["testing", "automation", "e2e", "integration"],
      featured: false,
    },
    {
      title: "Traversy Media - MERN Stack Front To Back",
      description:
        "Full stack development with MongoDB, Express, React, and Node.js.",
      link: "https://www.youtube.com/watch?v=PBTYxXADG_k&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE",
      category: "videos",
      tags: ["mern", "mongodb", "express", "react", "nodejs"],
      featured: true,
    },
    {
      title: "Custom React Hooks Collection",
      description:
        "A collection of useful custom React hooks for common functionalities.",
      link: "/code-snippets/custom-react-hooks",
      category: "code",
      tags: ["react", "hooks", "reusable", "javascript"],
      featured: true,
    },
    {
      title: "MDN Web Docs",
      description:
        "Resources for developers, by developers. Comprehensive documentation for web technologies.",
      link: "https://developer.mozilla.org/",
      category: "tutorials",
      tags: ["documentation", "web", "html", "css", "javascript"],
      featured: true,
    },
    {
      title: "Netlify",
      description:
        "Platform that automates your code to create high-performant, easily maintainable sites and web apps.",
      link: "https://www.netlify.com/",
      category: "tools",
      tags: ["deployment", "hosting", "serverless", "jamstack"],
      featured: false,
    },
    {
      title: "Fireship - 100 Seconds of Code",
      description:
        "Learn various programming concepts and technologies in just 100 seconds each.",
      link: "https://www.youtube.com/playlist?list=PL0vfts4VzfNiI1BsIq5fA8ESY4Td7oAwL",
      category: "videos",
      tags: ["quick learning", "programming", "concepts", "technologies"],
      featured: false,
    },
    {
      title: "Responsive CSS Grid Dashboard",
      description:
        "A responsive dashboard layout implementation using CSS Grid.",
      link: "/code-snippets/grid-dashboard",
      category: "code",
      tags: ["css", "grid", "dashboard", "responsive"],
      featured: false,
    },
  ];

  // Filter resources based on search term and active category
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      activeCategory === "all" || resource.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Get featured resources
  const featuredResources = resources.filter(
    (resource) => resource.featured && resource.category !== "code"
  );

  return (
    <>
      <Head>
        <title>
          Developer Resources - Karthik Nishanth | Full Stack Developer
        </title>
        <meta
          name="description"
          content="Curated collection of development tools, tutorials, and resources for web developers"
        />
        <meta
          name="keywords"
          content="web development, resources, tools, tutorials, learning, coding"
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
                Developer Resources
              </h1>

              <p className="text-gray-300 mb-8 font-calendas max-w-3xl">
                A curated collection of tools, tutorials, articles, and
                resources that I find valuable in my development work. I've
                compiled these to help fellow developers find quality resources
                more easily.
              </p>

              {/* Featured Resources */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredResources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-900 rounded-lg p-6 h-full flex flex-col"
                    >
                      <h3 className="text-xl font-bold text-white mb-3">
                        {resource.title}
                      </h3>
                      <p className="text-gray-300 mb-4 flex-grow">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        Visit Resource <FaExternalLinkAlt className="ml-2" />
                      </a>
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
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-white focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                          activeCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {category.icon && (
                          <span className="mr-2">{category.icon}</span>
                        )}
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource List */}
                {filteredResources.length > 0 ? (
                  <div className="space-y-4">
                    {filteredResources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-900 rounded-lg p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {resource.title}
                            </h3>
                            <p className="text-gray-300 mb-3">
                              {resource.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
                            >
                              View Resource
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-8 text-center">
                    <p className="text-gray-300 mb-4">
                      No resources found matching your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("all");
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Suggestion Box */}
              <div className="bg-blue-900/30 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Suggest a Resource
                </h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Know a great resource that should be included here? I'm always
                  looking to expand this collection with high-quality content.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Suggest Resource
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}
