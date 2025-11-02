import { useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer";
import { toast } from "sonner";

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";
import ContentSection from "@/components/admin/blog-editor/ContentSection";
import ActionButtons from "@/components/admin/blog-editor/ActionButtons";

// Keep ReactMarkdown and AiOutlineClose for the preview modal if still needed
import { AiOutlineClose } from "react-icons/ai";
import TipTapRenderer from "@/components/TipTapRenderer"; // Import TipTapRenderer

function CreateBlogNotionStyle() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "", // Corresponds to description in MetadataSection
    tags: [],
    imageUrl: "",
    isPublished: false,
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState([]);

  // State for modals/toggles
  const [showPreview, setShowPreview] = useState(false); // State for preview modal

  // --- State Update Handlers ---
  const handleFormChange = (updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
    setSubmitStatus([]);
    setError("");
  };

  const handleImageUrlChange = (url) => {
    handleFormChange({ imageUrl: url });
  };

  const handleContentChange = (newContent) => {
    handleFormChange({ content: newContent });
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  // --- Main Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitStatus([]);

    // Frontend validation
    const missingFields = [];
    if (!formData.title) missingFields.push("Title");
    if (!formData.content) missingFields.push("Content");
    if (!formData.imageUrl) missingFields.push("Image URL");
    if (!formData.excerpt) missingFields.push("Excerpt/Description");

    if (missingFields.length > 0) {
      const errorMsg = `Missing required field(s): ${missingFields.join(", ")}`;
      setError(errorMsg);
      setSubmitStatus([false, errorMsg]);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/blog/create", {
        ...formData,
        description: formData.excerpt, // Map excerpt to description for API
        tags: formData.tags.filter((tag) => tag && tag.length > 0), // Ensure tags are valid strings
      });

      if (response.data.success) {
        toast.success("Blog post created successfully!");
        // Redirect to the edit page of the newly created post
        router.push(
          `/admin/blog/edit/${
            response.data.data._id || response.data.data.slug
          }`
        ); // Use ID or slug
      } else {
        const apiErrorMsg =
          response.data.message || "Failed to create blog post";
        setError(apiErrorMsg);
        setSubmitStatus([false, apiErrorMsg]);
        toast.error(apiErrorMsg);
      }
    } catch (err) {
      console.error("Blog creation error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error creating blog post";
      setError(errorMsg);
      setSubmitStatus([false, errorMsg]);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Preview Modal --- (Copied from Edit page for consistency)
  const BlogPreview = () => (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/80 p-4">
      <div className="w-full max-w-4xl my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-heading font-semibold text-slate-900">
            Blog Preview
          </h2>
          <button
            onClick={togglePreview}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto px-6 py-6">
          {formData.imageUrl && (
            <div className="mb-6">
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="h-auto w-full max-h-[400px] rounded-xl object-cover"
              />
            </div>
          )}
          <h1 className="mb-6 text-3xl font-heading font-semibold text-slate-900">
            {formData.title}
          </h1>
          <div className="prose max-w-none text-slate-700 prose-headings:font-heading prose-headings:text-slate-900 prose-a:text-slate-900">
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
        <title>Create New Blog Post</title>
      </Head>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <PageContainer className="pt-24 pb-12">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-heading font-semibold text-slate-900 sm:text-5xl">
              Create New Blog Post
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
              Write and publish your next story. Lean on the AI tools to draft, polish, and
              format content faster.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-5xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <BannerImageSection
              imageUrl={formData.imageUrl}
              onImageUrlChange={handleImageUrlChange}
            />

            <MetadataSection
              formData={formData}
              onFormChange={handleFormChange}
              isPublished={formData.isPublished}
              onPublishChange={(checked) =>
                handleFormChange({ isPublished: checked })
              }
            />

            <ContentSection
              content={formData.content}
              setContent={handleContentChange}
              onTogglePreview={togglePreview}
              blogTitle={formData.title}
              onOutlineTitle={(title) =>
                title && handleFormChange({ title: title.trim() })
              }
            />

            <ActionButtons
              isLoading={isLoading}
              isSaveDisabled={
                !formData.title ||
                !formData.content ||
                !formData.imageUrl ||
                !formData.excerpt
              }
              onSubmit={handleSubmit}
              submitStatus={submitStatus}
              error={error}
              saveButtonText="Create Post"
              isPublished={formData.isPublished}
              onPublishChange={(checked) =>
                handleFormChange({ isPublished: checked })
              }
            />
          </form>
        </PageContainer>
      </div>
      {showPreview && <BlogPreview />}
    </>
  );
}

export default CreateBlogNotionStyle;
