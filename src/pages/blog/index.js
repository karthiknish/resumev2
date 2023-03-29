import { useEffect, useState } from "react";
import Head from "next/head";
import limitCharacters from "limit-characters";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
function Index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch("/api/blog", {
        method: "GET",
      });
      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="p-2">
        <div className="h-6 bg-gray-200 w-full mt-4"></div>
        <div className="h-4 bg-gray-200 w-full mt-2"></div>
        <div className="h-4 bg-gray-200 w-full mt-2"></div>
        <div className="h-4 bg-gray-200 w-3/4 mt-2"></div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <Head>
        <title>Blogs // karthik nishanth.</title>
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
        <header>
          <Link
            href={{
              pathname: "/",
            }}
          >
            <h1>karthik nishanth.</h1>

            <span></span>
          </Link>

          <div>
            <span></span>

            <span className="alt"></span>
          </div>
        </header>
        <div className="container px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-white capitalize lg:text-3x">
            From the blog
          </h1>

          {data?.length !== 0 &&
            data.map((d) => (
              <>
                <div
                  style={{ cursor: "pointer" }}
                  key={d?._id}
                  onClick={() => Router.push(`/blog/${d?._id}`)}
                  className="mt-8 lg:-mx-6 lg:flex lg:items-center "
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96"
                    src={d?.imageUrl}
                    alt="cover image"
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
                      className="mt-3 text-sm prose prose-strong:text-white text-gray-200 md:text-sm"
                    ></p>

                    <a
                      href="#"
                      className="inline-block mt-2 text-blue-500 underline hover:text-blue-400"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </>
            ))}
        </div>
      </motion.section>
    </>
  );
}

export default Index;
