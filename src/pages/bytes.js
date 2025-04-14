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
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-white">
      <motion.div
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={cardContentVariants}
      >
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-blue-900/30 shadow-xl overflow-hidden backdrop-blur-sm glow-card-subtle">
          <CardContent className="p-6 md:p-8">
            {byte.imageUrl && (
              <div className="relative w-full aspect-video mb-5 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={byte.imageUrl}
                  alt={byte.headline}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            )}
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 font-calendas leading-tight">
              {byte.headline}
            </h2>
            <div className="max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-5 pr-2">
              <p className="text-gray-300 text-sm md:text-base whitespace-pre-wrap break-words">
                {byte.body}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-3">
              <span>{formatDate(byte.createdAt)}</span>
              {byte.link && (
                <Link
                  href={byte.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Learn More <ExternalLink className="w-3.5 h-3.5" />
                </Link>
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
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="max-w-lg"
      >
        <Zap className="w-16 h-16 mx-auto mb-6 text-blue-400 glow-blue-icon" />
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white font-calendas glow-text-blue">
          Bytes
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Quick updates, bite-sized thoughts, interesting links, and news snippets.
        </p>
        <p className="text-sm text-gray-500 mt-6">
          (Scroll or use arrow keys to navigate)
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
      <div className="h-screen w-screen bg-black overflow-hidden relative">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading Bytes...
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center text-red-500 p-4 text-center">
            {error}
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
              mousewheel={true}
              keyboard={true}
              modules={[Mousewheel, Keyboard]}
              className="h-full w-full"
            >
              {/* --- Intro Slide --- */}
              <SwiperSlide
                key="intro-slide"
                className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-900"
              >
                <IntroSlide />
              </SwiperSlide>

              {/* --- Map over actual bytes --- */}
              {bytes.map((byte, index) => (
                <SwiperSlide
                  key={byte._id}
                  className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-900"
                >
                  {/* Pass isActive based on index + 1 because of the intro slide */}
                  <ByteSlide byte={byte} isActive={index + 1 === activeIndex} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Desktop Navigation Arrows - Show only if there are bytes */}
            {bytes.length > 0 && (
              <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10 hidden md:flex flex-col space-y-3">
                <button
                  onClick={goPrev}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 border border-white/20"
                  aria-label="Previous"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 border border-white/20"
                  aria-label="Next"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No updates posted yet.
          </div>
        )}
      </div>
    </>
  );
}

export default BytesPage;
