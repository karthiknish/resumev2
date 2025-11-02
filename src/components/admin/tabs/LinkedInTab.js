import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Linkedin,
  Loader2,
  Copy,
  Check,
  Sparkles,
  RefreshCw, // Keep RefreshCw if needed elsewhere, otherwise remove
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import TrendingNewsFeed from "@/components/admin/shared/TrendingNewsFeed"; // Import from shared location

// --- Post Suggestion Generator Component ---
const PostSuggestionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [numIdeas, setNumIdeas] = useState(3);
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerateIdeas = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setCopiedIndex(null);

    try {
      const response = await fetch("/api/ai/linkedin-post-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
          tone,
          numIdeas,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to generate ideas");
      setIdeas(data.ideas || []);
      if (!data.ideas || data.ideas.length === 0)
        toast.info("No ideas generated.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate ideas.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
      },
      (err) => {
        toast.error("Failed to copy text.");
        console.error("Clipboard copy failed: ", err);
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
            <div className="p-2 bg-slate-100 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            AI Post Idea Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleGenerateIdeas} className="space-y-4">
            <div>
              <label
                htmlFor="topic"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Topic / Goal
              </label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Benefits of Cloud Migration"
                disabled={isLoading}
                className=""
              />
            </div>
            <div>
              <label
                htmlFor="keywords"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Keywords (comma-separated)
              </label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., aws, serverless"
                disabled={isLoading}
                className=""
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="tone"
                  className="block text-xs font-medium text-slate-500 mb-1"
                >
                  Tone
                </label>
                <Select
                  value={tone}
                  onValueChange={setTone}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="engaging">Engaging</SelectItem>
                    <SelectItem value="thought-provoking">
                      Thought-Provoking
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="numIdeas"
                  className="block text-xs font-medium text-slate-500 mb-1"
                >
                  Number of Ideas
                </label>
                <Input
                  id="numIdeas"
                  type="number"
                  min="1"
                  max="10"
                  value={numIdeas}
                  onChange={(e) => setNumIdeas(parseInt(e.target.value, 10))}
                  disabled={isLoading}
                  className=""
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Generating..." : "Generate Ideas"}
            </Button>
          </form>
          {error && (
            <motion.div
              className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-xs font-medium text-red-600">Error: {error}</p>
            </motion.div>
          )}
          {ideas.length > 0 && (
            <motion.div
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-heading font-semibold text-slate-800">
                  Generated Ideas:
                </h4>
                <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">
                  {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
                </Badge>
              </div>
              {ideas.map((idea, index) => {
                const fullPostText = `${idea.hook}\n\n${idea.coreMessage}\n\n${
                  idea.callToAction || ""
                }\n\n${idea.hashtags?.join(" ") || ""}`;
                return (
                  <motion.div
                    key={index}
                    className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => copyToClipboard(fullPostText, index)}
                      className="absolute top-3 right-3 p-2 bg-slate-100 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy full post text"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-purple-600" />
                      )}
                    </button>
                    <p className="text-sm font-semibold text-slate-800 mb-2 pr-10">
                      {idea.hook}
                    </p>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                      {idea.coreMessage}
                    </p>
                    {idea.callToAction && (
                      <p className="text-sm text-slate-500 italic mb-3 bg-slate-50 p-2 rounded-lg">
                        {idea.callToAction}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 font-medium">
                      {idea.hashtags?.join(" ")}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Canva Carousel Generator Placeholder ---
const CarouselGenerator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 border-b border-slate-200">
        <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
          <div className="p-2 bg-slate-100 rounded-full">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
          Canva Carousel Generator
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-slate-700">Feature coming soon</p>
          <p className="text-xs text-slate-500">
            Generate LinkedIn carousels using Canva API (Requires setup).
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- Main LinkedIn Tab Component ---
export default function LinkedInTab() {
  // Optional: Handler if clicking news should populate the generator
  const handleNewsSelectForIdeas = (headline, summary) => {
    // Example: You could set the 'topic' state of PostSuggestionGenerator
    // This would require lifting state up or using context/zustand
    console.log("News selected in LinkedIn Tab:", headline);
    toast.info(
      `Selected news: "${headline}". You can use this as input for the idea generator.`
    );
    // Maybe set topic state here if PostSuggestionGenerator state is lifted up
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
            <div className="p-2 bg-slate-100 rounded-full">
              <Linkedin className="w-4 h-4 text-primary" />
            </div>
            LinkedIn Content Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.p 
            className="text-sm text-slate-600 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tools to help generate content and manage your LinkedIn presence.
          </motion.p>
          {/* Updated Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <PostSuggestionGenerator />
            </div>
            <div className="space-y-5">
              {/* Use shared component, pass handler (optional) */}
              <TrendingNewsFeed onNewsSelect={handleNewsSelectForIdeas} />
              <CarouselGenerator />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
