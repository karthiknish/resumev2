// Converted to TypeScript - migrated
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Extended Session type
 */
export interface AppSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    isAdmin?: boolean;
    _id?: string;
    id: string;
  };
}

/**
 * Standard API response format
 */
export const ApiResponse = {
  success: (res: NextApiResponse, data: unknown, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  error: (res: NextApiResponse, message = "An error occurred", statusCode = 500, errors: unknown = null) => {
    const response: Record<string, unknown> = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    if (errors) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  },

  created: (res: NextApiResponse, data: unknown, message = "Resource created successfully") => {
    return ApiResponse.success(res, data, message, 201);
  },

  notFound: (res: NextApiResponse, message = "Resource not found") => {
    return ApiResponse.error(res, message, 404);
  },

  badRequest: (res: NextApiResponse, message = "Invalid request", errors: unknown = null) => {
    return ApiResponse.error(res, message, 400, errors);
  },

  unauthorized: (res: NextApiResponse, message = "Authentication required") => {
    return ApiResponse.error(res, message, 401);
  },

  forbidden: (res: NextApiResponse, message = "Access denied") => {
    return ApiResponse.error(res, message, 403);
  },

  methodNotAllowed: (res: NextApiResponse, allowedMethods: string[] = []) => {
    res.setHeader("Allow", allowedMethods);
    return ApiResponse.error(res, `Method not allowed. Allowed: ${allowedMethods.join(", ")}`, 405);
  },

  conflict: (res: NextApiResponse, message = "Resource already exists") => {
    return ApiResponse.error(res, message, 409);
  },

  tooManyRequests: (res: NextApiResponse, message = "Too many requests. Please try again later.") => {
    return ApiResponse.error(res, message, 429);
  },

  serverError: (res: NextApiResponse, message = "Internal server error", error: unknown = null) => {
    // Log the actual error for debugging but don't expose to client
    if (error) {
      console.error("[API Server Error]:", error);
    }
    return ApiResponse.error(res, message, 500);
  },
};

/**
 * Check if user is authenticated admin
 */
export async function isAdminUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as AppSession | null;
    if (!session) return false;
    
    return (
      session?.user?.role === "admin" ||
      session?.user?.isAdmin === true ||
      session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    );
  } catch (error) {
    console.error("[Auth Check Error]:", error);
    return false;
  }
}

/**
 * Require admin authentication result
 */
export type RequireAdminResult = 
  | { authorized: true; session: AppSession; response?: never }
  | { authorized: false; response: () => void; session?: never };

/**
 * Require admin authentication middleware
 */
export async function requireAdmin(req: NextApiRequest, res: NextApiResponse): Promise<RequireAdminResult> {
  const session = await getServerSession(req, res, authOptions) as AppSession | null;
  
  if (!session) {
    return { authorized: false, response: () => ApiResponse.unauthorized(res) };
  }
  
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return { authorized: false, response: () => ApiResponse.forbidden(res, "Admin access required") };
  }
  
  return { authorized: true, session };
}

/**
 * Validate Document ID (Firestore)
 */
export function isValidObjectId(id: string) {
  return typeof id === "string" && id.length > 0;
}

/**
 * Validate required fields
 */
export function validateRequiredFields(body: Record<string, unknown>, requiredFields: string[]) {
  const missing: string[] = [];
  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      missing.push(field);
      errors[field] = `${field} is required`;
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    errors,
    message: missing.length > 0 ? `Missing required fields: ${missing.join(", ")}` : null,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(str: unknown): unknown {
  if (typeof str !== "string") return str;
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Parse pagination parameters
 */
export function parsePagination(query: Partial<Record<string, string | string[]>>, defaults = { page: 1, limit: 10, maxLimit: 100 }) {
  let page = parseInt(Array.isArray(query.page) ? query.page[0] : query.page || "", 10) || defaults.page;
  let limit = parseInt(Array.isArray(query.limit) ? query.limit[0] : query.limit || "", 10) || defaults.limit;

  // Ensure positive values
  page = Math.max(1, page);
  limit = Math.max(1, Math.min(limit, defaults.maxLimit));

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Handle common API errors
 */
export function handleApiError(res: NextApiResponse, error: unknown, context = "API") {
  console.error(`[${context} Error]:`, error);

  const apiError = error as { code?: string; message?: string };

  // Firestore/Firebase errors
  if (apiError.code === "permission-denied") {
    return ApiResponse.forbidden(res, "Permission denied");
  }

  if (apiError.code === "not-found") {
    return ApiResponse.notFound(res, "Resource not found");
  }

  if (apiError.code === "already-exists") {
    return ApiResponse.conflict(res, "Resource already exists");
  }

  // Custom error messages
  if (apiError.message) {
    if (apiError.message.includes("not found")) {
      return ApiResponse.notFound(res, apiError.message);
    }
    if (apiError.message.includes("required") || apiError.message.includes("invalid")) {
      return ApiResponse.badRequest(res, apiError.message);
    }
    if (apiError.message.includes("already exists")) {
      return ApiResponse.conflict(res, apiError.message);
    }
  }

  // Generic server error
  return ApiResponse.serverError(res, "An unexpected error occurred. Please try again later.", error);
}

/**
 * Rate limiting helper (in-memory, for simple use cases)
 * For production, use Redis or a proper rate limiting solution
 */
const rateLimitStore = new Map<string, { requests: number[]; blocked: boolean }>();

export function checkRateLimit(identifier: string, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or initialize the record
  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { requests: [], blocked: false };
    rateLimitStore.set(identifier, record);
  }

  // Clean old requests
  record.requests = record.requests.filter((timestamp) => timestamp > windowStart);

  // Check if rate limited
  if (record.requests.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil(((record.requests[0] || 0) + windowMs - now) / 1000),
    };
  }

  // Add current request
  record.requests.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.requests.length,
    resetTime: Math.ceil(windowMs / 1000),
  };
}

/**
 * Get client IP address
 */
export function getClientIp(req: NextApiRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (forwarded as string).split(",")[0]?.trim() || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
}

/**
 * Wrapper for API handlers with common error handling
 */
export function withErrorHandler(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(res, error);
    }
  };
}

/**
 * Create a method-based API handler
 */
export function createApiHandler(handlers: Record<string, (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    const handler = handlers[method as string];

    if (!handler) {
      return ApiResponse.methodNotAllowed(res, Object.keys(handlers));
    }

    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(res, error, `API ${method}`);
    }
  };
}

export interface ValidationRule {
  required?: boolean;
  message?: string;
  type?: "string" | "number" | "boolean" | "array";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  sanitize?: boolean;
  min?: number;
  max?: number;
  validate?: (value: unknown, body: Record<string, unknown>) => boolean | string;
}

export type ValidationSchema = Record<string, ValidationRule>;

/**
 * Validate request body against a schema
 */
export function validateBody(body: Record<string, unknown>, schema: ValidationSchema) {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, unknown> = {};

  for (const [field, rules] of Object.entries(schema)) {
    let value = body[field];

    // Required check
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors[field] = rules.message || `${field} is required`;
      continue;
    }

    // Skip further validation if not required and empty
    if (!rules.required && (value === undefined || value === null || value === "")) {
      continue;
    }

    // Type validation
    if (rules.type === "string" && typeof value !== "string") {
      errors[field] = `${field} must be a string`;
      continue;
    }

    if (rules.type === "number") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors[field] = `${field} must be a number`;
        continue;
      }
      value = numValue;
    }

    if (rules.type === "boolean") {
      value = value === true || value === "true" || value === 1;
    }

    if (rules.type === "array" && !Array.isArray(value)) {
      errors[field] = `${field} must be an array`;
      continue;
    }

    // String validations
    if (typeof value === "string") {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`;
        continue;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = rules.message || `${field} must be at most ${rules.maxLength} characters`;
        continue;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${field} has invalid format`;
        continue;
      }

      if (rules.email && !isValidEmail(value)) {
        errors[field] = rules.message || `${field} must be a valid email address`;
        continue;
      }

      // Sanitize string if requested
      if (rules.sanitize) {
        value = sanitizeString(value);
      }
    }

    // Number validations
    if (typeof value === "number") {
      if (rules.min !== undefined && value < rules.min) {
        errors[field] = rules.message || `${field} must be at least ${rules.min}`;
        continue;
      }

      if (rules.max !== undefined && value > rules.max) {
        errors[field] = rules.message || `${field} must be at most ${rules.max}`;
        continue;
      }
    }

    // Custom validation
    if (rules.validate && typeof rules.validate === "function") {
      const result = rules.validate(value, body);
      if (result !== true) {
        errors[field] = (result as string) || `${field} is invalid`; // Fixed type cast
        continue;
      }
    }

    sanitized[field] = value;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitized,
  };
}

