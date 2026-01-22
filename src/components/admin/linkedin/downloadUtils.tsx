// Converted to TypeScript - migrated
import { toast } from "sonner";
import { CarouselImage, HistoryItem } from "./useCarouselHistory";

export const downloadImage = (imageData: string, slideNumber: number, mimeType = "image/png") => {
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
  } catch (err: unknown) {
    console.error("Download error:", err instanceof Error ? err.message : "Unknown error");
    toast.error(`Failed to download slide ${slideNumber}`);
  }
};

export const downloadAllImages = (images: CarouselImage[], history: HistoryItem[]) => {
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
      }).catch((err: unknown) => console.error("Failed to mark as exported:", err instanceof Error ? err.message : "Unknown error"));
    }
  }

  images.forEach((img, idx) => {
    if (img.imageData) {
      const imageData = img.imageData; // Narrow type
      setTimeout(() => {
        downloadImage(imageData, img.slideNumber, img.mimeType);
      }, idx * 300);
    }
  });
};

