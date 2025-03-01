// src/utils/logger.js
// Utility for consistent logging across environments

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;

/**
 * Enhanced logger that provides consistent logging across environments
 */
const logger = {
  /**
   * Log information messages
   * @param {string} context - The context/component where the log originated
   * @param {string} message - The message to log
   * @param {any} data - Optional data to include
   */
  info: (context, message, data) => {
    if (!isProduction || isVercel) {
      console.log(`[INFO][${context}] ${message}`, data ? data : "");
    }
  },

  /**
   * Log warning messages
   * @param {string} context - The context/component where the warning originated
   * @param {string} message - The warning message
   * @param {any} data - Optional data to include
   */
  warn: (context, message, data) => {
    console.warn(`[WARN][${context}] ${message}`, data ? data : "");
  },

  /**
   * Log error messages
   * @param {string} context - The context/component where the error originated
   * @param {string|Error} error - The error object or message
   * @param {any} additionalData - Optional additional context
   */
  error: (context, error, additionalData) => {
    const errorMsg = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : null;

    console.error(`[ERROR][${context}] ${errorMsg}`);

    if (stack) {
      console.error(`[STACK][${context}] ${stack}`);
    }

    if (additionalData) {
      console.error(`[CONTEXT][${context}]`, additionalData);
    }
  },
};

export default logger;
