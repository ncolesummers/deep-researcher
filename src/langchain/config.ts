/**
 * Mock LangChain configuration for testing
 */

/**
 * Verifies if LangSmith environment variables are set
 * @returns {boolean} True if LangSmith is configured, false otherwise
 */
export function verifyLangSmithEnv(): boolean {
  return false;
}

/**
 * Returns setup instructions for LangSmith
 * @returns {string} Setup instructions
 */
export function langsmithSetupInstructions(): string {
  return `
To configure LangSmith, set the following environment variables:
- LANGCHAIN_API_KEY: Your LangSmith API key
- LANGCHAIN_PROJECT: Your LangSmith project name
`;
}
