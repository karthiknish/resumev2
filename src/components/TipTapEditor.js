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

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Helper function to create button with tooltip
  const MenuButton = ({ onClick, disabled, className, title, children }) => (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
      {/* Tooltip span */}
      <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-150 ease-out bg-black text-white text-xs px-2 py-1 rounded shadow z-50 whitespace-nowrap pointer-events-none">
        {title}
      </span>
    </div>
  );

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
    ];

    const handleColorClick = (color) => {
      editor.chain().focus().setColor(color).run();
      setShowPicker(false);
    };

    return (
      <div className="relative">
        <MenuButton
          onClick={() => setShowPicker(!showPicker)}
          className={`p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50`}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </MenuButton>
        {showPicker && (
          <div className="absolute z-10 top-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded shadow-lg flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorClick(color)}
                className="w-5 h-5 rounded-full border border-gray-600 hover:scale-110 transition-transform"
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
              className="w-5 h-5 rounded-full border border-gray-600 bg-white text-black flex items-center justify-center text-xs hover:scale-110 transition-transform"
              title="Remove Color"
            >
              X
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-800 rounded-md">
      {/* Undo/Redo - Use MenuButton */}
      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </MenuButton>

      {/* Basic Formatting */}
      {/* Revert Bold button to test click issue */}
      <button
        type="button"
        onClick={() => {
          console.log("Tiptap Selection State:", editor.state.selection);
          console.log(
            "Selected Text:",
            editor.state.doc.textBetween(
              editor.state.selection.from,
              editor.state.selection.to
            )
          );
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("bold")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Bold" // Keep title attribute for basic tooltip
      >
        <Bold className="w-4 h-4" />
      </button>
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("underline")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("highlight")
            ? "bg-yellow-500 text-black"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("italic")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("strike")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("code")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </MenuButton>

      {/* Headings - Use MenuButton */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </MenuButton>

      {/* Lists - Use MenuButton */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("bulletList")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("orderedList")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </MenuButton>

      {/* Alignment - Use MenuButton */}
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-1 px-2 rounded ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-1 px-2 rounded ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-1 px-2 rounded ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </MenuButton>

      {/* Link/Image - Use MenuButton */}
      <MenuButton
        onClick={() => {
          const url = window.prompt("Enter the URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 px-2 rounded ${
          editor.isActive("link")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => {
          const url = window.prompt("Enter the image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Insert Image"
      >
        <ImageIcon className="w-4 h-4" />
      </MenuButton>

      {/* Blocks - Use MenuButton */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("codeBlock")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Code Block"
      >
        <Code2 className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("blockquote")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </MenuButton>

      {/* Superscript/Subscript */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("superscript")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Superscript"
      >
        <SuperscriptIcon className="w-4 h-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={!editor.can().chain().focus().toggleSubscript().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("subscript")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Subscript"
      >
        <SubscriptIcon className="w-4 h-4" />
      </MenuButton>

      {/* Color Picker */}
      <ColorPickerButton editor={editor} />

      {/* Clear Formatting */}
      <MenuButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-1 px-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </MenuButton>

      {/* Task List Button */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-1 px-2 rounded ${
          editor.isActive("taskList")
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        } disabled:opacity-50`}
        title="Task List"
      >
        <ListTodo className="w-4 h-4" />
      </MenuButton>
    </div>
  );
};

const TipTapEditor = ({ content, onUpdate }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      UnderlineExtension,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder:
          "Start writing your blog post here... Press Tab for AI completion.",
      }),
      Superscript,
      Subscript,
      TaskList,
      TaskItem.configure({
        nested: true, // Allow nested task lists
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] bg-gray-900 text-white border border-gray-700 rounded-b-md p-4",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Tab" && !event.shiftKey) {
          event.preventDefault();

          handleSentenceCompletion();

          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
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
    <div className="bg-gray-900 border border-gray-700 rounded-md">
      <MenuBar editor={editor} />
      {isCompleting && (
        <div className="absolute top-0 right-0 p-2 text-xs text-blue-400 animate-pulse">
          AI thinking...
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
