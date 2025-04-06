"use client";
import Link from "next/link"; // Import Link
import { cn } from "@/lib/utils";
// Removed unused icons and sample data for clarity

function BentoGrid({ items = [] }) {
  // Default to empty array if items not passed
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto bg-black">
      {items.map((item, index) => {
        // Define the content of a grid item
        const GridItemContent = (
          <div
            className={cn(
              "group relative p-4 rounded-xl overflow-hidden transition-all duration-300 h-full", // Added h-full
              "border border-white/10 bg-gray-900",
              item.link
                ? "hover:shadow-blue-500/30 hover:border-blue-500/50"
                : "hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]", // Conditional hover effect
              item.link ? "hover:-translate-y-0.5 will-change-transform" : "", // Conditional transform
              // Add min-h-0 to prevent potential height issues
              "min-h-[180px]", // Set a minimum height for consistency
              {
                "shadow-[0_2px_12px_rgba(255,255,255,0.03)] -translate-y-0.5":
                  item.hasPersistentHover && !item.link, // Apply persistent hover only if not a link
              }
            )}
          >
            {/* Background effect */}
            <div
              className={`absolute inset-0 ${
                item.hasPersistentHover && !item.link // Apply persistent hover only if not a link
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col space-y-3 h-full">
              {" "}
              {/* Added h-full */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                    "bg-white/10 text-gray-300",
                    "transition-colors duration-300 group-hover:bg-white/20"
                  )}
                >
                  {item.status || "Project"} {/* Default status */}
                </span>
              </div>
              <div className="space-y-2 flex-grow">
                {" "}
                {/* Added flex-grow */}
                <h3 className="font-medium text-gray-100 tracking-tight text-[15px]">
                  {item.title}
                  {item.meta /* Conditionally render meta */ && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      {item.meta}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-300 leading-snug font-[425]">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                {" "}
                {/* Added mt-auto and pt-2 */}
                <div className="flex items-center space-x-2 text-xs text-gray-400 flex-wrap gap-1">
                  {" "}
                  {/* Added flex-wrap and gap */}
                  {item.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.link ? "View Details →" : item.cta || "Explore →"}{" "}
                  {/* Updated CTA */}
                </span>
              </div>
            </div>

            {/* Border effect */}
            <div
              className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/10 to-transparent ${
                item.hasPersistentHover && !item.link // Apply persistent hover only if not a link
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300`}
            />
          </div>
        );

        // Determine the className for the grid cell based on colSpan
        const cellClassName = cn(
          item.colSpan === 2 ? "md:col-span-2" : "col-span-1"
        );

        // Wrap with Link if item.link exists, otherwise render the div directly
        return item.link ? (
          <Link
            key={item.id || index}
            href={item.link}
            className={cellClassName}
          >
            {GridItemContent}
          </Link>
        ) : (
          <div key={item.id || index} className={cellClassName}>
            {GridItemContent}
          </div>
        );
      })}
    </div>
  );
}

export { BentoGrid };
