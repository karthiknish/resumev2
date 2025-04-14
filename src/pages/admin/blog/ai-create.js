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
import { Loader2, Wand2, Settings, Link, BookOpen } from "lucide-react";

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "informative", label: "Informative" },
  { value: "conversational", label: "Conversational" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "technical", label: "Technical" },
];

const lengthOptions = [
  { value: "500", label: "Short (~500 words)" },
  { value: "800", label: "Medium (~800 words)" },
  { value: "1200", label: "Long (~1200 words)" },
  { value: "1500", label: "Very Long (~1500 words)" },
  { value: "2000", label: "Epic (~2000 words)" },
];

export default function AICreateBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(toneOptions[0].value);
  const [length, setLength] = useState(lengthOptions[1].value);
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
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

  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState(null);

  const [isSuggestingTopics, setIsSuggestingTopics] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);

  const [loadingSection, setLoadingSection] = useState(null);

  const [saveStatus, setSaveStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session) {
      const isUserAdmin =
        session.user.role === "admin" ||
        session.user.isAdmin === true ||
        session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (!isUserAdmin) {
        toast.error("Access Denied: Admin required.");
        router.push("/");
      }
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

    try {
      const response = await fetch("/api/ai/blog-from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: articleUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");
      setTopic(result.title);
      setGeneratedContent({ title: result.title, content: result.content });
      handleSuggestKeywords(result.content);
      toast.success("Content generated from link!");
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
      setGeneratedOutline(result.data);
      setTopic(result.data.title);
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
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
      <PageContainer className="py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-center mb-10 text-white font-calendas glow-blue"
        >
          AI Blog Post Generator
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-400">
                  <AiOutlineBulb /> Start with a Topic
                </CardTitle>
                <CardDescription>
                  Enter a topic or suggest ideas to begin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="text-gray-300">
                    Topic / Idea
                  </Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Introduction to React Server Components"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSuggestTopics()}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-400 hover:bg-blue-900/30 flex-1"
                    disabled={loadingSection === "topics"}
                  >
                    {loadingSection === "topics" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <AiOutlineTags className="mr-2 h-4 w-4" />
                    )}
                    Suggest Topics
                  </Button>
                  <Button
                    onClick={handleGenerateOutline}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-400 hover:bg-blue-900/30 flex-1"
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
                  {suggestedTopics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 space-y-2"
                    >
                      <h4 className="text-sm font-medium text-gray-400">
                        Suggested Topics:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map((st, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            onClick={() => useSuggestedTopic(st)}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-300"
                          >
                            {st}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-400">
                  <Link /> Generate from Link
                </CardTitle>
                <CardDescription>
                  Paste an article URL to generate a blog post based on it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="articleUrl" className="text-gray-300">
                    Article URL
                  </Label>
                  <Input
                    id="articleUrl"
                    type="url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  />
                  <Button
                    onClick={handleConvertLink}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!articleUrl.trim() || loadingSection === "link"}
                  >
                    {loadingSection === "link" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Generate from URL
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-400">
                  <Settings /> Configuration
                </CardTitle>
                <CardDescription>
                  Adjust generation parameters (optional).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tone" className="text-gray-300">
                    Tone
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger
                      id="tone"
                      className="bg-gray-700 border-gray-600 text-white"
                    >
                      <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {toneOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length" className="text-gray-300">
                    Length
                  </Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger
                      id="length"
                      className="bg-gray-700 border-gray-600 text-white"
                    >
                      <SelectValue placeholder="Select Length" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {lengthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="keywords" className="text-gray-300">
                      Keywords (comma-separated)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleSuggestKeywords(generatedContent?.content)
                      }
                      disabled={
                        loadingSection === "keywords" ||
                        (!topic && !generatedContent)
                      }
                      className="text-blue-400 hover:text-blue-300 px-1 h-auto"
                      title="Suggest Keywords based on Topic/Content"
                    >
                      {loadingSection === "keywords" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <AiOutlineBulb className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., react, typescript, state management"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  />
                  <AnimatePresence>
                    {suggestedKeywords.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 space-y-1"
                      >
                        <h4 className="text-xs font-medium text-gray-400">
                          Suggestions:
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestedKeywords.map((kw, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addKeyword(kw)}
                              className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 h-auto py-0.5 px-1.5"
                            >
                              {kw}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {!generatedContent && (generatedOutline || topic) && (
              <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
                    disabled={loadingSection === "full"}
                  >
                    {loadingSection === "full" ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <AiOutlineRobot className="mr-2 h-5 w-5" />
                    )}
                    Generate Full Blog Post
                  </Button>
                </CardContent>
              </Card>
            )}

            <AnimatePresence>
              {generatedOutline && !generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="bg-gray-750 border-gray-600 text-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-blue-300">
                        Generated Outline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>
                        <strong>Title:</strong> {generatedOutline.title}
                      </p>
                      <div>
                        <strong>Headings:</strong>
                        <ul className="list-disc list-inside ml-4 text-gray-300">
                          {generatedOutline.headings.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {generatedContent && (
                <motion.div
                  key="content-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-xl font-semibold text-blue-400">
                        <span>Generated Content Preview</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={clearGeneratedContent}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <AiOutlineClose />
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Review the generated HTML content below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700">
                        {generatedContent.title}
                      </h2>
                      <div className="prose prose-invert max-w-none prose-p:my-2 prose-h2:mt-4 prose-h2:mb-1 prose-h3:mt-3 prose-h3:mb-1 prose-ul:my-2 prose-li:my-0.5">
                        <TipTapRenderer content={generatedContent.content} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {generatedContent && (
                <motion.div
                  key="actions-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg glow-card">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-blue-400">
                        Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={handleSaveDraft}
                        className="w-full bg-green-600 hover:bg-green-700"
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
                        <p className="mt-2 text-sm text-red-500">
                          Error: {saveStatus.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-center text-sm"
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
