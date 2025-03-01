// src/pages/api/ai/blog-summarize.js
// API endpoint to summarize a blog post using Gemini AI

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Blog content is required" });
    }

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return res.status(500).json({ error: "API configuration error" });
    }

    // Create a prompt for blog summarization
    const summarizationPrompt = `
Please create a concise summary of the following blog post titled "${
      title || "Blog Post"
    }". 
The summary should:
1. Be approximately 150-200 words
2. Capture the main points and key takeaways
3. Be suitable for reading aloud as audio content
4. Use simple, clear language that works well for speech

Here is the blog content to summarize:
${content}
`;

    // Use Gemini-2.0-flash as primary model with fallbacks
    const modelOptions = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
    ];

    // Try models in sequence until one works
    let summaryText = null;
    let lastError = null;

    for (const model of modelOptions) {
      try {
        // Use appropriate API version for the model
        const apiVersion = model.startsWith("gemini-2.0") ? "v1beta" : "v1";
        const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;

        // Structure the request body according to Gemini API specifications
        const requestBody = {
          contents: [
            {
              role: "user",
              parts: [{ text: summarizationPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more factual output
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        };

        // Send request to Gemini API
        const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        // Parse the response
        const data = await response.json();

        // Check if response was successful
        if (response.ok) {
          // Extract text from response
          if (
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0
          ) {
            summaryText = data.candidates[0].content.parts[0].text;
            console.log(`Successfully generated summary using model: ${model}`);
            break; // Exit the loop if we got a valid response
          } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            // Handle safety blocks
            summaryText = `Unable to summarize this content due to content policy restrictions.`;
            break;
          }
        } else {
          // Log the error and try the next model
          console.warn(`Error with model ${model}:`, data);
          lastError = data;
        }
      } catch (error) {
        console.warn(`Exception with model ${model}:`, error);
        lastError = error;
      }
    }

    // If we didn't get a valid response from any model
    if (!summaryText) {
      if (lastError) {
        console.error("All Gemini models failed:", lastError);
        return res.status(500).json({
          error: "Error generating summary",
          details: lastError,
        });
      } else {
        summaryText = `Unable to generate a summary for this blog post. Please try again later.`;
      }
    }

    // Return the summary to the client
    return res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("Error handling blog summarization:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
