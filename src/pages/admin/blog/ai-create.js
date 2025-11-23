import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineRobot,
  AiOutlineSave,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import PageContainer from "@/components/PageContainer";
import TipTapRenderer from "@/components/TipTapRenderer";
import TipTapEditor from "@/components/TipTapEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { toast } from "sonner";
import { Loader2, Settings, Link, BookOpen, Sparkles } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-slate-600" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
        <PageContainer className="pt-24 pb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-center text-4xl font-heading font-semibold text-slate-900 sm:text-5xl"
        >
          AI Blog Post Generator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center text-base text-slate-600 sm:text-lg"
        >
          Turn ideas into engaging blog posts with AI assistance. Start with a
          topic, generate an outline, and create human-like content.
        </motion.p>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:col-span-1"
          >
            <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
                  <Sparkles className="h-5 w-5 text-slate-500" /> Start with a Topic
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Enter a topic or get inspiration from AI suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="text-sm font-medium text-slate-700">
                    Topic / Idea
                  </Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How to optimize React performance"
                    className="border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleGenerateOutline}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-100"
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
                      className="space-y-3 border-t border-slate-200 pt-4"
                    >
                      <h4 className="text-sm font-medium text-slate-700">
                        Generated Outline:
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {generatedOutline.title}
                        </p>
                        <ul className="space-y-1">
                          {generatedOutline.headings.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm text-slate-600"
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

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
                  <Link className="h-5 w-5 text-slate-500" /> Transform Existing Content
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Paste an article URL to create a fresh blog post based on it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="articleUrl" className="text-sm font-medium text-slate-700">
                    Article URL
                  </Label>
                  <Input
                    id="articleUrl"
                    type="url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                  <Button
                    onClick={handleConvertLink}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800"
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

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-900">
                  <Settings className="h-5 w-5 text-slate-500" /> Writing Preferences
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Customize the tone and length of your content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tone" className="text-sm font-medium text-slate-700">
                    Tone
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger
                      id="tone"
                      className="border-slate-200 text-slate-700"
                    >
                      <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-200 bg-white text-slate-700">
                      {toneOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length" className="text-sm font-medium text-slate-700">
                    Length
                  </Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger
                      id="length"
                      className="border-slate-200 text-slate-700"
                    >
                      <SelectValue placeholder="Select Length" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-200 bg-white text-slate-700">
                      {lengthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="keywords" className="text-sm font-medium text-slate-700">
                    Keywords (comma-separated)
                  </Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., react, performance, optimization"
                    className="border-slate-200 text-slate-900 placeholder:text-slate-400"
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
                <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
                  <CardContent className="pt-6">
                    <Button
                      onClick={handleGenerateFullPost}
                      className="w-full rounded-xl bg-slate-900 py-3 text-lg font-medium text-white hover:bg-slate-800"
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
                    <Card className="flex min-h-0 flex-grow flex-col border border-slate-200 bg-white text-slate-900 shadow-sm">
                      <CardHeader className="flex-shrink-0">
                        <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-slate-900">
                          <span>Generated Content Preview</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearGeneratedContent}
                            className="text-slate-400 transition hover:text-red-500"
                          >
                            <AiOutlineClose />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Review and edit your generated content before saving.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-hidden p-0">
                        <ScrollArea className="h-full p-4">
                          <h2 className="mb-4 flex-shrink-0 border-b border-slate-200 pb-2 text-2xl font-heading font-semibold text-slate-900">
                            {generatedContent.title}
                          </h2>
                          <div className="prose max-w-none rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700 prose-headings:font-heading prose-headings:text-slate-900">
                            {generatedContent.content?.trim() ? (
                              <TipTapRenderer
                                content={generatedContent.content}
                              />
                            ) : (
                              <div className="text-sm italic text-slate-500">
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
                <Card className="flex flex-grow items-center justify-center border border-slate-200 bg-white text-slate-900 shadow-sm">
                  <div className="max-w-md p-8 text-center text-slate-600">
                    <AiOutlineRobot
                      size={48}
                      className="mx-auto mb-4 text-slate-400"
                    />
                    <h3 className="mb-2 text-xl font-heading font-semibold text-slate-900">
                      AI Blog Generator
                    </h3>
                    <p className="mb-4">
                      Start by entering a topic, generating an outline, or
                      transforming existing content. Your AI-generated blog post
                      will appear here.
                    </p>
                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                      <Badge variant="secondary" className="border border-slate-200 bg-slate-100 px-3 py-1 text-slate-600">
                        Step 1: Enter Topic
                      </Badge>
                      <Badge variant="secondary" className="border border-slate-200 bg-slate-100 px-3 py-1 text-slate-600">
                        Step 2: Generate Outline
                      </Badge>
                      <Badge variant="secondary" className="border border-slate-200 bg-slate-100 px-3 py-1 text-slate-600">
                        Step 3: Create Content
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}
              {loadingSection === "generate" && (
                <Card className="flex flex-grow items-center justify-center border border-slate-200 bg-white text-slate-900 shadow-sm">
                  <div className="p-8 text-center text-slate-600">
                    <Loader2
                      size={48}
                      className="mx-auto mb-4 animate-spin text-slate-500"
                    />
                    <h3 className="mb-2 text-xl font-heading font-semibold text-slate-900">
                      Generating Blog Post
                    </h3>
                    <p>Creating human-like content based on your topic...</p>
                  </div>
                </Card>
              )}
              {loadingSection === "link" && (
                <Card className="flex flex-grow items-center justify-center border border-slate-200 bg-white text-slate-900 shadow-sm">
                  <div className="p-8 text-center text-slate-600">
                    <Loader2
                      size={48}
                      className="mx-auto mb-4 animate-spin text-slate-500"
                    />
                    <h3 className="mb-2 text-xl font-heading font-semibold text-slate-900">
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
                    <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-heading font-semibold text-slate-900">
                          Ready to Save
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Save your generated content as a draft to continue
                          editing.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={handleSaveDraft}
                          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
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
                          <p className="mt-2 text-sm text-red-600">
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
                className="rounded border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
        </PageContainer>
      </div>
    </>
  );
}
