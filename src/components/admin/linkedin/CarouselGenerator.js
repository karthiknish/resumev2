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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  History,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import SortableSlideItem from "./SortableSlideItem";
import {
  CAROUSEL_TEMPLATES,
  formatTemplate,
  getTemplateCategoryLabel,
  getTemplateCategoryIcon,
} from "./carouselTemplates";
import { downloadImage, downloadAllImages } from "./downloadUtils";
import { useCarouselHistory } from "./useCarouselHistory";

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

  const { history, isLoadingHistory, saveToHistory, deleteHistoryItem, toggleFavorite } = useCarouselHistory(session);

  const [showTemplates, setShowTemplates] = useState(false);
  const [templateCategory, setTemplateCategory] = useState("educational");
  const [showHistory, setShowHistory] = useState(false);
  const [showSwipePreview, setShowSwipePreview] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (history.length > 0 && showHistory) {
      setShowHistory(false);
    }
  }, [history]);

  const handleTemplateSelect = (category, template) => {
    const formattedTopic = formatTemplate(template.template, template.placeholders);
    setTopic(formattedTopic);
    setSlideCount(String(template.slideCount));
    setShowTemplates(false);
    toast.success(`Loaded "${template.name}" template. Edit the topic to customize placeholders!`);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.slideNumber === active.id);
        const newIndex = items.findIndex((item) => item.slideNumber === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        const reordered = arrayMove(items, oldIndex, newIndex);

        return reordered.map((img, idx) => ({
          ...img,
          slideNumber: idx + 1,
        }));
      });

      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.slideNumber === active.id);
        const newIndex = items.findIndex((item) => item.slideNumber === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        const reordered = arrayMove(items, oldIndex, newIndex);

        return reordered.map((slide, idx) => ({
          ...slide,
          slideNumber: idx + 1,
        }));
      });

      toast.success("Slide order updated");
    }
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

      saveToHistory(topic.trim(), data.slides || [], data.images || [], style, aspectRatio);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to generate carousel");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const exportAsPDF = async () => {
    if (images.length === 0) {
      toast.error("No slides to export");
      return;
    }

    try {
      toast.info("Generating PDF...");

      const firstImage = images.find((img) => img.imageData);
      if (!firstImage) {
        throw new Error("No valid images to export");
      }

      const img = new Image();
      const firstImageSrc = `data:${firstImage.mimeType || "image/png"};base64,${firstImage.imageData}`;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = firstImageSrc;
      });

      const isPortrait = aspectRatio === "portrait" || img.height > img.width;
      const pageWidth = 210;
      const pageHeight = isPortrait ? 297 : 210;

      const pdf = new jsPDF({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        if (!imageData.imageData) continue;

        if (i > 0) {
          pdf.addPage();
        }

        await new Promise((resolve, reject) => {
          const slideImg = new Image();
          slideImg.onload = resolve;
          slideImg.onerror = reject;
          slideImg.src = `data:${imageData.mimeType || "image/png"};base64,${imageData.imageData}`;
        });

        const imgRatio = img.width / img.height;
        const pageRatio = pdfWidth / pdfHeight;

        let renderWidth, renderHeight, x, y;

        if (imgRatio > pageRatio) {
          renderWidth = pdfWidth;
          renderHeight = pdfWidth / imgRatio;
          x = 0;
          y = (pdfHeight - renderHeight) / 2;
        } else {
          renderHeight = pdfHeight;
          renderWidth = pdfHeight * imgRatio;
          x = (pdfWidth - renderWidth) / 2;
          y = 0;
        }

        const imgData = `data:${imageData.mimeType || "image/png"};base64,${imageData.imageData}`;
        pdf.addImage(imgData, imageData.mimeType || "PNG", x, y, renderWidth, renderHeight);
      }

      const sanitizedTopic = topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);
      const filename = sanitizedTopic ? `linkedin-carousel-${sanitizedTopic}.pdf` : "linkedin-carousel.pdf";

      pdf.save(filename);
      toast.success(`PDF exported: ${filename}`);

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
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
                    <span className="text-sm font-medium text-foreground">Carousel Templates</span>
                  </div>

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
                              <p className="font-medium text-foreground text-xs line-clamp-1">{template.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{template.description}</p>
                              <Badge variant="secondary" className="mt-1.5 text-xs">{template.slideCount} slides</Badge>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                      {isLoadingHistory && <span className="ml-2 text-xs text-muted-foreground">Loading...</span>}
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
                    <p className="text-sm text-muted-foreground">{isLoadingHistory ? "Loading..." : "No carousels yet"}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {history.map((item) => (
                        <div key={item.id || item._id} className="relative group">
                          <button onClick={() => loadFromHistory(item)} className="w-full text-left p-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground text-xs line-clamp-1">{item.topic}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{item.slideCount} slides</Badge>
                                  <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => toggleFavorite(item, e)} className={`p-1 rounded hover:bg-accent ${item.isFavorite ? "text-yellow-500" : "text-muted-foreground"}`} title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </button>
                            <button onClick={(e) => deleteHistoryItem(item, e)} className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive" title="Delete">
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
                <Label htmlFor="carousel-topic" className="text-sm font-medium text-foreground mb-1.5 block">Carousel Topic</Label>
                <Textarea id="carousel-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., '5 Tips for Better Code Reviews'" disabled={isGenerating} className="min-h-[80px] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slide-count" className="text-sm font-medium text-foreground mb-1.5 block">Number of Slides</Label>
                  <Select value={slideCount} onValueChange={setSlideCount} disabled={isGenerating}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>{[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (<SelectItem key={num} value={String(num)}>{num} slides</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Style Preset</Label>
                  <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait (4:5)</SelectItem>
                      <SelectItem value="square">Square (1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isGenerating || !topic.trim()} className="w-full">
                    {isGenerating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>) : (<><ImageIcon className="mr-2 h-4 w-4" />Generate</>)}
                  </Button>
                </div>
              </div>

              {isGenerating && (
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div className="bg-primary h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
              )}
            </form>

            {error && (
              <motion.div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <AnimatePresence>
          {images.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="bg-card border border-border shadow-sm rounded-2xl">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="flex items-center justify-between text-lg font-heading font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{images.length} slides</Badge>
                      Generated Carousel
                      <span className="text-xs text-muted-foreground font-normal">(Drag slides to reorder)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => { setShowSwipePreview(true); setCurrentSlideIndex(0); }} variant="outline" size="sm">
                        <Layers className="mr-2 h-4 w-4" />Swipe Preview
                      </Button>
                      <Button onClick={exportAsPDF} variant="outline" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>Export PDF
                      </Button>
                      <Button onClick={() => downloadAllImages(images, history)} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />Download All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={images.map((img) => img.slideNumber)} strategy={verticalListSortingStrategy}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {images.map((img, idx) => (<SortableSlideItem key={img.slideNumber} id={img.slideNumber} img={img} index={idx} onPreview={(image) => setSelectedImage(image)} />))}
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
                            {slide.body && <p className="text-muted-foreground text-xs mt-1">{slide.body}</p>}
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

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedImage(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-lg w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)} className="absolute top-3 right-3 z-10 p-2 bg-background/80 hover:bg-background rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="p-4">
                <img src={`data:${selectedImage.mimeType || "image/png"};base64,${selectedImage.imageData}`} alt={`Slide ${selectedImage.slideNumber}`} className="w-full aspect-[4/5] object-contain rounded-lg" />
              </div>
              <div className="p-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Slide {selectedImage.slideNumber}</p>
                  <p className="text-sm text-muted-foreground">Click download to save</p>
                </div>
                <Button onClick={() => downloadImage(selectedImage.imageData, selectedImage.slideNumber, selectedImage.mimeType)}>
                  <Download className="mr-2 h-4 w-4" />Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwipePreview && images.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowSwipePreview(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full h-full max-w-2xl max-h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 bg-card/95 backdrop-blur border-b border-border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">{currentSlideIndex + 1} / {images.length}</Badge>
                  <h3 className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">{slides[currentSlideIndex]?.heading || `Slide ${currentSlideIndex + 1}`}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { const currentImage = images[currentSlideIndex]; if (currentImage?.imageData) downloadImage(currentImage.imageData, currentSlideIndex + 1, currentImage.mimeType); }} className="text-foreground hover:bg-accent">
                    <Download className="w-4 h-4" />
                  </Button>
                  <button onClick={() => setShowSwipePreview(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                <Swiper modules={[Navigation, Pagination, Keyboard]} navigation={{ nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }} pagination={{ clickable: true, el: ".swiper-pagination-custom" }} keyboard={{ enabled: true, onlyInViewport: true }} initialSlide={currentSlideIndex} onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)} className="w-full h-full flex items-center justify-center" style={{ "--swiper-navigation-color": "#ffffff", "--swiper-pagination-color": "#ffffff" }}>
                  {images.map((img, idx) => (
                    <SwiperSlide key={img.slideNumber}>
                      <div className="flex items-center justify-center h-full px-8">
                        <img src={`data:${img.mimeType || "image/png"};base64,${img.imageData}`} alt={`Slide ${img.slideNumber}`} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" style={{ aspectRatio: aspectRatio === "square" ? "1/1" : "4/5" }} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-card/80 hover:bg-card backdrop-blur rounded-full shadow-lg transition-all hover:scale-110 hidden sm:flex" aria-label="Previous slide"><ChevronLeft className="w-6 h-6 text-foreground" /></button>
              <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-card/80 hover:bg-card backdrop-blur rounded-full shadow-lg transition-all hover:scale-110 hidden sm:flex" aria-label="Next slide"><ChevronRight className="w-6 h-6 text-foreground" /></button>

              <div className="swiper-pagination-custom absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"></div>

              {slides[currentSlideIndex]?.body && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><p className="text-white/90 text-sm text-center line-clamp-2">{slides[currentSlideIndex].body}</p></div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .swiper-pagination-bullet-custom { width: 8px; height: 8px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.4); transition: all 0.2s; }
        .swiper-pagination-bullet-active-custom { width: 24px; border-radius: 4px; background-color: rgba(255, 255, 255, 0.9); }
      `}</style>
    </>
  );
}
