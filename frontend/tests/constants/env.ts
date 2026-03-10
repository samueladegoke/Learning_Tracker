/**
 * Test Environment Constants
 * Centralized configuration for test environment detection
 */

// DEV_MODE is true when VITE_DEV_MODE env var is "true"
// This bypasses authentication in the application
export const DEV_MODE = process.env.VITE_DEV_MODE === 'true' ||
  // Default to true for local development testing
  (!process.env.CI && process.env.NODE_ENV !== 'production');

// Base URL for the application
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Test timeout overrides
export const TEST_TIMEOUT = {
  short: 5000,
  medium: 15000,
  long: 30000,
};

// Authentication test credentials (for non-DEV_MODE testing)
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'testpassword123',
};