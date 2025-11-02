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
        <Card className="w-full bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            {byte.imageUrl && (
              <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden shadow-lg">
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
              className="text-2xl md:text-3xl font-black mb-4 leading-tight text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              animate={isActive ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {byte.headline}
            </motion.h2>
            <div className="max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent mb-6 pr-2">
              <p className="text-white/80 text-base md:text-lg whitespace-pre-wrap break-words leading-relaxed font-medium">
                {byte.body}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
              <motion.span 
                className="text-white/70 font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
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
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/15"
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
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="max-w-2xl"
      >
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Bytes
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-white/80 leading-relaxed font-medium max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Quick updates, bite-sized thoughts, interesting links, and news snippets.

        </motion.p>
        <motion.div
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 inline-flex items-center gap-3 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <span className="text-white font-bold text-base md:text-lg">
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
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Oops! Something went wrong
        </h3>
        <p className="text-red-400 font-medium mb-6">
          {error}
        </p>
        <motion.button
          onClick={onRetry}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl mx-auto border border-white/15"
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
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
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
        <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          No Bytes Yet
        </h3>
        <p className="text-white/80 font-medium text-lg">
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
        <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center text-sm text-white/70 mt-1">
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
      </Head>
      <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden relative">
        <ProgressIndicator />
        
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-8 py-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
            
              <span className="text-white font-bold text-xl">Loading Bytes...</span>
            </motion.div>
          </div>
        ) : error ? (
          <ErrorSlide error={error} onRetry={handleRetry} />
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
              className="h-full w-full"
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
            <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10 hidden md:flex flex-col space-y-4">
              <motion.button
                onClick={goPrev}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white hover:text-white/80 transition-all duration-300 border border-white/15 hover:border-white/20 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Previous"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === 0}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={goNext}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white hover:text-white/80 transition-all duration-300 border border-white/15 hover:border-white/20 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Next"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === bytes.length}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
              <div className="flex space-x-2">
                {[...Array(bytes.length + 1)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-white w-6"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptySlide />
        )}
      </div>
    </>
  );
}

export default BytesPage;
