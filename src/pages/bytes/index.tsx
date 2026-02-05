import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  CalendarDays, 
  ExternalLink, 
  Clock,
  ArrowRight
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Button } from "@/components/ui/button";

interface Byte {
  _id: string;
  headline: string;
  body: string;
  imageUrl?: string;
  link?: string;
  createdAt: string | Date;
}

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BytesPage() {
  const [bytes, setBytes] = useState<Byte[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBytes();
  }, []);

  const fetchBytes = async (token: string | null = null) => {
    if (token) {
      setIsFetchingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const limit = 6;
      const url = token 
        ? `/api/bytes?limit=${limit}&pageToken=${token}` 
        : `/api/bytes?limit=${limit}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch bytes");
      }
      const data = await response.json();
      if (data.success && data.data) {
        const newBytes = data.data.bytes || [];
        if (token) {
          setBytes((prev) => [...prev, ...newBytes]);
        } else {
          setBytes(newBytes);
        }
        setNextPageToken(data.data.nextPageToken || null);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading bytes.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bytes - Quick Technical Insights | Karthik Nishanth</title>
        <meta 
          name="description" 
          content="Short-form technical updates, quick tips, and industry insights in bite-sized pieces." 
        />
        <link rel="canonical" href="https://karthiknish.com/bytes" />
      </Head>

      <PageContainer>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <section className="pt-36 pb-16 md:pt-44 md:pb-24 border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                  <Clock size={16} />
                  <span>Bite-sized Insights</span>
                </div>
                <h1 className="font-heading text-4xl md:text-6xl text-slate-900 mb-6">
                  Technical <span className="text-blue-600">Bytes</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Quick thoughts, industry updates, and technical micro-lessons from my daily engineering practice.
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Feed Section */}
          <section className="py-16 md:py-24 bg-slate-50/30">
            <div className="max-w-3xl mx-auto px-6">
              {isLoading && !bytes.length ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                  <p className="text-slate-500 font-medium">Brewing fresh bytes...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-3xl p-10 border border-red-100">
                  <p className="text-lg font-bold mb-2">Oops! Something went wrong.</p>
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => fetchBytes()}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <div className="space-y-12 md:space-y-16">
                  <AnimatePresence>
                    {bytes.map((byte, index) => (
                      <motion.article 
                        key={byte._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
                        className="group relative flex flex-col gap-6"
                      >
                        <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                          <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                            <CalendarDays size={14} className="text-blue-500" />
                            {formatDate(byte.createdAt)}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span>Byte #{bytes.length - index}</span>
                        </div>

                        <div className="space-y-4">
                          <h2 className="text-2xl md:text-3xl font-heading text-slate-900 group-hover:text-blue-600 transition-colors">
                            {byte.headline}
                          </h2>
                          
                          {byte.imageUrl && (
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-slate-100">
                              <Image 
                                src={byte.imageUrl}
                                alt={byte.headline}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 800px"
                              />
                            </div>
                          )}

                          <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                            {byte.body}
                          </div>

                          {byte.link && (
                            <div className="pt-2">
                              <a 
                                href={byte.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 font-bold group/link"
                              >
                                <span>Learn more</span>
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <ExternalLink size={16} />
                                </motion.div>
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute -left-8 top-0 bottom-0 w-px bg-slate-100 hidden md:block" />
                      </motion.article>
                    ))}
                  </AnimatePresence>

                  {/* Load More Button */}
                  {nextPageToken && (
                    <div className="flex justify-center pt-8">
                      <Button
                        onClick={() => fetchBytes(nextPageToken)}
                        disabled={isFetchingMore}
                        className="h-14 px-10 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold transition-all shadow-lg hover:shadow-slate-200 hover:-translate-y-1"
                      >
                        {isFetchingMore ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading more...
                          </>
                        ) : (
                          <>
                            View more bytes
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {!nextPageToken && bytes.length > 0 && (
                    <div className="text-center py-12 border-t border-slate-100">
                      <p className="text-slate-400 font-medium italic">You've reached the end of the feed. Stay hungry!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="py-24 bg-slate-50 border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-5xl font-heading text-slate-900 mb-8">
                  Get these in your inbox?
                </h2>
                <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                  Join the newsletter to receive weekly technical bytes and deep dives into modern web engineering.
                </p>
                <div className="flex justify-center">
                  <a href="/newsletter" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                    Join the newsletter
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
