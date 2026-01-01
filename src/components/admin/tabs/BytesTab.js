import React, { useState, useEffect, useRef } from "react";
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
  Info,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PexelsImageSearch from "@/components/admin/PexelsImageSearch";
import TrendingNewsFeed from "@/components/admin/shared/TrendingNewsFeed";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BytesTab() {
  const [bytes, setBytes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
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

  // AlertDialog state for deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [byteToDelete, setByteToDelete] = useState(null);

  // Ref for Swiper navigation
  const swiperNavPrevRef = useRef(null);
  const swiperNavNextRef = useRef(null);

  useEffect(() => {
    fetchBytes();
  }, []);

  const fetchBytes = async (token = null) => {
    if (token) {
      setIsFetchingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const limit = 12; // Fetch 12 at a time
      const url = token 
        ? `/api/bytes?limit=${limit}&pageToken=${token}` 
        : `/api/bytes?limit=${limit}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch bytes");
      }
      const data = await response.json();
      if (data.success && data.data) {
        const newBytes = data.data.bytes || [];
        if (token) {
          setBytes((prev) => [...prev, ...newBytes]);
        } else {
          setBytes(newBytes);
        }
        setNextPageToken(data.data.nextPageToken || null);
      } else {
        if (!token) setBytes([]);
        setError("No bytes found or invalid response format");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not load bytes.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Helper for character count color
  const getCountColor = (count, max) => {
    if (count > max) return "text-destructive";
    if (count > max * 0.9) return "text-orange-500";
    return "text-muted-foreground";
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteByte = (id) => {
    setByteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteByte = async () => {
    if (!byteToDelete) return;
    
    try {
      const response = await fetch(`/api/bytes/${byteToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete byte");
      }
      setBytes((prev) => prev.filter((byte) => byte._id !== byteToDelete));
      toast.success("Byte deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete byte.");
    } finally {
      setIsDeleteDialogOpen(false);
      setByteToDelete(null);
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
    <div className="space-y-8 p-4 md:p-6">
      {/* Instructions Card - Conditionally Rendered */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="bg-muted/50 border border-primary/20 relative shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground font-heading">
                  <Info className="h-5 w-5 text-primary" />
                  Welcome to Bytes!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>
                  Use this section to create short, timely updates or quick
                  thoughts ('Bytes').
                </p>
                <ul className="list-disc list-inside pl-2 space-y-0.5">
                  <li>Fill the form below to create a new Byte.</li>
                  <li>
                    Use the <Sparkles className="inline h-3 w-3" /> buttons for
                    AI suggestions.
                  </li>
                  <li>Add an image via URL or search Pexels.</li>
                  <li>
                    Click <Edit className="inline h-3 w-3" /> on a card to edit
                    it.
                  </li>
                  <li>The latest Bytes appear at the top.</li>
                </ul>
              </CardContent>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 rounded-full"
                onClick={() => setShowInstructions(false)}
                aria-label="Dismiss instructions"
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form and Trending News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Byte Creation/Edit Form Card */}
        <Card
          id="byte-form-card"
          className="lg:col-span-2 bg-card border-border shadow-sm rounded-xl"
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground font-heading">
              {isEditing ? "✏️ Edit Byte" : "✨ Create New Byte"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Headline Input with AI Suggestion */}
              <div className="space-y-1.5">
                <Label htmlFor="headline">Headline</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="headline"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    placeholder="Catchy headline..."
                    className="flex-grow bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={suggestHeadlines}
                    disabled={isSuggestingHeadline || !newBody.trim()}
                    title="Suggest Headlines based on Body"
                    className="border-primary/50 text-primary hover:bg-primary/10 flex-shrink-0"
                  >
                    {isSuggestingHeadline ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {headlineSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 flex-grow mr-4"
                      >
                        {headlineSuggestions.map((s, i) => (
                          <Button
                            key={i}
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setNewHeadline(s)}
                            className="w-full justify-start text-left text-foreground bg-muted hover:bg-muted/80 h-auto py-1 px-2"
                          >
                            {s}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className={cn("text-[10px] font-medium ml-auto", getCountColor(newHeadline.length, 200))}>
                    {newHeadline.length}/200
                  </span>
                </div>
              </div>

              {/* Body Textarea with AI Suggestion */}
              <div className="space-y-1.5">
                <Label htmlFor="body">Body</Label>
                <div className="flex items-start gap-2">
                  <Textarea
                    id="body"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="What's happening? Your thoughts..."
                    className="flex-grow bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px]"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={suggestBodies}
                    disabled={isSuggestingBody || !newHeadline.trim()}
                    title="Suggest Body based on Headline"
                    className="border-primary/50 text-primary hover:bg-primary/10 flex-shrink-0 mt-0"
                  >
                    {isSuggestingBody ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {bodySuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 flex-grow mr-4"
                      >
                        {bodySuggestions.map((s, i) => (
                          <Button
                            key={i}
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setNewBody(s)}
                            className="w-full justify-start text-left text-foreground bg-muted hover:bg-muted/80 h-auto py-1 px-2 whitespace-pre-wrap break-words"
                          >
                            {s}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className={cn("text-[10px] font-medium ml-auto", getCountColor(newBody.length, 500))}>
                    {newBody.length}/500
                  </span>
                </div>
              </div>

              {/* Image URL and Pexels Search */}
              <div>
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="imageUrl"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-grow bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                  <Dialog
                    open={isPexelsModalOpen}
                    onOpenChange={setIsPexelsModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Search Pexels for Image"
                        className="border-primary/50 text-primary hover:bg-primary/10 flex-shrink-0"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-background border-border text-foreground">
                      <DialogHeader>
                        <DialogTitle>Search Pexels Images</DialogTitle>
                      </DialogHeader>
                      <PexelsImageSearch onImageSelect={handlePexelsSelect} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <Label htmlFor="link">Link URL (Optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://related-link.com"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Submit/Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    "Update Byte"
                  ) : (
                    "Create Byte"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trending News Card */}
        <Card className="lg:col-span-1 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Trending News</CardTitle>
            <span className="text-xs text-muted-foreground">
              Click to use as context
            </span>
          </CardHeader>
          <CardContent>
            <TrendingNewsFeed onNewsSelect={handleNewsSelect} />
          </CardContent>
        </Card>
      </div>

      {/* Display Bytes Section - Changed to Slider */}
      <div className="mt-10 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Latest Bytes</h2>
          {/* Custom Navigation Buttons */}
          {!isLoading && !error && bytes.length > 3 && (
            <div className="flex gap-2">
              <Button
                ref={swiperNavPrevRef}
                variant="outline"
                size="icon"
                className="h-8 w-8 border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Previous Bytes Slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                ref={swiperNavNextRef}
                variant="outline"
                size="icon"
                className="h-8 w-8 border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Next Bytes Slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && !isLoading && (
          <p className="text-center text-destructive py-10">Error: {error}</p>
        )}
        {!isLoading && !error && bytes.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No bytes found. Create one above!
          </p>
        )}
        {!isLoading && !error && bytes.length > 0 && (
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: swiperNavPrevRef.current,
              nextEl: swiperNavNextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = swiperNavPrevRef.current;
              swiper.params.navigation.nextEl = swiperNavNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            className="!pb-2"
          >
            {bytes.map((byte) => (
              <SwiperSlide key={byte._id} className="h-auto">
                <motion.div variants={itemVariants} className="h-full">
                  <Card className="h-full flex flex-col bg-card border-border shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md overflow-hidden">
                    {byte.imageUrl && (
                      <div className="relative w-full h-40">
                        <Image
                          src={byte.imageUrl}
                          alt={byte.headline}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 text-foreground leading-tight">
                        {byte.headline}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-grow whitespace-pre-wrap break-words">
                        {byte.body}
                      </p>
                    </CardContent>
                    <CardFooter className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(byte.createdAt)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {byte.link && (
                          <a
                            href={byte.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"
                            title="Visit link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(byte)}
                          className="p-1 h-auto w-auto rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit Byte"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDeleteByte(byte._id)}
                          className="p-1 h-auto w-auto rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                          title="Delete Byte"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Load More Section */}
        {nextPageToken && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchBytes(nextPageToken)}
              disabled={isFetchingMore}
              className="gap-2 min-w-[140px]"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Bytes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Deletion Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the byte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteByte}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
