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

import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";

import { cn } from "@/lib/utils";

interface TipTapRendererProps {
  content: string;
  className?: string;
}

const lowlightInstance = createLowlight();

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

const TipTapRenderer = ({ content, className = "" }: TipTapRendererProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      UnderlineExtension,
      Highlight,
      Link.configure({ openOnClick: true, autolink: true }),
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
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance,
        HTMLAttributes: {
          class:
            "group relative rounded-xl border border-zinc-800 bg-[#09090b] text-zinc-100 p-5 my-6 overflow-x-auto font-mono text-sm leading-relaxed shadow-2xl",
        },
      }),
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
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose max-w-none focus:outline-none bg-transparent text-foreground prose-headings:text-foreground prose-a:text-blue-600 prose-blockquote:text-foreground prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-0 prose-li:marker:text-muted-foreground prose-table:text-foreground",
          className
        ),
      },
    },
    immediatelyRender: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

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

      const label = document.createElement("div");
      label.textContent = lang.toUpperCase();
      label.className =
        "absolute top-3 right-16 px-2 py-1 rounded text-xs font-medium text-zinc-400 select-none";
      pre.appendChild(label);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "absolute top-3 right-3 p-1.5 rounded-md bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100";
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
      btn.ariaLabel = "Copy code";

      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText || "");
          const originalIcon = btn.innerHTML;
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
          btn.classList.add("text-green-400");
          setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.classList.remove("text-green-400");
          }, 2000);
        } catch {}
      });
      pre.appendChild(btn);

      pre.setAttribute("data-enhanced", "true");
    });
  }, [editor, content]);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const slugify = (str: string) =>
      (str || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

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

    root.querySelectorAll("table").forEach((table) => {
      if (
        !table.parentElement ||
        !table.parentElement.classList.contains("table-wrapper")
      ) {
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper overflow-x-auto -mx-2 md:mx-0 my-4";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    root.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
      img.classList.add("rounded-xl", "border", "border-border");
    });

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    root.querySelectorAll('a[href^="http"]').forEach((a) => {
      try {
        const url = new URL((a as HTMLAnchorElement).href);
        if (!origin || url.origin !== origin) {
          (a as HTMLAnchorElement).target = "_blank";
          (a as HTMLAnchorElement).rel = "noopener noreferrer";
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
