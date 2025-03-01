import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import BlogAudioSummary from "@/components/BlogAudioSummary";

function Id({ data }) {
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
      <div className="min-h-screen bg-black/95 p-8 relative font-calendas">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-black/60 backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {data && (
                <div className="flex flex-col">
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="w-full h-[400px] object-cover rounded-lg mb-8"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-4xl font-bold text-white mb-8 font-calendas">
                      {data?.title}
                    </h1>

                    {/* Add the BlogAudioSummary component */}
                    {data?.content && (
                      <BlogAudioSummary
                        title={data.title}
                        content={data.content}
                      />
                    )}

                    {data && data.content && (
                      <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1 font-calendas">
                        <ReactMarkdown>{data.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </Card>
        </div>
      </div>
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
