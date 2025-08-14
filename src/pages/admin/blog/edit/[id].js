import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer"; // Ensure single import
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import necessary icons and toast
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
// Switch import is removed as it's handled in MetadataSection

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";
import ActionButtons from "@/components/admin/blog-editor/ActionButtons";

// Keep ReactMarkdown and AiOutlineClose for the preview modal if still needed
import { AiOutlineClose } from "react-icons/ai";
import TipTapEditor from "@/components/TipTapEditor";
import TipTapRenderer from "@/components/TipTapRenderer";
import useDebounce from "@/hooks/useDebounce";

function Edit() {
  const router = useRouter();
  const { id: blogId } = router.query;

  // Consolidate state for form data
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
  const [submitStatus, setSubmitStatus] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatError, setFormatError] = useState("");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState({ ...formData });
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");

  const debouncedFormData = useDebounce(formData, 1500);

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

  // Load blog by ID and populate form
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
    setFormatError("");
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
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Error formatting content.";
      setFormatError(errorMsg);
      setError(`Formatting Error: ${errorMsg}`);
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  };

  // Autosave debounced changes
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
        setAutoSaveMessage("Saving...");
        const res = await fetch("/api/blog/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: blogId, ...patch }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false)
          throw new Error(data.message || "Autosave failed");
        setLastSavedSnapshot((prev) => ({ ...prev, ...patch }));
        setAutoSaveMessage("Saved just now");
      } catch (e) {
        setAutoSaveMessage("Autosave failed");
      } finally {
        setIsAutoSaving(false);
      }
    };
    save();
  }, [debouncedFormData, blogId, lastSavedSnapshot]);

  // --- Main Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus([]);
    setError("");

    // Frontend validation
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
      setIsLoading(false);
      return;
    }

    const dataToUpdate = {
      id: blogId,
      title: formData.title,
      imageUrl: formData.imageUrl,
      content: formData.content || "", // Use content directly
      description: formData.excerpt || formData.description || "",
      excerpt: formData.excerpt, // Also send excerpt for backend compatibility
      category: formData.category,
      tags: formData.tags.filter((tag) => tag),
      isPublished: formData.isPublished, // Include publish status
    };

    try {
      const res = await fetch(`/api/blog/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitStatus([true, "Blog post updated successfully!"]);
        router.push("/blog");
      } else {
        const apiErrorMsg = result.message || "Failed to update blog post";
        setError(apiErrorMsg);
        setSubmitStatus([false, apiErrorMsg]);
      }
    } catch (err) {
      const networkErrorMsg = "Network error occurred while saving.";
      setError(networkErrorMsg);
      setSubmitStatus([false, networkErrorMsg]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Preview Modal ---
  const BlogPreview = () => (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80 flex items-start justify-center p-4">
      <div className="bg-gray-100 rounded-lg w-full max-w-4xl my-8 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Blog Preview</h2>
          <button
            onClick={togglePreview} // Use the defined toggle function
            className="text-gray-400 hover:text-white"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[80vh]">
          {formData.imageUrl && (
            <div className="mb-6">
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-6">
            {formData.title}
          </h1>
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1">
            <TipTapRenderer content={formData.content} />
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render ---
  return (
    <>
      <Head>
        <title>Edit Blog Post</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brandSecondary/10 text-foreground">
        <PageContainer className="mt-20">
          {!isLoading && blogId && (
            <h1
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              className="text-6xl font-black text-foreground  text-center mb-8 pt-8"
            >
              Edit Blog Post
            </h1>
          )}

          {isLoading && (
            <div className="text-center py-10">Loading post...</div>
          )}

          {!isLoading && !blogId && (
            <div className="text-center py-10 text-red-500">
              Invalid Post ID.
            </div>
          )}

          {!isLoading && blogId && (
            <form
              onSubmit={handleSubmit}
              className="bg-card border-2 border-blue-200 rounded-3xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto"
            >
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

              {/* --- Blog Content Section with Format Button --- */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <Label
                    htmlFor="blog-content-editor"
                    className="block text-foreground text-lg font-semibold mb-2 sm:mb-0"
                  >
                    Blog Content
                  </Label>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="secondary" className="px-2 py-1 rounded-md">
                      {readingTimeMinutes} min read
                    </Badge>
                    <Badge
                      className="px-2 py-1 rounded-md"
                      variant={
                        seoScore >= 80
                          ? "success"
                          : seoScore >= 60
                          ? "warning"
                          : "destructive"
                      }
                    >
                      SEO {seoScore}/100
                    </Badge>
                    <Button
                      type="button"
                      onClick={handleFormatContent}
                      disabled={isFormatting || !formData.content?.trim()}
                      variant="outline"
                      size="sm"
                      className="flex items-center border-blue-300 text-blue-600 hover:bg-blue-50"
                      title="Format content using AI"
                    >
                      {isFormatting ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-1 h-4 w-4" />
                      )}
                      Format
                    </Button>
                  </div>
                </div>
                {/* Display Formatting Error */}
                {formatError && (
                  <p className="text-sm text-destructive">
                    Format Error: {formatError}
                  </p>
                )}
                <TipTapEditor
                  id="blog-content-editor" // Add ID for label
                  content={formData.content}
                  onUpdate={(html) => handleContentChange(html)}
                />
              </div>
              {/* --- End Blog Content Section --- */}

              <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-card/90 backdrop-blur-sm border-t border-blue-200 rounded-b-3xl z-10">
                <ActionButtons
                  isLoading={isLoading}
                  isSaveDisabled={
                    !formData.title ||
                    !formData.content ||
                    !formData.imageUrl ||
                    !formData.description
                  }
                  onSubmit={handleSubmit}
                  onTogglePreview={togglePreview}
                  submitStatus={submitStatus}
                  error={error}
                  saveButtonText="Save Changes"
                  isPublished={formData.isPublished}
                  onPublishChange={handlePublishChange}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {isAutoSaving ? "Saving..." : autoSaveMessage}
                </div>
              </div>
            </form>
          )}
        </PageContainer>
      </div>
      {showPreview && <BlogPreview />}
    </>
  );
}

export default Edit;
