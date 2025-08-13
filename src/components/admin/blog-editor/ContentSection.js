// src/components/admin/blog-editor/ContentSection.js
import React, { useState, useCallback } from "react";
import TipTapEditor from "@/components/TipTapEditor"; // Import TipTapEditor
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Wand2 } from "lucide-react"; // Added Wand2 for Format
import { AiOutlineFormatPainter, AiOutlineEye } from "react-icons/ai"; // Keep AiOutlineEye
import axios from "axios";
import { toast } from "sonner"; // For displaying success/error messages

function ContentSection({
  content,
  setContent, // Renaming 'onUpdate' from TipTapEditor prop for consistency here
  onTogglePreview,
  blogTitle, // Keep blogTitle for Generate Content
}) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [contentGenError, setContentGenError] = useState("");
  const [isFormatting, setIsFormatting] = useState(false); // State for formatting loader
  const [formatError, setFormatError] = useState(""); // State for formatting error

  // Handler for generating content draft
  const handleGenerateContent = useCallback(async () => {
    if (!blogTitle?.trim()) {
      setContentGenError("Please enter a blog title first.");
      toast.error("Please enter a blog title first.");
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
        toast.success("Content generated successfully!");
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
      toast.error("Error generating content. Please try again.");
    } finally {
      setIsGeneratingContent(false);
    }
  }, [blogTitle, setContent]); // Dependencies

  // --- New Handler for Formatting Content ---
  const handleFormatContent = useCallback(async () => {
    if (!content?.trim()) {
      toast.error("Content is empty, nothing to format.");
      return;
    }
    setIsFormatting(true);
    setFormatError("");
    try {
      console.log("[ContentSection] Requesting content formatting...");
      const response = await axios.post("/api/ai/format-content", {
        content: content, // Send the current HTML content
      });

      if (response.data.success && response.data.data) {
        console.log("[ContentSection] Content formatted successfully.");
        setContent(response.data.data); // Update parent state with formatted HTML
        toast.success("Content formatted successfully!");
      } else {
        console.error(
          "[ContentSection] Content formatting API call failed:",
          response.data
        );
        throw new Error(response.data.message || "Failed to format content");
      }
    } catch (err) {
      console.error("[ContentSection] Error formatting content:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error formatting content.";
      setFormatError(errorMsg);
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  }, [content, setContent]); // Dependencies: content and setContent

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2 flex-wrap">
        {" "}
        {/* Added flex-wrap */}
        <Label
          htmlFor="blog-content-editor"
          className="block text-foreground mb-2 sm:mb-0 font-medium"
        >
          Content
        </Label>{" "}
        {/* Added htmlFor */}
        <div className="flex flex-wrap gap-2">
          {/* --- Format Button --- */}
          <Button
            type="button" // Prevent form submission
            onClick={handleFormatContent}
            disabled={isFormatting || !content?.trim()}
            variant="outline"
            size="sm"
            className="flex items-center border-primary/20 text-primary hover:bg-primary/5"
            title="Format content using AI"
          >
            {isFormatting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-1 h-4 w-4" /> // Using Wand2 icon
            )}
            Format
          </Button>
          {/* --- Preview Button --- */}
          <Button
            type="button" // Prevent form submission
            onClick={onTogglePreview}
            disabled={!content?.trim()}
            variant="outline"
            size="sm"
            className="flex items-center border-primary/20 text-primary hover:bg-primary/5"
          >
            <AiOutlineEye className="mr-1 h-4 w-4" />
            Preview
          </Button>
          {/* --- Generate Content Button --- */}
          <Button
            type="button" // Prevent form submission
            onClick={handleGenerateContent}
            disabled={isGeneratingContent || !blogTitle?.trim()}
            variant="default"
            size="sm"
            className="flex items-center bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground"
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
        <p className="text-sm text-destructive mt-1">{contentGenError}</p>
      )}
      {/* Display Formatting Error */}
      {formatError && (
        <p className="text-sm text-destructive mt-1">Format Error: {formatError}</p>
      )}
      <TipTapEditor
        content={content || ""}
        onUpdate={setContent} // Pass the setContent prop directly
        // Add an ID for the label's htmlFor
        id="blog-content-editor"
      />
    </div>
  );
}

export default ContentSection;
