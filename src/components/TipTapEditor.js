import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, useCallback } from "react";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Undo,
  Redo,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  ListTodo,
  RemoveFormatting,
  Table as TableIcon,
  MoreHorizontal,
  Type,
  AlignJustify,
} from "lucide-react";
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { toast } from "sonner";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import CharacterCount from "@tiptap/extension-character-count";

// Import Table extensions
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

// Import CodeBlockLowlight and lowlight
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

console.log("TipTapEditor: Imported createLowlight:", createLowlight); // Log

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

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Group buttons for better organization
  const textFormattingButtons = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      icon: Bold,
      title: "Bold",
      disabled: !editor.can().chain().focus().toggleBold().run(),
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      icon: Italic,
      title: "Italic",
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      icon: Underline,
      title: "Underline",
      disabled: !editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      icon: Strikethrough,
      title: "Strikethrough",
      disabled: !editor.can().chain().focus().toggleStrike().run(),
    },
    {
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      icon: Code,
      title: "Inline Code",
      disabled: !editor.can().chain().focus().toggleCode().run(),
    },
    {
      action: () => editor.chain().focus().toggleHighlight().run(),
      active: editor.isActive("highlight"),
      icon: Highlighter,
      title: "Highlight",
      disabled: !editor.can().chain().focus().toggleHighlight().run(),
    },
  ];

  const headingButtons = [
    {
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      icon: Heading1,
      title: "Heading 1",
      disabled: !editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      icon: Heading2,
      title: "Heading 2",
      disabled: !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      icon: Heading3,
      title: "Heading 3",
      disabled: !editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  const listButtons = [
    {
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      icon: List,
      title: "Bullet List",
      disabled: !editor.can().chain().focus().toggleBulletList().run(),
    },
    {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      icon: ListOrdered,
      title: "Ordered List",
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
    },
    {
      action: () => editor.chain().focus().toggleTaskList().run(),
      active: editor.isActive("taskList"),
      icon: ListTodo,
      title: "Task List",
      disabled: !editor.can().chain().focus().toggleTaskList().run(),
    },
  ];

  const alignmentButtons = [
    {
      action: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
      icon: AlignLeft,
      title: "Align Left",
      disabled: !editor.can().chain().focus().setTextAlign("left").run(),
    },
    {
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      icon: AlignCenter,
      title: "Align Center",
      disabled: !editor.can().chain().focus().setTextAlign("center").run(),
    },
    {
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      icon: AlignRight,
      title: "Align Right",
      disabled: !editor.can().chain().focus().setTextAlign("right").run(),
    },
    {
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      active: editor.isActive({ textAlign: "justify" }),
      icon: AlignJustify,
      title: "Justify",
      disabled: !editor.can().chain().focus().setTextAlign("justify").run(),
    },
  ];

  const blockButtons = [
    {
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      icon: Quote,
      title: "Blockquote",
      disabled: !editor.can().chain().focus().toggleBlockquote().run(),
    },
    {
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      icon: Code2,
      title: "Code Block",
      disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
    },
    {
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: false,
      icon: Minus,
      title: "Horizontal Rule",
      disabled: !editor.can().chain().focus().setHorizontalRule().run(),
    },
  ];

  const linkImageButtons = [
    {
      action: () => {
        const url = window.prompt("Enter the URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      active: editor.isActive("link"),
      icon: LinkIcon,
      title: "Insert Link",
      disabled: !editor.can().chain().focus().setLink({ href: "" }).run(),
    },
    {
      action: () => {
        const url = window.prompt("Enter the image URL");
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
      active: false,
      icon: ImageIcon,
      title: "Insert Image",
      disabled: !editor.can().chain().focus().setImage({ src: "" }).run(),
    },
  ];

  const tableButtons = [
    {
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      active: false,
      icon: TableIcon,
      title: "Insert Table",
      disabled: !editor.can().chain().focus().insertTable().run(),
    },
    {
      action: () => editor.chain().focus().addColumnBefore().run(),
      active: false,
      icon: MoreHorizontal,
      title: "Add Column Before",
      disabled: !editor.can().chain().focus().addColumnBefore().run(),
    },
    {
      action: () => editor.chain().focus().addColumnAfter().run(),
      active: false,
      icon: MoreHorizontal,
      title: "Add Column After",
      disabled: !editor.can().chain().focus().addColumnAfter().run(),
    },
    {
      action: () => editor.chain().focus().deleteColumn().run(),
      active: false,
      icon: Minus,
      title: "Delete Column",
      disabled: !editor.can().chain().focus().deleteColumn().run(),
    },
    {
      action: () => editor.chain().focus().addRowBefore().run(),
      active: false,
      icon: Type,
      title: "Add Row Before",
      disabled: !editor.can().chain().focus().addRowBefore().run(),
    },
    {
      action: () => editor.chain().focus().addRowAfter().run(),
      active: false,
      icon: Type,
      title: "Add Row After",
      disabled: !editor.can().chain().focus().addRowAfter().run(),
    },
    {
      action: () => editor.chain().focus().deleteRow().run(),
      active: false,
      icon: Minus,
      title: "Delete Row",
      disabled: !editor.can().chain().focus().deleteRow().run(),
    },
  ];

  const utilityButtons = [
    {
      action: () => editor.chain().focus().undo().run(),
      active: false,
      icon: Undo,
      title: "Undo",
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      action: () => editor.chain().focus().redo().run(),
      active: false,
      icon: Redo,
      title: "Redo",
      disabled: !editor.can().chain().focus().redo().run(),
    },
    {
      action: () => editor.chain().focus().unsetAllMarks().run(),
      active: false,
      icon: RemoveFormatting,
      title: "Clear Formatting",
      disabled: !editor.can().chain().focus().unsetAllMarks().run(),
    },
  ];

  // Color Picker Component
  const ColorPickerButton = ({ editor }) => {
    const [showPicker, setShowPicker] = useState(false);
    const colors = [
      "#9CA3AF", // Gray
      "#EF4444", // Red
      "#F59E0B", // Amber
      "#10B981", // Green
      "#3B82F6", // Blue
      "#8B5CF6", // Violet
      "#EC4899", // Pink
      "#000000", // Black
    ];

    const handleColorClick = (color) => {
      editor.chain().focus().setColor(color).run();
      setShowPicker(false);
    };

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            editor.isActive("textStyle", { color: "#9CA3AF" }) ||
            editor.isActive("textStyle", { color: "#EF4444" }) ||
            editor.isActive("textStyle", { color: "#F59E0B" }) ||
            editor.isActive("textStyle", { color: "#10B981" }) ||
            editor.isActive("textStyle", { color: "#3B82F6" }) ||
            editor.isActive("textStyle", { color: "#8B5CF6" }) ||
            editor.isActive("textStyle", { color: "#EC4899" }) ||
            editor.isActive("textStyle", { color: "#000000" })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          } disabled:opacity-50 flex items-center justify-center`}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </button>
        {showPicker && (
          <div className="absolute z-20 top-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl flex flex-wrap gap-2 w-48">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorClick(color)}
                className="w-6 h-6 rounded-full border-2 border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Set color to ${color}`}
              />
            ))}
            <button
              key="unset"
              type="button"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowPicker(false);
              }}
              className="w-6 h-6 rounded-full border-2 border-gray-600 bg-white text-black flex items-center justify-center text-xs hover:scale-110 transition-transform"
              title="Remove Color"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  };

  // Toolbar Group Component
  const ToolbarGroup = ({ title, children }) => (
    <div className="flex items-center">
      <div className="flex flex-wrap gap-1 p-1 bg-card border border-border rounded-lg">
        {children}
      </div>
    </div>
  );

  // Toolbar Button Component
  const ToolbarButton = ({ action, active, icon: Icon, title, disabled }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={action}
          disabled={disabled}
          className={`p-2 rounded-lg border border-border transition-all duration-200 ${
            active
              ? "bg-blue-600 text-white shadow-inner"
              : "bg-muted hover:bg-muted/80 text-foreground"
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
        >
          <Icon className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 p-3 bg-card rounded-lg border border-border mb-4">
        {/* Primary Tools - Always Visible */}
        <div className="flex flex-wrap gap-2">
          {/* Undo/Redo */}
          <ToolbarGroup title="History">
            {utilityButtons.slice(0, 2).map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Text Formatting */}
          <ToolbarGroup title="Text Formatting">
            {textFormattingButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
            <ColorPickerButton editor={editor} />
          </ToolbarGroup>

          {/* Headings */}
          <ToolbarGroup title="Headings">
            {headingButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Lists */}
          <ToolbarGroup title="Lists">
            {listButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Alignment */}
          <ToolbarGroup title="Alignment">
            {alignmentButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Links and Media */}
          <ToolbarGroup title="Links & Media">
            {linkImageButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Blocks */}
          <ToolbarGroup title="Blocks">
            {blockButtons.map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Tables */}
          <ToolbarGroup title="Tables">
            {tableButtons.slice(0, 1).map((button, index) => (
              <ToolbarButton key={index} {...button} />
            ))}
          </ToolbarGroup>

          {/* Clear Formatting */}
          <ToolbarGroup title="Utilities">
            <ToolbarButton {...utilityButtons[2]} />
          </ToolbarGroup>
        </div>

        {/* Secondary Tools - Collapsible */}
        <div className="flex flex-wrap gap-2">
          {/* Table Tools (when table is active) */}
          {editor.isActive("table") && (
            <ToolbarGroup title="Table Editing">
              {tableButtons.slice(1).map((button, index) => (
                <ToolbarButton key={`table-${index}`} {...button} />
              ))}
            </ToolbarGroup>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

const TipTapEditor = ({ content, onUpdate }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable StarterKit's code block to use CodeBlockLowlight
        codeBlock: false,
        // Keep other StarterKit defaults or configure as needed
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      UnderlineExtension,
      Highlight,
      Link.configure({
        openOnClick: false, // Recommended for editor UX
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: false, // Allow images to be block elements
        allowBase64: true, // Allow pasting base64 images (optional)
        HTMLAttributes: {
          class: "rounded-lg border border-border",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
      Superscript,
      Subscript,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start my-2",
        },
      }),
      // Configure CodeBlockLowlight with languages
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance,
        defaultLanguage: "plaintext",
        HTMLAttributes: {
          class: "rounded-lg border border-border bg-muted p-4 my-4",
        },
      }),
      // Add Table extensions
      Table.configure({
        resizable: true, // Allow column resizing
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
      CharacterCount.configure({
        // Optional: set a very high limit or expose via props later
        limit: 50000,
      }),
    ],
    content: content || "", // Use provided content or empty string
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // console.log("Editor Updated (HTML):", html); // Debug log
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[400px] p-6 border border-border rounded-b-lg bg-card text-foreground prose-headings:text-foreground prose-a:text-blue-600 prose-blockquote:text-foreground prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-0 prose-li:marker:text-muted-foreground prose-table:text-foreground",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleSentenceCompletion = async () => {
    if (!editor || isCompleting) return;

    const { state } = editor;
    const { from } = state.selection;

    const textBeforeCursor = state.doc.textBetween(
      Math.max(0, from - 500),
      from,
      "\n"
    );

    if (!textBeforeCursor.trim()) {
      toast.info("Not enough context before cursor for AI completion.");
      return;
    }

    setIsCompleting(true);
    toast.loading("AI is completing...", { id: "completion-toast" });

    try {
      const response = await fetch("/api/ai/complete-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textBeforeCursor }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.completion) {
        editor.chain().focus().insertContent(data.completion).run();
        toast.success("AI completion inserted!", { id: "completion-toast" });
      } else {
        throw new Error(data.message || "Failed to get AI completion.");
      }
    } catch (error) {
      console.error("Error fetching sentence completion:", error);
      toast.error(`AI Completion Failed: ${error.message}`, {
        id: "completion-toast",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="bg-gray-100 border border-gray-700 rounded-lg shadow-lg">
      <MenuBar editor={editor} />
      <div className="relative">
        {isCompleting && (
          <div className="absolute top-4 right-4 z-10 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            AI thinking...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <div className="px-6 py-3 bg-muted/50 border-t border-border rounded-b-lg text-xs text-muted-foreground flex justify-between items-center">
        <div>
          {editor && (
            <span>
              {editor.storage?.characterCount?.words?.() ?? 0} words ·{" "}
              {editor.storage?.characterCount?.characters?.() ?? 0} characters
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSentenceCompletion}
            disabled={isCompleting}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {isCompleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              "AI Complete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
