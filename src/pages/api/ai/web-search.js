// src/pages/api/ai/web-search.js

import { webSearch, similarSearch, topicResearch } from "@/lib/exa";
import { ApiResponse, checkRateLimit, getClientIp } from "@/lib/apiUtils";
import logger from "@/utils/logger";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["GET", "POST"]);
  }

  try {
    const { query, url, type, numResults, searchType } = req.body || req.query;

    // Get client IP for rate limiting
    const clientIp = getClientIp(req);

    // Check rate limit (10 requests per minute per IP)
    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000);
    if (!rateLimitCheck.allowed) {
      logger.warn("Web Search", `Rate limit exceeded for IP: ${clientIp}`);
      return ApiResponse.tooManyRequests(
        res,
        `Rate limit exceeded. Try again in ${rateLimitCheck.resetTime} seconds.`
      );
    }

    // Validate required parameters
    if (!query && !url) {
      return ApiResponse.badRequest(res, "Either 'query' or 'url' parameter is required.");
    }

    // Prepare search options
    const searchOptions = {
      numResults: numResults ? parseInt(numResults, 10) : 10,
      text: true,
      type: type || "auto",
    };

    let result;
    let searchAction;

    // Determine search type and execute accordingly
    if (url) {
      // Similar search based on URL
      if (!url.match(/^https?:\/\/.+/i)) {
        return ApiResponse.badRequest(res, "Invalid URL format. URL must start with http:// or https://");
      }
      searchAction = "similar search";
      result = await similarSearch(url, searchOptions);
    } else if (searchType === "topic" || searchType === "research") {
      // Topic research
      searchAction = "topic research";
      result = await topicResearch(query, searchOptions);
    } else {
      // Regular web search
      searchAction = "web search";
      result = await webSearch(query, searchOptions);
    }

    logger.info(
      "Web Search",
      `Successful ${searchAction} for query/url: "${query || url}" by IP: ${clientIp}`
    );

    return ApiResponse.success(res, result, "Search completed successfully");
  } catch (error) {
    logger.error("Web Search", `API error: ${error.message}`, { stack: error.stack });

    // Handle specific error cases
    if (error.message.includes("EXA_API_KEY")) {
      return ApiResponse.serverError(
        res,
        "Search service configuration error. Please contact administrator."
      );
    }

    if (error.message.includes("Rate limit")) {
      return ApiResponse.tooManyRequests(res, error.message);
    }

    if (error.message.includes("invalid") || error.message.includes("Invalid")) {
      return ApiResponse.badRequest(res, error.message);
    }

    return ApiResponse.serverError(
      res,
      "An error occurred while performing the search. Please try again later."
    );
  }
}
