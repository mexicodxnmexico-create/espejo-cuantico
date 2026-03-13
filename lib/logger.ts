export const logger = {
  info: (message: string, metadata?: any) => log('info', message, metadata),
  warn: (message: string, metadata?: any) => log('warn', message, metadata),
  error: (message: string, metadata?: any) => log('error', message, metadata),
};

function log(level: 'info' | 'warn' | 'error', message: string, metadata?: any) {
  let serializedMetadata = metadata;

  // JSON.stringify(new Error()) returns {}, so we must manually extract properties
  if (metadata instanceof Error) {
    serializedMetadata = {
      name: metadata.name,
      message: metadata.message,
      stack: metadata.stack,
    };
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata: serializedMetadata,
  };

  console[level](JSON.stringify(logEntry));
}
