import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
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
  Sparkles,
  Pencil,
  PlusCircle,
  MinusCircle,
  ListChecks,
  Loader2,
  Wand2,
  Check,
  X,
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

// Register languages - Import the languages themselves
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml"; // HTML is registered as xml
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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

const AI_TOOL_ACTIONS = [
  {
    key: "rewrite",
    label: "Rewrite",
    icon: Pencil,
    loadingMessage: "Rewriting selection…",
    successMessage: "Selection rewritten",
  },
  {
    key: "simplify",
    label: "Simplify",
    icon: Sparkles,
    loadingMessage: "Simplifying selection…",
    successMessage: "Selection simplified",
  },
  {
    key: "expand",
    label: "Expand",
    icon: PlusCircle,
    loadingMessage: "Expanding selection…",
    successMessage: "Selection expanded",
  },
  {
    key: "shorten",
    label: "Shorten",
    icon: MinusCircle,
    loadingMessage: "Shortening selection…",
    successMessage: "Selection shortened",
  },
  {
    key: "summarize",
    label: "Summarize",
    icon: ListChecks,
    loadingMessage: "Summarizing selection…",
    successMessage: "Summary ready",
  },
];

const MenuBar = ({
  editor,
  aiActions = [],
  onAiAction,
  activeAiAction,
  isAiBusy,
}) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    if (previousUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 font-normal">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline-block">Text</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <span className="mr-2">¶</span> Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="mr-2 h-4 w-4" /> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="mr-2 h-4 w-4" /> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="mr-2 h-4 w-4" /> Heading 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="mr-2 h-4 w-4" /> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="mr-2 h-4 w-4" /> Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
              <ListTodo className="mr-2 h-4 w-4" /> Task List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="mr-2 h-4 w-4" /> Quote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <Code2 className="mr-2 h-4 w-4" /> Code Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("bold") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Cmd+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("italic") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Cmd+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("underline") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Cmd+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("strike") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("code") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("highlight") && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-2 h-6 w-px bg-slate-200" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: "left" }) && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: "center" }) && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: "right" }) && "bg-slate-100 text-slate-900")}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-2 h-6 w-px bg-slate-200" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("link") && "bg-slate-100 text-slate-900")}
          onClick={setLink}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addImage}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Table">
              <TableIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              Insert Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
              Add Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
              Add Row
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>
              Delete Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mx-2 h-6 w-px bg-slate-200" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">AI Tools</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>AI Assistance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {aiActions.map((action) => (
              <DropdownMenuItem
                key={action.key}
                onClick={() => onAiAction?.(action)}
                disabled={isAiBusy}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const TipTapEditor = ({ content, onUpdate, id, className }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeAIActionKey, setActiveAIActionKey] = useState(null);
  const [isAiBusy, setIsAiBusy] = useState(false);

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
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline cursor-pointer",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg border border-slate-200 my-4",
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
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance,
        defaultLanguage: "plaintext",
        HTMLAttributes: {
          class: "rounded-lg border border-slate-200 bg-slate-50 p-4 my-4 font-mono text-sm",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "table-auto border-collapse border border-slate-200 rounded-lg overflow-hidden my-4 w-full",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-slate-50 border border-slate-200 p-2 font-semibold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-slate-200 p-2",
        },
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[400px] px-8 py-6 prose-headings:font-heading prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-img:rounded-xl",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if content is significantly different to avoid cursor jumps
      // Simple length check for now
      if (Math.abs(editor.getHTML().length - content.length) > 10) {
         editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  const runAiAction = useCallback(
    async (action) => {
      if (!editor) return;

      const { from, to } = editor.state.selection;

      if (from === to) {
        toast.info("Select some text to use AI tools.");
        return;
      }

      const selectedText = editor.state.doc.textBetween(from, to, "\n").trim();

      if (!selectedText) {
        toast.info("Select some text to use AI tools.");
        return;
      }

      setActiveAIActionKey(action.key);
      setIsAiBusy(true);

      const docSize = editor.state.doc.content.size;
      const contextRadius = 800;
      const contextStart = Math.max(0, from - contextRadius);
      const contextEnd = Math.min(docSize, to + contextRadius);
      const surrounding = editor.state.doc.textBetween(contextStart, contextEnd, "\n");

      const toastId = toast.loading(action.loadingMessage);

      try {
        const response = await fetch("/api/ai/edit-selection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: action.key,
            text: selectedText,
            context: surrounding,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && typeof data.replacement === "string") {
          const replacement = data.replacement.trim();
          if (!replacement) throw new Error("AI returned an empty response.");
          
          editor.chain().focus().deleteRange({ from, to }).insertContent(replacement).run();
          toast.success(action.successMessage, { id: toastId });
        } else {
          throw new Error(data.message || "AI request failed.");
        }
      } catch (error) {
        console.error("AI edit-selection error:", error);
        toast.error(error?.message || "AI request failed.", { id: toastId });
      } finally {
        setActiveAIActionKey(null);
        setIsAiBusy(false);
      }
    },
    [editor]
  );

  const handleSentenceCompletion = async () => {
    if (!editor || isCompleting) return;

    const { state } = editor;
    const { from } = state.selection;
    const docSize = state.doc.content.size;
    const contextWindow = 800;
    const textBeforeCursor = state.doc.textBetween(Math.max(0, from - contextWindow), from, "\n");
    const textAfterCursor = state.doc.textBetween(from, Math.min(docSize, from + 200), "\n");

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
        body: JSON.stringify({ textBeforeCursor, textAfterCursor }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.completion) {
        const completionText = data.completion;
        const needsLeadingSpace = textBeforeCursor.length > 0 && !textBeforeCursor.endsWith(" ") && !completionText.startsWith(" ");
        const contentToInsert = needsLeadingSpace ? ` ${completionText}` : completionText;

        editor.chain().focus().insertContent(contentToInsert).run();
        toast.success("AI completion inserted!", { id: "completion-toast" });
      } else {
        throw new Error(data.message || "Failed to get AI completion.");
      }
    } catch (error) {
      console.error("Error fetching sentence completion:", error);
      toast.error(`AI Completion Failed: ${error.message}`, { id: "completion-toast" });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className={cn("flex min-h-[500px] w-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)}>
      <MenuBar
        editor={editor}
        aiActions={AI_TOOL_ACTIONS}
        onAiAction={runAiAction}
        activeAiAction={activeAIActionKey}
        isAiBusy={isAiBusy}
      />
      <div className="relative flex-grow bg-white">
        {isCompleting && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm border border-indigo-100">
            <Loader2 className="h-3 w-3 animate-spin" />
            AI thinking...
          </div>
        )}
        <EditorContent editor={editor} />
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-slate-100")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-slate-100")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("strike") && "bg-slate-100")}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <div className="mx-1 h-4 w-px bg-slate-200" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => runAiAction(AI_TOOL_ACTIONS[0])}
              className="h-8 gap-1 px-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">Improve</span>
            </Button>
          </BubbleMenu>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
        <div>
          {editor && (
            <span>
              {editor.storage?.characterCount?.words?.() ?? 0} words ·{" "}
              {editor.storage?.characterCount?.characters?.() ?? 0} characters
            </span>
          )}
        </div>
        <Button
          onClick={handleSentenceCompletion}
          disabled={isCompleting}
          size="sm"
          className="h-7 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isCompleting ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Wand2 className="mr-1 h-3 w-3" />
          )}
          AI Complete
        </Button>
      </div>
    </div>
  );
};

export default TipTapEditor;
