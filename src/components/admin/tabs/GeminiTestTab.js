// src/components/admin/tabs/GeminiTestTab.js
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"; // Icons

function GeminiTestTab() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTestModels = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    try {
      const response = await fetch("/api/admin/test-gemini-models", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse JSON error
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        throw new Error("Invalid response format from API.");
      }
    } catch (e) {
      console.error("Error testing Gemini models:", e);
      setError(`Failed to test models: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">
        Gemini Model Status Test
      </h2>
      <p className="text-gray-400 mb-6">
        Click the button below to run a quick test against each configured
        Gemini model to check its availability and basic responsiveness. This
        sends a simple prompt ("Hello! Respond with just 'OK'.") to each model.
      </p>

      <Button
        onClick={handleTestModels}
        disabled={isLoading}
        className="mb-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          "Run Model Tests"
        )}
      </Button>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-md text-red-200 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-medium mb-3 text-gray-200">
            Test Results:
          </h3>
          <ul className="space-y-3">
            {results.map((result) => (
              <li
                key={result.model}
                className={`p-4 rounded-md border ${
                  result.status === "success"
                    ? "bg-green-900 border-green-700"
                    : "bg-red-900 border-red-700"
                } flex items-start justify-between`}
              >
                <div className="flex items-center">
                  {result.status === "success" ? (
                    <CheckCircle className="mr-3 h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="mr-3 h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                  {/* Added min-w-0 to allow text wrapping in flex child */}
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-100 break-words">
                      {" "}
                      {/* Added break-words */}
                      {result.model}
                    </span>
                    {result.status === "error" && (
                      <p className="text-sm text-red-300 mt-1 break-words">
                        {" "}
                        {/* Added break-words */}
                        Error: {result.error}
                        {result.details && ( // Optionally show more details if available
                          <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto break-all max-h-40">
                            {" "}
                            {/* Added break-all for pre, max-h */}
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </p>
                    )}
                    {result.status === "success" && result.response && (
                      <p className="text-sm text-green-300 mt-1 break-words">
                        {" "}
                        {/* Added break-words */}
                        Response: "{result.response}"
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    result.status === "success"
                      ? "bg-green-700 text-green-100"
                      : "bg-red-700 text-red-100"
                  }`}
                >
                  {result.status === "success" ? "Success" : "Failed"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GeminiTestTab;
