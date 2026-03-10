/**
 * Artifact System Constants
 *
 * IMPORTANT: These values must match the exports in convex/artifacts.ts
 * Backend source: convex/artifacts.ts
 *
 * If you update these values, ensure they are synchronized with the backend.
 */
export const ARTIFACT_XP_BONUS = 10
export const MAX_FILE_SIZE_MB = 5
export const MIN_REFLECTION_LENGTH = 50

/**
 * Valid artifact types
 * Must match ARTIFACT_TYPES keys in convex/artifacts.ts
 */
export const ARTIFACT_TYPES = {
  SCREENSHOT: 'screenshot',
  COMMIT_URL: 'commit_url',
  REFLECTION: 'reflection',
}

/**
 * Validates if a URL is a valid GitHub URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid GitHub URL
 */
export const isValidGitHubUrl = (url) => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com'
  } catch {
    return false
  }
}
