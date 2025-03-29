// src/pages/api/gemini.js
import { callGemini } from "@/lib/gemini"; // Import the utility function

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
    const apiKey = process.env.GEMINI_API_KEY; // Still needed for the utility function check

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return res.status(500).json({ error: "API configuration error" });
    }

    // Enhanced Website context information
    const websiteContext = `
You are a friendly and professional AI assistant for Karthik Nishanth's portfolio website (karthiknish.com). Your goal is to help users find information and understand Karthik's services.

**About Karthik Nishanth:**
*   **Role:** Full Stack Developer & Cloud Specialist based in Liverpool, UK.
*   **Expertise:** Modern web development (React, Next.js, Node.js, TypeScript), Cloud platforms (AWS, Azure, Vercel), API development, Database design (MongoDB, PostgreSQL), Web performance optimization, SEO best practices.
*   **Services:** Custom web application development, Cloud architecture & deployment, Technical consulting, API integration, Website performance audits.
*   **Approach:** Focuses on building scalable, maintainable, and high-performance solutions tailored to client needs. Bridges the gap between technical implementation and business goals.

**Website Structure:**
*   **Homepage (/):** Overview of services, skills, and value proposition.
*   **About (/about):** More detailed background on Karthik's experience and philosophy.
*   **Services (/services):** Detailed breakdown of offered services.
*   **Portfolio/Projects (/projects):** Showcases past work with descriptions and links.
*   **Blog (/blog):** Contains technical articles, tutorials, and insights written by Karthik.
*   **Bytes (/bytes):** Short-form updates, news snippets, quick thoughts.
*   **Contact (/contact):** Form and information for getting in touch.
*   **Resources (/resources):** Curated list of useful tools and articles.

**Your Interaction Style:**
*   Be helpful, polite, and professional.
*   Answer questions accurately based *only* on the information provided here about Karthik and the website content.
*   If asked about specific project details not listed, state that detailed case studies are on the portfolio page and offer to link there.
*   If asked for pricing, explain that pricing depends on project scope and encourage the user to get in touch via the contact page for a custom quote.
*   If asked about topics outside Karthik's expertise or the website's scope (e.g., unrelated tech, personal life), politely state that you can only assist with information related to Karthik's professional services and website content.
*   Guide users to relevant pages (e.g., "You can find more details on the /services page.").
*   Keep responses concise but informative.
*   **Strictly avoid making up information not provided here.**
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
      // Add more specific terms if needed
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

      let restrictionMessage = "I'm sorry, but I cannot assist with ";
      const messages = [];
      if (categories.includes("privacy"))
        messages.push("requests for personal information");
      if (categories.includes("financial"))
        messages.push("financial or payment-related questions");
      if (categories.includes("security"))
        messages.push("security-sensitive topics");
      if (categories.includes("off-topic"))
        messages.push(
          "topics unrelated to web development, technology, or Karthik's services"
        );

      restrictionMessage += messages.join(" or ") + ". ";
      restrictionMessage +=
        "I'm here to help with questions about Karthik's services, web development, and technical topics. How else can I assist you today?";

      return res.status(200).json({ response: restrictionMessage });
    }

    // Construct the full prompt including context and history for the utility function
    let fullPrompt = websiteContext + "\n\n**Conversation History:**\n";
    // Format history for the single prompt string
    chatHistory.forEach((msg) => {
      fullPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${
        msg.parts[0].text
      }\n`;
    });
    fullPrompt += `\n**Current User Query:**\nUser: ${prompt}\n\n**Your Response:**\nAssistant:`; // Add the latest user prompt clearly marked

    // Define generation config for the chatbot
    const generationConfig = {
      temperature: 0.7, // Balanced temperature for helpful conversation
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024, // Allow for reasonably detailed answers
    };
    // Note: Safety settings are handled by the Gemini API itself based on project settings,
    // but the utility function doesn't explicitly pass them. Relying on API defaults or errors.

    // Call the utility function
    const responseText = await callGemini(fullPrompt, generationConfig);

    // Return the response to the client
    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error("Error handling Gemini request:", error);
    // Provide a generic error message to the user
    let userErrorMessage =
      "I'm sorry, but I encountered an technical issue and cannot respond right now. Please try again later.";
    // Log the specific error for debugging but don't expose details to the user
    return res
      .status(500)
      .json({ error: userErrorMessage, details: error.message }); // Keep details internal
  }
}
