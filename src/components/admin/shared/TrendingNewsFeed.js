import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  CopyPlus,
  ExternalLink as LinkIcon,
} from "lucide-react";

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
    if (onNewsSelect) {
      onNewsSelect(item.headline, item.summary); // Pass headline and summary
      toast.info(`Copied "${item.headline}" to form.`);
    }
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Trending Tech News</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchNews}
          disabled={isLoading}
          aria-label="Refresh News"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {/* GNews Usage Note */}
        <p className="text-xs text-gray-500 mb-3 italic">
          Powered by GNews (Free tier: 100 requests/day). Click refresh
          sparingly.
        </p>
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        {!isLoading && !error && news.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            No news items found.
          </p>
        )}
        {!isLoading && !error && news.length > 0 && (
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {news.map((item, index) => (
              <li
                key={index}
                className="text-sm border-b border-gray-700 pb-2 last:border-b-0 group"
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Headline as a link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-100 hover:text-blue-400 transition-colors mb-0.5 flex-grow"
                    title={`Read full article: ${item.headline}`}
                  >
                    {item.headline}
                    <LinkIcon className="w-3 h-3 inline-block ml-1 opacity-50" />
                  </a>
                  {/* Button to copy to form */}
                  {onNewsSelect && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleSelect(item)}
                      title="Use this news for a new Byte"
                    >
                      <CopyPlus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">{item.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
