import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
function Id() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const query = router.query.id;

  useEffect(() => {
    if (query) {
      const getBlog = async () => {
        try {
          const response = await fetch(`/api/blog?id=${query}`);
          const blogData = await response.json();
          setData(blogData.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      getBlog();
    }
  }, [query]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-full h-40 bg-gray-200"></div>
      <div className="p-2">
        <div className="h-6 bg-gray-200 w-1/2 mt-4"></div>
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
        <title>{data?.title}</title>
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
        />{" "}
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
        <meta name="apple-mobile-web-app-title" content="KArthiknish" />{" "}
        <meta name="msapplication-TileColor" content="#000000" />{" "}
        <meta name="google" content="notranslate" />{" "}
        <link
          rel="canonical"
          href={`https://www.karthiknish.com/blog/${data?._id}`}
        />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header>
          <Link
            href={{
              pathname: "/",
              //   query: { comeThru: comeThru ? "true" : undefined },
            }}
          >
            <h1>karthik nishanth.</h1>
            <span></span>
          </Link>
          <div>
            <Link href="/blog">Blog</Link>
            <span></span>
            <span className="alt"></span>
          </div>
        </header>
        {data && (
          <div className="flex flex-col">
            <Image
              className="w-full h-40 object-cover"
              width="0"
              height="0"
              sizes="100vw"
              alt="headimage"
              src={data.imageUrl}
            />

            <div className="flex flex-col p-2">
              <h1 className="text-4xl p-2 text-white">{data?.title}</h1>
              {data && data.content && (
                <div
                  className="p-3 prose-strong:text-2xl prose-p:m-2 text-gray-200"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                ></div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Id;
