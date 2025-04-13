import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  ExternalLink,
  ImageIcon,
  FileText,
  CalendarDays,
  Sparkles,
  Search,
  Edit,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import PexelsImageSearch from "@/components/admin/PexelsImageSearch";
import TrendingNewsFeed from "@/components/admin/shared/TrendingNewsFeed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function BytesTab() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newHeadline, setNewHeadline] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLink, setNewLink] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingByteId, setEditingByteId] = useState(null);

  // AI Suggestion State
  const [headlineSuggestions, setHeadlineSuggestions] = useState([]);
  const [bodySuggestions, setBodySuggestions] = useState([]);
  const [isSuggestingHeadline, setIsSuggestingHeadline] = useState(false);
  const [isSuggestingBody, setIsSuggestingBody] = useState(false);

  // Pexels Modal State
  const [isPexelsModalOpen, setIsPexelsModalOpen] = useState(false);

  useEffect(() => {
    fetchBytes();
  }, []);

  const fetchBytes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bytes");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch bytes");
      }
      const data = await response.json();
      if (data.success && data.data) {
        setBytes(data.data);
      } else {
        setBytes([]);
        setError("No bytes found or invalid response format");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not load bytes.");
    } finally {
      setIsLoading(false);
    }
  };

  // Combined Create/Update Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newHeadline.trim() || !newBody.trim()) {
      toast.error("Headline and Body are required.");
      return;
    }
    setIsSubmitting(true);

    const byteData = {
      headline: newHeadline,
      body: newBody,
      imageUrl: newImageUrl || undefined,
      link: newLink || undefined,
    };

    Object.keys(byteData).forEach(
      (key) => byteData[key] === undefined && delete byteData[key]
    );

    const url = isEditing ? `/api/bytes/${editingByteId}` : "/api/bytes";
    const method = isEditing ? "PUT" : "POST";

    try {
      console.log(`Submitting Byte Data (${method}) to ${url}:`, byteData);

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(byteData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} byte`
        );
      }

      const resultData = await response.json();

      if (isEditing) {
        setBytes((prev) =>
          prev.map((b) => (b._id === editingByteId ? resultData.data : b))
        );
        toast.success("Byte updated successfully!");
      } else {
        setBytes((prev) => [resultData.data, ...prev]);
        toast.success("Byte created successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(
        err.message || `Failed to ${isEditing ? "update" : "create"} byte.`
      );
      console.error("Byte form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteByte = async (id) => {
    if (!confirm("Are you sure you want to delete this byte?")) {
      return;
    }
    try {
      const response = await fetch(`/api/bytes/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete byte");
      }
      setBytes((prev) => prev.filter((byte) => byte._id !== id));
      toast.success("Byte deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete byte.");
    }
  };

  // --- AI Suggestion Handlers ---
  const suggestHeadlines = async () => {
    setIsSuggestingHeadline(true);
    setHeadlineSuggestions([]);
    try {
      const response = await fetch("/api/ai/suggest-byte-headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: newBody, numSuggestions: 3 }),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to get suggestions");
      setHeadlineSuggestions(data.suggestions || []);
    } catch (error) {
      toast.error(`Headline suggestions failed: ${error.message}`);
    } finally {
      setIsSuggestingHeadline(false);
    }
  };

  const suggestBodies = async () => {
    if (!newHeadline.trim()) {
      toast.warning("Please enter a headline first to get body suggestions.");
      return;
    }
    setIsSuggestingBody(true);
    setBodySuggestions([]);
    try {
      const response = await fetch("/api/ai/suggest-byte-body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: newHeadline, numSuggestions: 3 }),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to get suggestions");
      setBodySuggestions(data.suggestions || []);
    } catch (error) {
      toast.error(`Body suggestions failed: ${error.message}`);
    } finally {
      setIsSuggestingBody(false);
    }
  };

  // --- News Selection Handler ---
  const handleNewsSelect = (headline, summary) => {
    setNewHeadline(headline);
    setNewBody(`Trending now: ${headline}\n\n${summary}\n\nMy thoughts: `);
    setNewImageUrl("");
    setNewLink("");
    setHeadlineSuggestions([]);
    setBodySuggestions([]);
  };

  // --- Pexels Image Selection Handler ---
  const handlePexelsSelect = (url, alt) => {
    console.log("[BytesTab] Pexels image selected:", url);
    setNewImageUrl(url);
    setIsPexelsModalOpen(false);
  };

  // --- Edit Handling ---
  const handleEditClick = (byte) => {
    setIsEditing(true);
    setEditingByteId(byte._id);
    setNewHeadline(byte.headline);
    setNewBody(byte.body);
    setNewImageUrl(byte.imageUrl || "");
    setNewLink(byte.link || "");
    setHeadlineSuggestions([]);
    setBodySuggestions([]);
    const formCard = document.getElementById("byte-form-card");
    if (formCard) {
      formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingByteId(null);
    setNewHeadline("");
    setNewBody("");
    setNewImageUrl("");
    setNewLink("");
    setHeadlineSuggestions([]);
    setBodySuggestions([]);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Byte Generator Link */}
      <div className="flex justify-end mb-4">
        <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
          <a
            href="/admin/bytes/ai-create"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Byte Generator
          </a>
        </Button>
      </div>
      {/* Top Section: Create/Edit Form + News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            id="byte-form-card"
            className="border-gray-700 bg-gray-900 text-white h-full"
          >
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Byte" : "Create New Byte"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Headline */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="headline"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Headline*
                    </label>
                    {/* AI Suggest Button - Always visible */}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={suggestHeadlines}
                      disabled={isSuggestingHeadline || isSubmitting}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      {isSuggestingHeadline ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}{" "}
                      Suggest
                    </Button>
                  </div>
                  <Input
                    id="headline"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    placeholder="Short, catchy headline"
                    required
                    maxLength={200}
                    disabled={isSubmitting}
                    className="bg-gray-800 border-gray-600"
                  />
                  {/* Headline Suggestions - Always visible if available */}
                  {headlineSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {headlineSuggestions.map((s, i) => (
                        <Button
                          key={i}
                          type="button"
                          size="xs"
                          variant="outline"
                          className="text-xs"
                          onClick={() => setNewHeadline(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="body"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Body*
                    </label>
                    {/* AI Suggest Button - Always visible */}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={suggestBodies}
                      disabled={
                        isSuggestingBody || isSubmitting || !newHeadline.trim()
                      }
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      {isSuggestingBody ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}{" "}
                      Suggest
                    </Button>
                  </div>
                  <Textarea
                    id="body"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="The main content of the byte (max 500 chars)"
                    required
                    maxLength={500}
                    rows={3}
                    disabled={isSubmitting}
                    className="bg-gray-800 border-gray-600"
                  />
                  {/* Body Suggestions - Always visible if available */}
                  {bodySuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {bodySuggestions.map((s, i) => (
                        <Button
                          key={i}
                          type="button"
                          size="xs"
                          variant="outline"
                          className="text-xs"
                          onClick={() => setNewBody(s)}
                        >
                          {s.substring(0, 50)}...
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Display Area (Inside Form) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image (Optional)
                  </label>
                  {newImageUrl && (
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-400">
                        Selected Image URL:
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={newImageUrl}
                          readOnly
                          className="mt-1 text-xs bg-gray-700 border-gray-600 text-gray-300 flex-grow"
                        />
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          className="text-red-400 text-xs mt-1 flex-shrink-0"
                          onClick={() => setNewImageUrl("")}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Link */}
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Link URL (Optional)
                  </label>
                  <Input
                    id="link"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://..."
                    disabled={isSubmitting}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                {/* Submit/Update Button */}
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isEditing
                      ? isSubmitting
                        ? "Updating..."
                        : "Update Byte"
                      : isSubmitting
                      ? "Creating..."
                      : "Create Byte"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Cancel Edit
                    </Button>
                  )}
                </div>
              </form>

              {/* Pexels Modal Trigger */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Dialog
                  open={isPexelsModalOpen}
                  onOpenChange={setIsPexelsModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {newImageUrl
                        ? "Change Pexels Image"
                        : "Search Pexels Image"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Search Pexels Images</DialogTitle>
                    </DialogHeader>
                    <PexelsImageSearch onImageSelect={handlePexelsSelect} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          {/* Only show news feed when *not* editing */}
          {!isEditing && <TrendingNewsFeed onNewsSelect={handleNewsSelect} />}
        </div>
      </div>

      {/* List of existing bytes */}
      <Card className="border-gray-700 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle>Existing Bytes ({bytes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          {error && !isLoading && (
            <p className="text-red-400 text-center py-10">Error: {error}</p>
          )}
          {!isLoading && !error && bytes.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              No bytes created yet.
            </p>
          )}
          {!isLoading && !error && bytes.length > 0 && (
            <div className="space-y-4">
              {bytes.map((byte) => (
                <Card key={byte._id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    {byte.imageUrl && (
                      <div className="flex-shrink-0 w-full md:w-32 h-32 relative rounded overflow-hidden">
                        <Image
                          src={byte.imageUrl}
                          alt={byte.headline}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-white mb-1">
                        {byte.headline}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">{byte.body}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />{" "}
                          {formatDate(byte.createdAt)}
                        </span>
                        {byte.link && (
                          <a
                            href={byte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Link
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col md:flex-row md:items-start gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(byte)}
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteByte(byte._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
