import { useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Import Switch

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";
import ContentSection from "@/components/admin/blog-editor/ContentSection";
import ActionButtons from "@/components/admin/blog-editor/ActionButtons";

// Keep ReactMarkdown and AiOutlineClose for the preview modal if still needed
import ReactMarkdown from "react-markdown";
import { AiOutlineClose } from "react-icons/ai";

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
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

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

  const toggleJsonInput = () => {
    setShowJsonInput((prevState) => !prevState);
    if (!showJsonInput) {
      // Initialize JSON editor content when opening
      setJsonInput(
        JSON.stringify(
          {
            title: formData.title,
            imageUrl: formData.imageUrl,
            content: formData.content,
            description: formData.excerpt, // Map state correctly
            category: formData.category,
            tags: formData.tags,
            isPublished: formData.isPublished,
          },
          null,
          2
        )
      );
    }
  };

  // --- JSON Editor Logic ---
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleApplyJsonChanges = () => {
    try {
      const json = JSON.parse(jsonInput);
      setFormData({
        title: json.title || "",
        imageUrl: json.imageUrl || "",
        content: json.content || "",
        excerpt: json.description || json.excerpt || "", // Map state correctly
        category: json.category || "",
        tags: Array.isArray(json.tags) ? json.tags : [],
        isPublished: json.isPublished || false,
      });
      setShowJsonInput(false);
      setError("");
      setSubmitStatus([]);
    } catch (err) {
      console.error("Invalid JSON input", err);
      setError("Invalid JSON format. Please check your input.");
      setSubmitStatus([false, "Invalid JSON format."]);
    }
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
      }
    } catch (err) {
      console.error("Blog creation error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error creating blog post";
      setError(errorMsg);
      setSubmitStatus([false, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Preview Modal --- (Copied from Edit page for consistency)
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
            <ReactMarkdown>{formData.content}</ReactMarkdown>
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
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <PageContainer>
          <h1 className="text-4xl font-bold text-white font-calendas text-center mb-8 pt-8">
            Create New Blog Post
          </h1>
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
              isPublished={formData.isPublished} // Pass isPublished state
              onPublishChange={(checked) =>
                handleFormChange({ isPublished: checked })
              } // Pass handler
            />

            <ContentSection
              content={formData.content}
              setContent={handleContentChange}
              onFormatContent={async () => {
                /* Formatting might not be needed on create? */
              }}
              isFormatting={false}
              onTogglePreview={togglePreview} // Pass toggle function
              onGenerateAudio={() => {}} // No-op for create page
              isGeneratingAudio={false}
              audioError={""}
              audioUrl={""}
              blogTitle={formData.title} // Pass the current title
            />

            <ActionButtons
              isLoading={isLoading}
              isSaveDisabled={
                !formData.title ||
                !formData.content ||
                !formData.imageUrl ||
                !formData.excerpt
              }
              onSubmit={handleSubmit} // Pass submit handler
              onToggleJsonEditor={toggleJsonInput}
              showJsonEditor={showJsonInput}
              submitStatus={submitStatus}
              error={error}
              saveButtonText="Create Post" // Customize button text
            />

            {/* JSON Editor (Conditional Rendering) */}
            {showJsonInput && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <Label htmlFor="jsonInput" className="block text-white">
                  Edit JSON
                </Label>
                <Textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={handleJsonInputChange}
                  className="block w-full h-48 px-4 py-2 text-gray-300 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none font-mono text-sm"
                  placeholder='{"title": "...", "imageUrl": "...", ...}'
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={handleApplyJsonChanges}
                >
                  Apply JSON Changes
                </Button>
              </div>
            )}
          </form>
        </PageContainer>
      </div>
      {showPreview && <BlogPreview />}
    </>
  );
}

export default CreateBlogNotionStyle;
