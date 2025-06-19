import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  CopyPlus,
  ExternalLink as LinkIcon,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

// Accept onNewsSelect prop
export default function TrendingNewsFeed({ onNewsSelect }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    setNews([]);
    try {
      const response = await fetch("/api/ai/get-trending-news", {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch trending news");
      }
      setNews(data.news || []);
      if (!data.news || data.news.length === 0) {
        toast.info("No trending news found at the moment.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to fetch trending news.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle clicking a news item to copy to form
  const handleSelect = (item) => {
    console.log("[TrendingNewsFeed] handleSelect called with:", item);
    if (onNewsSelect) {
      onNewsSelect(item.headline, item.summary); // Pass headline and summary
      toast.info(`Copied "${item.headline}" to form.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200 flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-white rounded-full shadow-md">
              <Newspaper className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-bold">Trending Tech News</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNews}
            disabled={isLoading}
            aria-label="Refresh News"
            className="hover:bg-white/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""} text-purple-600`} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
        {/* GNews Usage Note */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
            ⚡ Powered by GNews (Free tier: 100 requests/day)
          </Badge>
        </div>
        {isLoading && (
          <motion.div 
            className="flex flex-col justify-center items-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-gray-600 font-medium mt-3 text-sm">Loading latest tech news...</p>
          </motion.div>
        )}
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-2xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-700 text-sm font-medium">Error: {error}</p>
          </motion.div>
        )}
        {!isLoading && !error && news.length === 0 && (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-gray-400 text-5xl mb-4">📰</div>
            <p className="text-gray-600 font-medium">No news items found</p>
            <p className="text-gray-500 text-sm mt-2">Try refreshing to get the latest updates</p>
          </motion.div>
        )}
        {!isLoading && !error && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-purple-600 text-white">
                {news.length} {news.length === 1 ? 'article' : 'articles'}
              </Badge>
            </div>
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
              {news.map((item, index) => (
                <motion.li
                  key={index}
                  className="bg-white border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Headline as a link */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-purple-600 transition-colors mb-2 flex-grow group-hover:text-purple-700"
                      title={`Read full article: ${item.headline}`}
                    >
                      {item.headline}
                      <LinkIcon className="w-3 h-3 inline-block ml-1 opacity-50" />
                    </a>
                    {/* Button to copy to form */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 text-purple-500 hover:text-purple-700 hover:bg-purple-100 transition-all duration-200 rounded-full"
                      onClick={() => handleSelect(item)}
                      title="Use this news for a new post idea"
                    >
                      <CopyPlus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.summary}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
