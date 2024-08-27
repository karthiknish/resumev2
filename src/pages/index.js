import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaCode,
  FaLaptopCode,
  FaRocket,
  FaBrain,
  FaLightbulb,
  FaChartLine,
  FaAd,
  FaStar,
} from "react-icons/fa";
import { useState } from "react";

async function getPageInsights(url) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SPEED;
  if (!apiKey) {
    throw new Error("Google PageSpeed API key is not set");
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching page insights:", error);
    throw new Error(`Failed to get page insights: ${error.message}`);
  }
}

const HomeScreen = () => {
  const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "MongoDB",
    "SQL",
    "AWS",
    "Docker",
    "TypeScript",
    "GraphQL",
    "Next.js",
    "TailwindCSS",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
  ];

  const achievements = [
    {
      icon: FaCode,
      title: "3+ Years Experience",
      description: "A decade of crafting exceptional web solutions",
    },
    {
      icon: FaLaptopCode,
      title: "50+ Projects Completed",
      description: "Diverse portfolio spanning various industries",
    },
    {
      icon: FaRocket,
      title: "500+ Users Reached",
      description: "Creating impactful applications used globally",
    },
    {
      icon: FaAd,
      title: "£10000+ Ad Spend Managed",
      description: "Expertise in performance marketing across major platforms",
    },
    {
      icon: FaStar,
      title: "100% Client Satisfaction",
      description: "Consistently delivering high-quality results",
    },
    {
      icon: FaGraduationCap,
      title: "Continuous Learning",
      description: "Always staying updated with the latest technologies",
    },
  ];

  const [url, setUrl] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInsights(null);
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error("URL must start with http:// or https://");
      }
      const result = await getPageInsights(url);
      if (
        result &&
        result.lighthouseResult &&
        result.lighthouseResult.categories
      ) {
        setInsights(result.lighthouseResult);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error getting page insights:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getScoreInterpretation = (score) => {
    if (score === undefined || score === null) return "unknown";
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  return (
    <>
      <Head>
        <title>
          Karthik Nishanth - Elite Full Stack Developer & Performance Marketing
          Expert | Liverpool, UK
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Karthik Nishanth: An elite Full Stack Developer and Performance Marketing Expert based in Liverpool, UK. Transforming ideas into cutting-edge web solutions and driving growth through strategic digital advertising."
        />
        <meta
          name="keywords"
          content="Elite Full Stack Developer, Web Development Expert, React, Node.js, JavaScript, TypeScript, GraphQL, Performance Marketing, Google Ads, Meta Ads, TikTok Ads, Liverpool, UK"
        />
        <meta name="author" content="Karthik Nishanth" />
        <link rel="canonical" href="https://karthiknish.com/" />
      </Head>

      <div className="bg-gray-100 min-h-screen font-sans">
        <main className="container mx-auto px-6 py-8">
          <section className="text-center mb-16">
            <motion.h1
              className="text-6xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Karthik Nishanth
            </motion.h1>
            <motion.p
              className="text-2xl text-gray-600 mb-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Elite Full Stack Developer | Performance Marketing Expert |
              Architecting Digital Excellence
            </motion.p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTwitter size={24} />
              </a>
            </motion.div>
          </section>

          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Choose Me?
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <motion.p
                className="text-gray-600 mb-4 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                As an elite Full Stack Developer and Performance Marketing
                Expert, I bring unparalleled expertise and innovation to every
                project. With a proven track record of delivering cutting-edge
                solutions and driving growth through strategic digital
                advertising, I stand out as the go-to professional for
                businesses seeking excellence in web development and online
                marketing.
              </motion.p>
              <motion.p
                className="text-gray-600 mb-4 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                My approach combines technical mastery with strategic thinking,
                ensuring that every line of code and every ad campaign
                contributes to your business objectives. From concept to
                deployment, I craft scalable, high-performance applications and
                implement data-driven marketing strategies that set new
                standards in the industry.
              </motion.p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Unmatched Skill Set
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-md font-semibold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Page Insights Tool
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="mb-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL"
                  required
                  className="w-full p-2 border rounded text-gray-800"
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Analyzing..." : "Get Page Insights"}
                </motion.button>
              </form>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-red-600"
                >
                  {error}
                </motion.div>
              )}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex justify-center items-center"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </motion.div>
              )}
              {insights && insights.categories ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Page Insights:
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {insights.categories.performance &&
                      insights.categories.performance.score !== undefined && (
                        <div className="bg-blue-100 p-4 rounded-lg">
                          <p className="text-blue-800 font-semibold">
                            Performance Score:
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {Math.round(
                              insights.categories.performance.score * 100
                            )}
                            /100
                          </p>
                        </div>
                      )}
                    {insights.categories.accessibility &&
                      insights.categories.accessibility.score !== undefined && (
                        <div className="bg-green-100 p-4 rounded-lg">
                          <p className="text-green-800 font-semibold">
                            Accessibility Score:
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {Math.round(
                              insights.categories.accessibility.score * 100
                            )}
                            /100
                          </p>
                        </div>
                      )}
                    {insights.categories["best-practices"] &&
                      insights.categories["best-practices"].score !==
                        undefined && (
                        <div className="bg-purple-100 p-4 rounded-lg">
                          <p className="text-purple-800 font-semibold">
                            Best Practices Score:
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {Math.round(
                              insights.categories["best-practices"].score * 100
                            )}
                            /100
                          </p>
                        </div>
                      )}
                    {insights.categories.seo &&
                      insights.categories.seo.score !== undefined && (
                        <div className="bg-yellow-100 p-4 rounded-lg">
                          <p className="text-yellow-800 font-semibold">
                            SEO Score:
                          </p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {Math.round(insights.categories.seo.score * 100)}
                            /100
                          </p>
                        </div>
                      )}
                  </div>
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Overall Analysis:
                    </h4>
                    <p className="text-gray-700">
                      {insights.categories.performance &&
                      insights.categories.performance.score !== undefined &&
                      insights.categories.accessibility &&
                      insights.categories.accessibility.score !== undefined &&
                      insights.categories["best-practices"] &&
                      insights.categories["best-practices"].score !==
                        undefined &&
                      insights.categories.seo &&
                      insights.categories.seo.score !== undefined ? (
                        <>
                          Your website"s performance is{" "}
                          {getScoreInterpretation(
                            insights.categories.performance.score * 100
                          ).toLowerCase()}
                          , with accessibility being{" "}
                          {getScoreInterpretation(
                            insights.categories.accessibility.score * 100
                          ).toLowerCase()}
                          , best practices{" "}
                          {getScoreInterpretation(
                            insights.categories["best-practices"].score * 100
                          ).toLowerCase()}
                          , and SEO{" "}
                          {getScoreInterpretation(
                            insights.categories.seo.score * 100
                          ).toLowerCase()}
                          . Focus on improving the lower-scoring areas to
                          enhance your overall web presence and user experience.
                        </>
                      ) : (
                        "Unable to provide a complete analysis due to missing data. Please try again or check if the URL is correct."
                      )}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </motion.section>
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Achievements That Speak Volumes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
                >
                  <achievement.icon className="mx-auto text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Innovative Thinking
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaBrain className="mx-auto text-4xl text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  AI Integration
                </h3>
                <p className="text-gray-600">
                  Leveraging cutting-edge AI to enhance user experiences
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaLightbulb className="mx-auto text-4xl text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Innovative UX Design
                </h3>
                <p className="text-gray-600">
                  Creating intuitive and engaging user interfaces
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaChartLine className="mx-auto text-4xl text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Performance Optimization
                </h3>
                <p className="text-gray-600">
                  Ensuring lightning-fast load times and smooth interactions
                </p>
              </motion.div>
            </div>
          </section>

          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Elevate Your Web Presence?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let"s collaborate to turn your vision into a digital masterpiece.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-blue-700 transition duration-300 inline-block"
              >
                Start Your Project Now
              </Link>
            </motion.div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2024 Karthik Nishanth. Crafting digital excellence.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomeScreen;
