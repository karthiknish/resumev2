import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTag, FaClock } from "react-icons/fa";

// Components
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    async function fetchCategoryPosts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/categories/${category}`);

        if (!res.ok) {
          throw new Error("Failed to fetch category posts");
        }

        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category posts:", err);
        setError(
          "Failed to load posts for this category. Please try again later."
        );
        setLoading(false);
      }
    }

    fetchCategoryPosts();
  }, [category]);

  if (!category) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{category} - Blog Categories</title>
        <meta
          name="description"
          content={`Blog posts in the ${category} category`}
        />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to All Posts
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-800">
            Category: <span className="text-blue-600">{category}</span>
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No posts found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image || "/images/default-blog.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaTag className="mr-1" />
                          <span>{post.category}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
