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
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import "swiper/css/pagination";

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
        className="w-full max-w-2xl"
      >
        <Card className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 text-slate-100 shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            {byte.imageUrl && (
              <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                <Image
                  src={byte.imageUrl}
                  alt={byte.headline}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <motion.h2 
              className="font-heading text-3xl md:text-4xl mb-4 leading-tight text-slate-50"
              animate={isActive ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {byte.headline}
            </motion.h2>
            <div className="max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent mb-6 pr-2">
              <p className="text-slate-300 text-base md:text-lg whitespace-pre-wrap break-words leading-relaxed font-medium">
                {byte.body}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-4">
              <motion.span 
                className="text-slate-400 font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
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
                    className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-4 h-4" />
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
function IntroSlide({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="max-w-2xl"
      >
        <motion.h1 
          className="font-heading text-6xl md:text-8xl lg:text-9xl mb-6 text-slate-50"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Bytes
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Quick updates, bite-sized thoughts, interesting links, and news snippets.

        </motion.p>
        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full px-6 py-3 inline-flex items-center gap-3 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <span className="text-slate-300 font-medium text-base md:text-lg">
            Scroll or use arrow keys to navigate
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Error Slide Component
function ErrorSlide({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="font-heading text-3xl text-slate-50 mb-4">
          Oops! Something went wrong
        </h3>
        <p className="text-red-400 font-medium mb-6">
          {error}
        </p>
        <motion.button
          onClick={onRetry}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl mx-auto border border-slate-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}

// Empty State Slide Component
function EmptySlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
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
          📭
        </motion.div>
        <h3 className="font-heading text-4xl text-slate-50 mb-4">
          No Bytes Yet
        </h3>
        <p className="text-slate-400 font-medium text-lg">
          No updates posted yet. Check back soon for bite-sized content!
        </p>
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

  const handleRetry = () => {
    fetchBytes();
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    if (bytes.length === 0) return null;
    
    const totalSlides = bytes.length + 1; // +1 for intro slide
    const progress = (activeIndex / (totalSlides - 1)) * 100;
    
    return (
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-slate-200"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center text-sm text-slate-500 mt-1">
          {activeIndex} / {totalSlides - 1}
        </div>
      </div>
    );
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
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="h-screen w-screen bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-50"></div>
        <ProgressIndicator />
        
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center relative z-10">
            <motion.div 
              className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl px-8 py-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="w-6 h-6 text-slate-200 animate-spin" />
              <span className="text-slate-200 font-bold text-xl">Loading Bytes...</span>
            </motion.div>
          </div>
        ) : error ? (
          <div className="relative z-10 h-full">
            <ErrorSlide error={error} onRetry={handleRetry} />
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
                forceToAxis: true,
                releaseOnEdges: true,
                sensitivity: 0.6,
                thresholdDelta: 20,
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              speed={750}
              touchRatio={0.85}
              longSwipesMs={320}
              allowTouchMove={true}
              modules={[Mousewheel, Keyboard, Pagination]}
              className="h-full w-full relative z-10"
            >
              {/* Intro Slide */}
              <SwiperSlide
                key="intro-slide"
                className="h-full w-full"
              >
                <IntroSlide onRetry={handleRetry} />
              </SwiperSlide>

              {/* Bytes Slides */}
              {bytes.map((byte, index) => (
                <SwiperSlide
                  key={byte._id}
                  className="h-full w-full"
                >
                  <ByteSlide byte={byte} isActive={index + 1 === activeIndex} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Desktop Navigation Arrows */}
            <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-20 hidden md:flex flex-col space-y-4">
              <motion.button
                onClick={goPrev}
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-slate-300 hover:text-slate-100 transition-all duration-300 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Previous"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === 0}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={goNext}
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-slate-300 hover:text-slate-100 transition-all duration-300 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Next"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === bytes.length}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
              <div className="flex space-x-2">
                {[...Array(bytes.length + 1)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-slate-200 w-6"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="relative z-10 h-full">
            <EmptySlide />
          </div>
        )}
      </div>
    </>
  );
}

export default BytesPage;
