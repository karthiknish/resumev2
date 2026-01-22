// Converted to TypeScript - migrated
// src/components/admin/blog-editor/ActionButtons.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ButtonLoader } from "@/components/ui/app-loader";

interface ActionButtonsProps {
  isLoading: boolean;
  isSaveDisabled?: boolean;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  submitStatus: [boolean, string] | [];
  error?: string;
  saveButtonText?: string;
  isPublished?: boolean;
  onPublishChange?: (checked: boolean) => void;
}

function ActionButtons({
  isLoading,
  isSaveDisabled = false,
  onSubmit,
  submitStatus,
  error,
  saveButtonText = "Save Changes",
  isPublished,
  onPublishChange,
}: ActionButtonsProps) {
  return (
    <>
      {/* Submit Status */}
      {submitStatus.length > 0 && (
        <div
          className={`p-4 rounded-lg text-sm mb-4 ${
            submitStatus[0]
              ? "bg-success/20 border border-success/30 text-success"
              : "bg-destructive/20 border border-destructive/30 text-destructive"
          }`}
        >
          {submitStatus[1]}
        </div>
      )}
      {/* Display general form error */}
      {error &&
        !submitStatus[0] && ( // Show general error if submit status isn't success
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm mb-4">
            {error}
          </div>
        )}

      {/* Action Buttons & Publish Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border justify-between items-center">
        {/* Save Button */}
        <Button
          type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 order-1 sm:order-none"
          disabled={isLoading || isSaveDisabled}
          onClick={onSubmit}
        >
          {isLoading ? <ButtonLoader size="sm" /> : null}
          {isLoading ? "Saving..." : saveButtonText}
        </Button>

        {/* Publish/Draft Toggle */}
        {typeof isPublished !== "undefined" &&
          typeof onPublishChange === "function" && (
            <div className="flex items-center space-x-2 order-2 sm:order-none">
              <Switch
                id="isPublishedToggle"
                checked={isPublished}
                onCheckedChange={onPublishChange}
                disabled={isLoading} // Disable switch while loading
              />
              <Label
                htmlFor="isPublishedToggle"
                className="text-foreground cursor-pointer"
              >
                {isPublished ? "Published" : "Draft"}
              </Label>
            </div>
          )}
      </div>
    </>
  );
}

export default ActionButtons;

