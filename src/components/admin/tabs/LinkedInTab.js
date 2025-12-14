import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Linkedin, MessageSquare, Layers } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import TrendingNewsFeed from "@/components/admin/shared/TrendingNewsFeed";
import LinkedInPostGenerator from "@/components/admin/linkedin/LinkedInPostGenerator";
import CarouselGenerator from "@/components/admin/linkedin/CarouselGenerator";

export default function LinkedInTab() {
  const [topicFromNews, setTopicFromNews] = useState("");
  const [activeMode, setActiveMode] = useState("post");

  const handleNewsSelect = (headline, summary) => {
    const newTopic = `${headline}\n\nContext: ${summary}`;
    setTopicFromNews(newTopic);
    setActiveMode("post");
    toast.success("News topic loaded! Edit as needed and generate your post.");
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-foreground">
            <div className="p-2 bg-[#0077B5]/10 rounded-full">
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
            </div>
            LinkedIn Content Studio
            <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary border-0">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.p
            className="text-sm text-muted-foreground mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Generate LinkedIn posts and carousel images that speak in your authentic voice.
          </motion.p>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-5">
            <Button
              variant={activeMode === "post" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveMode("post")}
              className="flex-1 sm:flex-none"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Text Post
            </Button>
            <Button
              variant={activeMode === "carousel" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveMode("carousel")}
              className="flex-1 sm:flex-none"
            >
              <Layers className="mr-2 h-4 w-4" />
              Carousel Images
            </Button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeMode === "post" ? (
                  <motion.div
                    key="post"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <LinkedInPostGenerator initialTopic={topicFromNews} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="carousel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CarouselGenerator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <TrendingNewsFeed onNewsSelect={handleNewsSelect} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
  