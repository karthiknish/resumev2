// src/lib/exa.ts

import Exa from "exa-js";

/**
 * Exa API client instance
 */
let exaClient: Exa | null = null;

/**
 * Initialize or get the Exa client singleton
 * @returns {Exa} Exa client instance
 * @throws {Error} If EXA_API_KEY is not set
 */
function getExaClient(): Exa {
  if (!process.env.EXA_API_KEY) {
    throw new Error("EXA_API_KEY environment variable is not set.");
  }

  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY);
  }

  return exaClient;
}

/**
 * Search options interface
 */
export interface SearchOptions {
  numResults?: number;
  text?: boolean;
  autocompleted?: boolean;
  type?: "auto" | "keyword" | "neural" | "magic";
  useAutoprompt?: boolean;
  category?: string;
  domain?: string;
  excludeDomain?: string;
  subpages?: number;
  subpageTarget?: number;
}

/**
 * Search result interface
 */
export interface SearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  text?: string;
  id: string;
}

/**
 * Web search response interface
 */
export interface WebSearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
  autopromptString?: string;
}

/**
 * Perform web search using Exa API
 * 
 * @param {string} query - Search query
 * @param {SearchOptions} options - Optional search configuration
 * @returns {Promise<WebSearchResponse>} Search results
 * @throws {Error} If query is invalid or API call fails
 */
export async function webSearch(
  query: string,
  options: SearchOptions = {}
): Promise<WebSearchResponse> {
  // Validate query
  if (!query || typeof query !== "string" || !query.trim() || !/[a-zA-Z0-9]/.test(query)) {
    throw new Error("Search query cannot be empty and must contain alphanumeric characters.");
  }

  try {
    const exa = getExaClient();

    // Set default options
    const searchOptions = {
      numResults: options.numResults || 10,
      text: options.text !== undefined ? options.text : true,
      useAutoprompt: options.useAutoprompt !== undefined ? options.useAutoprompt : true,
      type: options.type || "auto",
      ...options,
    };

    console.log(`[Exa Search] Query: "${query}", Options:`, searchOptions);

    // Perform search using Exa's searchAndContents method
    const response = await exa.searchAndContents(query, searchOptions as unknown as Parameters<Exa["searchAndContents"]>[1]);

    // Transform results to our format
    const results: SearchResult[] = ((response.results as unknown[]) || []).map((result) => {
      // Exa results can have different shapes based on options, so we normalize here
      const res = result as {
        title?: string | null;
        url: string;
        publishedDate?: string;
        author?: string;
        score?: number;
        text?: string;
        id?: string;
      };
      
      return {
        title: res.title || "Untitled",
        url: res.url,
        publishedDate: res.publishedDate,
        author: res.author,
        score: res.score,
        text: res.text,
        id: res.id || res.url,
      };
    });

    console.log(`[Exa Search] Found ${results.length} results`);

    return {
      results,
      query,
      totalResults: results.length,
      autopromptString: (response as { autopromptString?: string }).autopromptString,
    };
  } catch (error) {
    const err = error as Error & { response?: { status: number; data?: { error?: { message: string } } } };
    console.error("[Exa Search Error]:", err);

    // Handle specific Exa API errors
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.error?.message || err.message;

      if (status === 401) {
        throw new Error("Invalid EXA_API_KEY. Please check your environment configuration.");
      }
      if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (status === 400) {
        throw new Error(`Bad request: ${message}`);
      }

      throw new Error(`Exa API error (${status}): ${message}`);
    }

    throw new Error(`Web search failed: ${err.message}`);
  }
}

/**
 * Similar search using Exa API (find similar content to a URL)
 * 
 * @param {string} url - URL to find similar content for
 * @param {SearchOptions} options - Optional search configuration
 * @returns {Promise<WebSearchResponse>} Similar search results
 * @throws {Error} If URL is invalid or API call fails
 */
export async function similarSearch(
  url: string,
  options: SearchOptions = {}
): Promise<WebSearchResponse> {
  // Validate URL
  if (!url || typeof url !== "string" || !url.trim()) {
    throw new Error("URL cannot be empty.");
  }

  const urlRegex = /^https?:\/\/.+/i;
  if (!urlRegex.test(url.trim())) {
    throw new Error("Invalid URL format. URL must start with http:// or https://");
  }

  try {
    const exa = getExaClient();

    // Set default options
    const searchOptions = {
      numResults: options.numResults || 10,
      text: options.text !== undefined ? options.text : true,
      useAutoprompt: false, // Disable autoprompt for similar search
      ...options,
    };

    console.log(`[Exa Similar Search] URL: "${url}", Options:`, searchOptions);

    // Perform similar search using Exa's findSimilarAndContents method
    const response = await exa.findSimilarAndContents(url, searchOptions as unknown as Parameters<Exa["findSimilarAndContents"]>[1]);

    // Transform results to our format
    const results: SearchResult[] = ((response.results as unknown[]) || []).map((result) => {
      // Exa results can have different shapes based on options, so we normalize here
      const res = result as {
        title?: string | null;
        url: string;
        publishedDate?: string;
        author?: string;
        score?: number;
        text?: string;
        id?: string;
      };
      
      return {
        title: res.title || "Untitled",
        url: res.url,
        publishedDate: res.publishedDate,
        author: res.author,
        score: res.score,
        text: res.text,
        id: res.id || res.url,
      };
    });

    console.log(`[Exa Similar Search] Found ${results.length} results`);

    return {
      results,
      query: url,
      totalResults: results.length,
    };
  } catch (error) {
    const err = error as Error & { response?: { status: number; data?: { error?: { message: string } } } };
    console.error("[Exa Similar Search Error]:", err);

    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.error?.message || err.message;

      if (status === 401) {
        throw new Error("Invalid EXA_API_KEY. Please check your environment configuration.");
      }
      if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      throw new Error(`Exa API error (${status}): ${message}`);
    }

    throw new Error(`Similar search failed: ${err.message}`);
  }
}

/**
 * Topic research using Exa API with multiple search strategies
 * 
 * @param {string} topic - Topic to research
 * @param {SearchOptions} options - Optional search configuration
 * @returns {Promise<WebSearchResponse>} Research results
 */
export async function topicResearch(
  topic: string,
  options: SearchOptions = {}
): Promise<WebSearchResponse> {
  try {
    // Perform enhanced search with neural type for topic research
    const researchOptions: SearchOptions = {
      type: "neural",
      numResults: options.numResults || 15,
      text: true,
      useAutoprompt: true,
      ...options,
    };

    const results = await webSearch(topic, researchOptions);

    console.log(`[Topic Research] Completed for topic: "${topic}"`);

    return results;
  } catch (error) {
    const err = error as Error;
    console.error("[Topic Research Error]:", err);
    throw new Error(`Topic research failed: ${err.message}`);
  }
}
