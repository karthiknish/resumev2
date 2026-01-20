import { toast } from "sonner";

export const downloadImage = (imageData, slideNumber, mimeType = "image/png") => {
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

export const downloadAllImages = (images, history) => {
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
