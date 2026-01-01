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
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import PageContainer from "@/components/PageContainer";
import TipTapRenderer from "@/components/TipTapRenderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Loader2, Settings, Link as LinkIcon, BookOpen, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkAdminStatus } from "@/lib/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("topic"); // 'topic' or 'link'

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(toneOptions[3].value);
  const [length, setLength] = useState(lengthOptions[1].value);
  const [keywords, setKeywords] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [articleUrl, setArticleUrl] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState(null);
  const [loadingSection, setLoadingSection] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (status === "loading") return;

    // Localhost bypass for development testing
    const isLocalhost = typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (isLocalhost) return;

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

  const handleSaveDraft = useCallback(async () => {
    if (!generatedContent?.title?.trim() || !generatedContent?.content?.trim()) {
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

      // Attempt to fetch a relevant image from Pexels
      let finalImageUrl = `https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1`; // Solid fallback
      try {
        const pexelsRes = await fetch(`/api/pexels/search?query=${encodeURIComponent(topic || "technology")}&per_page=1`);
        const pexelsData = await pexelsRes.json();
        if (pexelsData.success && pexelsData.photos && pexelsData.photos.length > 0) {
          finalImageUrl = pexelsData.photos[0].src.landscape || pexelsData.photos[0].src.large;
        }
      } catch (err) {
        console.error("Failed to fetch Pexels image:", err);
      }

      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt,
          imageUrl: finalImageUrl,
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
      
      toast.success("Content generated from link!");
      setStep(3); // Skip to result/preview
    } catch (err) {
      setError(`Link Conversion Failed: ${err.message}`);
      toast.error(`Link Conversion Failed: ${err.message}`);
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
      const outlinePayload = result.data || result.outline;
      if (!outlinePayload || !outlinePayload.title) {
        throw new Error("Malformed outline response");
      }
      setGeneratedOutline(outlinePayload);
      setTopic(outlinePayload.title);
      toast.success("Outline generated!");
      setStep(2); // Move to outline step
    } catch (err) {
      setError(`Outline Generation Failed: ${err.message}`);
      toast.error(`Outline Generation Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
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
          outline: generatedOutline, // Pass outline if available
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");

      setGeneratedContent({
        title: result.data.title || "Generated Post",
        content: result.data.content || "",
      });

      toast.success("Blog post generated!");
      setStep(3); // Move to result step
    } catch (err) {
      setError(`Generation Failed: ${err.message}`);
      toast.error(`Generation Failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Head>
        <title>AI Blog Generator</title>
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <PageContainer className="pt-24 pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
                AI Blog Generator
              </h1>
              <p className="text-muted-foreground">
                Create engaging content in minutes with AI assistance.
              </p>
            </div>

            {/* Stepper */}
            <div className="mb-8 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        step >= s
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`mx-2 h-1 w-12 rounded-full transition-colors ${
                          step > s ? "bg-foreground" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Choose your source</CardTitle>
                      <CardDescription>
                        Start from scratch with a topic or transform an existing article.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs
                        defaultValue="topic"
                        value={mode}
                        onValueChange={setMode}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-muted">
                          <TabsTrigger value="topic">Topic & Idea</TabsTrigger>
                          <TabsTrigger value="link">Article URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="topic" className="mt-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="topic">What do you want to write about?</Label>
                            <Input
                              id="topic"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder="e.g., The Future of Web Development in 2025"
                              className="h-12 text-lg"
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Tone</Label>
                              <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {toneOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Length</Label>
                              <Select value={length} onValueChange={setLength}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {lengthOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Keywords (Optional)</Label>
                            <Input
                              value={keywords}
                              onChange={(e) => setKeywords(e.target.value)}
                              placeholder="react, nextjs, performance"
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="link" className="mt-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="url">Article URL</Label>
                            <Input
                              id="url"
                              value={articleUrl}
                              onChange={(e) => setArticleUrl(e.target.value)}
                              placeholder="https://example.com/article-to-rewrite"
                              className="h-12"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      {mode === "topic" ? (
                        <Button
                          onClick={handleGenerateOutline}
                          disabled={!topic.trim() || loadingSection === "outline"}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {loadingSection === "outline" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <AiOutlineArrowRight className="mr-2 h-4 w-4" />
                          )}
                          Generate Outline
                        </Button>
                      ) : (
                        <Button
                          onClick={handleConvertLink}
                          disabled={!articleUrl.trim() || loadingSection === "link"}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {loadingSection === "link" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          Generate Content
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="border-border shadow-sm">
                    <CardHeader>
                      <CardTitle>Review Outline</CardTitle>
                      <CardDescription>
                        Customize the structure of your blog post before generating content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="font-semibold"
                        />
                      </div>
                      {generatedOutline && (
                        <div className="rounded-lg border border-border bg-muted/50 p-4">
                          <h3 className="mb-2 font-semibold text-foreground">Outline Structure</h3>
                          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            {generatedOutline.headings.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={prevStep}>
                        <AiOutlineArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleGenerateFullPost}
                        disabled={loadingSection === "generate"}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {loadingSection === "generate" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <AiOutlineRobot className="mr-2 h-4 w-4" />
                        )}
                        Generate Full Post
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Generated Content</CardTitle>
                        <CardDescription>
                          Review your AI-generated blog post.
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Start Over
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-xl border border-border bg-muted/30 p-6">
                        {generatedContent ? (
                          <article className="prose max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
                            <h1>{generatedContent.title}</h1>
                            <TipTapRenderer content={generatedContent.content} />
                          </article>
                        ) : (
                          <div className="flex h-64 items-center justify-center text-muted-foreground">
                            No content generated yet.
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={prevStep}>
                        <AiOutlineArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleSaveDraft}
                        disabled={loadingSection === "save" || saveStatus.state === "success"}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {loadingSection === "save" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : saveStatus.state === "success" ? (
                          <AiOutlineCheck className="mr-2 h-4 w-4" />
                        ) : (
                          <AiOutlineSave className="mr-2 h-4 w-4" />
                        )}
                        {saveStatus.state === "success" ? "Saved!" : "Save Draft & Edit"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PageContainer>
      </div>
    </>
  );
}

