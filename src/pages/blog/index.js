"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import limitCharacters from "limit-characters";
import Router from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { FaSearch, FaFolderOpen, FaArchive } from "react-icons/fa";

function Index({ data = [] }) {
  const [limitedContent, setLimitedContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Sort posts by createdAt date in descending order
    const sortedData = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setLimitedContent(
      sortedData.map((post) => ({
        ...post,
        limitedContent: limitCharacters({ text: post.content, length: 250 }),
      }))
    );
  }, [data]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      Router.push(`/blog/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <Head>
        <title>Blog - Karthik Nishanth | Full Stack Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Personal blog by Karthik Nishanth" />
        <meta name="keywords" content="blog, personal, karthik, nishanth" />
        <meta name="author" content="Karthik Nishanth" />
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-white font-calendas">
                  From the Blog
                </h1>

                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search posts..."
                      className="px-3 py-2 bg-black/40 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                      aria-label="Search"
                    >
                      <FaSearch />
                    </button>
                  </form>

                  <div className="flex gap-2">
                    <Link
                      href="/blog/categories"
                      className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-gray-700 rounded-md text-white hover:bg-black/60 transition-colors"
                    >
                      <FaFolderOpen /> Categories
                    </Link>
                    <Link
                      href="/blog/archive"
                      className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-gray-700 rounded-md text-white hover:bg-black/60 transition-colors"
                    >
                      <FaArchive /> Archive
                    </Link>
                  </div>
                </div>
              </div>

              {limitedContent.length > 0 && (
                <div className="space-y-12">
                  {limitedContent.map((post) => (
                    <div
                      key={post._id}
                      onClick={() => Router.push(`/blog/${post.slug}`)}
                      className="cursor-pointer group"
                    >
                      <div className="flex flex-col lg:flex-row items-center gap-8">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full lg:w-1/2 h-64 lg:h-96 object-cover rounded-lg"
                        />
                        <div className="lg:w-1/2">
                          <h2 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-500 transition-colors font-calendas">
                            {post.title}
                          </h2>
                          <div className="text-gray-300 mb-4 font-calendas prose prose-invert max-w-none prose-p:text-gray-300 prose-a:text-blue-400">
                            <ReactMarkdown>{post.limitedContent}</ReactMarkdown>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-blue-500 font-calendas underline group-hover:text-blue-400 transition-colors">
                              Read more
                            </p>
                            {post.category && (
                              <Link
                                href={`/blog/categories/${post.category}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-800/50 transition-colors"
                              >
                                {post.category}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.URL}/api/blog`);
    const { data } = await response.json();
    return { props: { data } };
  } catch (err) {
    console.error(err);
    return { props: { data: [] } };
  }
}

export default Index;
