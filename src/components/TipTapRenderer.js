import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
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
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

// Import CodeBlockLowlight and lowlight
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
          class: "rounded-lg border border-gray-700",
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
          class: "rounded-lg border border-gray-700 bg-gray-800 p-4 my-4",
        },
      }),
      // Add Table extensions
      Table.configure({
        HTMLAttributes: {
          class: "table-auto border-collapse border border-gray-700 rounded-lg overflow-hidden my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-gray-800 border border-gray-700",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-700 px-3 py-2",
        },
      }),
    ],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none bg-transparent text-gray-100 prose-headings:text-gray-100 prose-a:text-blue-400 prose-blockquote:text-gray-300 prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-800 prose-pre:p-0 prose-li:marker:text-gray-400 prose-table:text-gray-100",
      },
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapRenderer;
