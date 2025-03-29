// src/pages/api/admin/test-gemini-models.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Import model list directly - Ensure this path is correct
// Note: Adjust path if gemini.js is moved or structure changes
const modelOptions = [
  "gemini-2.5-pro-03-25",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
];

async function testSingleModel(modelName) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      model: modelName,
      status: "error",
      error: "GEMINI_API_KEY not set",
    };
  }

  try {
    const apiVersion = "v1beta"; // Consistent with the fix in gemini.js
    const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent`;
    const testPrompt = "Hello! Respond with just 'OK'.";

    console.log(`Testing Gemini model: ${modelName}`);

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: testPrompt }] }],
        // Minimal config for a simple test
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        },
      }),
      // Add a timeout (e.g., 15 seconds) to prevent hanging indefinitely
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Gemini Test Error (${modelName}): Status ${response.status}`,
        data
      );
      return {
        model: modelName,
        status: "error",
        error:
          data?.error?.message ||
          `API request failed with status ${response.status}`,
        details: data, // Include full error details if available
      };
    }

    // Check if the response structure is valid and contains the expected text
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (
      typeof textResponse === "string" &&
      textResponse.trim().includes("OK")
    ) {
      console.log(`Gemini Test Success (${modelName})`);
      return {
        model: modelName,
        status: "success",
        response: textResponse.trim(),
      };
    } else {
      console.warn(`Gemini Test Unexpected Response (${modelName}):`, data);
      return {
        model: modelName,
        status: "error",
        error: "Unexpected response structure or content",
        details: data,
      };
    }
  } catch (error) {
    console.error(`Gemini Test Exception (${modelName}):`, error);
    let errorMessage = error.message;
    if (error.name === "TimeoutError") {
      errorMessage = "Request timed out after 15 seconds.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown exception occurred.";
    }
    return { model: modelName, status: "error", error: errorMessage };
  }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    // Use POST to trigger the test action
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Starting Gemini model tests...");
    // Run tests in parallel for efficiency
    const testPromises = modelOptions.map((model) => testSingleModel(model));
    const results = await Promise.all(testPromises);
    console.log("Gemini model tests completed.");

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error running Gemini model tests:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
}
