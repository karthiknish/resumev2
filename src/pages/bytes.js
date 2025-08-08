import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Animation variants for card content
const cardContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Component for a single Byte slide
function ByteSlide({ byte, isActive }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 pt-20 md:pt-24">
      <motion.div
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={cardContentVariants}
      >
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            {byte.imageUrl && (
              <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={byte.imageUrl}
                  alt={byte.headline}
                  layout="fill"
                  objectFit="cover"
                  priority
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <motion.h2 
              className="text-2xl md:text-3xl font-black mb-4 leading-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {byte.headline}
            </motion.h2>
            <div className="max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 mb-6 pr-2">
              <p className="text-gray-700 text-base md:text-lg whitespace-pre-wrap break-words leading-relaxed font-medium">
                {byte.body}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm border-t-2 border-gradient-to-r from-purple-200 to-blue-200 pt-4">
              <motion.span 
                className="text-gray-600 font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg"></span>
                {formatDate(byte.createdAt)}
              </motion.span>
              {byte.link && (
                <motion.div
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={byte.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Learn More</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// New Intro Slide Component
function IntroSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="max-w-2xl"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-8xl mb-8"
        >
          
        </motion.div>
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Bytes
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Quick updates, bite-sized thoughts, interesting links, and news snippets.
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block ml-3 text-2xl"
          >
            
          </motion.span>
        </motion.p>
        <motion.div
          className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-6 py-3 inline-flex items-center gap-3 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <span className="text-2xl"></span>
          <span className="text-gray-700 font-bold text-lg">
            Scroll or use arrow keys to navigate
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function BytesPage() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchBytes();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    return () => {
      // Restore body scrolling on cleanup
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const fetchBytes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bytes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setBytes(data.data);
      } else {
        setError("Failed to load updates or invalid data format.");
        setBytes([]);
      }
    } catch (e) {
      console.error("Error fetching bytes:", e);
      setError(`Failed to load updates: ${e.message}`);
      setBytes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <>
      <Head>
        <title>Bytes - Quick Updates | Karthik Nishanth</title>
        <meta
          name="description"
          content="Quick updates, news, and thoughts from Karthik Nishanth."
        />
        <meta
          property="og:title"
          content="Bytes - Quick Updates | Karthik Nishanth"
        />
        <meta
          property="og:description"
          content="Quick updates, news, and thoughts from Karthik Nishanth."
        />
        <meta property="og:url" content="https://karthiknish.com/bytes" />
        <meta property="og:type" content="website" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div className="h-screen w-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden relative" style={{ touchAction: 'none' }}>
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-8 py-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                
              </motion.div>
              <span className="text-gray-700 font-bold text-xl">Loading Bytes...</span>
            </motion.div>
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center p-4">
            <motion.div 
              className="bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-8 shadow-xl text-center max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 font-medium">{error}</p>
            </motion.div>
          </div>
        ) : bytes.length > 0 ? (
          <>
            <Swiper
              ref={swiperRef}
              onSwiper={(swiper) => {
                swiperRef.current = { swiper };
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              direction={"vertical"}
              slidesPerView={1}
              spaceBetween={0}
              mousewheel={{
                sensitivity: 1,
                thresholdDelta: 50,
                thresholdTime: 1000,
                releaseOnEdges: false,
                forceToAxis: true,
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              speed={800}
              allowTouchMove={true}
              touchRatio={1}
              touchAngle={45}
              longSwipesRatio={0.5}
              longSwipesMs={300}
              followFinger={true}
              resistance={true}
              resistanceRatio={0}
              watchSlidesProgress={true}
              preventClicks={false}
              preventClicksPropagation={false}
              modules={[Mousewheel, Keyboard]}
              className="h-full w-full"
              onReachEnd={() => {
                // Prevent further scrolling when reaching the end
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.allowSlideNext = false;
                  setTimeout(() => {
                    if (swiperRef.current && swiperRef.current.swiper) {
                      swiperRef.current.swiper.allowSlideNext = true;
                    }
                  }, 1000);
                }
              }}
            >
              {/* --- Intro Slide --- */}
              <SwiperSlide
                key="intro-slide"
                className="h-full w-full bg-gradient-to-br from-purple-50 via-white to-blue-50"
              >
                <IntroSlide />
              </SwiperSlide>

              {/* --- Map over actual bytes --- */}
              {bytes.map((byte, index) => (
                <SwiperSlide
                  key={byte._id}
                  className="h-full w-full bg-gradient-to-br from-purple-50 via-white to-blue-50"
                >
                  {/* Pass isActive based on index + 1 because of the intro slide */}
                  <ByteSlide byte={byte} isActive={index + 1 === activeIndex} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Desktop Navigation Arrows - Show only if there are bytes */}
            {bytes.length > 0 && (
              <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10 hidden md:flex flex-col space-y-4">
                <motion.button
                  onClick={goPrev}
                  className="p-4 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-sm text-purple-600 hover:text-purple-700 transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 shadow-xl hover:shadow-2xl"
                  aria-label="Previous"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronUp className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={goNext}
                  className="p-4 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-sm text-purple-600 hover:text-purple-700 transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 shadow-xl hover:shadow-2xl"
                  aria-label="Next"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div 
              className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-12 shadow-xl text-center max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl mb-6"
              >
                
              </motion.div>
              <h3 className="text-3xl font-black text-gray-800 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                No Bytes Yet
              </h3>
              <p className="text-gray-600 font-medium text-lg">
                No updates posted yet. Check back soon for bite-sized content!
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export default BytesPage;
