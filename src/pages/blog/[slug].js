import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import rehypeHighlight from "rehype-highlight"; // Import the plugin
import PageContainer from "@/components/PageContainer";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import RelatedPosts from "@/components/RelatedPosts";
import CommentsSection from "@/components/CommentsSection";
import JsonLd, { createBlogPostingSchema } from "@/components/JsonLd"; // Import JsonLd and schema function
import { useSession } from "next-auth/react"; // Import useSession for admin check
import TipTapRenderer from "@/components/TipTapRenderer"; // Import TipTapRenderer
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import { checkAdminStatus } from "@/lib/authUtils";
import dbConnect from "@/lib/dbConnect"; // <-- Import dbConnect
import Blog from "@/models/Blog"; // <-- Import Blog model
import { ChevronUpIcon } from "@heroicons/react/24/solid";

function SlugPage({ data, relatedPosts }) {
  // Add relatedPosts to props destructuring
  // Ref for the main content card
  const contentRef = useRef(null);
  const router = useRouter();
  const { slug } = router.query;

  // Admin session check
  const { data: session } = useSession();
  const isAdmin = checkAdminStatus(session);

  // Calculate estimated reading time
  const estimateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = data?.content ? estimateReadingTime(data.content) : 0;

  // Add useEffect for gtag tracking
  useEffect(() => {
    if (data && typeof window.gtag === "function") {
      window.gtag("event", "view_item", {
        event_category: "blog",
        event_label: data.title, // Use data.title
        items: [
          {
            item_id: data._id, // Use data._id
            item_name: data.title, // Use data.title
            item_category: data.category || "Uncategorized",
            // Add other relevant item parameters if available
          },
        ],
      });
    }
  }, [data]); // Trigger when data prop changes

  // Share functionality
  const shareArticle = (platform) => {
    const slugOrId = data?.slug || data?._id;
    if (!slugOrId) {
      toast.error("Cannot generate share link.");
      return;
    }
    const url = `https://www.karthiknish.com/blog/${slugOrId}`;
    const title = data?.title || "Blog post";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      default:
        navigator.clipboard
          .writeText(url)
          .then(() => {
            toast.success("Link copied to clipboard!", {
              className: "bg-black text-white", // Ensure this matches Toaster options if needed
            });
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy link to clipboard");
          });
    }
  };

  // Check if data prop exists (primarily handles case where GSSP might fail unexpectedly)
  // getServerSideProps should already return notFound:true for missing/unpublished posts
  if (!data) {
    return (
      <PageContainer bgClassName="bg-white">
        <div className="text-center text-gray-400 py-20">
          Post not found or there was an error loading it.
        </div>
      </PageContainer>
    );
  }

  // Debug log for audio URL
  // console.log("[Blog Page] data.audioSummaryUrl:", data?.audioSummaryUrl);

  // Generate BlogPosting schema
  const blogPostingSchema = data ? createBlogPostingSchema(data) : null;

  // ─── Scroll‑to‑top indicator state & effect ─────────────────────────
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollY = window.scrollY;
      const scrolled = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
      setShowScrollTopButton(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Add JsonLd component */}
      {blogPostingSchema && <JsonLd data={blogPostingSchema} />}
      <Head>
        <title>{data.title} - Karthik Nishanth | Full Stack Developer</title>
        <meta name="description" content={data.description || data.title} />
        <meta
          name="keywords"
          content={`blog, ${data.tags?.join(", ") || ""}, karthik, nishanth, ${
            data.category || ""
          }`}
        />
        <meta name="author" content="Karthik Nishanth" />
        <meta property="og:title" content={data.title} />
        <meta
          property="og:description"
          content={data.description || data.title}
        />
        <meta property="og:image" content={data.imageUrl} />
        <meta property="og:image:alt" content={data.title} />
        <meta
          property="og:url"
          content={`https://www.karthiknish.com/blog/${data.slug || data._id}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Karthiknish" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta
          name="twitter:description"
          content={data.description || data.title}
        />
        <meta name="twitter:image" content={data.imageUrl} />
        <meta name="twitter:site" content="@karthiknish" />
        <meta name="twitter:creator" content="@karthiknish" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Karthiknish" />
        <meta name="google" content="notranslate" />
        <link
          rel="canonical"
          href={`https://www.karthiknish.com/blog/${data.slug || data._id}`}
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {showScrollTopButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed left-6 bottom-6 z-50 w-14 h-14 rounded-full  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute">
            <ChevronUpIcon className="w-7 h-7 text-white" />
          </div>
          <svg className="w-14 h-14 -rotate-90 absolute">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-white/20"
              fill="none"
              strokeWidth="2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-white"
              fill="none"
              strokeWidth="2"
              strokeDasharray={`${scrollProgress}, 100`}
              pathLength="100"
            />
          </svg>
        </motion.button>
      )}
      <PageContainer>
        <div
          className="relative min-h-screen bg-background py-24"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />
          <div className="max-w-5xl mx-auto px-4 pt-4 sm:px-6 md:px-8 relative z-10">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.98 }}
              className="mb-12 inline-block"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-semibold shadow-sm transition-colors duration-200"
              >
                <motion.svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, -2, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </motion.svg>
                <span className="text-base sm:text-lg">
                  Back to all articles
                </span>
              </Link>
            </motion.div>
            {/* Assign the ref to the Card component */}

            <motion.article
              ref={contentRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-slate-200 p-6 sm:p-8 md:p-12 rounded-3xl shadow-sm"
            >
              <motion.div
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                <div className="flex flex-col">
                  <motion.div
                    variants={fadeInUpVariants}
                    className="relative mb-12"
                  >
                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[500px] rounded-3xl shadow overflow-hidden group">
                      <Image
                        src={data.imageUrl}
                        alt={data.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                        priority
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    {data.tags && data.tags.length > 0 && (
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-wrap gap-2 sm:gap-3">
                        {data.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            className="bg-white text-brandSecondary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium shadow border border-brandSecondary/30 text-xs sm:text-sm"
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <div className="flex flex-col">
                    <motion.h1
                      variants={fadeInUpVariants}
                      className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 sm:mb-8 leading-tight"
                    >
                      {data.title}
                    </motion.h1>
                    {/* Admin-only Edit Button */}
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-8 inline-block"
                      >
                        <Link
                          href={`/admin/blog/edit/${data._id}`}
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold shadow-lg text-sm sm:text-base"
                        >
                          <span className="text-xl"></span>
                          Edit Article
                        </Link>
                      </motion.div>
                    )}

                    <motion.div
                      variants={fadeInUpVariants}
                      className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-slate-600 mb-6 sm:mb-8 bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base sm:text-lg">
                          {new Date(
                            data.createdAt || Date.now()
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base sm:text-lg">
                          {readingTime} min read
                        </span>
                      </div>

                      {/* Social Share Buttons */}
                      <div className="flex items-center gap-2 sm:gap-4 ml-0 md:ml-auto">
                        <span className="font-bold text-base sm:text-lg hidden md:inline-flex items-center gap-2">
                          <span className="text-2xl"></span>
                          Share:
                        </span>
                        <motion.button
                          onClick={() => shareArticle("twitter")}
                          className="p-2 sm:p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-colors duration-200 shadow-sm"
                          aria-label="Share on Twitter"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => shareArticle("facebook")}
                          className="p-2 sm:p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-colors duration-200 shadow-sm"
                          aria-label="Share on Facebook"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => shareArticle("linkedin")}
                          className="p-2 sm:p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-colors duration-200 shadow-sm"
                          aria-label="Share on LinkedIn"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => shareArticle("copy")}
                          className="p-2 sm:p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-colors duration-200 shadow-sm"
                          aria-label="Copy link"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>

                    <Separator className="my-8 bg-slate-200 h-px" />

                    {/* Removed Audio Player Section */}

                    {data.content && (
                      <motion.div
                        variants={fadeInUpVariants}
                        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-slate-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-slate-900 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:bg-slate-100 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:my-6 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:p-6"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <TipTapRenderer content={data.content} />
                      </motion.div>
                    )}

                    <Separator className="my-12 bg-slate-200 h-px" />

                    <motion.div
                      variants={fadeInUpVariants}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <motion.div whileHover={{ x: -3 }}>
                        <Link
                          href="/blog"
                          className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold text-lg transition-colors duration-200"
                        >
                          <motion.svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, -2, 0] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19l-7-7 7-7"
                            />
                          </motion.svg>
                          More articles
                        </Link>
                      </motion.div>

                      {data.tags && data.tags.length > 0 && (
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="flex items-center gap-2 text-slate-600 font-semibold">
                            <span className="text-2xl"></span>
                            Tags:
                          </span>
                          {data.tags.map((tag) => (
                            <motion.span
                              key={tag}
                              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-medium border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Render Related Posts Section */}
              <RelatedPosts posts={relatedPosts} />

              {/* Render Comments Section with themed container */}
              <div className="mt-16">
                <CommentsSection blogPostId={data._id} />
              </div>
            </motion.article>
          </div>
        </div>
      </PageContainer>

      {/* Scroll to top button with progress indicator */}
    </>
  );
}

// --- Update getStaticPaths function ---
export async function getStaticPaths() {
  await dbConnect();
  // Fetch slug AND _id for logging purposes
  const posts = await Blog.find({ isPublished: true })
    .select("slug _id")
    .lean();

  const paths = posts
    .map((post) => {
      if (!post.slug || typeof post.slug !== "string") {
        console.warn(
          `[getStaticPaths] Post with ID ${post._id} is missing a valid slug. Skipping path generation.`
        );
        return null; // Skip this post
      }
      return {
        params: { slug: post.slug }, // Use the valid slug
      };
    })
    .filter(Boolean); // Remove any null entries from the array

  // If no valid paths found after filtering, log a more specific message
  if (paths.length === 0 && posts.length > 0) {
    console.error(
      "[getStaticPaths] No valid slugs found for published posts. Check database entries."
    );
  } else if (paths.length === 0) {
    console.warn(
      "[getStaticPaths] No published posts found to generate paths."
    );
  }

  return {
    paths: paths,
    fallback: "blocking",
  };
}

// --- Update getStaticProps function ---
export async function getStaticProps(context) {
  const { slug } = context.params; // Get slug from context.params

  try {
    await dbConnect(); // Connect to DB

    // Fetch the specific blog post by SLUG
    const post = await Blog.findOne({ slug: slug }).lean(); // <-- Fetch by slug

    // If no post found or it's not published, return 404
    // (Slug uniqueness should be handled by schema index)
    if (!post || !post.isPublished) {
      return {
        notFound: true,
      };
    }

    // --- Fetch related posts (logic remains similar) ---
    let relatedPosts = [];
    try {
      const relatedQuery = {
        isPublished: true,
        _id: { $ne: post._id }, // Exclude the current post by ID
        $or: [{ category: post.category }, { tags: { $in: post.tags || [] } }],
      };
      relatedPosts = await Blog.find(relatedQuery)
        .select("title slug _id imageUrl createdAt")
        .limit(3)
        .sort({ createdAt: -1 })
        .lean();
      relatedPosts = relatedPosts.filter(
        (p) => p._id.toString() !== post._id.toString()
      );
    } catch (error) {
      console.error("[Related Posts] Error fetching:", error);
      relatedPosts = [];
    }
    // --- End Fetch related posts ---

    return {
      props: {
        data: JSON.parse(JSON.stringify(post)),
        relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps for blog post:", error);
    return {
      notFound: true,
    };
  }
}

export default SlugPage; // Renamed component export

