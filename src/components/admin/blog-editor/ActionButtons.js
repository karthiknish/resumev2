// src/components/admin/blog-editor/ActionButtons.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ButtonLoader } from "@/components/ui/app-loader";

function ActionButtons({
  isLoading,
  isSaveDisabled, // Pass combined disabled state
  onSubmit,
  submitStatus,
  error, // General form error
  saveButtonText = "Save Changes", // Add default save button text
  isPublished, // Add isPublished prop
  onPublishChange, // Add onPublishChange prop
}) {
  return (
    <>
      {/* Submit Status */}
      {submitStatus.length > 0 && (
        <div
          className={`p-4 rounded-lg text-sm mb-4 ${
            submitStatus[0]
              ? "bg-green-900/50 border border-green-700 text-green-300"
              : "bg-red-900/50 border border-red-700 text-red-300"
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
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-primary/10 justify-between items-center">
        {/* Save Button */}
        <Button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground disabled:opacity-50 order-1 sm:order-none"
          disabled={isLoading || isSaveDisabled}
          onClick={onSubmit} // Keep onClick if not using form onSubmit directly
        >
          {isLoading ? <ButtonLoader size="sm" className="mr-2" /> : null}
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
