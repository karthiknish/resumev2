const modelOptions = ["gemini-3-flash-preview"];

interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export async function callGemini(prompt: string, generationConfigOverride: GenerationConfig = {}): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  if (
    !prompt ||
    typeof prompt !== "string" ||
    !prompt.trim() ||
    !/[a-zA-Z0-9]/.test(prompt)
  ) {
    throw new Error(
      "Prompt cannot be empty and must contain alphanumeric characters."
    );
  }

  let lastError: Error | null = null;

  for (const model of modelOptions) {
    try {
      const apiVersion = "v1beta";
      const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;

      console.log(
        `Attempting Gemini call with model: ${model} via ${apiVersion} API`
      );

      const generationConfig: GenerationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        ...generationConfigOverride,
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
        continue;
      }

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        typeof data.candidates[0].content.parts[0].text === "string"
      ) {
        console.log(`Successfully generated content with model: ${model}`);
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        console.error(
          `Unexpected Gemini API response structure (${model}):`,
          data
        );
        lastError = new Error(
          `Invalid response structure from AI model ${model}.`
        );
        console.error(
          `Problematic Gemini Response Data (${model}):`,
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      console.error(`Error calling Gemini model ${model}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content.");
}
