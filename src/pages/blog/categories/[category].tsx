// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTag, FaClock } from "react-icons/fa";
import { runQuery, fieldFilter } from "@/lib/firebase";

import Loader from "../../../components/Loader";

interface Post {
  _id: string;
  slug: string;
  title: string;
  image?: string;
  excerpt?: string;
  content: string;
  category: string;
  createdAt: string;
}

interface CategoryPageProps {
  initialPosts: Post[];
  categoryName: string;
}

export default function CategoryPage({ initialPosts = [], categoryName }: CategoryPageProps) {
  const router = useRouter();
  const { category } = router.query;
  const currentCategory = categoryName || (category as string);
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  if (router.isFallback) {
    return <Loader />;
  }

  if (!currentCategory) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${currentCategory} - Blog Categories`}</title>
        <meta
          name="description"
          content={`Blog posts in the ${currentCategory} category`}
        />
      </Head>

      <main className="container mx-auto px-4 py-16 min-h-screen bg-white">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-900 hover:text-gray-700"
          >
            <FaArrowLeft className="mr-2" /> Back to All Posts
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-900">
            Category: <span className="text-gray-700">{currentCategory}</span>
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
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
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
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 mb-4 line-clamp-3">
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
    </>
  );
}

export async function getStaticPaths() {
  console.log("[getStaticPaths /blog/categories/[category]] Running...");
  try {
    const blogs = await runQuery<Post>(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)]
    );

    const categorySet = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.category && blog.category !== "" && blog.category !== "Uncategorized") {
        categorySet.add(blog.category);
      }
    });

    const paths = Array.from(categorySet).map((category) => ({
      params: { category },
    }));

    console.log(`[getStaticPaths /blog/categories/[category]] Generated ${paths.length} paths.`);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("[getStaticPaths /blog/categories/[category]] Error:", error);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }: { params: { category: string } }) {
  const { category } = params;
  console.log(`[getStaticProps /blog/categories/${category}] Running...`);

  try {
    const blogs = await runQuery<Post>(
      "blogs",
      [
        fieldFilter("isPublished", "EQUAL", true),
        fieldFilter("category", "EQUAL", category)
      ],
      { field: { fieldPath: "createdAt" }, direction: "DESCENDING" }
    );

    console.log(`[getStaticProps /blog/categories/${category}] Found ${blogs.length} posts.`);

    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(blogs)),
        categoryName: category,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`[getStaticProps /blog/categories/${category}] Error:`, error);
    return {
      props: {
        initialPosts: [],
        categoryName: category,
      },
      revalidate: 60,
    };
  }
}

