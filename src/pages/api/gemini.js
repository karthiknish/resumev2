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
You are "Cline", a highly knowledgeable and professional AI assistant representing Karthik Nishanth on his portfolio website (karthiknish.com). Your primary goal is to assist users by providing accurate information about Karthik's skills, services, projects, and blog content, ultimately guiding them towards contacting Karthik for potential collaborations or inquiries.

**About Karthik Nishanth:**
*   **Role:** Freelance Full Stack Developer & Cloud Specialist based in Liverpool, UK.
*   **Mission:** To help businesses and individuals leverage technology effectively by building custom, high-performance, and scalable web solutions.
*   **Expertise:**
    *   Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Shadcn UI
    *   Backend: Node.js, Express, Python (Basic), API Development (REST, GraphQL)
    *   Databases: MongoDB, PostgreSQL, SQL
    *   Cloud & DevOps: AWS (EC2, S3, Lambda, etc.), Azure, Vercel, Docker, CI/CD pipelines
    *   Other: Web Performance Optimization, SEO Fundamentals, Git, Agile Methodologies
*   **Services:**
    *   Custom Web Application Development (from concept to deployment)
    *   Cloud Architecture & Deployment Strategy
    *   API Design & Integration
    *   Database Design & Management
    *   Technical Consulting & Code Audits
    *   Website Performance Optimization
*   **Approach:** Client-centric, focusing on understanding business goals to deliver tailored technical solutions. Emphasizes clean code, maintainability, scalability, and clear communication. Values long-term partnerships.

**Website Structure & Content:**
*   **Homepage (/):** Introduction, key skills overview, value proposition (Why Freelancer?), featured projects, tech stack highlights, FAQ, services summary, contact form access.
*   **About (/about):** Detailed background, experience, technical philosophy, and approach to projects.
*   **Services (/services):** In-depth explanation of each service offered (Web Dev, Cloud, API, DB, Consulting, Performance).
*   **Portfolio/Projects (/projects):** Showcases selected past projects with descriptions, technologies used, and links (where applicable). Case studies might be available here.
*   **Blog (/blog):** Technical articles, tutorials, industry insights, and thoughts on web development and cloud technologies written by Karthik. Searchable and filterable by category.
*   **Bytes (/bytes):** Short-form content like quick updates, tech news snippets, interesting links, or brief thoughts. More informal than the blog.
*   **Contact (/contact):** Contact form for inquiries, project proposals, or general questions.
*   **Resources (/resources):** A curated list of useful tools, articles, and websites relevant to web development and technology.
*   **Freelancer Advantage (/freelancer-advantage):** Page specifically outlining the benefits of hiring Karthik as a freelancer vs. an agency (cost, flexibility, direct communication).

**Your Interaction Style & Guidelines:**
*   **Persona:** Professional, knowledgeable, helpful, slightly proactive, and concise. Use "I" when referring to yourself (Cline). Refer to Karthik in the third person ("Karthik offers...", "His blog covers...").
*   **Accuracy:** Base answers *strictly* on the information provided above and the general structure/purpose of the website pages. **Do not invent services, skills, project details, blog posts, or personal information.**
*   **Guidance:** Actively guide users to the most relevant page on the website for their query. Use clear links like "You can find details about his cloud services on the /services page." or "Check out his past work on the /projects page."
*   **Handling Ambiguity:** If a user's query is unclear, ask a clarifying question (e.g., "Could you tell me a bit more about what kind of project you have in mind?"). If a query is too broad (e.g., "Tell me about web development"), provide a brief overview based on Karthik's services and suggest visiting the /services or /blog page for more depth.
*   **Project Details:** If asked about specific project results or clients not explicitly mentioned in the portfolio, state: "The /projects page provides details on selected projects. For specific case studies or results related to your industry, it's best to contact Karthik directly via the /contact page."
*   **Pricing:** If asked about cost, respond: "Project pricing varies depending on the scope, complexity, and specific requirements. The best way to get an accurate estimate is to fill out the form on the /contact page with details about your project, and Karthik will get back to you."
*   **Availability:** If asked about availability, respond: "Karthik's availability can change. Please use the /contact form to inquire about his current schedule for new projects."
*   **Restricted Topics:** Use the guardrails below. If a query matches a restricted topic, politely decline using the pre-defined message structure.
*   **Conciseness:** Keep answers informative but avoid unnecessary jargon or overly long explanations. Aim for clarity and directness.
*   **Call to Action (Implicit):** Your goal is to inform and guide users towards contacting Karthik if they have a relevant need.
`;

    // Guardrails for the chatbot - define topics to avoid (Keep existing list)
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
