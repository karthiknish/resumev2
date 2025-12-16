import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Linkedin,
  Loader2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  History,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const HISTORY_KEY = "linkedin-post-history";
const MAX_HISTORY = 10;

const POST_TYPES = [
  { value: "insight", label: "Insight", description: "Share a professional observation" },
  { value: "story", label: "Story", description: "Tell a personal story with a lesson" },
  { value: "tutorial", label: "Tutorial", description: "Provide a quick how-to or tip" },
  { value: "opinion", label: "Opinion", description: "Express a thought-provoking view" },
  { value: "celebration", label: "Celebration", description: "Celebrate an achievement" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "thoughtful", label: "Thoughtful" },
  { value: "inspiring", label: "Inspiring" },
  { value: "educational", label: "Educational" },
];

export default function LinkedInPostGenerator({ initialTopic = "" }) {
  const [topic, setTopic] = useState(initialTopic);
  const [postType, setPostType] = useState("insight");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState([50]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  const getLengthLabel = (value) => {
    if (value < 33) return "short";
    if (value < 66) return "medium";
    return "long";
  };

  const getLengthDisplayLabel = (value) => {
    if (value < 33) return "Short (100-150 words)";
    if (value < 66) return "Medium (200-300 words)";
    return "Long (400-600 words)";
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPost("");

    try {
      const response = await fetch("/api/ai/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          postType,
          tone,
          length: getLengthLabel(length[0]),
          includeHashtags,
          includeCta,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate post");
      }

      setGeneratedPost(data.post);

      const newHistoryItem = {
        id: Date.now(),
        topic: topic.trim(),
        post: data.post,
        postType,
        tone,
        createdAt: new Date().toISOString(),
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      toast.success("Post generated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate post");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost).then(
      () => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        toast.error("Failed to copy");
        console.error("Copy failed:", err);
      }
    );
  };

  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setGeneratedPost(item.post);
    setPostType(item.postType);
    setTone(item.tone);
    setShowHistory(false);
    toast.info("Loaded from history");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success("History cleared");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              Generate LinkedIn Post
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-muted-foreground hover:text-foreground"
            >
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Recent Posts</span>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-destructive hover:text-destructive h-7"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No posts yet</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm"
                      >
                        <span className="font-medium text-foreground line-clamp-1">
                          {item.topic}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-sm font-medium text-foreground mb-1.5 block">
                Topic / Idea
              </Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to post about?"
                disabled={isLoading}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">Post Type</Label>
                <Select value={postType} onValueChange={setPostType} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">Tone</Label>
                <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Length</Label>
                <span className="text-xs text-muted-foreground">
                  {getLengthDisplayLabel(length[0])}
                </span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={100}
                step={1}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-border"
                />
                <span className="text-foreground">Include hashtags</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCta}
                  onChange={(e) => setIncludeCta(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-border"
                />
                <span className="text-foreground">Include call-to-action</span>
              </label>
            </div>

            <Button type="submit" disabled={isLoading || !topic.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Post
                </>
              )}
            </Button>
          </form>

          {error && (
            <motion.div
              className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm font-medium text-destructive">Error: {error}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {generatedPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-border bg-gradient-to-r from-[#0077B5]/5 to-transparent">
                <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#0077B5]/10 rounded-full">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" />
                    </div>
                    Post Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {POST_TYPES.find((t) => t.value === postType)?.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tone}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-background border border-border rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      KN
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Karthik Nishanth</p>
                      <p className="text-xs text-muted-foreground">Full-Stack Developer • Just now</p>
                    </div>
                  </div>
                  <div className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyToClipboard} variant="default" className="flex-1 sm:flex-none">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Post
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
