// Converted to TypeScript - migrated
import React, { useState, useEffect, useMemo } from "react";
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
    Hash,
    X,
    FileText,
    BookOpen,
    Megaphone,
  } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "./EmojiPicker";
import { POST_TYPES, TONES } from "./constants";
import { POST_TEMPLATES, getTemplateCategoryLabel, getTemplateCategoryIcon } from "./templates";
import { suggestHashtags } from "./hashtagUtils";
import { useHistory } from "./useHistory";

export default function LinkedInPostGenerator({ initialTopic = "", session }) {
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
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [customHashtag, setCustomHashtag] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateCategory, setTemplateCategory] = useState("hook");

  const { history, isLoadingHistory, saveToHistory, deleteHistoryItem, clearHistory, toggleFavorite } = useHistory(session);

  const LINKEDIN_CHAR_LIMIT = 3000;
  const charCount = generatedPost.length;
  const charPercentage = (charCount / LINKEDIN_CHAR_LIMIT) * 100;
  const isNearLimit = charPercentage > 90;
  const isOverLimit = charCount > LINKEDIN_CHAR_LIMIT;

  const hashtagSuggestions = useMemo(
    () => suggestHashtags(topic, 8),
    [topic]
  );

  const availableSuggestions = hashtagSuggestions.filter(
    (tag) => !selectedHashtags.includes(tag)
  );

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

      const lengthLabel = getLengthLabel(length[0]);
      const newHistoryItem = {
        id: Date.now(),
        topic: topic.trim(),
        post: data.post,
        postType,
        tone,
        length: lengthLabel,
        createdAt: new Date().toISOString(),
        hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
      };

      await saveToHistory(newHistoryItem);
      toast.success("Post generated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate post");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      toast.success("Copied to clipboard!");

      if (history.length > 0) {
        const mostRecentItem = history[0];
        if (mostRecentItem._id) {
          fetch("/api/linkedin/content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contentId: mostRecentItem._id,
              action: "markExported",
              exportType: "copy",
            }),
          }).catch((err) => console.error("Failed to mark as exported:", err));
        }
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Copy failed:", err);
    }
  };

  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setGeneratedPost(item.post);
    setPostType(item.postType || "insight");
    setTone(item.tone || "professional");
    if (item.hashtags) {
      setSelectedHashtags(item.hashtags);
    }
    setShowHistory(false);
    toast.info("Loaded from history");
  };

  const addHashtag = (tag) => {
    if (!selectedHashtags.includes(tag)) {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const removeHashtag = (tag) => {
    setSelectedHashtags(selectedHashtags.filter((h) => h !== tag));
  };

  const addCustomHashtag = () => {
    const trimmed = customHashtag.trim();
    if (trimmed) {
      const formatted = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      if (/^#[\w]+$/.test(formatted) && !selectedHashtags.includes(formatted)) {
        addHashtag(formatted);
        setCustomHashtag("");
        toast.success("Hashtag added");
      } else if (!/^#[\w]+$/.test(formatted)) {
        toast.error("Invalid hashtag format. Use letters, numbers, and underscores only.");
      } else {
        toast.info("Hashtag already added");
      }
    }
  };

  const handleCustomHashtagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomHashtag();
    }
  };

  const getCharCountColor = () => {
    if (isOverLimit) return "text-destructive";
    if (isNearLimit) return "text-warning";
    return "text-muted-foreground";
  };

  const getCharCountBgColor = () => {
    if (isOverLimit) return "bg-destructive";
    if (isNearLimit) return "bg-warning";
    return "bg-primary";
  };

  const handleTemplateSelect = (category, template) => {
    setSelectedTemplate(template);
    setTemplateCategory(category);
    setTopic(template.template);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" loaded! Fill in the {placeholders} with your content.`);
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4 mr-1" />
                Templates
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4 mr-1" />
                History
              </Button>
            </div>
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
                  <span className="text-sm font-medium text-foreground">
                    Recent Posts
                    {isLoadingHistory && (
                      <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
                    )}
                  </span>
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
                  <p className="text-sm text-muted-foreground">
                    {isLoadingHistory ? "Loading..." : "No posts yet"}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="flex items-center gap-2 group"
                      >
                        <button
                          onClick={() => loadFromHistory(item)}
                          className="flex-1 text-left p-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-foreground line-clamp-1 block">
                                {item.topic}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => toggleFavorite(item, e)}
                                className={`p-1 rounded hover:bg-accent ${
                                  item.isFavorite ? "text-yellow-500" : "text-muted-foreground"
                                }`}
                                title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => deleteHistoryItem(item, e)}
                                className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Post Templates
                  </span>
                </div>

                <div className="flex gap-1 mb-3 p-1 bg-background rounded-lg">
                  {Object.keys(POST_TEMPLATES).map((category) => {
                    const CategoryIcon = getTemplateCategoryIcon(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        data-testid={`template-category-${category}`}
                        onClick={() => setTemplateCategory(category)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          templateCategory === category
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <CategoryIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{category}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {POST_TEMPLATES[templateCategory].map((template) => {
                    const TemplateIcon = template.icon;
                    return (
                      <motion.button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(templateCategory, template)}
                        className="text-left p-3 rounded-lg bg-background hover:bg-accent hover:border-primary/30 border border-border transition-all text-sm group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                            <TemplateIcon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-xs line-clamp-1">
                              {template.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="topic" className="text-sm font-medium text-foreground">
                  Topic / Idea
                </Label>
                <EmojiPicker
                  onEmojiSelect={(emoji) => setTopic((prev) => prev + emoji)}
                  triggerClassName="h-8 w-8 p-0"
                />
              </div>
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

            <AnimatePresence>
              {(hashtagSuggestions.length > 0 || selectedHashtags.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {selectedHashtags.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Selected Hashtags ({selectedHashtags.length})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedHashtags([])}
                          className="text-xs text-muted-foreground hover:text-destructive h-6 px-2"
                        >
                          Clear all
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedHashtags.map((tag) => (
                          <motion.div
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge
                              variant="secondary"
                              className="gap-1 pr-1 text-xs cursor-pointer hover:bg-destructive/20 group"
                              onClick={() => removeHashtag(tag)}
                            >
                              <span>{tag}</span>
                              <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableSuggestions.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Suggested Hashtags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {availableSuggestions.slice(0, 6).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50"
                            onClick={() => addHashtag(tag)}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customHashtag}
                          onChange={(e) => setCustomHashtag(e.target.value)}
                          onKeyDown={handleCustomHashtagKeyDown}
                          placeholder="Add custom hashtag..."
                          disabled={isLoading}
                          className="flex-1 h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={addCustomHashtag}
                          disabled={isLoading || !customHashtag.trim()}
                          className="h-8 px-3"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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

                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getCharCountBgColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(charPercentage, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getCharCountColor()}`}>
                      {charCount.toLocaleString()} / {LINKEDIN_CHAR_LIMIT.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmojiPicker
                      onEmojiSelect={(emoji) => setGeneratedPost((prev) => prev + emoji)}
                      triggerClassName="h-7 w-7 p-0"
                    />
                    {isOverLimit && (
                      <span className="text-xs text-destructive font-medium">
                        {charCount - LINKEDIN_CHAR_LIMIT} characters over limit
                      </span>
                    )}
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

