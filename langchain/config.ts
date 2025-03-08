// Documentation of LangSmith environment variables
export function langsmithRequiredEnvVars(): string[] {
  return ['LANGSMITH_TRACING_V2', 'LANGSMITH_API_KEY', 'LANGSMITH_PROJECT'];
}

// Helper to verify the environment is properly configured
export function verifyLangSmithEnv(): boolean {
  const required = langsmithRequiredEnvVars();
  const missing = required.filter(name => !Deno.env.get(name));

  if (missing.length > 0) {
    console.warn(
      `Missing LangSmith environment variables: ${missing.join(', ')}`
    );
    return false;
  }
  return true;
}

/**
 * Provides instructions for setting up LangSmith environment.
 * @returns {string} Instructions for setting up LangSmith
 */
export function langsmithSetupInstructions(): string {
  return `
To configure LangSmith, set the following environment variables:

export LANGSMITH_TRACING_V2=true
export LANGSMITH_API_KEY=your_api_key
export LANGSMITH_PROJECT="Deep Research Assistant"

Optionally, you can also set:
export LANGSMITH_ENDPOINT=https://api.smith.langchain.com
`;
}
