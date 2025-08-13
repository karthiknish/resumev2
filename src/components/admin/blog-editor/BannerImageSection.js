// src/components/admin/blog-editor/BannerImageSection.js
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, LinkIcon, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import PexelsImageSearch from "@/components/admin/PexelsImageSearch";

function BannerImageSection({ imageUrl, onImageUrlChange }) {
  const [showPexelsSearch, setShowPexelsSearch] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");

  const handlePexelsImageSelect = (url) => {
    onImageUrlChange(url);
    setShowPexelsSearch(false); // Close the dialog
  };

  const handleManualUrlConfirm = () => {
    if (manualImageUrl.trim()) {
      onImageUrlChange(manualImageUrl.trim());
    }
    setManualImageUrl(""); // Clear input after confirming
  };

  return (
    <div className="space-y-2">
      <Label className="block text-foreground">Cover Image</Label>
      <div className="h-48 md:h-64 bg-muted rounded-lg relative flex items-center justify-center border border-dashed border-input overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Blog cover preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onImageUrlChange("")} // Clear image URL
              className="absolute top-3 right-3 z-10 rounded-full p-1 h-auto"
              aria-label="Remove image"
            >
              ✕
            </Button>
            {/* Change Image Button - Opens Pexels Dialog via state */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                console.log("[BannerImageSection] Change button clicked");
                setShowPexelsSearch(true);
              }} // Add log
              className="absolute bottom-3 left-3 z-10 flex items-center"
              aria-label="Change image using Pexels"
            >
              <Search className="mr-1 h-4 w-4" /> Change
            </Button>
          </>
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
            <ImagePlus size={40} />
            <div className="flex gap-2">
              {/* Pexels Button - Now just sets state, DialogTrigger removed */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  console.log("[BannerImageSection] Add Cover button clicked");
                  setShowPexelsSearch(true);
                }}
              >
                <Search className="mr-2 h-4 w-4" /> Add Cover from Pexels
              </Button>

              {/* Manual URL Input Dialog Trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <LinkIcon className="mr-2 h-4 w-4" /> Add via URL
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-popover border-input text-popover-foreground">
                  <DialogHeader>
                    <DialogTitle>Add Image URL</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      id="manual-url"
                      placeholder="https://example.com/image.jpg"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      className="col-span-3 bg-background border-input"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" onClick={handleManualUrlConfirm}>
                        Confirm URL
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>

      {/* Pexels Search Dialog (Rendered unconditionally, controlled by state) */}
      <Dialog open={showPexelsSearch} onOpenChange={setShowPexelsSearch}>
        {/* No DialogTrigger needed here as it's controlled by state */}
        {/* Added max-h and overflow to DialogContent */}
        <DialogContent className="sm:max-w-[800px] bg-popover border-input text-popover-foreground max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            {" "}
            {/* Prevent header from shrinking */}
            <DialogTitle>Search Pexels for Cover Image</DialogTitle>
          </DialogHeader>
          {/* Added overflow-y-auto and flex-grow to the Pexels component wrapper */}
          <div className="flex-grow overflow-y-auto pr-2">
            <PexelsImageSearch onImageSelect={handlePexelsImageSelect} />
          </div>
          <DialogFooter className="flex-shrink-0">
            {" "}
            {/* Prevent footer from shrinking */}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Input field to show/edit the URL */}
      <Input
        id="imageUrl" // Keep id for potential label association if needed elsewhere
        value={imageUrl || ""}
        type="text"
        onChange={(e) => onImageUrlChange(e.target.value)}
        className="block w-full px-4 py-2 text-foreground bg-background border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none mt-2"
        placeholder="Image URL will appear here or paste directly"
        required
      />
    </div>
  );
}

export default BannerImageSection;
