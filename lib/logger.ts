// lib/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    // In a production environment, this could integrate with a service like Sentry
    if (process.env.NODE_ENV !== "production") {
      console.error(message, error);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(message, data);
    }
  },
  log: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(message, data);
    }
  }
};
