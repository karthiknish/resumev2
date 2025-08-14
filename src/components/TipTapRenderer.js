import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

// Import Table extensions
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

// Import CodeBlockLowlight and lowlight
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight"; // Import createLowlight instead of default

console.log("TipTapRenderer: Imported createLowlight:", createLowlight); // Log

// Register languages - Import the languages themselves
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml"; // HTML is registered as xml
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";

// Create the lowlight instance
const lowlightInstance = createLowlight();

// Register languages with the instance
lowlightInstance.register({
  javascript,
  js: javascript,
  css,
  html,
  xml: html,
  python,
  py: python,
  bash,
  sh: bash,
});

const TipTapRenderer = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable StarterKit's code block to use CodeBlockLowlight
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      // Add extensions used in TipTapEditor for consistent rendering
      TextStyle,
      Color,
      UnderlineExtension,
      Highlight,
      Link.configure({ openOnClick: true, autolink: true }), // Match editor config if needed
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg border border-border",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start my-2",
        },
      }),
      // Configure CodeBlockLowlight with languages
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance, // Pass the created instance
        HTMLAttributes: {
          class:
            "group relative rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] text-[#d4d4d4] p-4 my-6 overflow-x-auto font-mono text-sm leading-relaxed",
        },
      }),
      // Add Table extensions
      Table.configure({
        HTMLAttributes: {
          class:
            "table-auto border-collapse border border-border rounded-lg overflow-hidden my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-muted border border-border",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-3 py-2",
        },
      }),
    ],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none bg-transparent text-foreground prose-headings:text-foreground prose-a:text-blue-600 prose-blockquote:text-foreground prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-0 prose-li:marker:text-muted-foreground prose-table:text-foreground",
      },
    },
  });

  const containerRef = useRef(null);

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Enhance code blocks: language label and copy button
  useEffect(() => {
    if (!containerRef.current) return;
    const preNodes = containerRef.current.querySelectorAll("pre");
    preNodes.forEach((pre) => {
      if (pre.getAttribute("data-enhanced") === "true") return;
      pre.classList.add("relative", "group");
      const code = pre.querySelector("code");
      if (!code) return;
      const langMatch = (code.className || "").match(/language-([a-z0-9+]+)/i);
      const lang = langMatch
        ? langMatch[1]
        : code.getAttribute("data-language") || "code";

      // Language label
      const label = document.createElement("div");
      label.textContent = lang.toUpperCase();
      label.className =
        "absolute top-2 left-2 px-2 py-0.5 rounded bg-[#2d2d2d] text-[#9cdcfe] text-xs font-semibold";
      pre.appendChild(label);

      // Copy button
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "absolute top-2 right-2 px-2 py-0.5 rounded border border-[#3c3c3c] bg-[#252526] text-[#d4d4d4] text-xs hover:bg-[#2d2d2d] transition-colors";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          const prev = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = prev), 1200);
        } catch {}
      });
      pre.appendChild(btn);

      pre.setAttribute("data-enhanced", "true");
    });
  }, [editor, content]);

  // Enhance other content: headings anchors, blockquotes, tables, images, links
  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    // Utility slugify
    const slugify = (str) =>
      (str || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    // Headings: add ids and anchor links
    root.querySelectorAll("h2, h3").forEach((h) => {
      h.classList.add("group", "scroll-mt-24");
      if (!h.id) {
        const text = h.textContent || "";
        h.id =
          slugify(text) || `heading-${Math.random().toString(36).slice(2, 8)}`;
      }
      if (!h.querySelector(".heading-anchor")) {
        const a = document.createElement("a");
        a.href = `#${h.id}`;
        a.className =
          "heading-anchor ml-2 opacity-0 group-hover:opacity-100 text-blue-600 text-sm align-middle";
        a.textContent = "#";
        h.appendChild(a);
      }
    });

    // Blockquotes: subtle card style
    root.querySelectorAll("blockquote").forEach((bq) => {
      bq.classList.add(
        "rounded-xl",
        "border-l-4",
        "border-blue-600",
        "bg-blue-50/60",
        "p-4",
        "my-4"
      );
    });

    // Tables: responsive wrapper
    root.querySelectorAll("table").forEach((table) => {
      if (
        !table.parentElement ||
        !table.parentElement.classList.contains("table-wrapper")
      ) {
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper overflow-x-auto -mx-2 md:mx-0 my-4";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // Images: rounded borders, lazy loading
    root.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
      img.classList.add("rounded-xl", "border", "border-border");
    });

    // External links: open in new tab
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    root.querySelectorAll('a[href^="http"]').forEach((a) => {
      try {
        const url = new URL(a.href);
        if (!origin || url.origin !== origin) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
      } catch {}
    });
  }, [editor, content]);

  return (
    <div className="w-full" ref={containerRef}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapRenderer;
