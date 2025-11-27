import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import mongoose from "mongoose";

/**
 * Standard API response format
 */
export const ApiResponse = {
  success: (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  error: (res, message = "An error occurred", statusCode = 500, errors = null) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
    if (errors) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  },

  created: (res, data, message = "Resource created successfully") => {
    return ApiResponse.success(res, data, message, 201);
  },

  notFound: (res, message = "Resource not found") => {
    return ApiResponse.error(res, message, 404);
  },

  badRequest: (res, message = "Invalid request", errors = null) => {
    return ApiResponse.error(res, message, 400, errors);
  },

  unauthorized: (res, message = "Authentication required") => {
    return ApiResponse.error(res, message, 401);
  },

  forbidden: (res, message = "Access denied") => {
    return ApiResponse.error(res, message, 403);
  },

  methodNotAllowed: (res, allowedMethods = []) => {
    res.setHeader("Allow", allowedMethods);
    return ApiResponse.error(res, `Method not allowed. Allowed: ${allowedMethods.join(", ")}`, 405);
  },

  conflict: (res, message = "Resource already exists") => {
    return ApiResponse.error(res, message, 409);
  },

  tooManyRequests: (res, message = "Too many requests. Please try again later.") => {
    return ApiResponse.error(res, message, 429);
  },

  serverError: (res, message = "Internal server error", error = null) => {
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
export async function isAdminUser(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
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
 * Require admin authentication middleware
 */
export async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
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
 * Validate MongoDB ObjectId
 */
export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && 
    new mongoose.Types.ObjectId(id).toString() === id;
}

/**
 * Validate required fields
 */
export function validateRequiredFields(body, requiredFields) {
  const missing = [];
  const errors = {};

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
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(str) {
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
export function parsePagination(query, defaults = { page: 1, limit: 10, maxLimit: 100 }) {
  let page = parseInt(query.page, 10) || defaults.page;
  let limit = parseInt(query.limit, 10) || defaults.limit;

  // Ensure positive values
  page = Math.max(1, page);
  limit = Math.max(1, Math.min(limit, defaults.maxLimit));

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(total, page, limit) {
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
export function handleApiError(res, error, context = "API") {
  console.error(`[${context} Error]:`, error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);
    return ApiResponse.badRequest(res, `Validation failed: ${errors.join(". ")}`, error.errors);
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return ApiResponse.conflict(res, `A record with this ${field} already exists`);
  }

  // MongoDB CastError (invalid ObjectId)
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return ApiResponse.badRequest(res, "Invalid ID format");
  }

  // Custom error messages
  if (error.message) {
    if (error.message.includes("not found")) {
      return ApiResponse.notFound(res, error.message);
    }
    if (error.message.includes("required") || error.message.includes("invalid")) {
      return ApiResponse.badRequest(res, error.message);
    }
    if (error.message.includes("already exists")) {
      return ApiResponse.conflict(res, error.message);
    }
  }

  // Generic server error
  return ApiResponse.serverError(res, "An unexpected error occurred. Please try again later.", error);
}

/**
 * Rate limiting helper (in-memory, for simple use cases)
 * For production, use Redis or a proper rate limiting solution
 */
const rateLimitStore = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
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
      resetTime: Math.ceil((record.requests[0] + windowMs - now) / 1000),
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
export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || "unknown";
}

/**
 * Wrapper for API handlers with common error handling
 */
export function withErrorHandler(handler) {
  return async (req, res) => {
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
export function createApiHandler(handlers) {
  return async (req, res) => {
    const { method } = req;
    const handler = handlers[method];

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

/**
 * Validate request body against a schema
 */
export function validateBody(body, schema) {
  const errors = {};
  const sanitized = {};

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
      value = Number(value);
      if (isNaN(value)) {
        errors[field] = `${field} must be a number`;
        continue;
      }
    }

    if (rules.type === "boolean") {
      value = value === true || value === "true";
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
        errors[field] = result || `${field} is invalid`;
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
