/**
 * Error ID constants for structured error logging.
 * These IDs are used to track and identify errors across the application.
 */

/** Quiz module error IDs */
export const QUIZ_OPTIONS_PARSE_ERROR = 'QUIZ_OPTIONS_PARSE_ERROR';
export const QUIZ_TEST_CASES_PARSE_ERROR = 'QUIZ_TEST_CASES_PARSE_ERROR';
export const QUIZ_ANSWER_VERIFY_FAILED = 'QUIZ_ANSWER_VERIFY_FAILED';

/** Shop module error IDs */
export const SHOP_PURCHASE_FAILED = 'SHOP_PURCHASE_FAILED';

/** Reflections module error IDs */
export const REFLECTIONS_SAVE_FAILED = 'REFLECTIONS_SAVE_FAILED';

/** Python/Pyodide module error IDs */
export const PYODIDE_LOAD_FAILED = 'PYODIDE_LOAD_FAILED';
export const PYTHON_EXECUTION_ERROR = 'PYTHON_EXECUTION_ERROR';

/** Dashboard module error IDs */
export const DASHBOARD_DATA_LOAD_FAILED = 'DASHBOARD_DATA_LOAD_FAILED';

/** Authentication error IDs */
export const AUTH_INIT_FAILED = 'AUTH_INIT_FAILED';
export const AUTH_SESSION_ERROR = 'AUTH_SESSION_ERROR';

/** Network error IDs */
export const NETWORK_REQUEST_FAILED = 'NETWORK_REQUEST_FAILED';

/**
 * Get a human-readable error message based on error ID.
 * @param {string} errorId - The error ID
 * @returns {string} - Human-readable error message
 */
export const getErrorMessage = (errorId: string): string => {
  const messages: Record<string, string> = {
    [QUIZ_OPTIONS_PARSE_ERROR]: 'Failed to parse quiz options',
    [QUIZ_TEST_CASES_PARSE_ERROR]: 'Failed to parse quiz test cases',
    [QUIZ_ANSWER_VERIFY_FAILED]: 'Failed to verify your answer',
    [SHOP_PURCHASE_FAILED]: 'Purchase failed',
    [REFLECTIONS_SAVE_FAILED]: 'Failed to save reflection',
    [PYODIDE_LOAD_FAILED]: 'Failed to load Python environment',
    [PYTHON_EXECUTION_ERROR]: 'Python execution error',
    [DASHBOARD_DATA_LOAD_FAILED]: 'Failed to load dashboard data',
    [AUTH_INIT_FAILED]: 'Authentication initialization failed',
    [AUTH_SESSION_ERROR]: 'Session error',
    [NETWORK_REQUEST_FAILED]: 'Network request failed',
  };

  return messages[errorId] || 'An unexpected error occurred';
};

/**
 * Get a user-friendly action suggestion based on error ID.
 * @param {string} errorId - The error ID
 * @returns {string | null} - Suggested action or null if none
 */
export const getErrorAction = (errorId: string): string | null => {
  const actions: Record<string, string> = {
    [SHOP_PURCHASE_FAILED]: 'Not enough gold - complete quests to earn more!',
    [PYODIDE_LOAD_FAILED]: 'Check your connection and try again',
    [NETWORK_REQUEST_FAILED]: 'Check your connection and try again',
  };

  return actions[errorId] || null;
};
