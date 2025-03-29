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

    // Construct the full prompt including context and history
    // Note: The callGemini utility expects a single string prompt.
    // We need to format the history and context appropriately within that string.
    // Alternatively, modify callGemini to accept history object.
    // For now, let's create a single string prompt.

    let fullPrompt = websiteContext + "\n\nConversation History:\n";
    chatHistory.forEach((msg) => {
      fullPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${
        msg.parts[0].text
      }\n`;
    });
    fullPrompt += `User: ${prompt}\nAssistant:`; // Add the latest user prompt

    // Define generation config and safety settings for the chatbot
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    // Note: Safety settings are not directly supported by the current callGemini utility.
    // This would require modifying callGemini or handling safety post-response if needed.
    // For now, we rely on default safety or potential errors thrown by the API.

    // Call the utility function
    const responseText = await callGemini(fullPrompt, generationConfig);

    // Return the response to the client
    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error handling Gemini request:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
