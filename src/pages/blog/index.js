import { useEffect, useState } from "react";
import Head from "next/head";
import limitCharacters from "limit-characters";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
function Index({ data = [] }) {
  const [limitedContent, setLimitedContent] = useState([]);
  useEffect(() => {
    setLimitedContent(
      data.map((d) => ({
        ...d,
        limitedContent: limitCharacters({ text: d?.content, length: 250 }),
      }))
    );
  }, [data]);
  return (
    <>
      <Head>
        <title>blogs // karthik nishanth.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A personal blog by Karthik Nishanth"
        />
        <meta name="keywords" content="blog, personal, karthik, nishanth" />
        <meta name="author" content="Karthik Nishanth" />
      </Head>
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black"
      >
        <div className="px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-white capitalize lg:text-3x">
            From the blog
          </h1>

          {limitedContent?.length !== 0 &&
            limitedContent
              .slice()
              .reverse()
              .map((d) => (
                <div
                  style={{ cursor: "pointer" }}
                  key={d?._id}
                  onClick={() => Router.push(`/blog/${d?.slug}`)}
                  className="mt-8 lg:-mx-6 lg:flex lg:items-center "
                >
                  <img
                    src={d?.imageUrl}
                    alt="cover image"
                    className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl max-h-72 lg:h-96"
                  />

                  <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
                    <p className="block mt-4 text-2xl font-semibold text-white ">
                      {d?.title}
                    </p>

                    <p
                      dangerouslySetInnerHTML={{
                        __html: limitCharacters({
                          text: d?.content,
                          length: 250,
                        }),
                      }}
                      className="mt-3 text-sm prose prose-strong:text-white font-mono text-gray-200 md:text-sm"
                    ></p>

                    <p className="inline-block mt-2 text-blue-500 font-mono underline hover:text-blue-400">
                      Read more
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </motion.section>
    </>
  );
}
export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.URL}/api/blog`, {
      method: "GET",
    });
    const responseData = await response.json();

    return {
      props: {
        data: responseData.data,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        data: [],
      },
    };
  }
}
export default Index;
