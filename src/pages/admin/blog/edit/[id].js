import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, ArrowLeft, Eye, Save, LayoutPanelLeft, Check, CloudUpload, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";

import { AiOutlineClose } from "react-icons/ai";
import TipTapEditor from "@/components/TipTapEditor";
import TipTapRenderer from "@/components/TipTapRenderer";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "sonner";

import { checkAdminStatus } from "@/lib/authUtils";

// Helper function to format relative time
function formatRelativeTime(date) {
  if (!date) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 10) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

function Edit() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: blogId } = router.query;

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    content: "",
    description: "",
    excerpt: "",
    category: "",
    tags: [],
    isPublished: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState({ ...formData });
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error

  const debouncedFormData = useDebounce(formData, 1500);

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

    if (session && !checkAdminStatus(session)) {
      toast.error("Access Denied: Admin privileges required.");
      router.push("/");
    }
  }, [status, session, router]);

  const getPlainText = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const readingTimeMinutes = (() => {
    const words = getPlainText(formData.content)
      .split(" ")
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  })();

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

  useEffect(() => {
    const load = async () => {
      if (!blogId) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/blog?id=${blogId}`);
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load blog post");
        }
        const b = data.data || {};
        const populated = {
          title: b.title || "",
          imageUrl: b.imageUrl || "",
          content: b.content || "",
          description: b.description || "",
          excerpt: b.description || "",
          category: b.category || "",
          tags: Array.isArray(b.tags) ? b.tags : [],
          isPublished: !!b.isPublished,
        };
        setFormData(populated);
        setLastSavedSnapshot(populated);
      } catch (e) {
        setError(e.message || "Failed to load blog post");
        toast.error(e.message || "Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [blogId]);

  const handleImageUrlChange = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleContentChange = (html) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  const handleFormChange = (fieldOrPatch, maybeValue) => {
    if (typeof fieldOrPatch === "object" && fieldOrPatch !== null) {
      setFormData((prev) => ({ ...prev, ...fieldOrPatch }));
    } else if (typeof fieldOrPatch === "string") {
      setFormData((prev) => ({ ...prev, [fieldOrPatch]: maybeValue }));
    }
  };

  const handlePublishChange = (checked) => {
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
    } catch (err) {
      const errorMsg = err?.message || "Error formatting content.";
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  };

  useEffect(() => {
    if (!blogId) return;
    const keys = [
      "title",
      "imageUrl",
      "content",
      "description",
      "excerpt",
      "category",
      "tags",
      "isPublished",
    ];
    const patch = {};
    let changed = false;
    keys.forEach((k) => {
      const prevVal = lastSavedSnapshot[k];
      const currVal = debouncedFormData[k];
      const isChanged = Array.isArray(currVal)
        ? JSON.stringify(prevVal || []) !== JSON.stringify(currVal || [])
        : prevVal !== currVal;
      if (isChanged) {
        if (
          ["title", "content", "excerpt", "category", "description"].includes(k)
        ) {
          if (!currVal || String(currVal).trim() === "") return;
        }
        patch[k] = currVal;
        changed = true;
      }
    });
    if (!changed) return;
    const save = async () => {
      try {
        setIsAutoSaving(true);
        setSaveStatus("saving");
        const res = await fetch("/api/blog/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: blogId, ...patch }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false)
          throw new Error(data.message || "Autosave failed");
        setLastSavedSnapshot((prev) => ({ ...prev, ...patch }));
        setLastSavedTime(new Date());
        setSaveStatus("saved");
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } catch (e) {
        setSaveStatus("error");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } finally {
        setIsAutoSaving(false);
      }
    };
    save();
  }, [debouncedFormData, blogId, lastSavedSnapshot]);

  // Update relative time display every minute
  useEffect(() => {
    if (!lastSavedTime) return;
    const interval = setInterval(() => {
      setLastSavedTime((prev) => new Date(prev));
    }, 60000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setSubmitStatus([]);
    setError("");

    const missingFields = [];
    if (!formData.title) missingFields.push("Title");
    if (!formData.content) missingFields.push("Content");
    if (!formData.imageUrl) missingFields.push("Image URL");
    if (!(formData.excerpt || formData.description))
      missingFields.push("Description");

    if (missingFields.length > 0) {
      const errorMsg = `Missing required field(s): ${missingFields.join(", ")}`;
      setError(errorMsg);
      setSubmitStatus([false, errorMsg]);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/blog/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blogId, ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Blog post updated successfully!");
        router.push("/admin");
      } else {
        setError(result.message || "Failed to update blog post");
        toast.error(result.message || "Failed to update blog post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit: {formData.title || "Blog Post"}</title>
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
                    Edit Post
                  </h1>
                  {/* Auto-save indicator with timestamp */}
                  {lastSavedTime || saveStatus !== "idle" ? (
                    <div
                      className={`flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-300 w-fit ${
                        saveStatus === "saving"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : saveStatus === "error"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {saveStatus === "saving" ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
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
                          <span>Saved {formatRelativeTime(lastSavedTime)}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">All changes saved</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                        imageUrl={formData.imageUrl}
                        onImageUrlChange={handleImageUrlChange}
                      />
                      <MetadataSection
                        formData={formData}
                        onFormChange={handleFormChange}
                        isPublished={formData.isPublished}
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
                  Save Changes
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="max-w-5xl mx-auto space-y-8">
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
                  <Badge variant="secondary" className="font-normal">
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
                </div>
              </div>

              <div className="lg:block hidden space-y-8">
                {/* Metadata Section (Top) */}
                <MetadataSection
                  formData={formData}
                  onFormChange={handleFormChange}
                  isPublished={formData.isPublished}
                  onPublishChange={handlePublishChange}
                />

                {/* Banner Image (Middle) */}
                <BannerImageSection
                  imageUrl={formData.imageUrl}
                  onImageUrlChange={handleImageUrlChange}
                />
              </div>
            </div>

            {/* Main Editor Area (Bottom) - Full Width */}
            <div className="mt-8">
              <TipTapEditor
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
    </>
  );
}

export default Edit;
