const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;

interface Logger {
  info: (context: string, message: string, data?: any) => void;
  warn: (context: string, message: string, data?: any) => void;
  error: (context: string, error: Error | string, additionalData?: any) => void;
}

const logger: Logger = {
  info: (context, message, data) => {
    if (!isProduction || isVercel) {
      console.log(`[INFO][${context}] ${message}`, data ? data : "");
    }
  },

  warn: (context, message, data) => {
    console.warn(`[WARN][${context}] ${message}`, data ? data : "");
  },

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
