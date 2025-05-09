// src/lib/gemini.js

// List of models to try in order of preference/capability
const modelOptions = [
  "gemini-2.5-pro-exp-03-25",
  "gemini-2.0-flash", // Add newer models when available and tested

  "gemini-1.5-pro", // More capable model
  "gemini-1.5-flash", // Faster model
  "gemini-1.0-pro", // Older pro model
];

/**
 * Calls the Google Gemini API with a given prompt, trying multiple models sequentially.
 *
 * @param {string} prompt - The prompt to send to the Gemini API.
 * @param {object} [generationConfigOverride] - Optional generation config overrides.
 * @returns {Promise<string>} - The generated text content.
 * @throws {Error} - Throws an error if all models fail or the response structure is invalid.
 */
export async function callGemini(prompt, generationConfigOverride = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  // Robust check: ensure prompt is a non-empty string and contains at least one alphanumeric character after trimming
  if (
    !prompt ||
    typeof prompt !== "string" ||
    !prompt.trim() ||
    !/[a-zA-Z0-9]/.test(prompt) // Check for at least one letter or number
  ) {
    throw new Error(
      "Prompt cannot be empty and must contain alphanumeric characters."
    );
  }

  let lastError = null;

  for (const model of modelOptions) {
    try {
      // Use v1beta endpoint for all current models in the list
      const apiVersion = "v1beta";
      const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;

      console.log(
        `Attempting Gemini call with model: ${model} via ${apiVersion} API`
      ); // Log model being tried

      // Default generation config - merge with overrides
      const generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        ...generationConfigOverride, // Apply overrides
      };

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `Gemini API Error (${model}): Status ${response.status}`,
          data
        );
        lastError = new Error(
          data?.error?.message ||
            `Gemini API request failed for model ${model} with status ${response.status}`
        );
        continue; // Try the next model
      }

      // Check for valid response structure
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        typeof data.candidates[0].content.parts[0].text === "string"
      ) {
        console.log(`Successfully generated content with model: ${model}`);
        return data.candidates[0].content.parts[0].text.trim(); // Return successful result
      } else {
        console.error(
          `Unexpected Gemini API response structure (${model}):`,
          data
        );
        lastError = new Error(
          `Invalid response structure from AI model ${model}.`
        );
        // Log the problematic data structure when text is missing/invalid
        console.error(
          `Problematic Gemini Response Data (${model}):`,
          JSON.stringify(data, null, 2)
        );
        // Continue to next model, maybe it was a temporary issue or model specific format change
      }
    } catch (error) {
      console.error(`Error calling Gemini model ${model}:`, error);
      lastError = error; // Store the error and try the next model
    }
  }

  // If loop finishes without returning, all models failed
  throw lastError || new Error("All Gemini models failed to generate content.");
}
