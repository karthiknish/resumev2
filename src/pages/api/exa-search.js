// src/pages/api/exa-search.js
// API endpoint for Exa Websets people search

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.EXA_API_KEY;

  if (!apiKey) {
    console.error("EXA_API_KEY is not defined in environment variables");
    return res.status(500).json({ error: "API configuration error" });
  }

  try {
    const { query, count = 10 } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Use Exa's search endpoint with neural search for finding people
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query: query,
        type: "neural",
        useAutoprompt: true,
        numResults: Math.min(count, 20),
        contents: {
          text: true,
          highlights: true,
        },
        // Focus on LinkedIn for professional profiles
        includeDomains: [
          "linkedin.com",
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Exa API error:", response.status, errorData);
      return res.status(response.status).json({
        error: "Search service error",
        details: errorData.message || "Failed to fetch results",
      });
    }

    const data = await response.json();

    // Transform results to extract person-like information
    const results = (data.results || []).map((result) => {
      // Extract name from title or URL
      const title = result.title || "";
      const url = result.url || "";
      
      // Try to extract name from LinkedIn URL pattern
      let name = title;
      let role = "";
      let company = "";
      
      // Parse LinkedIn patterns like "Name - Title at Company | LinkedIn"
      if (url.includes("linkedin.com")) {
        const linkedInMatch = title.match(/^([^-|]+)(?:\s*[-–]\s*([^|]+))?/);
        if (linkedInMatch) {
          name = linkedInMatch[1]?.trim() || title;
          const roleCompany = linkedInMatch[2]?.trim() || "";
          
          // Try to split "Title at Company" pattern
          const atMatch = roleCompany.match(/(.+?)\s+at\s+(.+)/i);
          if (atMatch) {
            role = atMatch[1]?.trim() || "";
            company = atMatch[2]?.trim() || "";
          } else {
            role = roleCompany;
          }
        }
      }

      return {
        id: result.id || Math.random().toString(36).substr(2, 9),
        name: name.replace(/\s*\|\s*LinkedIn.*$/i, "").trim(),
        role: role,
        company: company,
        url: url,
        text: result.text?.substring(0, 300) || "",
        highlights: result.highlights || [],
        score: result.score || 0,
        source: url.includes("linkedin.com")
          ? "LinkedIn"
          : url.includes("github.com")
          ? "GitHub"
          : url.includes("twitter.com")
          ? "Twitter"
          : "Web",
      };
    });

    return res.status(200).json({
      results,
      totalResults: results.length,
      query: query,
    });
  } catch (error) {
    console.error("Error handling Exa search request:", error);
    return res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
}
