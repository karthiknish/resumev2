import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
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
} from "lucide-react";
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

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
    </div>
  );
};

const TipTapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      UnderlineExtension,
      Highlight,
      Link,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write your blog post content here...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="border border-gray-700 rounded-md bg-gray-900 text-gray-200">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1 font-calendas prose-blockquote:border-blue-500 prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-md prose-img:rounded-lg prose-img:shadow-md prose-table:bg-gray-800 prose-table:text-gray-200 prose-th:bg-gray-700 prose-td:bg-gray-800 prose-code:bg-gray-900 prose-code:text-blue-400 prose-pre:bg-gray-900 prose-pre:text-blue-300 prose-pre:rounded prose-pre:p-4 prose-pre:overflow-x-auto"
      />
    </div>
  );
};

export default TipTapEditor;
