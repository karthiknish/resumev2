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

// Import Table extensions
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

// Import CodeBlockLowlight and lowlight
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import lowlight from 'lowlight/lib/core' // Use core for smaller bundle size
// Register languages - Import and register only the languages you need
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml'; // HTML is registered as xml
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';

// Register languages with lowlight
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('js', javascript);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('xml', html);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('py', python);
lowlight.registerLanguage('bash', bash);
lowlight.registerLanguage('sh', bash);

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
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // Add CodeBlockLowlight
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // Add Table extensions
      Table,
      TableRow,
      TableHeader,
      TableCell,
      // NOTE: Other extensions like Subscript, Superscript, TaskList
      // should also be added here if they were added to the editor
      // to ensure proper rendering.
    ],
    content: content,
    editable: false,
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Remove the wrapper div, rely on parent styling or add specific classes for renderer
  // The prose styling might conflict with table/code block styling
  return <EditorContent editor={editor} />;

};

export default TipTapRenderer;
