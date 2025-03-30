import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-lg">AI Post Idea Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateIdeas} className="space-y-4">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Topic / Goal
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Benefits of Cloud Migration"
              disabled={isLoading}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Keywords (comma-separated)
            </label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., aws, serverless"
              disabled={isLoading}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="tone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Tone
              </label>
              <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
                className="block text-sm font-medium text-gray-300 mb-1"
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
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Generating..." : "Generate Ideas"}
          </Button>
        </form>
        {error && <p className="mt-4 text-red-400 text-sm">Error: {error}</p>}
        {ideas.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-md font-semibold text-gray-200">
              Generated Ideas:
            </h4>
            {ideas.map((idea, index) => {
              const fullPostText = `${idea.hook}\n\n${idea.coreMessage}\n\n${
                idea.callToAction || ""
              }\n\n${idea.hashtags?.join(" ") || ""}`;
              return (
                <div
                  key={index}
                  className="p-3 border border-gray-600 rounded-md bg-gray-700/50 relative group"
                >
                  <button
                    onClick={() => copyToClipboard(fullPostText, index)}
                    className="absolute top-2 right-2 p-1 bg-gray-600 rounded hover:bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy full post text"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-300" />
                    )}
                  </button>
                  <p className="text-sm font-semibold text-blue-300 mb-1">
                    {idea.hook}
                  </p>
                  <p className="text-sm text-gray-300 mb-2">
                    {idea.coreMessage}
                  </p>
                  {idea.callToAction && (
                    <p className="text-sm text-gray-400 italic mb-2">
                      {idea.callToAction}
                    </p>
                  )}
                  <p className="text-xs text-purple-300">
                    {idea.hashtags?.join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Canva Carousel Generator Placeholder ---
const CarouselGenerator = () => (
  <Card className="border-gray-700 bg-gray-800/50">
    <CardHeader>
      <CardTitle className="text-lg">Canva Carousel Generator</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-400">
        Feature coming soon: Generate LinkedIn carousels using Canva API
        (Requires setup).
      </p>
    </CardContent>
  </Card>
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
    <div className="space-y-6">
      <Card className="border-gray-700 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="w-5 h-5" /> LinkedIn Content Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Tools to help generate content and manage your LinkedIn presence.
          </p>
          {/* Updated Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PostSuggestionGenerator />
            </div>
            <div className="space-y-6">
              {/* Use shared component, pass handler (optional) */}
              <TrendingNewsFeed onNewsSelect={handleNewsSelectForIdeas} />
              <CarouselGenerator />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
