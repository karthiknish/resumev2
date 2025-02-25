import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa";

// Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);

  useEffect(() => {
    async function fetchArchiveData() {
      try {
        setLoading(true);
        const res = await fetch("/api/blog/archive");

        if (!res.ok) {
          throw new Error("Failed to fetch archive data");
        }

        const data = await res.json();
        setArchiveData(data.archiveData);

        // Auto-expand the most recent year
        if (data.archiveData && Object.keys(data.archiveData).length > 0) {
          const years = Object.keys(data.archiveData).sort((a, b) => b - a);
          setExpandedYear(years[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching archive data:", err);
        setError("Failed to load archive data. Please try again later.");
        setLoading(false);
      }
    }

    fetchArchiveData();
  }, []);

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <>
      <Head>
        <title>Blog Archive</title>
        <meta name="description" content="Browse our blog posts by date" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Blog Archive
            </h1>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : Object.keys(archiveData).length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No posts found in the archive.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {Object.keys(archiveData)
                .sort((a, b) => b - a) // Sort years in descending order
                .map((year) => (
                  <div key={year} className="mb-6">
                    <button
                      onClick={() => toggleYear(year)}
                      className="flex items-center justify-between w-full text-left font-semibold text-xl text-gray-800 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        <span>{year}</span>
                      </div>
                      <div className="text-gray-500">
                        {expandedYear === year ? (
                          <span className="text-sm">▼</span>
                        ) : (
                          <span className="text-sm">▶</span>
                        )}
                      </div>
                    </button>

                    {expandedYear === year && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 ml-6 border-l-2 border-gray-200 pl-4"
                      >
                        {Object.keys(archiveData[year])
                          .sort((a, b) => b - a) // Sort months in descending order
                          .map((month) => (
                            <div key={`${year}-${month}`} className="mb-4">
                              <h3 className="font-medium text-lg text-gray-700 mb-2">
                                {format(new Date(year, month - 1, 1), "MMMM")}
                              </h3>
                              <ul className="space-y-3">
                                {archiveData[year][month].map((post) => (
                                  <li
                                    key={post._id}
                                    className="hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                                  >
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      className="flex flex-col md:flex-row md:items-center justify-between"
                                    >
                                      <div className="flex-grow">
                                        <h4 className="text-blue-600 hover:text-blue-800 font-medium">
                                          {post.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                          {post.excerpt ||
                                            post.content.substring(0, 100)}
                                          ...
                                        </p>
                                      </div>
                                      <div className="flex items-center mt-2 md:mt-0">
                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center mr-2">
                                          <FaTag className="mr-1" />{" "}
                                          {post.category}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {format(
                                            parseISO(post.createdAt),
                                            "MMM d"
                                          )}
                                        </span>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
