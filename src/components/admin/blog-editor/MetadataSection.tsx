// Converted to TypeScript - migrated
// src/components/admin/blog-editor/MetadataSection.js
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Calendar, Clock, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/datepicker";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

function MetadataSection({
  formData,
  onFormChange,
  isPublished,
  onPublishChange,
}) {
  // State for Description Suggestions
  const [isSuggestingDesc, setIsSuggestingDesc] = useState(false);
  const [descSuggestionError, setDescSuggestionError] = useState("");
  const [descSuggestions, setDescSuggestions] = useState([]);

  // State for Category Suggestions
  const [isSuggestingCat, setIsSuggestingCat] = useState(false);
  const [catSuggestionError, setCatSuggestionError] = useState("");
  const [catSuggestions, setCatSuggestions] = useState([]);

  // State for Keyword/Tag Suggestions
  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState(false);
  const [keywordSuggestionError, setKeywordSuggestionError] = useState("");
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);

  // Scheduled Publishing state
  const [isScheduleMode, setIsScheduleMode] = useState(false);

  // Check if the post has a scheduled publish date
  const hasScheduledDate = formData.scheduledPublishAt &&
    new Date(formData.scheduledPublishAt) > new Date();

  // Format scheduled date for display
  const formattedScheduledDate = hasScheduledDate
    ? format(new Date(formData.scheduledPublishAt), "PPP 'at' p")
    : null;

  // Handle scheduled date change
  const handleScheduledDateChange = (date) => {
    onFormChange({ ...formData, scheduledPublishAt: date ? date.toISOString() : null });
  };

  // Clear scheduled date
  const clearScheduledDate = () => {
    onFormChange({ ...formData, scheduledPublishAt: null });
    setIsScheduleMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name === "description" ? "excerpt" : name;
    onFormChange({ ...formData, [fieldName]: value });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    onFormChange({ ...formData, tags });
  };

  // --- AI Suggestion Handlers ---

  const handleSuggestDescriptions = useCallback(async () => {
    if (!formData.title && !formData.content) {
      setDescSuggestionError("Please enter a title or some content first.");
      return;
    }
    setIsSuggestingDesc(true);
    setDescSuggestionError("");
    setDescSuggestions([]);
    try {
      const response = await axios.post("/api/ai/suggest-description", {
        title: formData.title,
        content: formData.content,
      });
      if (response.data.success && response.data.suggestions) {
        setDescSuggestions(response.data.suggestions);
      } else {
        setDescSuggestionError("Could not fetch description suggestions.");
      }
    } catch (err) {
      console.error("Description suggestion error:", err);
      setDescSuggestionError(
        err.response?.data?.error || err.message || "Failed to get suggestions."
      );
    } finally {
      setIsSuggestingDesc(false);
    }
  }, [formData.title, formData.content]);

  const handleSuggestCategories = useCallback(async () => {
    if (!formData.title && !formData.content) {
      setCatSuggestionError("Please enter a title or some content first.");
      return;
    }
    setIsSuggestingCat(true);
    setCatSuggestionError("");
    setCatSuggestions([]);
    try {
      const response = await axios.post("/api/ai/suggest-categories", {
        title: formData.title,
        content: formData.content,
      });
      if (response.data.success && response.data.suggestions) {
        setCatSuggestions(response.data.suggestions);
      } else {
        setCatSuggestionError("Could not fetch category suggestions.");
      }
    } catch (err) {
      console.error("Category suggestion error:", err);
      setCatSuggestionError(
        err.response?.data?.error || err.message || "Failed to get suggestions."
      );
    } finally {
      setIsSuggestingCat(false);
    }
  }, [formData.title, formData.content]);

  // New handler for suggesting keywords/tags
  const handleSuggestKeywords = useCallback(async () => {
    if (!formData.title && !formData.content) {
      setKeywordSuggestionError("Please enter a title or some content first.");
      return;
    }
    setIsSuggestingKeywords(true);
    setKeywordSuggestionError("");
    setKeywordSuggestions([]);
    try {
      const response = await axios.post("/api/ai/suggest-keywords", {
        title: formData.title,
        contentSnippet: formData.content, // Send content snippet
      });
      if (response.data.success && response.data.suggestions) {
        setKeywordSuggestions(response.data.suggestions);
      } else {
        setKeywordSuggestionError("Could not fetch keyword suggestions.");
      }
    } catch (err) {
      console.error("Keyword suggestion error:", err);
      setKeywordSuggestionError(
        err.response?.data?.error || err.message || "Failed to get suggestions."
      );
    } finally {
      setIsSuggestingKeywords(false);
    }
  }, [formData.title, formData.content]);

  // Function to add a suggested tag if not already present
  const addSuggestedTag = (tagToAdd) => {
    const currentTags = formData.tags || [];
    if (!currentTags.includes(tagToAdd)) {
      onFormChange({ ...formData, tags: [...currentTags, tagToAdd] });
    }
  };

  return (
    <div className="space-y-6 border-y border-border py-6">
      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description / Excerpt */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-foreground">
              Description / Excerpt
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSuggestDescriptions}
              disabled={
                isSuggestingDesc || (!formData.title && !formData.content)
              }
              className="text-blue-600 hover:text-blue-700 disabled:text-muted-foreground px-2 py-1 text-xs"
              title="Suggest Descriptions (uses Title/Content)"
            >
              {isSuggestingDesc ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Suggest
            </Button>
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.excerpt || ""}
            onChange={(e) =>
              onFormChange({ ...formData, excerpt: e.target.value })
            }
            className="bg-background border-input focus:border-blue-600 focus:ring-blue-600"
            placeholder="A short summary for previews and SEO (120-155 chars recommended)..."
            rows={3}
            required
          />
          {descSuggestionError && (
            <p className="text-xs text-destructive mt-1">
              {descSuggestionError}
            </p>
          )}
          {descSuggestions.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs text-muted-foreground">
                Suggestions:
              </span>
              {descSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    onFormChange({ ...formData, excerpt: suggestion })
                  }
                  className="px-1.5 py-0.5 text-xs text-left bg-muted text-foreground rounded hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSuggestCategories}
              disabled={
                isSuggestingCat || (!formData.title && !formData.content)
              }
              className="text-blue-600 hover:text-blue-700 disabled:text-muted-foreground px-2 py-1 text-xs"
              title="Suggest Categories (uses Title/Content)"
            >
              {isSuggestingCat ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Suggest
            </Button>
          </div>
          <Input
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            type="text"
            className="bg-background border-input focus:border-blue-600 focus:ring-blue-600"
            placeholder="e.g., Tech"
          />
          {catSuggestionError && (
            <p className="text-xs text-destructive mt-1">
              {catSuggestionError}
            </p>
          )}
          {catSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {catSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    onFormChange({ ...formData, category: suggestion })
                  }
                  className="px-1.5 py-0.5 text-xs bg-muted text-foreground rounded hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="tags" className="text-foreground">
              Tags (comma-separated)
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSuggestKeywords}
              disabled={
                isSuggestingKeywords || (!formData.title && !formData.content)
              }
              className="text-blue-600 hover:text-blue-700 disabled:text-muted-foreground px-2 py-1 text-xs"
              title="Suggest Keywords/Tags (uses Title/Content)"
            >
              {isSuggestingKeywords ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Suggest
            </Button>
          </div>
          <Input
            id="tags"
            name="tags"
            value={formData.tags?.join(", ") || ""} // Join array for display
            onChange={handleTagsChange}
            type="text"
            className="bg-background border-input focus:border-blue-600 focus:ring-blue-600"
            placeholder="e.g., react, nextjs, tutorial"
          />
          {keywordSuggestionError && (
            <p className="text-xs text-destructive mt-1">
              {keywordSuggestionError}
            </p>
          )}
          {keywordSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs text-muted-foreground w-full mb-1">
                Suggestions (click to add):
              </span>
              {keywordSuggestions
                .filter(
                  (suggestion) =>
                    suggestion &&
                    typeof suggestion === "string" &&
                    !suggestion.trim().startsWith("```") &&
                    suggestion.trim() !== ""
                )
                .map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestedTag(suggestion)} // Use add function
                    className="px-1.5 py-0.5 text-xs bg-muted text-foreground rounded hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={(formData.tags || []).includes(suggestion)} // Disable if already added
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Publish Status & Scheduled Publishing */}
        <div className="rounded-lg border p-4 md:col-span-2 bg-background space-y-4">
          {/* Publish Status Toggle */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base text-foreground">Publish Status</Label>
              <p className="text-sm text-muted-foreground">
                {isPublished
                  ? "Post is live and visible to the public."
                  : hasScheduledDate
                  ? `Scheduled to publish on ${formattedScheduledDate}`
                  : "Post is currently a draft and hidden."}
              </p>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={(checked) => {
                onPublishChange(checked);
                if (checked) {
                  // Clear scheduled date if manually publishing
                  clearScheduledDate();
                }
              }}
              disabled={hasScheduledDate}
            />
          </div>

          {/* Scheduled Publishing Section */}
          {!isPublished && (
            <div className="pt-2 border-t border-border">
              {isScheduleMode || hasScheduledDate ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Schedule Publish Date
                    </Label>
                    {hasScheduledDate && !isScheduleMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearScheduledDate}
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Schedule
                      </Button>
                    )}
                  </div>

                  <DatePicker
                    value={formData.scheduledPublishAt}
                    onChange={handleScheduledDateChange}
                    placeholder="Select date and time to publish"
                    disabled={hasScheduledDate && !isScheduleMode}
                    label={hasScheduledDate && !isScheduleMode ? "" : undefined}
                    className={hasScheduledDate && !isScheduleMode ? "hidden" : ""}
                  />

                  {hasScheduledDate && (
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formattedScheduledDate}
                      </Badge>
                      {isScheduleMode && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsScheduleMode(false)}
                            className="h-7 px-2 text-xs"
                          >
                            Done
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {hasScheduledDate && !isScheduleMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsScheduleMode(true)}
                      className="h-7 px-2 text-xs text-primary hover:text-primary"
                    >
                      Change Schedule
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScheduleMode(true)}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule for later
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetadataSection;

