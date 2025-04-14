import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer"; // Ensure single import
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

function Edit() {
  const router = useRouter();
  const { id: blogId } = router.query;

  // Consolidate state for form data
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    content: "",
    description: "",
    category: "",
    tags: [],
    isPublished: false, // State for publish status
  });

  // State for UI and processes
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState([]);
  const [error, setError] = useState("");

  // State for specific features
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatError, setFormatError] = useState(""); // Add format error state
  // Audio summary feature removed

  // State for modals/toggles
  const [showPreview, setShowPreview] = useState(false);

  // --- Define toggle functions ---
  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  // --- Data Fetching ---
  useEffect(() => {
    const getData = async () => {
      if (blogId) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/blog?id=${blogId}`);
          const d = await res.json();
          if (d?.success && d.data) {
            setFormData({
              title: d.data.title || "",
              imageUrl: d.data.imageUrl || "",
              content: d.data.content || "",
              description: d.data.description || "",
              excerpt: d.data.description || "", // Map backend description to excerpt for the UI
              category: d.data.category || "",
              tags: Array.isArray(d.data.tags) ? d.data.tags : [],
              isPublished: d.data.isPublished || false, // Fetch isPublished status
            });
          } else {
            setError("Failed to load blog post data.");
            setSubmitStatus([
              false,
              d?.message || "Failed to load blog post data.",
            ]);
          }
        } catch (err) {
          console.error("Error fetching blog post:", err);
          setError("Error loading blog post.");
          setSubmitStatus([false, "Error loading blog post."]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (router.isReady) {
      getData();
    }
  }, [router.isReady, blogId]);

  // --- State Update Handlers ---
  const handleFormChange = (updatedData) => {
    setFormData((prev) => {
      // If description or excerpt is updated, keep them in sync
      let next = { ...prev, ...updatedData };
      if ("excerpt" in updatedData) {
        next.description = updatedData.excerpt;
      }
      if ("description" in updatedData) {
        next.excerpt = updatedData.description;
      }
      return next;
    });
    setSubmitStatus([]);
    setError("");
  };

  // Specific handler for the isPublished switch (passed to MetadataSection)
  const handlePublishChange = (checked) => {
    handleFormChange({ isPublished: checked });
  };

  const handleImageUrlChange = (url) => {
    handleFormChange({ imageUrl: url });
  };

  const handleContentChange = (newContent) => {
    handleFormChange({ content: newContent });
  };

  // --- Format Content Handler ---
  const handleFormatContent = useCallback(async () => {
    if (!formData.content?.trim()) {
      toast.error("Content is empty, nothing to format.");
      return;
    }
    setIsFormatting(true);
    setFormatError("");
    setError(""); // Clear general errors too
    setSubmitStatus([]);
    try {
      console.log("[EditPage] Formatting content:", formData.content); // Log the content
      console.log("[EditPage] Type of content:", typeof formData.content); // Log the type

      console.log("[EditPage] Requesting content formatting...");
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
      console.error("[EditPage] Error formatting content:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error formatting content.";
      setFormatError(errorMsg);
      setError(`Formatting Error: ${errorMsg}`); // Also set general error for display
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  }, [formData.content, handleContentChange]); // Dependencies: content and handler

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
    if (!formData.description) missingFields.push("Description");

    if (missingFields.length > 0) {
      const errorMsg = `Missing required field(s): ${missingFields.join(", ")}`;
      setError(errorMsg);
      setSubmitStatus([false, errorMsg]);
      setIsLoading(false);
      return;
    }

    // Strip leading/trailing triple backticks and language specifiers from markdown content
    let cleanedContent = formData.content || "";
    cleanedContent = cleanedContent.trim();
    if (cleanedContent.startsWith("```markdown")) {
      cleanedContent = cleanedContent.slice(10);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const dataToUpdate = {
      id: blogId,
      title: formData.title,
      imageUrl: formData.imageUrl,
      content: cleanedContent,
      description: formData.description,
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
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl my-8 overflow-hidden shadow-2xl">
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
      <div className="min-h-screen bg-black text-white">
        <PageContainer className="mt-10">
          {!isLoading && blogId && (
            <h1 className="text-4xl font-bold text-white font-calendas text-center mb-8 pt-8">
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
              className="bg-gray-800 rounded-lg p-6 shadow-lg space-y-6 max-w-4xl mx-auto"
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
              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <Label
                    htmlFor="blog-content-editor"
                    className="block text-gray-300 text-lg font-semibold mb-2 sm:mb-0"
                  >
                    Blog Content
                  </Label>
                  <Button
                    type="button" // Prevent form submission
                    onClick={handleFormatContent}
                    disabled={isFormatting || !formData.content?.trim()}
                    variant="secondary"
                    size="sm"
                    className="flex items-center"
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
                {/* Display Formatting Error */}
                {formatError && (
                  <p className="text-sm text-red-500">
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
            </form>
          )}
        </PageContainer>
      </div>
      {showPreview && <BlogPreview />}
    </>
  );
}

export default Edit;
