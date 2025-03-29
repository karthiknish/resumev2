// src/components/admin/blog-editor/ActionButtons.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function ActionButtons({
  isLoading,
  isSaveDisabled, // Pass combined disabled state
  onSubmit,
  onToggleJsonEditor,
  showJsonEditor,
  submitStatus,
  error, // General form error
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit" // Changed from onClick to type="submit" to work with form onSubmit
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || isSaveDisabled}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          type="button" // Ensure this doesn't submit the form
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onToggleJsonEditor}
        >
          {showJsonEditor ? "Hide JSON Editor" : "Show JSON Editor"}
        </Button>
      </div>
    </>
  );
}

export default ActionButtons;
