import Link from "next/link";
import { motion, LayoutGroup } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

// Sample images (consider moving to a data file if used elsewhere)
const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop",
    title: "Coding on a laptop",
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3270&auto=format&fit=crop",
    title: "Team collaboration",
  },
  {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3270&auto=format&fit=crop",
    title: "Modern workspace setup",
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=3015&auto=format&fit=crop",
    title: "Data Analytics Dashboard",
  },
  {
    url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=3276&auto=format&fit=crop",
    title: "Business Analytics",
  },
]; // Simplified for brevity, add more if needed

export default function HeroSection() {
  return (
    // Removed the fragment <></> as the outer div serves as the root
    <div className="bg-black overflow-hidden relative min-h-screen">
      {" "}
      {/* Ensure min height */}
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
      <HeroGeometric
        className="absolute inset-0 -z-0 opacity-30"
        duration={20}
        speed={2}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 min-h-screen py-20 flex flex-col items-center justify-center" // Centering content
      >
        {/* This motion.div was previously unclosed */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 container mx-auto mb-10 flex flex-col items-center"
        >
          {/* Floating Images */}
          <Floating
            sensitivity={-0.5}
            className="h-full w-full absolute pointer-events-none"
          >
            <FloatingElement depth={0.5} className="top-[15%] left-[5%]">
              <motion.img
                src={exampleImages[0].url}
                alt={exampleImages[0].title}
                className="w-24 h-16 object-cover -rotate-[3deg] shadow-2xl rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            </FloatingElement>
            <FloatingElement depth={1} className="top-[5%] left-[15%]">
              <motion.img
                src={exampleImages[1].url}
                alt={exampleImages[1].title}
                className="w-48 h-36 object-cover -rotate-12 shadow-2xl rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              />
            </FloatingElement>
            <FloatingElement depth={4} className="top-[80%] left-[10%]">
              <motion.img
                src={exampleImages[2].url}
                alt={exampleImages[2].title}
                className="w-60 h-60 object-cover -rotate-[4deg] shadow-2xl rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              />
            </FloatingElement>
            <FloatingElement depth={2} className="top-[5%] right-[5%]">
              <motion.img
                src={exampleImages[3].url}
                alt={exampleImages[3].title}
                className="w-64 h-56 object-cover rotate-[6deg] shadow-2xl rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
              />
            </FloatingElement>
            <FloatingElement depth={1} className="top-[70%] right-[10%]">
              <motion.img
                src={exampleImages[4].url}
                alt={exampleImages[4].title}
                className="w-80 h-80 object-cover rotate-[19deg] shadow-2xl rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
              />
            </FloatingElement>
          </Floating>

          {/* Main Text Content */}
          <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto mt-10">
            <motion.h1
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4 text-white"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
            >
              <span>I Build </span>
              <LayoutGroup>
                <motion.span layout className="flex whitespace-pre">
                  <motion.span
                    layout
                    className="flex whitespace-pre"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  >
                    Websites{" "}
                  </motion.span>
                  <TextRotate
                    texts={[
                      "that scale",
                      "that perform",
                      "with precision",
                      "with passion",
                      "⚡ fast",
                      "secure 🔒",
                      "elegant",
                      "✨ modern",
                      "robust",
                      "🚀 efficient",
                      "future-proof",
                      "seamless",
                      "strategic",
                    ]}
                    mainClassName="overflow-hidden pr-3 text-blue-500 py-0 pb-2 md:pb-4 rounded-xl"
                    staggerDuration={0.03}
                    staggerFrom="last"
                    rotationInterval={3000}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                </motion.span>
              </LayoutGroup>
            </motion.h1>
            <motion.p
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center font-calendas pt-4 sm:pt-8 md:pt-10 lg:pt-12 text-white"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
            >
              Freelance web developer creating custom, scalable, and
              high-performance web solutions for businesses and individuals.
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20 lg:mt-20 text-xs">
              <motion.button
                className="sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link className="text-white font-calendas" href="/contact">
                  Get in Touch <span className="font-calendas ml-1">→</span>
                </Link>
              </motion.button>
              <motion.button
                className="sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  target="_blank"
                  href="https://github.com/karthiknish"
                  className="font-calendas"
                >
                  View GitHub <span className="font-calendas ml-1">→</span>
                </Link>
              </motion.button>
            </div>
          </div>
        </motion.div>{" "}
        {/* Closing tag for the inner motion.div */}
      </motion.div>{" "}
      {/* Closing tag for the outer motion.div */}
    </div> // Closing tag for the root div
  );
}
