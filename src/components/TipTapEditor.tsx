import * as React from "react";

export interface TipTapEditorHandle {
  insertLink: (params: { url: string; text?: string }) => void;
}

export interface TipTapEditorProps {
  id?: string;
  content?: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export const TipTapEditor = React.forwardRef<TipTapEditorHandle, TipTapEditorProps>(
  ({ id, content, onUpdate, editable = true, placeholder, className }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onUpdate) {
        onUpdate(e.target.value);
      }
    };

    const insertLink = ({ url, text }: { url: string; text?: string }) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const linkText = text?.trim() ? text.trim() : url;
      const markdown = `[${linkText}](${url})`;
      const currentValue = content ?? "";
      const start = textarea.selectionStart ?? currentValue.length;
      const end = textarea.selectionEnd ?? currentValue.length;
      const nextValue = `${currentValue.slice(0, start)}${markdown}${currentValue.slice(end)}`;

      onUpdate?.(nextValue);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + markdown.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    };

    React.useImperativeHandle(ref, () => ({ insertLink }), [content, onUpdate]);

    return (
      <textarea
        id={id}
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        disabled={!editable}
        placeholder={placeholder}
        className={`w-full min-h-[300px] p-4 border border-input rounded-md ${className || ""}`}
      />
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;
