export const logger = {
  info(message: string, metadata?: any) {
    log("info", message, metadata);
  },
  warn(message: string, metadata?: any) {
    log("warn", message, metadata);
  },
  error(message: string, metadata?: any) {
    log("error", message, metadata);
  },
};

function log(level: "info" | "warn" | "error", message: string, metadata?: any) {
  let processedMetadata = metadata;

  // Manual extraction of Error properties
  if (metadata instanceof Error) {
    processedMetadata = {
      name: metadata.name,
      message: metadata.message,
      stack: metadata.stack,
    };
  } else if (metadata && typeof metadata === "object") {
    // If metadata contains an error property that is an Error
    if (metadata.error instanceof Error) {
      processedMetadata = {
        ...metadata,
        error: {
          name: metadata.error.name,
          message: metadata.error.message,
          stack: metadata.error.stack,
        },
      };
    } else {
        // Deep check is probably overkill, we can just copy
        processedMetadata = { ...metadata };
    }
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata: processedMetadata,
  };

  const jsonString = JSON.stringify(logEntry);

  if (level === "error") {
    console.error(jsonString);
  } else if (level === "warn") {
    console.warn(jsonString);
  } else {
    console.info(jsonString);
  }
}
