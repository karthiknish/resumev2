import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, ArrowLeft, Eye, Save, LayoutPanelLeft } from "lucide-react";
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

function CreateBlog() {
  const router = useRouter();

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

    const dataToSubmit = {
      title: formData.title,
      imageUrl: formData.imageUrl,
      content: formData.content || "",
      description: formData.excerpt || formData.description || "",
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.filter((tag) => tag),
      isPublished: formData.isPublished,
    };

    try {
      const res = await fetch(`/api/blog/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitStatus([true, "Blog post created successfully!"]);
        toast.success("Blog post created successfully!");
        // Redirect to edit page of the new post
        const newId = result.data._id || result.data.slug;
        router.push(`/admin/blog/edit/${newId}`);
      } else {
        const apiErrorMsg = result.message || "Failed to create blog post";
        setError(apiErrorMsg);
        setSubmitStatus([false, apiErrorMsg]);
        toast.error(apiErrorMsg);
      }
    } catch (err) {
      const networkErrorMsg = "Network error occurred while saving.";
      setError(networkErrorMsg);
      setSubmitStatus([false, networkErrorMsg]);
      toast.error(networkErrorMsg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const BlogPreview = () => (
    <div className="fixed inset-0 z-[150] flex items-start justify-center overflow-auto bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl my-8 overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h2 className="text-lg font-heading font-semibold text-slate-900">
            Preview
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreview}
            className="text-slate-500 hover:text-slate-900"
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
        <div className="max-h-[80vh] overflow-auto px-8 py-8">
          {formData.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-xl shadow-sm">
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <h1 className="mb-6 text-4xl font-heading font-bold text-slate-900">
            {formData.title}
          </h1>
          <div className="prose prose-lg max-w-none text-slate-700 prose-headings:font-heading prose-headings:text-slate-900 prose-a:text-blue-600">
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
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <PageContainer className="pt-32 pb-20 px-6 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-heading font-bold text-slate-900">
                    Create New Post
                  </h1>
                  <p className="text-sm text-slate-500">
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
                  Create Post
                </Button>
              </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              {/* Title & Badges */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Post Title"
                  className="w-full border-none bg-transparent text-4xl font-heading font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-0"
                />

                <div className="flex items-center gap-2 text-sm text-slate-500">
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

export default CreateBlog;
