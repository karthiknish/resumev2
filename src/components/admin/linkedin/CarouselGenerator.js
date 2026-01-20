import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Download,
  Image as ImageIcon,
  Layers,
  X,
  FileText,
  BookOpen,
  Lightbulb,
  List,
  TrendingUp,
  GripVertical,
  FileDown,
  History,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

/**
 * Sortable Slide Item Component
 * Individual slide item with drag handle for reordering
 */
function SortableSlideItem({ id, img, index, onPreview }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      <div className="relative aspect-[4/5] rounded-lg border border-border overflow-hidden bg-card">
        {/* Drag Handle - Always visible on hover for desktop */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1.5 bg-background/90 hover:bg-background rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          aria-label="Drag to reorder slide"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Slide Image */}
        {img.imageData ? (
          <>
            <img
              src={`data:${img.mimeType || "image/png"};base64,${img.imageData}`}
              alt={`Slide ${img.slideNumber}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onPreview(img)}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Click to preview</span>
            </div>
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              {index + 1}
            </span>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground text-center p-2">
              {img.error || "Failed"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * LinkedIn Carousel Template Library
 * Pre-built templates for different carousel formats
 */
const CAROUSEL_TEMPLATES = {
  educational: [
    {
      id: "edu-tips",
      name: "Quick Tips",
      icon: Lightbulb,
      description: "Share bite-sized tips on any topic",
      template: "{number} Quick Tips for {topic}",
      slideCount: 5,
      placeholders: {
        topic: "Better JavaScript",
        number: "5",
      },
    },
    {
      id: "edu-mistakes",
      name: "Common Mistakes",
      icon: BookOpen,
      description: "Highlight mistakes and how to avoid them",
      template: "{number} Common {audience} Mistakes to Avoid",
      slideCount: 6,
      placeholders: {
        audience: "New Developer",
        number: "6",
      },
    },
    {
      id: "edu-steps",
      name: "Step-by-Step Guide",
      icon: List,
      description: "Break down a process into actionable steps",
      template: "How to {outcome}: A Step-by-Step Guide",
      slideCount: 7,
      placeholders: {
        outcome: "Build a React App",
      },
    },
    {
      id: "edu-myths",
      name: "Myth vs Reality",
      icon: FileText,
      description: "Debunk common myths in your industry",
      template: "{number} Myths About {topic} (Debunked)",
      slideCount: 5,
      placeholders: {
        topic: "Remote Work",
        number: "5",
      },
    },
    {
      id: "edu-checklist",
      name: "Actionable Checklist",
      icon: List,
      description: "Create a practical checklist for your audience",
      template: "The Ultimate {topic} Checklist",
      slideCount: 6,
      placeholders: {
        topic: "Code Review",
      },
    },
  ],
  professional: [
    {
      id: "prof-journey",
      name: "Career Journey",
      icon: TrendingUp,
      description: "Share your professional growth story",
      template: "My {timeframe} Career Journey in {industry}",
      slideCount: 5,
      placeholders: {
        timeframe: "5-Year",
        industry: "Tech",
      },
    },
    {
      id: "prof-lessons",
      name: "Key Lessons Learned",
      icon: BookOpen,
      description: "Share wisdom from your experience",
      template: "{number} Lessons I Learned from {experience}",
      slideCount: 5,
      placeholders: {
        number: "5",
        experience: "My First Job",
      },
    },
    {
      id: "prof-tools",
      name: "Tools & Resources",
      icon: FileText,
      description: "Curate a list of valuable tools",
      template: "{number} Essential Tools for {purpose}",
      slideCount: 6,
      placeholders: {
        number: "7",
        purpose: "Frontend Development",
      },
    },
    {
      id: "prof-trends",
      name: "Industry Trends",
      icon: TrendingUp,
      description: "Highlight trending topics in your field",
      template: "{number} {industry} Trends to Watch in {year}",
      slideCount: 5,
      placeholders: {
        number: "5",
        industry: "Tech",
        year: "2024",
      },
    },
    {
      id: "prof-advice",
      name: "Pro Tips",
      icon: Lightbulb,
      description: "Share professional advice",
      template: "Pro Tips for {skill}: From {level} to {level}",
      slideCount: 5,
      placeholders: {
        skill: "React",
        level: "Beginner",
        level2: "Advanced",
      },
    },
  ],
  engaging: [
    {
      id: "eng-quiz",
      name: "Quiz Format",
      icon: Lightbulb,
      description: "Create an interactive quiz carousel",
      template: "Quiz: How Much Do You Know About {topic}?",
      slideCount: 6,
      placeholders: {
        topic: "Web Development",
      },
    },
    {
      id: "eng-before-after",
      name: "Before & After",
      icon: TrendingUp,
      description: "Show transformation results",
      template: "Before & After: Transforming {outcome}",
      slideCount: 5,
      placeholders: {
        outcome: "Your Coding Skills",
      },
    },
    {
      id: "eng-comparison",
      name: "This vs That",
      icon: FileText,
      description: "Compare two options or approaches",
      template: "{option1} vs {option2}: Which is Better?",
      slideCount: 5,
      placeholders: {
        option1: "React",
        option2: "Vue",
      },
    },
    {
      id: "eng-story",
      name: "Story Series",
      icon: BookOpen,
      description: "Tell a story across multiple slides",
      template: "Story Time: {title}",
      slideCount: 7,
      placeholders: {
        title: "How I Got My First Developer Job",
      },
    },
    {
      id: "eng-stats",
      name: "Statistics Roundup",
      icon: TrendingUp,
      description: "Share compelling statistics",
      template: "{number} Surprising Statistics About {topic}",
      slideCount: 6,
      placeholders: {
        number: "7",
        topic: "Remote Work",
      },
    },
  ],
};

/**
 * Get template by category and ID
 */
const getTemplate = (category, templateId) => {
  return CAROUSEL_TEMPLATES[category]?.find(t => t.id === templateId);
};

/**
 * Format template with placeholder values
 */
const formatTemplate = (template, values = {}) => {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `{${key}}`),
    template
  );
};

export default function CarouselGenerator({ session }) {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState("5");
  const [style, setStyle] = useState("dark_pro");
  const [aspectRatio, setAspectRatio] = useState("portrait");
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Template state
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateCategory, setTemplateCategory] = useState("educational");

  // Swipe preview state
  const [showSwipePreview, setShowSwipePreview] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only start drag after moving 8px to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Fetch carousel history from server
   */
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/linkedin/content?contentType=carousel&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          const transformedHistory = data.content.map((item) => ({
            _id: item._id,
            id: item._id,
            topic: item.topic,
            slides: item.slides,
            slideImages: item.slideImages,
            carouselStyle: item.carouselStyle,
            aspectRatio: item.aspectRatio,
            slideCount: item.slideImages?.length || item.slides?.length || 0,
            createdAt: item.createdAt,
            isFavorite: item.isFavorite,
          }));
          setHistory(transformedHistory);
          setIsLoadingHistory(false);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch carousel history:", error);
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  /**
   * Save carousel to server
   */
  const saveToHistory = async (slidesData, imagesData) => {
    try {
      const response = await fetch("/api/linkedin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "carousel",
          topic: topic.trim(),
          slides: slidesData,
          slideImages: imagesData,
          carouselStyle: style,
          aspectRatio: aspectRatio,
          metrics: {
            slideCount: imagesData.length,
          },
        }),
      });

      if (response.ok) {
        fetchHistory(); // Refresh history after save
        return true;
      }
    } catch (error) {
      console.error("Failed to save carousel to server:", error);
    }
    return false;
  };

  /**
   * Load carousel from history
   */
  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setSlides(item.slides || []);
    setImages(item.slideImages || []);
    setSlideCount(String(item.slideCount || 5));
    if (item.carouselStyle) setStyle(item.carouselStyle);
    if (item.aspectRatio) setAspectRatio(item.aspectRatio);
    setShowHistory(false);
    toast.info("Loaded from history");
  };

  /**
   * Delete carousel from history
   */
  const deleteHistoryItem = async (item, e) => {
    e.stopPropagation();

    if (item._id) {
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "softDelete",
          }),
        });
        if (response.ok) {
          setHistory(history.filter((h) => h._id !== item._id));
          toast.success("Deleted from history");
          return;
        }
      } catch (err) {
        console.error("Failed to delete from server:", err);
      }
    }

    setHistory(history.filter((h) => h.id !== item.id));
    toast.success("Deleted from history");
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = async (item, e) => {
    e.stopPropagation();

    if (item._id) {
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "toggleFavorite",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHistory(
              history.map((h) =>
                h._id === item._id
                  ? { ...h, isFavorite: data.content.isFavorite }
                  : h
              )
            );
            toast.success(
              data.content.isFavorite ? "Added to favorites" : "Removed from favorites"
            );
            return;
          }
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    }

    setHistory(
      history.map((h) =>
        h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h
      )
    );
    toast.info("Favorite status updated");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.slideNumber === active.id);
        const newIndex = items.findIndex((item) => item.slideNumber === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update slide numbers after reordering
        return reordered.map((img, idx) => ({
          ...img,
          slideNumber: idx + 1,
        }));
      });

      // Also reorder slides content if available
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.slideNumber === active.id);
        const newIndex = items.findIndex((item) => item.slideNumber === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update slide numbers after reordering
        return reordered.map((slide, idx) => ({
          ...slide,
          slideNumber: idx + 1,
        }));
      });

      toast.success("Slide order updated");
    }
  };

  const getTemplateCategoryLabel = (category) => {
    const labels = {
      educational: "Educational",
      professional: "Professional",
      engaging: "Engaging",
    };
    return labels[category] || category;
  };

  const getTemplateCategoryIcon = (category) => {
    const icons = {
      educational: BookOpen,
      professional: TrendingUp,
      engaging: Lightbulb,
    };
    return icons[category] || FileText;
  };

  const handleTemplateSelect = (category, template) => {
    // Format the template with default placeholders
    const formattedTopic = formatTemplate(template.template, template.placeholders);
    setTopic(formattedTopic);
    setSlideCount(String(template.slideCount));
    setShowTemplates(false);

    // Show toast with instructions
    toast.success(`Loaded "${template.name}" template. Edit the topic to customize placeholders!`);
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a carousel topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSlides([]);
    setImages([]);
    setProgress(10);

    try {
      toast.info("Generating carousel content...");
      setProgress(20);

      const response = await fetch("/api/ai/linkedin-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          slideCount: parseInt(slideCount, 10),
          style,
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate carousel");
      }

      setSlides(data.slides || []);
      setImages(data.images || []);
      setProgress(100);
      toast.success(`Generated ${data.slides?.length || 0} slides!`);

      // Save to history
      saveToHistory(data.slides || [], data.images || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate carousel");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadImage = (imageData, slideNumber, mimeType = "image/png") => {
    try {
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const ext = mimeType.includes("jpeg") ? "jpg" : "png";

      const link = document.createElement("a");
      link.href = url;
      link.download = `linkedin-slide-${slideNumber}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success(`Downloaded slide ${slideNumber}`);
    } catch (err) {
      console.error("Download error:", err);
      toast.error(`Failed to download slide ${slideNumber}`);
    }
  };

  const downloadAll = () => {
    // Mark the most recent history item as exported
    if (history.length > 0) {
      const mostRecentItem = history[0];
      if (mostRecentItem._id) {
        fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: mostRecentItem._id,
            action: "markExported",
            exportType: "images",
          }),
        }).catch((err) => console.error("Failed to mark as exported:", err));
      }
    }

    images.forEach((img, idx) => {
      if (img.imageData) {
        setTimeout(() => {
          downloadImage(img.imageData, img.slideNumber, img.mimeType);
        }, idx * 300);
      }
    });
  };

  /**
   * Export all slides as a single PDF document
   * Creates a multi-page PDF with one slide per page
   */
  const exportAsPDF = async () => {
    if (images.length === 0) {
      toast.error("No slides to export");
      return;
    }

    try {
      toast.info("Generating PDF...");

      // Get the first image to determine dimensions
      const firstImage = images.find((img) => img.imageData);
      if (!firstImage) {
        throw new Error("No valid images to export");
      }

      // Create an image to get dimensions
      const img = new Image();
      const firstImageSrc = `data:${firstImage.mimeType || "image/png"};base64,${
        firstImage.imageData
      }`;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = firstImageSrc;
      });

      // Determine PDF dimensions based on aspect ratio setting
      // LinkedIn carousel slides are typically 1080x1350 (4:5 portrait) or 1080x1080 (1:1 square)
      const isPortrait = aspectRatio === "portrait" || img.height > img.width;
      const pageWidth = isPortrait ? 210 : 210; // A4 width in mm
      const pageHeight = isPortrait ? 297 : 210; // A4 height in mm (use A4 portrait for portrait slides, A4 landscape/square for square)

      // Create PDF with appropriate orientation
      const pdf = new jsPDF({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Process each image and add to PDF
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        if (!imageData.imageData) continue;

        // Add new page for slides after the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Load the image
        await new Promise((resolve, reject) => {
          const slideImg = new Image();
          slideImg.onload = resolve;
          slideImg.onerror = reject;
          slideImg.src = `data:${imageData.mimeType || "image/png"};base64,${
            imageData.imageData
          }`;
        });

        // Calculate dimensions to fit the PDF page while maintaining aspect ratio
        const imgRatio = img.width / img.height;
        const pageRatio = pdfWidth / pdfHeight;

        let renderWidth, renderHeight, x, y;

        if (imgRatio > pageRatio) {
          // Image is wider than page - fit to width
          renderWidth = pdfWidth;
          renderHeight = pdfWidth / imgRatio;
          x = 0;
          y = (pdfHeight - renderHeight) / 2; // Center vertically
        } else {
          // Image is taller than page - fit to height
          renderHeight = pdfHeight;
          renderWidth = pdfHeight * imgRatio;
          x = (pdfWidth - renderWidth) / 2; // Center horizontally
          y = 0;
        }

        // Add image to PDF
        const imgData = `data:${imageData.mimeType || "image/png"};base64,${
          imageData.imageData
        }`;
        pdf.addImage(imgData, imageData.mimeType || "PNG", x, y, renderWidth, renderHeight);
      }

      // Generate filename from topic (sanitize for filename)
      const sanitizedTopic = topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);
      const filename = sanitizedTopic
        ? `linkedin-carousel-${sanitizedTopic}.pdf`
        : "linkedin-carousel.pdf";

      // Save the PDF
      pdf.save(filename);
      toast.success(`PDF exported: ${filename}`);

      // Mark the most recent history item as exported
      if (history.length > 0) {
        const mostRecentItem = history[0];
        if (mostRecentItem._id) {
          fetch("/api/linkedin/content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contentId: mostRecentItem._id,
              action: "markExported",
              exportType: "pdf",
            }),
          }).catch((err) => console.error("Failed to mark as exported:", err));
        }
      }
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF: " + err.message);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
        {/* Generator Form */}
        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                Generate Carousel Images
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Templates
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Carousel Templates
                    </span>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-1 mb-3 p-1 bg-background rounded-lg">
                    {Object.keys(CAROUSEL_TEMPLATES).map((category) => {
                      const CategoryIcon = getTemplateCategoryIcon(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          data-testid={`carousel-template-category-${category}`}
                          onClick={() => setTemplateCategory(category)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                            templateCategory === category
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <CategoryIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{getTemplateCategoryLabel(category)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Template Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {CAROUSEL_TEMPLATES[templateCategory].map((template) => {
                      const TemplateIcon = template.icon;
                      return (
                        <motion.button
                          key={template.id}
                          type="button"
                          onClick={() => handleTemplateSelect(templateCategory, template)}
                          className="text-left p-3 rounded-lg bg-background hover:bg-accent hover:border-primary/30 border border-border transition-all text-sm group"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          data-testid={`carousel-template-${template.id}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                              <TemplateIcon className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-xs line-clamp-1">
                                {template.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {template.description}
                              </p>
                              <Badge variant="secondary" className="mt-1.5 text-xs">
                                {template.slideCount} slides
                              </Badge>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Panel */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-muted/50 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Recent Carousels
                      {isLoadingHistory && (
                        <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
                      )}
                    </span>
                    {history.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setHistory([]);
                          toast.success("History cleared");
                        }}
                        className="text-destructive hover:text-destructive h-7"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {isLoadingHistory ? "Loading..." : "No carousels yet"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {history.map((item) => (
                        <div
                          key={item.id || item._id}
                          className="relative group"
                        >
                          <button
                            onClick={() => loadFromHistory(item)}
                            className="w-full text-left p-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground text-xs line-clamp-1">
                                  {item.topic}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {item.slideCount} slides
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => toggleFavorite(item, e)}
                              className={`p-1 rounded hover:bg-accent ${
                                item.isFavorite ? "text-yellow-500" : "text-muted-foreground"
                              }`}
                              title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => deleteHistoryItem(item, e)}
                              className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="carousel-topic" className="text-sm font-medium text-foreground mb-1.5 block">
                  Carousel Topic
                </Label>
                <Textarea
                  id="carousel-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., '5 Tips for Better Code Reviews' or '7 Mistakes New Developers Make'"
                  disabled={isGenerating}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slide-count" className="text-sm font-medium text-foreground mb-1.5 block">
                    Number of Slides
                  </Label>
                  <Select value={slideCount} onValueChange={setSlideCount} disabled={isGenerating}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} slides
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    Style Preset
                  </Label>
                  <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark_pro">Dark Pro</SelectItem>
                      <SelectItem value="light_pro">Light Pro</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    Aspect Ratio
                  </Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait (4:5)</SelectItem>
                      <SelectItem value="square">Square (1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isGenerating || !topic.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isGenerating && (
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </form>

            {error && (
              <motion.div
                className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Generated Images Preview */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{images.length} slides</Badge>
                      Generated Carousel
                      <span className="text-xs text-muted-foreground font-normal">
                        (Drag slides to reorder)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => { setShowSwipePreview(true); setCurrentSlideIndex(0); }} variant="outline" size="sm">
                        <Layers className="mr-2 h-4 w-4" />
                        Swipe Preview
                      </Button>
                      <Button onClick={exportAsPDF} variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button onClick={downloadAll} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.slideNumber)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {images.map((img, idx) => (
                          <SortableSlideItem
                            key={img.slideNumber}
                            id={img.slideNumber}
                            img={img}
                            index={idx}
                            onPreview={(image) => setSelectedImage(image)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {slides.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-3">Slide Content:</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {slides.map((slide, idx) => (
                          <div key={idx} className="p-2 bg-muted/50 rounded-lg text-sm">
                            <span className="font-semibold text-primary">{slide.slideNumber}. </span>
                            <span className="font-medium">{slide.heading}</span>
                            {slide.body && (
                              <p className="text-muted-foreground text-xs mt-1">{slide.body}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-4">
                <img
                  src={`data:${selectedImage.mimeType || "image/png"};base64,${selectedImage.imageData}`}
                  alt={`Slide ${selectedImage.slideNumber}`}
                  className="w-full aspect-[4/5] object-contain rounded-lg"
                />
              </div>

              <div className="p-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Slide {selectedImage.slideNumber}</p>
                  <p className="text-sm text-muted-foreground">Click download to save</p>
                </div>
                <Button
                  onClick={() => {
                    downloadImage(selectedImage.imageData, selectedImage.slideNumber, selectedImage.mimeType);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Preview Modal */}
      <AnimatePresence>
        {showSwipePreview && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setShowSwipePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full h-full max-w-2xl max-h-screen flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-card/95 backdrop-blur border-b border-border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {currentSlideIndex + 1} / {images.length}
                  </Badge>
                  <h3 className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
                    {slides[currentSlideIndex]?.heading || `Slide ${currentSlideIndex + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentImage = images[currentSlideIndex];
                      if (currentImage?.imageData) {
                        downloadImage(currentImage.imageData, currentSlideIndex + 1, currentImage.mimeType);
                      }
                    }}
                    className="text-foreground hover:bg-accent"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <button
                    onClick={() => setShowSwipePreview(false)}
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Swiper Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <Swiper
                  modules={[Navigation, Pagination, Keyboard]}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-custom",
                    bulletClass: "swiper-pagination-bullet-custom",
                    bulletActiveClass: "swiper-pagination-bullet-active-custom",
                  }}
                  keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                  }}
                  initialSlide={currentSlideIndex}
                  onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    "--swiper-navigation-color": "#ffffff",
                    "--swiper-pagination-color": "#ffffff",
                  }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={img.slideNumber}>
                      <div className="flex items-center justify-center h-full px-8">
                        <img
                          src={`data:${img.mimeType || "image/png"};base64,${img.imageData}`}
                          alt={`Slide ${img.slideNumber}`}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                          style={{ aspectRatio: aspectRatio === "square" ? "1/1" : "4/5" }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Custom Navigation Buttons */}
              <button
                className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-card/80 hover:bg-card backdrop-blur rounded-full shadow-lg transition-all hover:scale-110 hidden sm:flex"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-card/80 hover:bg-card backdrop-blur rounded-full shadow-lg transition-all hover:scale-110 hidden sm:flex"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>

              {/* Custom Pagination */}
              <div className="swiper-pagination-custom absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"></div>

              {/* Slide Content Preview (Optional) */}
              {slides[currentSlideIndex]?.body && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white/90 text-sm text-center line-clamp-2">
                    {slides[currentSlideIndex].body}
                  </p>
                </div>
              )}

              {/* Swipe Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60 text-xs sm:hidden">
                <span>Swipe to navigate</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          transition: all 0.2s;
        }
        .swiper-pagination-bullet-active-custom {
          width: 24px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </>
  );
}
