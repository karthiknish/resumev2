import { useEffect, useState, createRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";

function About() {
  const [animationEnd, setAnimationEnd] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (animationEnd) {
      setCurrentMessageIndex(messages.length);
    }
  }, [animationEnd]);
  const messages = [
    "Hey there! I'm Karthik Nishanth!",
    "I'm based in Liverpool and currently freelancing, while actively seeking opportunities in web/app development and design 🚀",
    "With a passion for solving real-life challenges, I excel at designing and implementing efficient and elegant solutions 🌟",
    "My most significant accomplishment so far is YouMusic, where I utilized YouTube API to develop a feature-rich music player with search and recommendation capabilities 🎵",
    "As a designer, my focus lies in crafting stunning, accessible, and user-friendly interfaces that elevate the user experience 🎨",
    "I've honed my skills in top-notch technologies and programming languages, and I'm always eager to learn more!",
    "Additionally, I take pride in contributing to open-source software and the broader tech community 🌐",
    "My enthusiasm for UI/UX drives me to create websites that are not only visually appealing but also high-performing and seamless for users 👥",
    "Currently, I'm pursuing tech-related product or software engineering roles for 2023, where I can make a significant impact 🎯",
    "I have a strong aptitude for analytics, which enables me to create data-driven designs and strategies, optimizing user engagement and satisfaction 📊",
    "My keen attention to detail and extensive experience make me a valuable asset for any company seeking innovative talent 🌟",
    "Let's collaborate and create something amazing together! 🤝",
  ];
  const messageRefs = messages.map(() => createRef());
  useEffect(() => {
    if (animationEnd) {
      setCurrentMessageIndex(messages.length);
    }
  }, [animationEnd]);
  const scrollToMessage = (index) => {
    if (messageRefs[index] && messageRefs[index].current) {
      messageRefs[index].current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  return (
    <>
      <Head>
        <title>about me // karthik nishanth.</title>
        <meta
          name="description"
          content="A creative designer, developer, and analyst based in Liverpool."
        />
      </Head>
      <div className="min-h-screen flex flex-col justify-center">
        <h1 className="text-white mx-auto py-3 text-4xl font-mono">About me</h1>
        <div className="w-full p-4">
          <ul className="p-2 flex flex-col mx-auto space-y-4">
            {messages.map((message, i) => (
              <AnimatePresence key={i}>
                {i <= currentMessageIndex && (
                  <motion.li
                    ref={messageRefs[i]}
                    className={` max-w-lg font-display text-xl px-4 py-2 rounded-lg text-white ${
                      i % 2 === 0
                        ? "self-start bg-purple-800"
                        : "self-end bg-green-500"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.2 }}
                    onAnimationComplete={() => {
                      if (!animationEnd && i === currentMessageIndex) {
                        setCurrentMessageIndex(i + 1);
                      }
                      scrollToMessage(i);
                    }}
                  >
                    {i === messages.length - 1 ? (
                      <Link className="text-rose-800" href="/contact">
                        {message}
                      </Link>
                    ) : (
                      message
                    )}
                  </motion.li>
                )}
              </AnimatePresence>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default About;
