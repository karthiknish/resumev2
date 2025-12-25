import React, { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CarouselGenerator() {
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
    images.forEach((img, idx) => {
      if (img.imageData) {
        setTimeout(() => {
          downloadImage(img.imageData, img.slideNumber, img.mimeType);
        }, idx * 300);
      }
    });
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
            <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-foreground">
              <div className="p-2 bg-primary/10 rounded-full">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              Generate Carousel Images
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">
                  Carousel Topic
                </Label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., '5 Tips for Better Code Reviews' or '7 Mistakes New Developers Make'"
                  disabled={isGenerating}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
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
                    </div>
                    <Button onClick={downloadAll} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => img.imageData && setSelectedImage(img)}
                      >
                        {img.imageData ? (
                          <>
                            <img
                              src={`data:${img.mimeType || "image/png"};base64,${img.imageData}`}
                              alt={`Slide ${img.slideNumber}`}
                              className="w-full aspect-[4/5] object-cover rounded-lg border border-border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Click to preview</span>
                            </div>
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                              {img.slideNumber}
                            </span>
                          </>
                        ) : (
                          <div className="w-full aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground text-center p-2">
                              {img.error || "Failed"}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

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
    </>
  );
}
