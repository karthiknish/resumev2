import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  CalendarDays,
} from "lucide-react"; // Added icons
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image"; // Use Next.js Image

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

  // Form state for new byte
  const [newHeadline, setNewHeadline] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLink, setNewLink] = useState("");

  // Fetch bytes on mount
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

  // Handle new byte submission
  const handleCreateByte = async (e) => {
    e.preventDefault();
    if (!newHeadline.trim() || !newBody.trim()) {
      toast.error("Headline and Body are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bytes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: newHeadline,
          body: newBody,
          imageUrl: newImageUrl || undefined, // Send undefined if empty
          link: newLink || undefined, // Send undefined if empty
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create byte");
      }
      const newData = await response.json();
      // Add new byte to the top of the list optimistically
      setBytes((prev) => [newData.data, ...prev]);
      toast.success("Byte created successfully!");
      // Reset form
      setNewHeadline("");
      setNewBody("");
      setNewImageUrl("");
      setNewLink("");
    } catch (err) {
      toast.error(err.message || "Failed to create byte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle byte deletion
  const handleDeleteByte = async (id) => {
    if (!confirm("Are you sure you want to delete this byte?")) {
      return;
    }
    try {
      const response = await fetch(`/api/bytes/${id}`, { method: "DELETE" }); // Assuming DELETE endpoint exists at /api/bytes/[id]
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete byte");
      }
      // Remove byte from state
      setBytes((prev) => prev.filter((byte) => byte._id !== id));
      toast.success("Byte deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete byte.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form for creating new byte */}
      <Card className="border-gray-700 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle>Create New Byte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateByte} className="space-y-4">
            <div>
              <label
                htmlFor="headline"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Headline*
              </label>
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
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Body*
              </label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Image URL (Optional)
                </label>
                <Input
                  id="imageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={isSubmitting}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
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
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? "Creating..." : "Create Byte"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
                    <div className="flex-shrink-0 flex flex-col md:items-end justify-start pt-1">
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
