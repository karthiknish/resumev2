import { NextApiRequest, NextApiResponse } from "next";
import { webSearch, similarSearch, topicResearch } from "@/lib/exa";
import { ApiResponse, checkRateLimit, getClientIp } from "@/lib/apiUtils";
import logger from "@/utils/logger";

interface WebSearchRequest {
  query?: string;
  url?: string;
  type?: string;
  numResults?: number;
  searchType?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET" && req.method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["GET", "POST"]);
  }

  try {
    const { query, url, type, numResults, searchType } = (req.body || req.query) as WebSearchRequest;

    const clientIp = getClientIp(req);

    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000);
    if (!rateLimitCheck.allowed) {
      logger.warn("Web Search", `Rate limit exceeded for IP: ${clientIp}`);
      return ApiResponse.tooManyRequests(
        res,
        `Rate limit exceeded. Try again in ${rateLimitCheck.resetTime} seconds.`
      );
    }

    if (!query && !url) {
      return ApiResponse.badRequest(res, "Either 'query' or 'url' parameter is required.");
    }

    const searchOptions = {
      numResults: numResults ? parseInt(numResults.toString(), 10) : 10,
      text: true,
      type: type || "auto",
    };

    let result: any;
    let searchAction: string;

    if (url) {
      if (!url.match(/^https?:\/\/.+/i)) {
        return ApiResponse.badRequest(res, "Invalid URL format. URL must start with http:// or https://");
      }
      searchAction = "similar search";
      result = await similarSearch(url, searchOptions);
    } else if (searchType === "topic" || searchType === "research") {
      searchAction = "topic research";
      result = await topicResearch(query, searchOptions);
    } else {
      searchAction = "web search";
      result = await webSearch(query, searchOptions);
    }

    logger.info(
      "Web Search",
      `Successful ${searchAction} for query/url: "${query || url}" by IP: ${clientIp}`
    );

    return ApiResponse.success(res, result, "Search completed successfully");
  } catch (error) {
    logger.error("Web Search", `API error: ${(error as Error).message}`, { stack: (error as Error).stack });

    if ((error as Error).message.includes("EXA_API_KEY")) {
      return ApiResponse.serverError(
        res,
        "Search service configuration error. Please contact administrator."
      );
    }

    if ((error as Error).message.includes("Rate limit")) {
      return ApiResponse.tooManyRequests(res, (error as Error).message);
    }

    if ((error as Error).message.includes("invalid") || (error as Error).message.includes("Invalid")) {
      return ApiResponse.badRequest(res, (error as Error).message);
    }

    return ApiResponse.serverError(
      res,
      "An error occurred while performing search. Please try again later."
    );
  }
}
