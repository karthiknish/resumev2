import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import BlogAudioSummary from "@/components/BlogAudioSummary";
import PageContainer from "@/components/PageContainer";
import {
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/PageTransitionWrapper";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Id({ data }) {
  // Calculate estimated reading time
  const estimateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = data?.content ? estimateReadingTime(data.content) : 0;

  // Reading progress state
  const [readingProgress, setReadingProgress] = useState(0);

  // Handle scroll to update reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const currentScrollPos = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress((currentScrollPos / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateReadingProgress);

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
    };
  }, []);

  // Share functionality
  const shareArticle = (platform) => {
    const url = `https://www.karthiknish.com/blog/${data?._id}`;
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
        // Copy to clipboard
        navigator.clipboard
          .writeText(url)
          .then(() => {
            toast.success("Link copied to clipboard!", {
              className: "bg-black text-white",
            });
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy link to clipboard");
          });
    }
  };

  return (
    <>
      <Head>
        <title>{data?.title} - Karthik Nishanth | Full Stack Developer</title>
        <meta name="description" content={data?.title} />
        <meta name="keywords" content="blog, personal, karthik, nishanth" />
        <meta name="author" content="Karthik Nishanth" />
        <meta property="og:title" content={data?.title} />
        <meta property="og:description" content={data?.title} />
        <meta property="og:image" content={data?.imageUrl} />
        <meta property="og:image:alt" content={data?.title} />
        <meta
          property="og:url"
          content={`https://www.karthiknish.com/blog/${data?._id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Karthiknish" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.title} />
        <meta name="twitter:description" content={data?.title} />
        <meta name="twitter:image" content={data?.imageUrl} />
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
          href={`https://www.karthiknish.com/blog/${data?._id}`}
        />
      </Head>

      {/* Reading progress bar - fixed position with higher z-index and more visible styling */}
      <div className="fixed bottom-0 left-0 w-full h-2 z-[100] bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <PageContainer className="space-y-8 font-calendas max-w-4xl mx-auto">
        <Link href="/blog">
          <motion.div
            className="flex items-center text-blue-400 mb-4 hover:underline"
            variants={fadeInUpVariants}
            initial="initial"
            animate="animate"
          >
            ← Back to all articles
          </motion.div>
        </Link>

        <Card className="border-none bg-black/60 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {data && (
              <div className="flex flex-col">
                <motion.div variants={fadeInUpVariants} className="relative">
                  <div className="relative w-full h-[400px] mb-8 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={data.imageUrl}
                      alt={data.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black "></div>
                  </div>
                  {data.tags && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm">{data.tags}</span>
                    </div>
                  )}
                </motion.div>

                <div className="flex flex-col">
                  <motion.h1
                    variants={fadeInUpVariants}
                    className="text-4xl font-bold text-white mb-4 font-calendas"
                  >
                    {data?.title}
                  </motion.h1>

                  <motion.div
                    variants={fadeInUpVariants}
                    className="flex flex-wrap items-center gap-4 text-gray-400 mb-6"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {new Date(
                          data?.createdAt || Date.now()
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{readingTime} min read</span>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => shareArticle("twitter")}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => shareArticle("facebook")}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => shareArticle("linkedin")}
                        className="text-gray-400 hover:text-blue-700 transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => shareArticle("copy")}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                        aria-label="Copy link"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </button>
                    </div>
                  </motion.div>

                  <Separator className="my-6 bg-gray-700" />

                  {/* Audio Player */}
                  {data?.content && (
                    <motion.div variants={fadeInUpVariants} className="mb-8">
                      <BlogAudioSummary
                        title={data.title}
                        content={data.content}
                        blogId={data._id}
                      />
                    </motion.div>
                  )}

                  {data && data.content && (
                    <motion.div
                      variants={fadeInUpVariants}
                      className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1 font-calendas prose-blockquote:border-blue-500 prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-md prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded prose-code:text-blue-300"
                    >
                      <ReactMarkdown>{data.content}</ReactMarkdown>
                    </motion.div>
                  )}

                  <Separator className="my-8 bg-gray-700" />

                  <motion.div
                    variants={fadeInUpVariants}
                    className="flex justify-between items-center"
                  >
                    <Link href="/blog">
                      <span className="text-blue-400 hover:underline">
                        ← More articles
                      </span>
                    </Link>

                    {data?.tags && (
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">{data.tags}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </Card>
      </PageContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await fetch(`${process.env.URL}/api/blog?slug=${id}`);
  const blogData = await response.json();
  const data = blogData.data;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
}

export default Id;

