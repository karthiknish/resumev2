// src/components/admin/tabs/ApiStatusTab.js
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DatabaseZap, // Keep for Gemini
  Image as ImageIcon,
  Mic2,
  Database, // Icon for MongoDB
} from "lucide-react";

// Structure to hold results for each service
const initialApiStatus = {
  mongodb: { loading: false, result: null, error: null },
  gemini: { loading: false, results: [], error: null },
  pexels: { loading: false, result: null, error: null },
  // elevenlabs: { loading: false, result: null, error: null }, // Removed ElevenLabs
};

function ApiStatusTab() {
  const [apiStatus, setApiStatus] = useState(initialApiStatus);
  const [isLoading, setIsLoading] = useState(false); // Overall loading state for the button

  const testApi = useCallback(async (endpoint, serviceKey) => {
    setApiStatus((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        loading: true,
        error: null,
        result: null,
        results: serviceKey === "gemini" ? [] : undefined,
      },
    }));
    try {
      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json(); // Assuming all test endpoints return JSON

      if (!response.ok && !data.success) {
        // Handle non-200 or success=false responses gracefully
        throw new Error(
          data.error ||
            data.message ||
            `API test failed with status ${response.status}`
        );
      }

      // Update state based on service
      if (serviceKey === "gemini") {
        setApiStatus((prev) => ({
          ...prev,
          [serviceKey]: {
            loading: false,
            results: data.results || [],
            error: data.success ? null : "Received non-success response",
          },
        }));
      } else {
        setApiStatus((prev) => ({
          ...prev,
          [serviceKey]: {
            loading: false,
            result: data,
            error: data.success ? null : data.error || "Test failed",
          },
        }));
      }
    } catch (e) {
      console.error(`Error testing ${serviceKey} API:`, e);
      setApiStatus((prev) => ({
        ...prev,
        [serviceKey]: {
          ...prev[serviceKey],
          loading: false,
          error: e.message || `Failed to test ${serviceKey}`,
        },
      }));
    }
  }, []);

  const handleRunAllTests = useCallback(async () => {
    setIsLoading(true);
    setApiStatus(initialApiStatus); // Reset status before running tests

    // Run tests sequentially or in parallel
    await Promise.all([
      testApi("/api/admin/test-mongodb", "mongodb"),
      testApi("/api/admin/test-gemini-models", "gemini"),
      testApi("/api/admin/test-pexels", "pexels"),
      // testApi("/api/admin/test-elevenlabs", "elevenlabs"), // Removed ElevenLabs test call
    ]);

    setIsLoading(false);
  }, [testApi]);

  // Helper to render status icon and text
  const renderStatus = (statusData, serviceKey) => {
    // Added serviceKey parameter
    if (statusData.loading) {
      return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
    }
    if (statusData.error) {
      return (
        <div
          className="flex items-center text-red-400"
          title={statusData.error}
        >
          <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="text-sm truncate">Error: {statusData.error}</span>
        </div>
      );
    }
    if (statusData.result?.success === false) {
      // Handle explicit failure from API
      return (
        <div
          className="flex items-center text-red-400"
          title={statusData.result.error}
        >
          <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="text-sm truncate">
            Failed: {statusData.result.error}
          </span>
        </div>
      );
    }
    if (
      statusData.result?.success === true ||
      (statusData.results &&
        statusData.results.every((r) => r.status === "success"))
    ) {
      return (
        <div className="flex items-center text-green-400">
          <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="text-sm">Success</span>
        </div>
      );
    }
    // Handle Gemini partial success/failure
    if (serviceKey === "gemini" && statusData.results?.length > 0) {
      const failedModels = statusData.results.filter(
        (r) => r.status !== "success"
      );
      if (failedModels.length > 0) {
        return (
          <div
            className="flex items-center text-yellow-400"
            title={`Models failed: ${failedModels
              .map((m) => m.model)
              .join(", ")}`}
          >
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
            <span className="text-sm">Partial Success</span>
          </div>
        );
      }
      // If no failures and some results, it's a success (covered above)
    }

    return <span className="text-sm text-gray-500">-</span>; // Default/initial state
  };

  // Helper to render Gemini specific results
  const renderGeminiResults = (geminiStatus) => {
    if (
      geminiStatus.loading ||
      !geminiStatus.results ||
      geminiStatus.results.length === 0
    )
      return null;

    return (
      <ul className="mt-2 space-y-1 pl-6 text-xs list-disc list-inside">
        {geminiStatus.results.map((result) => (
          <li
            key={result.model}
            className={`flex items-center ${
              result.status === "success" ? "text-green-300" : "text-red-300"
            }`}
          >
            {result.status === "success" ? (
              <CheckCircle className="h-3 w-3 mr-1.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-3 w-3 mr-1.5 flex-shrink-0" />
            )}
            <span className="font-medium mr-1">{result.model}:</span>
            <span
              className="truncate"
              title={result.status === "error" ? result.error : "OK"}
            >
              {result.status === "success" ? "OK" : `Error - ${result.error}`}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">
        API Service Status
      </h2>
      <p className="text-gray-400 mb-6">
        Click the button below to run simple tests against configured external
        APIs (Gemini, Pexels, ElevenLabs) to check their status and key
        validity.
      </p>

      <Button
        onClick={handleRunAllTests}
        disabled={isLoading}
        className="mb-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running Tests...
          </>
        ) : (
          "Run All API Tests"
        )}
      </Button>

      {/* Results Section */}
      <div className="space-y-4">
        {/* MongoDB */}
        <div className="p-4 rounded-md border border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-400" />{" "}
              {/* MongoDB Icon */}
              <span className="font-semibold text-gray-100">
                MongoDB Connection
              </span>
            </div>
            {renderStatus(apiStatus.mongodb, "mongodb")}
          </div>
          {/* Optionally display specific success/error message */}
          {apiStatus.mongodb.result?.message && !apiStatus.mongodb.error && (
            <p className="mt-1 pl-7 text-xs text-gray-400">
              {apiStatus.mongodb.result.message}
            </p>
          )}
          {apiStatus.mongodb.error && (
            <p className="mt-1 pl-7 text-xs text-red-400">
              {apiStatus.mongodb.error}
            </p>
          )}
        </div>

        {/* Gemini */}
        <div className="p-4 rounded-md border border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DatabaseZap className="h-5 w-5 text-purple-400" />
              <span className="font-semibold text-gray-100">
                Google Gemini Models
              </span>
            </div>
            {renderStatus(apiStatus.gemini, "gemini")} {/* Pass serviceKey */}
          </div>
          {renderGeminiResults(apiStatus.gemini)}
        </div>

        {/* Pexels */}
        <div className="p-4 rounded-md border border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-gray-100">Pexels API</span>
            </div>
            {renderStatus(apiStatus.pexels, "pexels")} {/* Pass serviceKey */}
          </div>
        </div>

        {/* ElevenLabs - REMOVED */}
      </div>
    </div>
  );
}

export default ApiStatusTab;
