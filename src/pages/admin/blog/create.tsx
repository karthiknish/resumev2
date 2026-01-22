// Converted to TypeScript - migrated
import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Wand2, ArrowLeft, Eye, Save, LayoutPanelLeft, Clock, Trash2, Bot, Sparkles, Check, CloudUpload, FileText, Upload, X, ChevronDown, List, Search, ExternalLink, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";
import InternalLinkSuggestions from "@/components/admin/blog-editor/InternalLinkSuggestions";
import SectionalAgent from "@/components/admin/SectionalAgent";

import { AiOutlineClose } from "react-icons/ai";
import TipTapEditor, { TipTapEditorHandle } from "@/components/TipTapEditor";
import TipTapRenderer from "@/components/TipTapRenderer";
import useDebounce from "@/hooks/useDebounce";
import { BlogFormData } from "@/types";

const DRAFT_STORAGE_KEY = "blog_draft_create";

  // Helper function to format relative time
function formatRelativeTime(date: Date | string | null) {
  if (!date) return "";
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 10) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return diffMs;
}

function CreateBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const editorRef = useRef<TipTapEditorHandle | null>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    imageUrl: "",
    content: "",
    description: "",
    excerpt: "",
    category: "",
    tags: [],
    isPublished: false,
    scheduledPublishAt: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error

  // Agent Mode state
  const [isAgentModeOpen, setIsAgentModeOpen] = useState(false);
  const [agentContext, setAgentContext] = useState("");
  const [agentUrl, setAgentUrl] = useState("");
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentFile, setAgentFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  // Style/Voice configuration state
  const [agentTone, setAgentTone] = useState("professional");
  const [agentAudience, setAgentAudience] = useState("developers");
  const [agentLength, setAgentLength] = useState("medium");
  // Sectional Agent state
  const [isSectionalAgentOpen, setIsSectionalAgentOpen] = useState(false);
  // Web research state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Debounced form data for auto-save (save after 3 seconds of no changes)
  const debouncedFormData = useDebounce(formData, 3000);

  // Check for admin status
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

    const isAdmin =
      session?.user?.role === "admin" ||
      session?.user?.isAdmin === true ||
      session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!isAdmin) {
      toast.error("Access Denied: Admin privileges required.");
      router.push("/");
    }
  }, [status, session, router]);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData && (parsed.formData.title || parsed.formData.content)) {
          setFormData(parsed.formData);
          setLastSaved(parsed.savedAt ? new Date(parsed.savedAt) : null);
          setHasDraft(true);
          toast.success("Draft restored!", {
            description: "Your previous draft has been loaded.",
            duration: 4000,
          });
        }
      }
    } catch (e) {
      console.error("Error restoring draft:", e);
    }
  }, []);

  // Auto-save draft to localStorage when form changes
  useEffect(() => {
    // Only save if there's meaningful content
    if (debouncedFormData.title || debouncedFormData.content) {
      // Show saving state with a slight delay for better UX
      const saveTimer = setTimeout(() => {
        setIsSaving(true);
        setSaveStatus("saving");
      }, 500);

      // Perform save operation
      const performSave = () => {
        try {
          const draftData = {
            formData: debouncedFormData,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
          setLastSaved(new Date());
          setHasDraft(true);
          setSaveStatus("saved");
        } catch (e) {
          console.error("Error saving draft:", e);
          setSaveStatus("error");
        } finally {
          setIsSaving(false);
          // Reset to "saved" state after 2 seconds
          setTimeout(() => {
            setSaveStatus("idle");
          }, 2000);
        }
      };

      // Save after the "saving" state is shown
      const saveCompleteTimer = setTimeout(performSave, 800);

      return () => {
        clearTimeout(saveTimer);
        clearTimeout(saveCompleteTimer);
      };
    }
  }, [debouncedFormData]);

  // Update relative time display every minute
  useEffect(() => {
    if (!lastSaved) return;
    const interval = setInterval(() => {
      // Force re-render to update relative time
      setLastSaved((prev) => prev ? new Date(prev) : null);
    }, 60000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (!window.confirm("Are you sure you want to clear the current draft? All unsaved changes will be lost.")) {
      return;
    }
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      setLastSaved(null);
      setFormData({
        title: "",
        imageUrl: "",
        content: "",
        description: "",
        excerpt: "",
        category: "",
        tags: [],
        isPublished: false,
        scheduledPublishAt: null,
      });
      toast.success("Draft cleared!");
    } catch (e) {
      console.error("Error clearing draft:", e);
    }
  }, []);

  const getPlainText = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const wordCount = getPlainText(formData.content)
    .split(" ")
    .filter(Boolean).length;

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const seoScore = (() => {
    let score = 0;
    const titleLen = (formData.title || "").trim().length;
    const descLen = (formData.excerpt || "").trim().length;
    const text = getPlainText(formData.content);
    const words = text.split(" ").filter(Boolean).length;
    const hasSubheadings = /<h2|<h3/i.test(formData.content || "");
    const tagsCount = (formData.tags || []).length;
    if (titleLen >= 30 && titleLen <= 60) score += 20;
    if (descLen >= 120 && descLen <= 160) score += 20;
    if (words >= 600) score += 20;
    if (hasSubheadings) score += 20;
    if (tagsCount >= 3) score += 20;
    return Math.max(0, Math.min(100, score));
  })();

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleContentChange = (html: string) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  const handleFormChange = (
    fieldOrPatch: keyof BlogFormData | Partial<BlogFormData>,
    maybeValue?: BlogFormData[keyof BlogFormData]
  ) => {
    if (typeof fieldOrPatch === "object" && fieldOrPatch !== null) {
      setFormData((prev) => ({ ...prev, ...fieldOrPatch }));
    } else if (typeof fieldOrPatch === "string") {
      const key = fieldOrPatch as keyof BlogFormData;
      setFormData((prev) => ({ ...prev, [key]: maybeValue }));
    }
  };

  const handlePublishChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: !!checked }));
  };

  const togglePreview = () => setShowPreview((prev) => !prev);

  const handleFormatContent = async () => {
    if (!formData.content?.trim()) return;
    setIsFormatting(true);
    setError("");
    try {
      const response = await fetch("/api/ai/format-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        handleContentChange(data.data);
        toast.success("Content formatted successfully!");
      } else {
        throw new Error(data.message || "Failed to format content.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error formatting content.";
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  };

  // Handler for Agent Mode blog generation
  const handleAgentGenerate = async () => {
    if (!agentContext?.trim() && !agentUrl?.trim() && !agentFile) {
      setAgentError("Please provide context, a URL, or upload a file for generating the blog.");
      toast.error("Please provide context, a URL, or upload a file for generating the blog.");
      return;
    }

    setIsAgentGenerating(true);
    setAgentError("");

    const toastId = "agent-generate-toast";
    toast.loading("Agent is writing your blog...", { id: toastId });

    try {
      // Use FormData if we have a file, otherwise use JSON
      let response;
      const styleConfig = { tone: agentTone, audience: agentAudience, length: agentLength };

      if (agentFile) {
        const formData = new FormData();
        formData.append('file', agentFile);
        if (agentContext) formData.append('context', agentContext);
        if (agentUrl) formData.append('url', agentUrl);
        formData.append('styleConfig', JSON.stringify(styleConfig));

        response = await fetch("/api/ai/agent-generate-blog", {
          method: "POST",
          // Don't set Content-Type header for FormData, let the browser set it with boundary
          body: formData,
        });
      } else {
        response = await fetch("/api/ai/agent-generate-blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: agentContext, url: agentUrl, styleConfig }),
        });
      }

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const { title, content } = data.data;

        // Update form data with generated title and content
        setFormData((prev) => ({
          ...prev,
          title: title || prev.title,
          content: content || prev.content,
        }));

        toast.success("Blog generated successfully!", { id: toastId });
        setIsAgentModeOpen(false);
        setAgentContext("");
        setAgentUrl("");
        setAgentFile(null);
      } else {
        throw new Error(data.message || "Failed to generate blog.");
      }
    } catch (err: unknown) {
      console.error("Agent Mode error:", err);
      const message = err instanceof Error ? err.message : "Failed to generate blog.";
      setAgentError(message);
      toast.error(`Generation failed: ${message}`, { id: toastId });
    } finally {
      setIsAgentGenerating(false);
    }
  };

  // Handle file selection for Agent Mode
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setAgentError("Invalid file type. Please upload PDF, DOCX, or TXT files.");
      toast.error("Invalid file type. Please upload PDF, DOCX, or TXT files.");
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setAgentError("File size exceeds 10MB limit.");
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setAgentFile(file);
    setAgentError("");
  };

  // Handle removing the selected file
  const handleRemoveFile = () => {
    setAgentFile(null);
  };

  // Handler for Sectional Agent content completion
  const handleSectionalAgentComplete = (generatedContent: { title?: string; content?: string }) => {
    const { title, content } = generatedContent;
    setFormData((prev) => ({
      ...prev,
      title: title || prev.title,
      content: content || prev.content,
    }));
    setIsSectionalAgentOpen(false);
    toast.success("Blog content generated successfully!");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    const missingFields: string[] = [];
    if (!formData.title) missingFields.push("Title");
    if (!formData.content) missingFields.push("Content");
    if (!formData.imageUrl) missingFields.push("Image URL");
    if (!(formData.excerpt || formData.description))
      missingFields.push("Description");

    if (missingFields.length > 0) {
      const errorMsg = `Missing required field(s): ${missingFields.join(", ")}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    const dataToSubmit = {
      title: formData.title,
      imageUrl: formData.imageUrl,
      content: formData.content || "",
      description: formData.excerpt || formData.description || "",
      excerpt: formData.excerpt,
      category: formData.category,
      tags: (formData.tags || []).filter((tag) => tag),
      isPublished: !!formData.isPublished,
      scheduledPublishAt: formData.scheduledPublishAt,
    };

    try {
      const res = await fetch(`/api/blog/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Blog post created successfully!");
        // Clear draft from localStorage after successful creation
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasDraft(false);
        // Redirect to edit page of the new post
        const newId = result.data._id || result.data.slug;
        router.push(`/admin/blog/edit/${newId}`);
      } else {
        const apiErrorMsg = result.message || "Failed to create blog post";
        setError(apiErrorMsg);
        toast.error(apiErrorMsg);
      }
    } catch (err: unknown) {
      const networkErrorMsg = "Network error occurred while saving.";
      setError(networkErrorMsg);
      toast.error(networkErrorMsg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const BlogPreview = () => (
    <div className="fixed inset-0 z-[150] flex items-start justify-center overflow-auto bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl my-8 overflow-hidden rounded-2xl bg-background border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Preview
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreview}
            className="text-muted-foreground hover:text-foreground"
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
        <div className="max-h-[80vh] overflow-auto px-8 py-8">
          {formData.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-xl shadow-sm border border-border">
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <h1 className="mb-6 text-4xl font-heading font-bold text-foreground">
            {formData.title}
          </h1>
          <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary">
            <TipTapRenderer content={formData.content} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Create New Post</title>
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <PageContainer className="pt-32 pb-20 px-6 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Create New Post
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Draft a new blog post from scratch or{" "}
                    <button
                      onClick={() => router.push("/admin/blog/ai-create")}
                      className="font-medium text-primary hover:underline"
                    >
                      try the AI Generator
                    </button>
                    .
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Auto-save indicator with timestamp */}
                {hasDraft && lastSaved && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                        saveStatus === "saving"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : saveStatus === "error"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {saveStatus === "saving" ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === "error" ? (
                        <>
                          <CloudUpload className="h-3 w-3" />
                          <span>Save failed</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Saved {formatRelativeTime(lastSaved)}</span>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDraft}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Clear draft"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <LayoutPanelLeft className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Post Settings</SheetTitle>
                      <SheetDescription>
                        Manage metadata, SEO, and publishing settings.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <BannerImageSection
                        imageUrl={formData.imageUrl || ""}
                        onImageUrlChange={handleImageUrlChange}
                      />
                      <MetadataSection
                        formData={formData}
                        onFormChange={handleFormChange}
                        isPublished={!!formData.isPublished}
                        onPublishChange={handlePublishChange}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" onClick={togglePreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button onClick={(e) => handleSubmit(e)} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Create Post
                </Button>
              </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              {error && (
                <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Title & Badges */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Post Title"
                  className="w-full border-none bg-transparent text-4xl font-heading font-bold text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="font-normal flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
                  </Badge>
                  <Badge variant="secondary" className="font-normal flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {readingTimeMinutes} min read
                  </Badge>
                  <Badge
                    variant={
                      seoScore >= 80
                        ? "success"
                        : seoScore >= 60
                        ? "warning"
                        : "destructive"
                    }
                    className="font-normal"
                  >
                    SEO Score: {seoScore}/100
                  </Badge>
                  <InternalLinkSuggestions
                    title={formData.title}
                    content={formData.content}
                    currentSlug=""
                    onInsertLink={({ url, text }) => {
                      editorRef.current?.insertLink({ url, text });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFormatContent}
                    disabled={isFormatting}
                    className="h-6 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {isFormatting ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Wand2 className="mr-1 h-3 w-3" />
                    )}
                    AI Format
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAgentModeOpen(true)}
                    disabled={isAgentGenerating}
                    className="h-6 px-2 text-xs text-violet-600 hover:bg-violet-500/10 hover:text-violet-700"
                  >
                    {isAgentGenerating ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Bot className="mr-1 h-3 w-3" />
                    )}
                    Quick Generate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSectionalAgentOpen(true)}
                    className="h-6 px-2 text-xs text-purple-600 hover:bg-purple-500/10 hover:text-purple-700"
                  >
                    <List className="mr-1 h-3 w-3" />
                    Sectional Mode
                  </Button>
                </div>
              </div>

              <div className="max-w-5xl mx-auto space-y-8 lg:block hidden">
                {/* Metadata Section (Top) */}
                <MetadataSection
                  formData={formData}
                  onFormChange={handleFormChange}
                  isPublished={!!formData.isPublished}
                  onPublishChange={handlePublishChange}
                />

                {/* Banner Image (Middle) */}
                <BannerImageSection
                  imageUrl={formData.imageUrl || ""}
                  onImageUrlChange={handleImageUrlChange}
                />
              </div>
            </div>

            {/* Main Editor Area (Bottom) - Full Width */}
            <div className="mt-8">
              <TipTapEditor
                ref={editorRef}
                id="blog-content-editor"
                content={formData.content}
                onUpdate={(html) => handleContentChange(html)}
                className="min-h-[600px] border-none shadow-none"
              />
            </div>
          </div>
        </PageContainer>
      </div>
      {showPreview && <BlogPreview />}

      {/* Agent Mode Dialog */}
      <Dialog open={isAgentModeOpen} onOpenChange={(open) => {
        setIsAgentModeOpen(open);
        if (!open) {
          setAgentError("");
          setAgentFile(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-500" />
              Agent Mode
            </DialogTitle>
            <DialogDescription>
              Provide context, a URL, or upload a file (PDF, DOCX, TXT) to generate
              a complete blog post with title and content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="agent-file">Upload File (Optional)</Label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="agent-file"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    agentFile
                      ? "border-violet-500 bg-violet-500/5"
                      : "border-input hover:border-muted-foreground/50 hover:bg-muted/30"
                  }`}
                >
                  <input
                    id="agent-file"
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isAgentGenerating}
                  />
                  {agentFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-violet-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{agentFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(agentFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFile();
                        }}
                        className="ml-2 rounded-full p-1 hover:bg-muted-foreground/20"
                        disabled={isAgentGenerating}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Drop file or click to upload
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        PDF, DOCX, TXT (max 10MB)
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-url">URL (Optional)</Label>
              <input
                id="agent-url"
                type="url"
                placeholder="https://example.com/article"
                value={agentUrl}
                onChange={(e) => setAgentUrl(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isAgentGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-context">Context / Instructions</Label>
              <Textarea
                id="agent-context"
                placeholder="E.g., Write a blog about React Server Components, explaining what they are, their benefits over client components, and how to migrate existing components. Include code examples and best practices."
                value={agentContext}
                onChange={(e) => setAgentContext(e.target.value)}
                className="min-h-[120px] resize-y"
                disabled={isAgentGenerating}
              />
            </div>

            {/* Style/Voice Configuration Panel */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <Label className="text-sm font-medium">Writing Style & Voice</Label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Tone Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="agent-tone" className="text-xs text-muted-foreground">Tone</Label>
                  <Select value={agentTone} onValueChange={setAgentTone} disabled={isAgentGenerating}>
                    <SelectTrigger id="agent-tone" className="h-8 text-sm">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="agent-audience" className="text-xs text-muted-foreground">Audience</Label>
                  <Select value={agentAudience} onValueChange={setAgentAudience} disabled={isAgentGenerating}>
                    <SelectTrigger id="agent-audience" className="h-8 text-sm">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="executives">Executives</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Length Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="agent-length" className="text-xs text-muted-foreground">Length</Label>
                  <Select value={agentLength} onValueChange={setAgentLength} disabled={isAgentGenerating}>
                    <SelectTrigger id="agent-length" className="h-8 text-sm">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (~500 words)</SelectItem>
                      <SelectItem value="medium">Medium (~1000 words)</SelectItem>
                      <SelectItem value="long">Long (~2000 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {agentError && (
              <p className="text-sm text-destructive">{agentError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAgentModeOpen(false);
                setAgentError("");
                setAgentFile(null);
              }}
              disabled={isAgentGenerating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAgentGenerate}
              disabled={isAgentGenerating || (!agentContext?.trim() && !agentUrl?.trim() && !agentFile)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {isAgentGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Blog
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sectional Agent Dialog */}
      <Dialog open={isSectionalAgentOpen} onOpenChange={setIsSectionalAgentOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <SectionalAgent
            onContentComplete={handleSectionalAgentComplete}
            onCancel={() => setIsSectionalAgentOpen(false)}
            initialContext={agentContext}
            initialUrl={agentUrl}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateBlog;
