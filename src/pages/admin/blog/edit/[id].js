import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer"; // Ensure single import
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Switch import is removed as it's handled in MetadataSection

// Import the refactored components
import BannerImageSection from "@/components/admin/blog-editor/BannerImageSection";
import MetadataSection from "@/components/admin/blog-editor/MetadataSection";
import ContentSection from "@/components/admin/blog-editor/ContentSection";
import ActionButtons from "@/components/admin/blog-editor/ActionButtons";

// Keep ReactMarkdown and AiOutlineClose for the preview modal if still needed
import ReactMarkdown from "react-markdown";
import { AiOutlineClose } from "react-icons/ai";

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
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // State for modals/toggles
  const [showPreview, setShowPreview] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  // --- Define toggle functions ---
  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  const toggleJsonInput = () => {
    setShowJsonInput((prevState) => !prevState);
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
              category: d.data.category || "",
              tags: Array.isArray(d.data.tags) ? d.data.tags : [],
              isPublished: d.data.isPublished || false, // Fetch isPublished status
            });
            setAudioUrl(d.data.audioSummaryUrl || "");
            setJsonInput(
              JSON.stringify(
                {
                  title: d.data.title || "",
                  imageUrl: d.data.imageUrl || "",
                  content: d.data.content || "",
                  description: d.data.description || "",
                  category: d.data.category || "",
                  tags: Array.isArray(d.data.tags) ? d.data.tags : [],
                  isPublished: d.data.isPublished || false,
                  audioSummaryUrl: d.data.audioSummaryUrl || "",
                },
                null,
                2
              )
            );
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
    setFormData((prev) => ({ ...prev, ...updatedData }));
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

  // --- Feature Handlers ---
  const handleFormatContent = async () => {
    if (!formData.content?.trim()) {
      setSubmitStatus([false, "Content is required for formatting"]);
      return;
    }
    setIsFormatting(true);
    setSubmitStatus([]);
    setError("");
    try {
      const response = await fetch("/api/ai/format-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.content }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to format content");
      handleContentChange(result.data); // Use handler
      setSubmitStatus([true, "Content formatted successfully!"]);
      setTimeout(() => setSubmitStatus([]), 3000);
    } catch (err) {
      console.error("Error formatting content:", err);
      setError(err.message || "Failed to format content");
      setSubmitStatus([false, err.message || "Failed to format content"]);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioError("");
    setSubmitStatus([]);
    setError("");

    if (!blogId) {
      setAudioError("Blog post ID is missing.");
      setIsGeneratingAudio(false);
      return;
    }
    if (!formData.content?.trim()) {
      setAudioError("Blog content is needed to generate a summary.");
      setIsGeneratingAudio(false);
      return;
    }

    try {
      console.log("Fetching summary for audio generation...");
      const summaryRes = await axios.post("/api/ai/blog-summarize", {
        content: formData.content,
      });
      if (!summaryRes.data || !summaryRes.data.summary)
        throw new Error("Failed to generate text summary.");
      const textSummary = summaryRes.data.summary;
      console.log("Summary fetched:", textSummary.substring(0, 100) + "...");

      console.log("Generating audio from summary...");
      const ttsRes = await axios.post("/api/ai/text-to-speech", {
        text: textSummary,
        blogId,
      });
      if (!ttsRes.data || !ttsRes.data.success || !ttsRes.data.audioUrl)
        throw new Error(
          ttsRes.data.message || "Failed to generate audio file."
        );
      const generatedAudioUrl = ttsRes.data.audioUrl;
      console.log("Audio generated:", generatedAudioUrl);

      console.log("Updating blog post with summary and audio URL...");
      const updateData = {
        id: blogId,
        aiSummary: textSummary,
        audioSummaryUrl: generatedAudioUrl,
        hasAudioSummary: true,
        summaryGeneratedAt: new Date(),
      };
      const updateRes = await fetch(`/api/blog/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const updateResult = await updateRes.json();
      if (!updateResult.success) {
        const errorDetail =
          updateResult.message ||
          (updateResult.error
            ? JSON.stringify(updateResult.error)
            : "Unknown error updating blog post.");
        throw new Error(
          `Failed to update blog post with audio details: ${errorDetail}`
        );
      }

      setAudioUrl(generatedAudioUrl); // Update local state
      setSubmitStatus([
        true,
        "Audio summary generated and saved successfully!",
      ]);
    } catch (err) {
      console.error("Error generating audio summary:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate audio summary.";
      setAudioError(errorMsg);
      setSubmitStatus([false, errorMsg]);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

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

    const dataToUpdate = {
      id: blogId,
      title: formData.title,
      imageUrl: formData.imageUrl,
      content: formData.content,
      description: formData.description,
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
        description: json.description || "",
        category: json.category || "",
        tags: Array.isArray(json.tags) ? json.tags : [],
        isPublished: json.isPublished || false, // Apply isPublished from JSON
      });
      setAudioUrl(json.audioSummaryUrl || ""); // Update audio URL from JSON too
      setShowJsonInput(false); // Close editor on successful apply
      setError(""); // Clear errors
      setSubmitStatus([]);
    } catch (err) {
      console.error("Invalid JSON input", err);
      setError("Invalid JSON format. Please check your input.");
      setSubmitStatus([false, "Invalid JSON format."]);
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
        <title>Edit Blog Post</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <PageContainer>
          <h1 className="text-4xl font-bold text-white font-calendas text-center mb-8 pt-8">
            Edit Blog Post
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg p-6 shadow-lg space-y-6"
          >
            <BannerImageSection
              imageUrl={formData.imageUrl}
              onImageUrlChange={handleImageUrlChange}
            />

            <MetadataSection
              formData={formData}
              onFormChange={handleFormChange}
              isPublished={formData.isPublished} // Pass isPublished state
              onPublishChange={handlePublishChange} // Pass specific handler for switch
            />

            {/* The duplicate Publish Switch block is confirmed removed. */}

            <ContentSection
              content={formData.content}
              setContent={handleContentChange}
              onFormatContent={handleFormatContent}
              isFormatting={isFormatting}
              onTogglePreview={togglePreview} // Pass the toggle function
              onGenerateAudio={handleGenerateAudio}
              isGeneratingAudio={isGeneratingAudio}
              audioError={audioError}
              audioUrl={audioUrl}
              blogTitle={formData.title} // Pass title for content generation button
            />

            <ActionButtons
              isLoading={isLoading}
              isSaveDisabled={
                !formData.title ||
                !formData.content ||
                !formData.imageUrl ||
                !formData.description
              }
              onSubmit={handleSubmit}
              onToggleJsonEditor={toggleJsonInput}
              showJsonEditor={showJsonInput}
              submitStatus={submitStatus}
              error={error}
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

export default Edit;
