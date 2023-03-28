import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiCodeAlt,
  BiParagraph,
  BiUndo,
  BiRedo,
} from "react-icons/bi";
import { HiListBullet } from "react-icons/hi2";
import { AiOutlineOrderedList, AiOutlineCode } from "react-icons/ai";
import { TbBlockquote } from "react-icons/tb";
import { GoHorizontalRule } from "react-icons/go";
import { ImPagebreak } from "react-icons/im";
import Placeholder from "@tiptap/extension-placeholder";
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-4  bg-white">
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <BiBold className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Bold
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <BiItalic className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Italic
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <BiStrikethrough className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Strike
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <BiCodeAlt className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Code
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <BiParagraph className="text-2xl" />
        </button>
        <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
          Paragraph
        </span>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading1
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2{" "}
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading2
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3{" "}
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading3
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4{" "}
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading4
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading5
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Heading6
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <HiListBullet className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Bullet List
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <AiOutlineOrderedList className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Ordered List
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          <AiOutlineCode className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Code Block
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <TbBlockquote className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Block Quote
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <GoHorizontalRule className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Horizontal Rule
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <ImPagebreak className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Hard Break
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <BiUndo className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Undo
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <BiRedo className="text-2xl" />
          <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Redo
          </span>
        </button>
      </div>
      <div className="group relative flex justify-center">
        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").color}
        />
        <span className="z-10 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
          Color
        </span>
      </div>
    </div>
  );
};

function Markdown({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Write something inspiring...",
      }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor?.getHTML());
    },
  });

  return (
    <>
      {console.log(content)}
      <MenuBar editor={editor} />
      <EditorContent className="bg-white min-h-screen" editor={editor} />
    </>
  );
}

export default Markdown;
