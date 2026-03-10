/**
 * Structured logging utility for error tracking and debugging.
 * Provides consistent error logging format with error IDs and context.
 */

/**
 * Logs an error with structured format including error ID and context.
 * @param {string} errorId - Unique identifier for the error (e.g., 'SHOP_PURCHASE_FAILED')
 * @param {any} context - Additional context object with timestamp and metadata
 * @param {Error} [error] - Optional Error object to log
 */
export const logError = (errorId, context = {}, error) => {
  const logContext = {
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (error) {
    console.error(`[${errorId}]`, logContext, error);
  } else {
    console.error(`[${errorId}]`, logContext);
  }
};

/**
 * Logs informational messages with structured format.
 * @param {string} message - The message to log
 * @param {any} [context] - Optional context object
 */
export const logInfo = (message, context = {}) => {
  const logContext = {
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.log(`[INFO] ${message}`, logContext);
};

/**
 * Logs a warning with structured format.
 * @param {string} warningId - Unique identifier for the warning
 * @param {any} [context] - Optional context object
 */
export const logWarning = (warningId, context = {}) => {
  const logContext = {
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.warn(`[${warningId}]`, logContext);
};
