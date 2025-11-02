"use client";
import Link from "next/link"; // Import Link
import { cn } from "@/lib/utils";
// Removed unused icons and sample data for clarity

function BentoGrid({ items = [] }) {
  // Default to empty array if items not passed
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {items.map((item, index) => {
        // Define the content of a grid item
        const GridItemContent = (
          <div
            className={cn(
              "group relative p-6 rounded-3xl overflow-hidden transition-all duration-300 h-full",
              "border border-slate-200 bg-white shadow-sm",
              item.link
                ? "hover:-translate-y-2 hover:shadow-xl"
                : "hover:-translate-y-2 hover:shadow-lg",
              "min-h-[220px]",
              {
                "-translate-y-2 shadow-lg": item.hasPersistentHover && !item.link,
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_65%)]" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col space-y-3 h-full">
              {" "}
              {/* Added h-full */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 border border-slate-200 group-hover:bg-slate-200 transition-all duration-300">
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full border",
                    "border-slate-200 bg-slate-100 text-slate-600",
                    "transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-white"
                  )}
                >
                  {item.status || "Project"} {/* Default status */}
                </span>
              </div>
              <div className="space-y-2 flex-grow">
                {" "}
                {/* Added flex-grow */}
                <h3 className="font-heading text-lg text-slate-900 tracking-tight">
                  {item.title}
                  {item.meta /* Conditionally render meta */ && (
                    <span className="ml-2 text-xs text-slate-500 font-normal">
                      {item.meta}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                {" "}
                {/* Added mt-auto and pt-2 */}
                <div className="flex items-center space-x-2 text-xs text-slate-500 flex-wrap gap-1">
                  {" "}
                  {/* Added flex-wrap and gap */}
                  {item.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-slate-100 transition-all duration-200 hover:bg-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.link ? "View details →" : item.cta || "Explore →"} {" "}
                  {/* Updated CTA */}
                </span>
              </div>
            </div>

            {/* Border effect */}
            <div
              className={`absolute inset-0 -z-10 rounded-3xl p-px bg-gradient-to-br from-transparent via-slate-200/60 to-transparent ${
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
