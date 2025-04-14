// src/components/admin/blog-editor/ActionButtons.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

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
          <div className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

      {/* Action Buttons & Publish Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700 justify-between items-center">
        {/* Save Button */}
        <Button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 order-1 sm:order-none"
          disabled={isLoading || isSaveDisabled}
          onClick={onSubmit} // Keep onClick if not using form onSubmit directly
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                className="text-gray-300 cursor-pointer"
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
