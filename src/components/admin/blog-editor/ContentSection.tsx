// Converted to TypeScript - migrated
// src/components/admin/blog-editor/ContentSection.js
import React, { useState, useCallback,useRef } from "react";
import TipTapEditor from "@/components/TipTapEditor"; // Import TipTapEditor
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Wand2, ListChecks, Bot, Upload } from "lucide-react"; // Added Bot and Upload for Agent Mode
import { AiOutlineEye } from "react-icons/ai"; // Keep AiOutlineEye
import axios from "axios";
import { toast } from "sonner"; // For displaying success/error messages
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ContentSectionProps {
  content: string;
  setContent: (content: string) => void;
  onTogglePreview?: () => void;
  blogTitle: string;
  onOutlineTitle?: (title: string) => void;
  onTitleChange?: (title: string) => void;
}

function ContentSection({
  content,
  setContent, // Renaming 'onUpdate' from TipTapEditor prop for consistency here
  onTogglePreview,
  blogTitle, // Keep blogTitle for Generate Content
  onOutlineTitle = () => {},
  onTitleChange = () => {}, // New prop for Agent Mode to update title
}: ContentSectionProps) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [contentGenError, setContentGenError] = useState("");
  const [isFormatting, setIsFormatting] = useState(false); // State for formatting loader
  const [formatError, setFormatError] = useState(""); // State for formatting error
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [outlineData, setOutlineData] = useState<{ headings?: string[]; title?: string } | null>(null);
  const [outlineError, setOutlineError] = useState("");

  // Agent Mode state
  const [isAgentModeOpen, setIsAgentModeOpen] = useState(false);
  const [agentContext, setAgentContext] = useState("");
  const [agentFile, setAgentFile] = useState<File | null>(null);
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [agentError, setAgentError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err: unknown) {
      console.error("[ContentSection] Error generating content:", err);
      let message = "Error generating content.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setContentGenError(message);
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
    } catch (err: unknown) {
      console.error("[ContentSection] Error formatting content:", err);
      let errorMsg = "Error formatting content.";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setFormatError(errorMsg);
      toast.error(`Formatting failed: ${errorMsg}`);
    } finally {
      setIsFormatting(false);
    }
  }, [content, setContent]); // Dependencies: content and setContent

  const handleOutlineOpenChange = useCallback((open: boolean) => {
    setIsOutlineOpen(open);
    if (!open) {
      setOutlineError("");
    }
  }, []);

  const handleGenerateOutline = useCallback(async () => {
    if (!blogTitle?.trim()) {
      toast.error("Please enter a blog title first.");
      return;
    }

    setIsOutlineOpen(true);
    setIsGeneratingOutline(true);
    setOutlineError("");
    setOutlineData(null);

    const toastId = "outline-toast";
    toast.loading("Generating outline...", { id: toastId });

    try {
      const response = await axios.post("/api/ai/generate-outline", {
        topic: blogTitle,
      });

      if (response.data.success && response.data.data) {
        setOutlineData(response.data.data);
        toast.success("Outline generated!", { id: toastId });
      } else {
        throw new Error(response.data.message || "Failed to generate outline.");
      }
    } catch (err: unknown) {
      console.error("[ContentSection] Outline generation error:", err);
      let message = "Failed to generate outline.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setOutlineError(message);
      toast.error(`Outline generation failed: ${message}`, { id: toastId });
    } finally {
      setIsGeneratingOutline(false);
    }
  }, [blogTitle]);

  // Handler for Agent Mode blog generation
  const handleAgentGenerate = useCallback(async () => {
    if (!agentContext?.trim() && !agentFile) {
      setAgentError("Please provide context or upload a file for generating the blog.");
      toast.error("Please provide context or upload a file.");
      return;
    }

    setIsAgentGenerating(true);
    setAgentError("");

    const toastId = "agent-generate-toast";
    toast.loading("Agent is writing your blog...", { id: toastId });

    try {
      let response;

      if (agentFile) {
        const formData = new FormData();
        formData.append("context", agentContext || "");
        formData.append("file", agentFile);

        response = await axios.post("/api/ai/agent-generate-blog", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post("/api/ai/agent-generate-blog", {
          context: agentContext,
        });
      }

      if (response.data.success && response.data.data) {
        const { title, content: generatedContent } = response.data.data;

        if (title) {
          onTitleChange(title);
        }

        if (generatedContent) {
          setContent(generatedContent);
        }

        toast.success("Blog generated successfully!", { id: toastId });
        setIsAgentModeOpen(false);
        setAgentContext("");
        setAgentFile(null);
      } else {
        throw new Error(response.data.message || "Failed to generate blog.");
      }
    } catch (err: unknown) {
      console.error("[ContentSection] Agent Mode error:", err);
      let message = "Failed to generate blog.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setAgentError(message);
      toast.error(`Generation failed: ${message}`, { id: toastId });
    } finally {
      setIsAgentGenerating(false);
    }
  }, [agentContext, agentFile, onTitleChange, setContent]);

  const handleAgentModeOpenChange = useCallback((open: boolean) => {
    setIsAgentModeOpen(open);
    if (!open) {
      setAgentError("");
      setAgentFile(null);
    }
  }, []);

  const handleApplyOutline = useCallback(
    (mode: "append" | "replace") => {
      if (!outlineData) {
        return;
      }

      const headings = Array.isArray(outlineData.headings)
        ? outlineData.headings.filter(Boolean)
        : [];

      if (headings.length === 0) {
        toast.error("Outline did not include any headings.");
        return;
      }

      const draftSections = headings
        .map((heading) => `<h2>${heading}</h2>\n<p></p>`)
        .join("\n\n");

      const existing =
        typeof content === "string" ? content.trimEnd() : "";

      const nextContent =
        mode === "append" && existing
          ? `${existing}\n\n${draftSections}`
          : draftSections;

      setContent(nextContent);

      if (outlineData.title && (!blogTitle || !blogTitle.trim())) {
        onOutlineTitle(outlineData.title);
      }

      toast.success(
        mode === "append"
          ? "Outline appended to editor."
          : "Editor content replaced with outline skeleton."
      );

      setIsOutlineOpen(false);
    },
    [outlineData, content, setContent, blogTitle, onOutlineTitle]
  );

  const handleUseOutlineTitle = useCallback(() => {
    if (outlineData?.title) {
      onOutlineTitle(outlineData.title);
      toast.success("Title updated from outline.");
    }
  }, [outlineData, onOutlineTitle]);

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
          {/* --- Agent Mode Button --- */}
          <Button
            type="button"
            onClick={() => setIsAgentModeOpen(true)}
            disabled={isAgentGenerating}
            variant="outline"
            size="sm"
            className="flex items-center border-violet-500/30 text-violet-600 hover:bg-violet-500/10"
            title="Generate full blog from context (AI Agent)"
          >
            {isAgentGenerating ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-1 h-4 w-4" />
            )}
            Agent Mode
          </Button>
          {/* --- Outline Button --- */}
          <Button
            type="button"
            onClick={handleGenerateOutline}
            disabled={isGeneratingOutline || !blogTitle?.trim()}
            variant="outline"
            size="sm"
            className="flex items-center border-primary/20 text-primary hover:bg-primary/5"
            title="Generate a structured outline from the title (AI)"
          >
            {isGeneratingOutline ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <ListChecks className="mr-1 h-4 w-4" />
            )}
            Outline
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
      <Dialog open={isOutlineOpen} onOpenChange={handleOutlineOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Generated Outline</DialogTitle>
            <DialogDescription>
              Use the suggested structure to map out your article before
              writing.
            </DialogDescription>
          </DialogHeader>
          {isGeneratingOutline && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {outlineError && (
            <p className="text-sm text-destructive">{outlineError}</p>
          )}
          {outlineData && (
            <div className="space-y-4">
              {outlineData.title && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Suggested title
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {outlineData.title}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Headings
                </p>
                <div className="space-y-2">
                  {outlineData.headings?.map((heading, index) => (
                    <div
                      key={`${heading}-${index}`}
                      className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
                    >
                      {index + 1}. {heading}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!isGeneratingOutline && !outlineData && !outlineError && (
            <p className="text-sm text-muted-foreground">
              Outline suggestions will appear here when generated.
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOutlineOpenChange(false)}
            >
              Close
            </Button>
            {outlineData?.title && (
              <Button
                type="button"
                variant="outline"
                onClick={handleUseOutlineTitle}
              >
                Use Title
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={!outlineData}
              onClick={() => handleApplyOutline("append")}
            >
              Append To Editor
            </Button>
            <Button
              type="button"
              disabled={!outlineData}
              onClick={() => handleApplyOutline("replace")}
            >
              Replace Editor Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Mode Dialog */}
      <Dialog open={isAgentModeOpen} onOpenChange={handleAgentModeOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-500" />
              Agent Mode
            </DialogTitle>
            <DialogDescription>
              Describe what you want to write about or upload a file, and the AI agent will generate
              a complete blog post with title and content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-context">Context / Instructions</Label>
              <Textarea
                placeholder="E.g., Write a blog about React Server Components, explaining what they are, their benefits over client components, and how to migrate existing components. Include code examples and best practices."
                value={agentContext}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setAgentContext(e.target.value);
                }}
                className="min-h-[150px] resize-y"
                disabled={isAgentGenerating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-file">Upload Reference File (Optional)</Label>
              <div className="flex items-center gap-4">
                 <input
                  ref={fileInputRef}
                  id="agent-file"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const files = input.files;
                    if (files && files[0]) {
                      const file = files[0];
                      const maxSize = 10 * 1024 * 1024; // 10MB
                      if (file.size > maxSize) {
                        toast.error("File size must be less than 10MB");
                        input.value = "";
                        setAgentFile(null);
                        return;
                      }
                      setAgentFile(file);
                    } else {
                      setAgentFile(null);
                    }
                  }}
                  disabled={isAgentGenerating}
                />
              </div>
              {agentFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Selected: {agentFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAgentFile(null);
                      const input = document.getElementById('agent-file') as HTMLInputElement | null;
                      if (input) input.value = "";
                    }}
                    disabled={isAgentGenerating}
                    className="h-6 px-2 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX, TXT (max 10MB)
              </p>
            </div>
            {agentError && (
              <p className="text-sm text-destructive">{agentError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleAgentModeOpenChange(false)}
              disabled={isAgentGenerating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAgentGenerate}
              disabled={isAgentGenerating || (!agentContext?.trim() && !agentFile)}
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
    </div>
  );
}

export default ContentSection;

