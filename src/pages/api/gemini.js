// src/pages/api/gemini.js
// This file creates an API endpoint that forwards requests to Google's Gemini API

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, chatHistory = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return res.status(500).json({ error: "API configuration error" });
    }

    // Website context information to help the AI understand the site
    const websiteContext = `
You are a helpful assistant for Karthik Nishanth's portfolio website. Here's important information about Karthik and the website:

ABOUT KARTHIK:
- Karthik Nishanth is a Full Stack Developer and Cloud Specialist based in the UK
- He specializes in React, Node.js, Next.js, TypeScript, and cloud technologies
- He has extensive experience in building modern web applications and cloud solutions
- He offers web development services, consultations, and technical expertise

WEBSITE SECTIONS:
- Portfolio: Showcases Karthik's development projects and case studies
- Services: Web development, cloud solutions, technical consultations
- Blog: Technical articles and insights on modern web technologies
- Contact: Ways to reach out for collaboration or inquiries

ACCEPTABLE TOPICS TO DISCUSS:
- Questions about Karthik's professional background and skills
- Inquiries about his web development services and pricing
- Technical questions related to web development, cloud computing, and programming
- Information about contacting Karthik or working with him
- Details about his portfolio projects and case studies
- Questions about website functionality or navigation

YOUR ROLE:
- Provide helpful, accurate information about Karthik and his services
- Be friendly and professional in your responses
- Direct users to the appropriate sections of the website when relevant
- Assist users in connecting with Karthik for potential collaborations
`;

    // Guardrails for the chatbot - define topics to avoid
    const restrictedTopics = [
      { term: "personal information", category: "privacy" },
      { term: "address", category: "privacy" },
      { term: "phone number", category: "privacy" },
      { term: "credit card", category: "financial" },
      { term: "payment details", category: "financial" },
      { term: "bank account", category: "financial" },
      { term: "political", category: "off-topic" },
      { term: "religion", category: "off-topic" },
      { term: "dating", category: "off-topic" },
      { term: "medical", category: "off-topic" },
      { term: "health advice", category: "off-topic" },
      { term: "investment", category: "financial" },
      { term: "crypto", category: "financial" },
      { term: "gambling", category: "off-topic" },
      { term: "hacking", category: "security" },
      { term: "password", category: "security" },
      { term: "illegal", category: "security" },
    ];

    // Check if the prompt contains restricted topics
    const lowercasePrompt = prompt.toLowerCase();
    const matchedRestrictions = restrictedTopics.filter((topic) =>
      lowercasePrompt.includes(topic.term)
    );

    // If restricted topics found, return appropriate response without querying Gemini
    if (matchedRestrictions.length > 0) {
      const categories = [
        ...new Set(matchedRestrictions.map((r) => r.category)),
      ];

      let restrictionMessage = "I'm sorry, but I can't assist with ";

      if (categories.includes("privacy")) {
        restrictionMessage += "requests for personal information. ";
      }
      if (categories.includes("financial")) {
        restrictionMessage += "financial or payment-related questions. ";
      }
      if (categories.includes("security")) {
        restrictionMessage += "security-sensitive topics. ";
      }
      if (categories.includes("off-topic")) {
        restrictionMessage +=
          "topics unrelated to web development, technology, or Karthik's services. ";
      }

      restrictionMessage +=
        "I'm here to help with questions about Karthik's services, web development, and technical topics. How else can I assist you today?";

      return res.status(200).json({ response: restrictionMessage });
    }

    // List of models to try in order of preference
    const modelOptions = [
      "gemini-2.0-flash", // Next generation model (PRIMARY)
      "gemini-2.0-flash-lite", // Cost efficient 2.0 model
      "gemini-1.5-pro", // More capable for complex reasoning
      "gemini-1.5-flash", // Fast and versatile
      "gemini-1.5-flash-8b", // Optimized for high volume tasks
      "gemini-1.0-pro", // Original model (fallback)
    ];

    // Try models in sequence until one works
    let responseText = null;
    let lastError = null;

    for (const model of modelOptions) {
      try {
        // Use v1 endpoint for all models
        const apiVersion = model.startsWith("gemini-2.0") ? "v1beta" : "v1";
        const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;

        // Prepend the system context to the request
        const completeHistory =
          chatHistory.length > 0
            ? [
                { role: "model", parts: [{ text: websiteContext }] },
                ...chatHistory,
              ]
            : [];

        // Structure the request body according to Gemini API specifications
        const requestBody = {
          contents: [
            ...completeHistory,
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
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
            responseText = data.candidates[0].content.parts[0].text;
            console.log(`Successfully used model: ${model}`);
            break; // Exit the loop if we got a valid response
          } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            // Handle safety blocks
            responseText = `I'm sorry, I cannot provide a response to that query due to safety concerns.`;
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
    if (!responseText) {
      if (lastError) {
        console.error("All Gemini models failed:", lastError);
        return res.status(500).json({
          error: "Error from Gemini API",
          details: lastError,
        });
      } else {
        responseText = `I'm sorry, I couldn't generate a response. Please try rephrasing your question.`;
      }
    }

    // Return the response to the client
    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error handling Gemini request:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
