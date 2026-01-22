// Converted to TypeScript - migrated
import React from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CarouselImage } from "./useCarouselHistory";

interface SortableSlideItemProps {
  id: number;
  img: CarouselImage;
  index: number;
  onPreview: (img: CarouselImage) => void;
}

function SortableSlideItem({ id, img, index, onPreview }: SortableSlideItemProps) {
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
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1.5 bg-background/90 hover:bg-background rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          aria-label="Drag to reorder slide"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

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

export default SortableSlideItem;

