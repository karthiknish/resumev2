import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Sparkles, ExternalLink, Calendar, FolderOpen, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Suggestion {
  _id?: string;
  slug: string;
  title: string;
  description?: string;
  relevanceReason?: string;
  category?: string;
  createdAt?: string;
  tags?: string[];
  anchorText?: string;
}

interface InternalLinkSuggestionsProps {
  title: string;
  content: string;
  currentSlug: string;
  onInsertLink: (link: { url: string; text: string }) => void;
  trigger?: React.ReactNode;
  triggerClassName?: string;
}

function InternalLinkSuggestions({
  title = "",
  content = "",
  currentSlug = "",
  onInsertLink,
  trigger = null,
  triggerClassName = "",
}: InternalLinkSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");

  // Get plain text from HTML content for better context
  const getPlainText = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Handle fetching internal link suggestions
  const handleSuggestLinks = useCallback(async () => {
    const plainTextContent = getPlainText(content);
    const contentSnippet = plainTextContent.substring(0, 1000);

    if (!title && !contentSnippet) {
      setError("Please enter a title or some content first.");
      return;
    }

    setIsSuggesting(true);
    setError("");
    setSuggestions([]);

    try {
      const response = await axios.post("/api/ai/suggest-internal-links", {
        title,
        contentSnippet,
        currentSlug,
      });

      if (response.data.success && response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        if (response.data.suggestions.length === 0) {
          setError("No relevant internal links found. Try adding more content first.");
        }
      } else {
        setError(response.data.message || "Could not fetch link suggestions.");
      }
    } catch (err: unknown) {
      console.error("Internal link suggestion error:", err);
      let message = "Failed to get suggestions.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSuggesting(false);
    }
  }, [title, content, currentSlug]);

  // Open dialog and fetch suggestions
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setError("");
    // Auto-fetch on open if we have content
    if (title || content) {
      handleSuggestLinks();
    }
  }, [title, content, handleSuggestLinks]);

  // Handle inserting a link into the editor
  const handleInsertLink = useCallback((suggestion: Suggestion) => {
    const linkUrl = `/blog/${suggestion.slug}`;
    const linkText = suggestion.anchorText || suggestion.title;

    if (onInsertLink) {
      onInsertLink({ url: linkUrl, text: linkText });
      toast.success(`Link inserted: "${linkText}"`);
    } else {
      // Fallback: copy the link to clipboard
      navigator.clipboard.writeText(linkUrl);
      toast.success(`Link copied to clipboard: "${linkText}"`);
    }

    setIsOpen(false);
  }, [onInsertLink]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Default trigger button
  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleOpen}
      disabled={isSuggesting}
      className={cn(
        "text-blue-600 hover:text-blue-700 disabled:text-muted-foreground px-2 py-1 text-xs h-6",
        triggerClassName
      )}
      title="Suggest internal links to other posts"
    >
      {isSuggesting ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <Link2 className="h-3 w-3 mr-1" />
      )}
      Internal Links
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setError("");
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-blue-500" />
              Internal Link Suggestions
            </DialogTitle>
            <DialogDescription>
              AI-powered suggestions to link to related posts on your blog.
              This helps with SEO and keeps readers engaged.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto py-4">
            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Loading state */}
            {isSuggesting && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Analyzing content to find relevant links...
                </p>
              </div>
            )}

            {/* Suggestions list */}
            {!isSuggesting && suggestions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {suggestions.length} {suggestions.length === 1 ? "suggestion" : "suggestions"} found
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSuggestLinks}
                    className="h-7 px-2 text-xs text-primary hover:text-primary"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>

                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id || suggestion.slug}
                    className="group rounded-lg border border-border bg-card p-4 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-grow min-w-0">
                        {/* Title with link badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm truncate">
                            {suggestion.title}
                          </h4>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            <Link2 className="h-2.5 w-2.5 mr-1" />
                            {suggestion.relevanceReason}
                          </Badge>
                        </div>

                        {/* Description snippet */}
                        {suggestion.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {suggestion.description}
                          </p>
                        )}

                        {/* Meta info */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {suggestion.category && (
                            <span className="flex items-center gap-1">
                              <FolderOpen className="h-3 w-3" />
                              {suggestion.category}
                            </span>
                          )}
                          {suggestion.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(suggestion.createdAt)}
                            </span>
                          )}
                          {suggestion.tags && suggestion.tags.length > 0 ? (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {suggestion.tags.slice(0, 2).join(", ")}
                              {suggestion.tags.length > 2 ? " + more" : null}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Insert button */}
                      <Button
                        size="sm"
                        onClick={() => handleInsertLink(suggestion)}
                        className="flex-shrink-0 h-8 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Link2 className="h-3.5 w-3.5 mr-1" />
                        Insert
                      </Button>
                    </div>

                    {/* Preview URL */}
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <a
                        href={`/blog/${suggestion.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        /blog/{suggestion.slug}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Empty state (not loading, no error, no suggestions) */}
            {!isSuggesting && !error && suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Link2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-1">
                  No content to analyze
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Add a title and some content to get AI-powered internal link suggestions.
                </p>
              </div>
            ) : null}
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSuggesting}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InternalLinkSuggestions;

