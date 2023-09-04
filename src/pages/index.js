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
        <title>karthik nishanth.</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A creative designer and developer based in Liverpool, passionate about building elegant products designed to solve problems."
        />
        <meta
          name="keywords"
          content="web development, design, Liverpool, freelance, business analyst"
        />
        <meta name="author" content="Karthik Nishanth" />

        <meta name="author" content="Karthik Nishanth" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta
          property="og:title"
          content="Karthik Nishanth - Web Developer and Designer"
        />
        <meta
          property="og:description"
          content="A creative designer and developer based in Liverpool."
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/path/to/your-image.jpg"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://karthiknish.com/" />
        <meta
          property="twitter:title"
          content="Karthik Nishanth - Web Developer and Designer"
        />
        <meta
          property="twitter:description"
          content="A creative designer and developer based in Liverpool."
        />
        <meta
          property="twitter:image"
          content="https://media.licdn.com/dms/image/C4E03AQEJdFeqoffB_g/profile-displayphoto-shrink_100_100/0/1603790440614?e=1685577600&v=beta&t=6kdvYfBvqFT-ItGt4UEWwjo6oFpAxpdhnmnDmnAdmsw"
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
