import * as React from "react";

export interface TipTapEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onUpdate, editable = true, placeholder, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdate) {
      onUpdate(e.target.value);
    }
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      disabled={!editable}
      placeholder={placeholder}
      className={`w-full min-h-[300px] p-4 border border-input rounded-md ${className || ''}`}
    />
  );
};

export default TipTapEditor;
