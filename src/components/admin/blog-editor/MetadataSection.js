// src/components/admin/blog-editor/MetadataSection.js
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Ensure Switch is imported

function MetadataSection({
  formData,
  onFormChange,
  isPublished, // Receive isPublished state
  onPublishChange, // Receive handler for switch change
}) {
  // State for Description Suggestions
  const [isSuggestingDesc, setIsSuggestingDesc] = useState(false);
  const [descSuggestionError, setDescSuggestionError] = useState("");
  const [descSuggestions, setDescSuggestions] = useState([]);

  // State for Category Suggestions
  const [isSuggestingCat, setIsSuggestingCat] = useState(false);
  const [catSuggestionError, setCatSuggestionError] = useState("");
  const [catSuggestions, setCatSuggestions] = useState([]);

  // State for Title Suggestions
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [titleSuggestionError, setTitleSuggestionError] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name === "description" ? "excerpt" : name;
    onFormChange({ ...formData, [fieldName]: value });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    onFormChange({ ...formData, tags });
  };

  // AI Suggestion Handlers (Keep existing logic)
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
  }, [formData.title, formData.content, onFormChange]);

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
  }, [formData.title, formData.content, onFormChange]);

  const handleSuggestTitles = useCallback(async () => {
    if (!formData.title && !formData.content) {
      setTitleSuggestionError("Please enter a title or some content first.");
      return;
    }
    setIsSuggestingTitle(true);
    setTitleSuggestionError("");
    setTitleSuggestions([]);
    try {
      const response = await axios.post("/api/ai/suggest-titles", {
        currentTitle: formData.title,
        contentSnippet: formData.content,
      });
      if (response.data.success && response.data.suggestions) {
        setTitleSuggestions(response.data.suggestions);
      } else {
        setTitleSuggestionError("Could not fetch title suggestions.");
      }
    } catch (err) {
      console.error("Title suggestion error:", err);
      setTitleSuggestionError(
        err.response?.data?.error ||
          err.message ||
          "Failed to get title suggestions."
      );
    } finally {
      setIsSuggestingTitle(false);
    }
  }, [formData.title, formData.content, onFormChange]);

  return (
    <div className="space-y-6 border-y border-gray-700 py-6">
      {/* Title Input with Suggestion Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            type="text"
            className="flex-grow text-3xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none h-auto p-0 placeholder-gray-500 text-white"
            placeholder="Untitled Blog Post"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSuggestTitles}
            disabled={isSuggestingTitle || !formData.title}
            className="text-purple-400 hover:text-purple-300 disabled:text-gray-500 flex-shrink-0"
            title="Suggest better titles (AI)"
          >
            {isSuggestingTitle ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
          </Button>
        </div>
        {/* Display Title Suggestions */}
        {titleSuggestionError && (
          <p className="text-xs text-red-500 mt-1">{titleSuggestionError}</p>
        )}
        {titleSuggestions.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 pl-2">
            <span className="text-xs text-gray-400">Suggestions:</span>
            {titleSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onFormChange({ ...formData, title: suggestion })}
                className="px-1.5 py-0.5 text-sm text-left bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description / Excerpt */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-gray-400">
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
              className="text-purple-400 hover:text-purple-300 disabled:text-gray-500 px-2 py-1 text-xs"
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
            name="description" // Use 'description' here
            value={formData.excerpt || ""} // Bind to excerpt state
            onChange={(e) => handleFormChange({ excerpt: e.target.value })} // Update excerpt state
            className="bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            placeholder="A short summary for previews and SEO (120-155 chars recommended)..."
            rows={3}
            required
          />
          {descSuggestionError && (
            <p className="text-xs text-red-500 mt-1">{descSuggestionError}</p>
          )}
          {descSuggestions.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs text-gray-400">Suggestions:</span>
              {descSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={
                    () => onFormChange({ ...formData, excerpt: suggestion }) // Update excerpt state
                  }
                  className="px-1.5 py-0.5 text-xs text-left bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
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
            <Label htmlFor="category" className="text-gray-400">
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
              className="text-purple-400 hover:text-purple-300 disabled:text-gray-500 px-2 py-1 text-xs"
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
            className="bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Tech"
          />
          {catSuggestionError && (
            <p className="text-xs text-red-500 mt-1">{catSuggestionError}</p>
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
                  className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-gray-400">
            Tags (comma-separated)
          </Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
            type="text"
            className="bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., react, nextjs, tutorial"
          />
        </div>

        {/* Publish Switch */}
        <div className="md:col-span-2 pt-4 border-t border-gray-700">
          {" "}
          {/* Ensure it spans columns and has top padding/border */}
          {/* Removed debug markers and forceful styling */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished} // Use prop
              onCheckedChange={onPublishChange} // Use prop handler
              // Removed debug styling
            />
            <Label
              htmlFor="isPublished"
              className="text-gray-300 cursor-pointer"
            >
              {isPublished ? "Published" : "Draft"}
            </Label>
          </div>
        </div>
      </div>{" "}
      {/* End Metadata Grid */}
    </div> // End Main Container Div
  );
}

export default MetadataSection;
