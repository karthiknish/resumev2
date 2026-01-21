import { NextApiRequest, NextApiResponse } from "next";

interface ExaSearchRequest {
  query: string;
  count?: number;
}

interface SearchResult {
  id: string;
  name: string;
  role: string;
  company: string;
  url: string;
  text: string;
  highlights: string[];
  score: number;
  source: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.EXA_API_KEY;

  if (!apiKey) {
    console.error("EXA_API_KEY is not defined in environment variables");
    return res.status(500).json({ error: "API configuration error" });
  }

  try {
    const { query, count = 10 } = req.body as ExaSearchRequest;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        type: "neural",
        useAutoprompt: true,
        numResults: Math.min(count, 20),
        contents: {
          text: true,
          highlights: true,
        },
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

    const results: SearchResult[] = (data.results || []).map((result: any) => {
      const title = result.title || "";
      const url = result.url || "";

      let name = title;
      let role = "";
      let company = "";

      if (url.includes("linkedin.com")) {
        const linkedInMatch = title.match(/^([^-|]+)(?:\s*[-–]\s*([^|]+)?)/);
        if (linkedInMatch) {
          name = linkedInMatch[1]?.trim() || title;
          const roleCompany = linkedInMatch[2]?.trim() || "";

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
        id: result.id || Math.random().toString(36).substring(2, 11),
        name: name.replace(/\s*\|\s*LinkedIn.*$/i, "").trim(),
        role,
        company,
        url,
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
      query,
    });
  } catch (error) {
    console.error("Error handling Exa search request:", error);
    return res.status(500).json({
      error: "An unexpected error occurred",
      details: (error as Error).message,
    });
  }
}
