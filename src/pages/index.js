import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";
import Chatbot from "../components/Chatbot";
const HomeScreen = () => {
  const cards = [
    {
      title: "My Blog",
      bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      secondColor: "bg-cyan-400",
      href: "/blog",
    },
    {
      title: "View My Projects",
      bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
      secondColor: "bg-indigo-300",
      href: "/projects",
    },
    {
      title: "Programming Skills and Tools",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      secondColor: "bg-slate-400",
      href: "/skills",
    },
  ];
  return (
    <>
      <Head>
        <title>
          Karthik Nishanth - Freelance Web Developer in Liverpool, UK
        </title>

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Karthik Nishanth: A Liverpool-based freelance web developer and designer, crafting elegant web solutions for businesses in the UK."
        />
        <meta
          name="keywords"
          content="freelance web developer, Liverpool, UK, web design, Karthik Nishanth"
        />
        <meta name="author" content="Karthik Nishanth" />

        <link rel="canonical" href="https://karthiknish.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta
          property="og:title"
          content="Karthik Nishanth - Freelance Web Developer in Liverpool, UK"
        />
        <meta
          property="og:description"
          content="Karthik Nishanth: A Liverpool-based freelance web developer and designer, crafting elegant web solutions for businesses in the UK."
        />
        <meta
          property="og:image"
          content="https://media.licdn.com/dms/image/C4E03AQEJdFeqoffB_g/profile-displayphoto-shrink_800_800/0/1603790440614?e=1699488000&v=beta&t=dwg4dZ4yoUI53_8YL4ivkY0YhTSTpvhhzzRZMtKrVOQ"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://karthiknish.com/" />
        <meta
          property="twitter:title"
          content="Karthik Nishanth - Freelance Web Developer in Liverpool, UK"
        />
        <meta
          property="twitter:description"
          content="Karthik Nishanth: A Liverpool-based freelance web developer and designer, crafting elegant web solutions for businesses in the UK."
        />
        <meta
          property="twitter:image"
          content="https://media.licdn.com/dms/image/C4E03AQEJdFeqoffB_g/profile-displayphoto-shrink_800_800/0/1603790440614?e=1699488000&v=beta&t=dwg4dZ4yoUI53_8YL4ivkY0YhTSTpvhhzzRZMtKrVOQ"
        />
      </Head>

      <div className="md:max-h-screen bg-black text-white font-poppins overflow-hidden">
        <main className="p-4 md:px-0 h-full flex flex-col">
          <div className="text-white px-4 md:px-0 h-full font-poppins">
            <div className="flex flex-col md:flex-row">
              <div className="relative md:mx-10 w-full my-4">
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-10 bg-green-300 border-8 z-20 border-yellow-300"
                >
                  <h1 className="text-6xl font-serif text-teal-900 font-bold">
                    Hi! I m karthik.
                  </h1>
                  <h2 className="text-xl text-gray-700 font-mono">
                    A talented Business Analyst graduate, freelance web
                    developer, and designer based in Liverpool. I am passionate
                    about creating cutting-edge, elegant products designed to
                    solve problems and deliver exceptional user experiences.
                  </h2>
                  <br />
                  <div className="flex flex-col gap-2">
                    <Link
                      className="font-mono text-xl text-indigo-500 font-bold underline"
                      href="/about"
                    >
                      more about me &rarr;
                    </Link>

                    <Link
                      className="font-mono text-xl text-indigo-500 font-bold underline"
                      href="/contact"
                    >
                      contact &rarr;
                    </Link>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute top-5 left-5 w-full h-full bg-blue-500 z-10"
                ></motion.div>
              </div>
              <motion.div
                className="flex flex-col w-full gap-10 md:m-8 my-8 md:my-0 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                {cards.map((card) => (
                  <div key={card.title} className="relative z-10">
                    <Link href={card.href} key={card.title}>
                      <div
                        className={`text-white font-mono p-6 shadow-lg flex  items-center  justify-center ${card.bgColor} hover:bg-opacity-80 transition-all duration-300 cursor-pointer`}
                      >
                        {card.title} &rarr;
                      </div>
                    </Link>
                    <div
                      className={`absolute w-full h-full top-2 left-2 -z-10 ${card.secondColor}`}
                    ></div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <Chatbot />

          <div className="text-gray-300 text-2xl font-mono mx-auto mt-8">
            <Link href="/subscribe">
              subscribe to my newsletter here! &rarr;
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};
export default HomeScreen;
