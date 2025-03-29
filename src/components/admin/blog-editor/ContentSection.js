// src/components/admin/blog-editor/ContentSection.js
import React, { useState, useCallback } from "react";
import Markdown from "@/components/Markdown"; // Adjust path if necessary
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AudioWaveform, Sparkles } from "lucide-react"; // Added Sparkles
import { AiOutlineFormatPainter, AiOutlineEye } from "react-icons/ai";
import axios from "axios";

function ContentSection({
  content,
  setContent,
  onFormatContent,
  isFormatting,
  onTogglePreview,
  onGenerateAudio,
  isGeneratingAudio,
  audioError,
  audioUrl,
  blogTitle, // Added blogTitle prop to pass to API
}) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false); // State for content generation
  const [contentGenError, setContentGenError] = useState(""); // Error state for content generation

  // Handler for generating content draft
  const handleGenerateContent = useCallback(async () => {
    if (!blogTitle?.trim()) {
      setContentGenError("Please enter a blog title first.");
      return;
    }
    setIsGeneratingContent(true);
    setContentGenError("");
    try {
      console.log(
        `[ContentSection] Requesting content generation for title: "${blogTitle}"`
      );
      const response = await axios.post("/api/ai/generate-blog", {
        topic: blogTitle, // Send title as topic
        // No outline, keywords, etc. needed for draft
      });

      if (response.data.success && response.data.data?.content) {
        console.log("[ContentSection] Content generated successfully.");
        setContent(response.data.data.content); // Update parent state
      } else {
        console.error(
          "[ContentSection] Content generation API call failed:",
          response.data
        );
        throw new Error(
          response.data.message || "Failed to generate content draft."
        );
      }
    } catch (err) {
      console.error("[ContentSection] Error generating content:", err);
      setContentGenError(
        err.response?.data?.message ||
          err.message ||
          "Error generating content."
      );
    } finally {
      setIsGeneratingContent(false);
    }
  }, [blogTitle, setContent]); // Dependencies

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <Label className="block text-white">Content</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onFormatContent}
            disabled={isFormatting || !content?.trim()}
            variant="secondary"
            size="sm"
            className="flex items-center"
          >
            {isFormatting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <AiOutlineFormatPainter className="mr-1 h-4 w-4" />
            )}
            Format
          </Button>
          <Button
            onClick={onTogglePreview}
            disabled={!content?.trim()}
            variant="secondary"
            size="sm"
            className="flex items-center"
          >
            <AiOutlineEye className="mr-1 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={onGenerateAudio}
            disabled={isGeneratingAudio || !content?.trim()}
            variant="secondary"
            size="sm"
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-600"
          >
            {isGeneratingAudio ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <AudioWaveform className="mr-1 h-4 w-4" />
            )}
            {isGeneratingAudio ? "Generating..." : "Audio Summary"}
          </Button>
          {/* Generate Content Button */}
          <Button
            onClick={handleGenerateContent}
            disabled={isGeneratingContent || !blogTitle?.trim()}
            variant="secondary"
            size="sm"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
            title="Generate draft content based on title (AI)"
          >
            {isGeneratingContent ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1 h-4 w-4" />
            )}
            {isGeneratingContent ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </div>
      {/* Display Content Generation Error */}
      {contentGenError && (
        <p className="text-sm text-red-500 mt-1">{contentGenError}</p>
      )}
      {/* Display Audio Error */}
      {audioError && <p className="text-sm text-red-500 mt-1">{audioError}</p>}
      {/* Display Existing Audio URL */}
      {audioUrl && !isGeneratingAudio && (
        <div className="mt-2 text-sm text-gray-400">
          Current Audio:{" "}
          <a
            href={audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            {audioUrl}
          </a>
        </div>
      )}
      <div className="bg-gray-700 rounded-lg p-1 border border-gray-600 min-h-[300px]">
        <Markdown
          key={content} // Re-render if content changes externally
          content={content || ""}
          setContent={setContent}
          required // Keep required for form validation consistency
        />
      </div>
    </div>
  );
}

export default ContentSection;
