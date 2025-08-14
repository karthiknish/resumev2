import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineLoading3Quarters,
  AiOutlineRobot,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineCheck,
  AiOutlinePicture,
  AiOutlineFormatPainter,
  AiOutlineBulb,
  AiOutlineTags,
  AiOutlineGlobal,
  AiOutlineClose,
} from "react-icons/ai";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import PageContainer from "@/components/PageContainer";
import TipTapRenderer from "@/components/TipTapRenderer";
import TipTapEditor from "@/components/TipTapEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Wand2, Settings, Link, BookOpen, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkAdminStatus } from "@/lib/authUtils";

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "informative", label: "Informative" },
  { value: "conversational", label: "Conversational" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "technical", label: "Technical" },
];

const lengthOptions = [
  { value: "500", label: "Short (~500 words) " },
  { value: "800", label: "Medium (~800 words) " },
  { value: "1200", label: "Long (~1200 words) " },
  { value: "1500", label: "Very Long (~1500 words) " },
  { value: "2000", label: "Epic (~2000 words) " },
];

export default function AICreateBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(toneOptions[3].value); // Default to conversational
  const [length, setLength] = useState(lengthOptions[1].value);
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pexelsDebounceRef = useRef();

  const [isFormatting, setIsFormatting] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);

  const [articleUrl, setArticleUrl] = useState("");
  const [styleInstructions, setStyleInstructions] = useState("");
  const [isConvertingLink, setIsConvertingLink] = useState(false);

  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [suggestedDescriptions, setSuggestedDescriptions] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);

  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState(null);

  const [isSuggestingTopics, setIsSuggestingTopics] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);

  const [loadingSection, setLoadingSection] = useState(null);

  const [saveStatus, setSaveStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      toast.error("Authentication required. Redirecting to signin...");
      router.push("/signin");
      return;
    }
    if (session && !checkAdminStatus(session)) {
      toast.error("Access Denied: Admin privileges required.");
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (generatedContent && !imageSearchQuery) {
      if (keywords) {
        setImageSearchQuery(keywords.split(",")[0].trim());
      } else if (topic) {
        setImageSearchQuery(topic);
      }
    }
  }, [generatedContent, keywords, topic, imageSearchQuery]);

  const handleSaveDraft = useCallback(async () => {
    if (
      !generatedContent?.title?.trim() ||
      !generatedContent?.content?.trim()
    ) {
      setError("Generated title and content are required to save draft.");
      toast.error("Generated title and content are required to save draft.");
      return;
    }

    setLoadingSection("save");
    setSaveStatus({ state: "loading", message: "" });
    setError("");

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generatedContent.content;
      const excerpt =
        tempDiv.textContent?.substring(0, 160) + "..." ||
        generatedContent.title;

      const keywordsArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt,
          imageUrl: `https://source.unsplash.com/random/1200x630/?${encodeURIComponent(
            topic || "ai blog"
          )}`,
          tags: keywordsArray,
          isPublished: false,
          category: "AI Generated",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save draft");

      setSaveStatus({
        state: "success",
        message: "Draft saved! Redirecting...",
      });
      toast.success("Draft saved successfully! Redirecting to editor...");

      // --- Add gtag event tracking ---
      if (typeof window.gtag === "function") {
        window.gtag("event", "save_draft", {
          event_category: "ai_generator",
          event_label: generatedContent?.title || "Untitled Draft",
          value: 1,
        });
      }
      // --- End gtag ---

      setTimeout(() => {
        router.push(`/admin/blog/edit/${result.data._id}`);
      }, 1500);
    } catch (err) {
      const errorMsg = `Save Draft Failed: ${err.message}`;
      setError(errorMsg);
      setSaveStatus({ state: "error", message: err.message });
      toast.error(errorMsg);
    } finally {
      setLoadingSection(null);
    }
  }, [generatedContent, keywords, topic, router]);

  const handleConvertLink = async () => {
    if (!articleUrl.trim() || !articleUrl.startsWith("http")) {
      toast.error("Please enter a valid URL");
      return;
    }
    setLoadingSection("link");
    setError("");
    setGeneratedContent(null);
    setGeneratedOutline(null);
    setSuggestedKeywords([]);
    setSuggestedDescriptions([]);
    setSuggestedCategories([]);

    try {
      const response = await fetch("/api/ai/blog-from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: articleUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");

      setTopic(result.title || "");
      setGeneratedContent({
        title: result.title || "Generated Post",
        content: result.content || "",
      });
      setKeywords(result.keywords?.join(", ") || "");
      setSuggestedKeywords(result.keywords || []);
      setSuggestedDescriptions(result.descriptions || []);
      setSuggestedCategories(result.categories || []);

      toast.success("Content and suggestions generated from link!");

      // --- Add gtag event tracking ---
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_from_link", {
          event_category: "ai_generator",
          event_label: articleUrl, // Send the URL
          value: 1,
        });
      }
      // --- End gtag ---
    } catch (err) {
      setError(`Link Conversion Failed: ${err.message}`);
      toast.error(`Link Conversion Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSuggestKeywords = async (contentToAnalyze) => {
    if (!topic && !contentToAnalyze) {
      toast.info("Need a topic or content to suggest keywords.");
      return;
    }
    setLoadingSection("keywords");
    setError("");
    setSuggestedKeywords([]);

    try {
      const response = await fetch("/api/ai/suggest-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          contentSnippet: contentToAnalyze?.substring(0, 500),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed");
      setSuggestedKeywords(result.keywords || []);
      toast.success("Keywords suggested!");
    } catch (err) {
      setError(`Keyword Suggestion Failed: ${err.message}`);
      toast.error(`Keyword Suggestion Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleGenerateOutline = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }
    setLoadingSection("outline");
    setError("");
    setGeneratedOutline(null);

    try {
      const response = await fetch("/api/ai/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed");
      const outlinePayload = result.data || result.outline; // support both keys
      if (!outlinePayload || !outlinePayload.title) {
        throw new Error("Malformed outline response");
      }
      setGeneratedOutline(outlinePayload);
      setTopic(outlinePayload.title);
      toast.success("Outline generated!");
    } catch (err) {
      setError(`Outline Generation Failed: ${err.message}`);
      toast.error(`Outline Generation Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const addKeyword = (keywordToAdd) => {
    setKeywords((prev) => (prev ? `${prev}, ${keywordToAdd}` : keywordToAdd));
    toast.info(`Added keyword: ${keywordToAdd}`);

    // --- Add gtag event tracking ---
    if (typeof window.gtag === "function") {
      window.gtag("event", "suggestion_used", {
        event_category: "ai_generator",
        event_label: `keyword: ${keywordToAdd}`,
        value: 1,
      });
    }
    // --- End gtag ---
  };

  const useSuggestedTopic = (suggestedTopic) => {
    setTopic(suggestedTopic);
    setGeneratedOutline(null);
    setGeneratedContent(null);
    setSuggestedTopics([]);
    toast.info(`Using topic: "${suggestedTopic}"`);
  };

  const clearGeneratedContent = () => {
    setGeneratedContent(null);
    setTopic("");
    setGeneratedOutline(null);
    setKeywords("");
    setSuggestedKeywords([]);
    setError("");
    toast.info("Cleared generated content.");
  };

  const addCategory = (categoryToAdd) => {
    toast.info(`Selected category: ${categoryToAdd}`);

    // --- Add gtag event tracking ---
    if (typeof window.gtag === "function") {
      window.gtag("event", "suggestion_used", {
        event_category: "ai_generator",
        event_label: `category: ${categoryToAdd}`,
        value: 1,
      });
    }
    // --- End gtag ---
  };

  const useDescription = (descriptionToUse) => {
    toast.info(`Selected description: ${descriptionToUse.substring(0, 50)}...`);

    // --- Add gtag event tracking ---
    if (typeof window.gtag === "function") {
      window.gtag("event", "suggestion_used", {
        event_category: "ai_generator",
        event_label: `description: ${descriptionToUse.substring(0, 30)}...`,
        value: 1,
      });
    }
    // --- End gtag ---
  };

  const handleGenerateFullPost = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }
    setLoadingSection("generate");
    setError("");
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
          length,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");

      setGeneratedContent({
        title: result.data.title || "Generated Post",
        content: result.data.content || "",
      });

      toast.success("Blog post generated!");

      // --- Add gtag event tracking ---
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_full_post", {
          event_category: "ai_generator",
          event_label: topic || result.data.title || "Generated Post",
          value: 1,
        });
      }
      // --- End gtag ---
    } catch (err) {
      setError(`Generation Failed: ${err.message}`);
      toast.error(`Generation Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brandSecondary/10 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>AI Blog Post Generator</title>
      </Head>
      <PageContainer className="mt-20 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-center mb-4 text-foreground font-calendas"
        >
          AI Blog Post Generator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-10 text-lg max-w-3xl mx-auto"
        >
          Turn ideas into engaging blog posts with AI assistance. Start with a
          topic, generate an outline, and create human-like content.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-card border border-primary/20 text-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Sparkles className="h-5 w-5" /> Start with a Topic
                </CardTitle>
                <CardDescription>
                  Enter a topic or get inspiration from AI suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="text-foreground">
                    Topic / Idea
                  </Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How to optimize React performance"
                    className="bg-background border-input text-foreground placeholder-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleGenerateOutline}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary/10 flex-1"
                    disabled={!topic.trim() || loadingSection === "outline"}
                  >
                    {loadingSection === "outline" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BookOpen className="mr-2 h-4 w-4" />
                    )}
                    Generate Outline
                  </Button>
                </div>

                <AnimatePresence>
                  {generatedOutline && !generatedContent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 space-y-3 border-t border-primary/10"
                    >
                      <h4 className="text-sm font-medium text-foreground">
                        Generated Outline:
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">
                          {generatedOutline.title}
                        </p>
                        <ul className="space-y-1">
                          {generatedOutline.headings.map((h, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start"
                            >
                              <span className="mr-2">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="bg-card border border-primary/20 text-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Link className="h-5 w-5" /> Transform Existing Content
                </CardTitle>
                <CardDescription>
                  Paste an article URL to create a fresh blog post based on it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="articleUrl" className="text-foreground">
                    Article URL
                  </Label>
                  <Input
                    id="articleUrl"
                    type="url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="bg-background border-input text-foreground placeholder-muted-foreground"
                  />
                  <Button
                    onClick={handleConvertLink}
                    className="w-full bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground"
                    disabled={!articleUrl.trim() || loadingSection === "link"}
                  >
                    {loadingSection === "link" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Generate Blog Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-primary/20 text-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Settings className="h-5 w-5" /> Writing Preferences
                </CardTitle>
                <CardDescription>
                  Customize the tone and length of your content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tone" className="text-foreground">
                    Tone
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger
                      id="tone"
                      className="bg-background border-input text-foreground"
                    >
                      <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-input text-popover-foreground">
                      {toneOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length" className="text-foreground">
                    Length
                  </Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger
                      id="length"
                      className="bg-background border-input text-foreground"
                    >
                      <SelectValue placeholder="Select Length" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-input text-popover-foreground">
                      {lengthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="keywords" className="text-foreground">
                    Keywords (comma-separated)
                  </Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., react, performance, optimization"
                    className="bg-background border-input text-foreground placeholder-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6 flex flex-col"
          >
            <div className="space-y-6 flex-shrink-0">
              {!generatedContent && (generatedOutline || topic) && (
                <Card className="bg-card border border-primary/20 text-foreground shadow-lg">
                  <CardContent className="pt-6">
                    <Button
                      onClick={handleGenerateFullPost}
                      className="w-full bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground text-lg py-3"
                      disabled={loadingSection === "generate"}
                    >
                      {loadingSection === "generate" ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <AiOutlineRobot className="mr-2 h-5 w-5" />
                      )}
                      Generate Blog Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex-grow flex flex-col min-h-0">
              <AnimatePresence>
                {generatedContent && (
                  <motion.div
                    key="content-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col flex-grow min-h-0"
                  >
                    <Card className="bg-card border border-primary/20 text-foreground shadow-lg flex flex-col flex-grow min-h-0">
                      <CardHeader className="flex-shrink-0">
                        <CardTitle className="flex items-center justify-between text-xl font-semibold text-primary">
                          <span>Generated Content Preview</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearGeneratedContent}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <AiOutlineClose />
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Review and edit your generated content before saving.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-hidden p-0">
                        <ScrollArea className="h-full p-4">
                          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-primary/10 flex-shrink-0">
                            {generatedContent.title}
                          </h2>
                          <div className="prose prose-invert max-w-none prose-p:my-2 prose-h2:mt-4 prose-h2:mb-1 prose-h3:mt-3 prose-h3:mb-1 prose-ul:my-2 prose-li:my-0.5 bg-neutral-900/90 border border-neutral-800 rounded-lg p-5 shadow-inner">
                            {generatedContent.content?.trim() ? (
                              <TipTapRenderer
                                content={generatedContent.content}
                              />
                            ) : (
                              <div className="text-sm text-neutral-400 italic">
                                (No content returned from AI. Try regenerating.)
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              {!generatedContent && !loadingSection && !generatedOutline && (
                <Card className="bg-card border border-primary/20 text-foreground shadow-lg flex-grow flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8 max-w-md">
                    <AiOutlineRobot
                      size={48}
                      className="mx-auto mb-4 text-primary/50"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      AI Blog Generator
                    </h3>
                    <p className="mb-4">
                      Start by entering a topic, generating an outline, or
                      transforming existing content. Your AI-generated blog post
                      will appear here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Badge variant="secondary" className="px-3 py-1">
                        Step 1: Enter Topic
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1">
                        Step 2: Generate Outline
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1">
                        Step 3: Create Content
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}
              {loadingSection === "generate" && (
                <Card className="bg-card border border-primary/20 text-foreground shadow-lg flex-grow flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <Loader2
                      size={48}
                      className="mx-auto mb-4 animate-spin text-primary"
                    />
                    <h3 className="text-xl font-semibold mb-2">
                      Generating Blog Post
                    </h3>
                    <p>Creating human-like content based on your topic...</p>
                  </div>
                </Card>
              )}
              {loadingSection === "link" && (
                <Card className="bg-card border border-primary/20 text-foreground shadow-lg flex-grow flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <Loader2
                      size={48}
                      className="mx-auto mb-4 animate-spin text-primary"
                    />
                    <h3 className="text-xl font-semibold mb-2">
                      Processing Article
                    </h3>
                    <p>Transforming the content into a fresh blog post...</p>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex-shrink-0">
              <AnimatePresence>
                {generatedContent && (
                  <motion.div
                    key="actions-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-card border border-primary/20 text-foreground shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-primary">
                          Ready to Save
                        </CardTitle>
                        <CardDescription>
                          Save your generated content as a draft to continue
                          editing.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={handleSaveDraft}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-primary-foreground"
                          disabled={
                            loadingSection === "save" ||
                            saveStatus.state === "success"
                          }
                        >
                          {loadingSection === "save" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : saveStatus.state === "success" ? (
                            <AiOutlineCheck className="mr-2 h-4 w-4" />
                          ) : (
                            <AiOutlineSave className="mr-2 h-4 w-4" />
                          )}
                          {saveStatus.state === "success"
                            ? "Draft Saved!"
                            : "Save as Draft"}
                        </Button>
                        {saveStatus.state === "error" && (
                          <p className="mt-2 text-sm text-destructive">
                            Error: {saveStatus.message}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-center text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
