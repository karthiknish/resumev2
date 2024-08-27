import { useEffect, useState } from "react";
import Head from "next/head";
import limitCharacters from "limit-characters";
import Router from "next/router";
import { motion } from "framer-motion";

function Index({ data = [] }) {
  const [limitedContent, setLimitedContent] = useState([]);

  useEffect(() => {
    setLimitedContent(
      data.map((post) => ({
        ...post,
        limitedContent: limitCharacters({ text: post.content, length: 250 }),
      }))
    );
  }, [data]);

  return (
    <>
      <Head>
        <title>Blog // Karthik Nishanth</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Personal blog by Karthik Nishanth" />
        <meta name="keywords" content="blog, personal, karthik, nishanth" />
        <meta name="author" content="Karthik Nishanth" />
      </Head>
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white min-h-screen"
      >
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-black mb-8">From the Blog</h1>

          {limitedContent.length > 0 && (
            <div className="space-y-12">
              {limitedContent.reverse().map((post) => (
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
                      <h2 className="text-2xl font-semibold text-black mb-4 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: post.limitedContent,
                        }}
                        className="text-gray-700 mb-4 font-mono"
                      />
                      <p className="text-blue-600 font-mono underline group-hover:text-blue-800 transition-colors">
                        Read more
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
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
