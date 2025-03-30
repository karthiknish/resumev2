import { useState, useEffect, useRef } from "react"; // Added useRef
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, ChevronUp, ChevronDown } from "lucide-react"; // Added arrows
import Image from "next/image";

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

// Component for a single Byte slide
function ByteSlide({ byte }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-white">
      <Card className="w-full max-w-md bg-black/70 border border-gray-700 shadow-xl overflow-hidden backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          {byte.imageUrl && (
            <div className="relative w-full aspect-video mb-4 rounded-md overflow-hidden">
              <Image
                src={byte.imageUrl}
                alt={byte.headline}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          )}
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 font-calendas">
            {byte.headline}
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-4 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {byte.body}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formatDate(byte.createdAt)}</span>
            {byte.link && (
              <Link
                href={byte.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BytesPage() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null); // Ref for Swiper instance

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

  // Navigation functions
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
      {/* Main container takes full screen height and hides overflow - Added relative positioning */}
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
              ref={swiperRef} // Assign ref
              onSwiper={(swiper) => {
                // Store swiper instance
                swiperRef.current = { swiper };
              }}
              direction={"vertical"}
              slidesPerView={1}
              spaceBetween={0}
              mousewheel={true}
              keyboard={true}
              modules={[Mousewheel, Keyboard]}
              className="h-full w-full"
            >
              {bytes.map((byte) => (
                <SwiperSlide
                  key={byte._id}
                  className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-900"
                >
                  <ByteSlide byte={byte} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Desktop Navigation Arrows - Hidden on mobile */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 hidden md:flex flex-col space-y-2">
              <button
                onClick={goPrev}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous Byte"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                aria-label="Next Byte"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
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
