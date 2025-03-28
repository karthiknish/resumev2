import { useState, useEffect, useRef, createRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import PageContainer from "@/components/PageContainer";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionComponents";
import { Card, CardContent } from "@/components/ui/card"; // Re-use Card component

function BytesPage() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // Index of the currently focused byte
  const byteRefs = useRef([]); // Refs for each byte card element
  const containerRef = useRef(null); // Ref for the container handling touch events
  const touchStartY = useRef(0); // Store touch start Y position

  // Effect to fetch bytes on mount
  useEffect(() => {
    fetchBytes();
  }, []);

  // Effect to initialize or update refs when bytes data changes
  useEffect(() => {
    byteRefs.current = bytes.map((_, i) => byteRefs.current[i] ?? createRef());
  }, [bytes]);

  // Function to scroll to a specific byte index
  const scrollToByte = (index) => {
    if (byteRefs.current[index] && byteRefs.current[index].current) {
      byteRefs.current[index].current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Try to center the item vertically
      });
    }
  };

  // Effect to handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (bytes.length === 0) return;

      let newIndex = activeIndex;
      if (event.key === "ArrowDown") {
        event.preventDefault(); // Prevent default page scroll
        newIndex = Math.min(activeIndex + 1, bytes.length - 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault(); // Prevent default page scroll
        newIndex = Math.max(activeIndex - 1, 0);
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        scrollToByte(newIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, bytes.length]); // Re-run if activeIndex or bytes length changes

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (bytes.length === 0 || !touchStartY.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY; // Positive for swipe up, negative for swipe down
    const swipeThreshold = 50; // Minimum pixels to be considered a swipe

    let newIndex = activeIndex;

    if (deltaY > swipeThreshold) {
      // Swiped Up (Next byte)
      newIndex = Math.min(activeIndex + 1, bytes.length - 1);
    } else if (deltaY < -swipeThreshold) {
      // Swiped Down (Previous byte)
      newIndex = Math.max(activeIndex - 1, 0);
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      scrollToByte(newIndex);
    }

    touchStartY.current = 0; // Reset touch start position
  };

  const fetchBytes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bytes"); // Fetch from the public endpoint
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
      </Head>
      <PageContainer>
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-calendas text-center">
            Bytes
          </h1>
          <p className="text-lg text-gray-400 mb-12 text-center max-w-2xl mx-auto">
            Quick updates, snippets, and thoughts. Keeping it brief.
          </p>

          {isLoading ? (
            <div className="text-center text-gray-400">Loading updates...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : bytes.length > 0 ? (
            <StaggerContainer
              ref={containerRef}
              className="max-w-2xl mx-auto space-y-6 focus:outline-none" // Added focus:outline-none
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              tabIndex={-1} // Make container focusable for potential future keyboard focus management
            >
              {bytes.map((byte, index) => (
                <StaggerItem
                  key={byte._id}
                  index={index}
                  ref={byteRefs.current[index]}
                >
                  {/* Added ref here */}
                  <Card
                    className={`bg-gray-900 border border-gray-700 overflow-hidden transition-all duration-300 ${
                      index === activeIndex
                        ? "ring-2 ring-blue-500 scale-105 shadow-lg" // Highlight active byte
                        : "opacity-80 scale-100" // Dim inactive bytes slightly
                    }`}
                  >
                    <CardContent className="p-5">
                      {byte.imageUrl && (
                        <img
                          src={byte.imageUrl}
                          alt={byte.headline}
                          className="w-full h-48 object-cover rounded-md mb-4"
                          loading="lazy" // Lazy load images
                        />
                      )}
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {byte.headline}
                      </h2>
                      <p className="text-gray-300 text-sm mb-3">{byte.body}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {format(new Date(byte.createdAt), "MMM dd, yyyy")}
                        </span>
                        {byte.link && (
                          <Link
                            href={byte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline"
                          >
                            Learn More →
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center text-gray-400">
              No updates posted yet.
            </div>
          )}
        </FadeIn>
      </PageContainer>
    </>
  );
}

export default BytesPage;
