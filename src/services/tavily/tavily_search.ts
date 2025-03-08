import { TavilySearchResults } from 'npm:@langchain/community/tools/tavily_search';

/**
 * Configuration options for the Tavily search
 */
export interface TavilySearchOptions {
  /**
   * Maximum number of results to return
   * @default 5
   */
  maxResults?: number;

  /**
   * Search depth - "basic" or "deep"
   * @default "basic"
   */
  searchDepth?: 'basic' | 'deep';

  /**
   * Include raw content from the search results
   * @default true
   */
  includeRawContent?: boolean;

  /**
   * Include images in the search results
   * @default false
   */
  includeImages?: boolean;

  /**
   * API key for Tavily (optional - will use TAVILY_API_KEY env var if not provided)
   */
  apiKey?: string;

  /**
   * For testing: Skip API initialization and run in test mode
   * @default false
   */
  testMode?: boolean;
}

/**
 * Result interface from Tavily search
 */
export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

/**
 * TavilySearchService - A service class for performing web searches using Tavily
 *
 * This is a wrapper around the Tavily Search API that makes it easier to use
 * in the context of the Deep Researcher application.
 */
export class TavilySearchService {
  private tavilyTool?: TavilySearchResults;
  private isTestMode = false;
  private mockResults: SearchResult[] = [];

  /**
   * Create a new TavilySearchService
   *
   * @param options Configuration options for the search
   */
  constructor(options: TavilySearchOptions = {}) {
    // Check if we should run in test mode
    if (options.testMode === true) {
      this.isTestMode = true;
      return;
    }

    // Set default options
    const defaultOptions: TavilySearchOptions = {
      maxResults: 5,
      searchDepth: 'basic',
      includeRawContent: true,
      includeImages: false,
    };

    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };

    try {
      // Create the Tavily tool
      this.tavilyTool = new TavilySearchResults({
        maxResults: mergedOptions.maxResults,
        searchDepth: mergedOptions.searchDepth,
        includeRawContent: mergedOptions.includeRawContent,
        includeImages: mergedOptions.includeImages,
        apiKey: mergedOptions.apiKey,
      });
    } catch (error) {
      // If we're in a test environment, switch to test mode
      if (Deno.env.get('DENO_ENV') === 'test') {
        console.warn(
          'Tavily API key not found, running in TEST MODE. Searches will not work.'
        );
        this.isTestMode = true;
      } else {
        // In normal operation, we propagate the error
        throw error;
      }
    }
  }

  /**
   * Perform a search using Tavily
   *
   * @param query The search query
   * @returns Array of search results
   */
  async search(query: string): Promise<SearchResult[]> {
    // If we're in test mode, return mock results
    if (this.isTestMode) {
      return this.mockResults;
    }

    try {
      console.log(`Performing Tavily search for: "${query}"`);
      if (!this.tavilyTool) {
        throw new Error('Tavily tool not initialized');
      }

      const results = await this.tavilyTool.invoke(query);

      // Parse the results - they come as a JSON string
      if (typeof results === 'string') {
        try {
          return JSON.parse(results) as SearchResult[];
        } catch (e) {
          console.error('Error parsing Tavily results:', e);
          return [];
        }
      } else {
        // Should not happen, but just in case
        console.warn('Unexpected result type from Tavily:', typeof results);
        return Array.isArray(results) ? results : [];
      }
    } catch (error: unknown) {
      console.error('Error performing Tavily search:', error);
      if (error instanceof Error) {
        throw new Error(`Tavily search failed: ${error.message}`);
      } else {
        throw new Error(`Tavily search failed: ${String(error)}`);
      }
    }
  }

  /**
   * Perform a search and return a formatted summary of the results
   *
   * @param query The search query
   * @returns A formatted string summary of the search results
   */
  async searchAndFormatResults(query: string): Promise<string> {
    const results = await this.search(query);

    if (results.length === 0) {
      return 'No results found.';
    }

    // Format the results into a readable summary
    let formattedResults = `Found ${results.length} results for "${query}":\n\n`;

    results.forEach((result, index) => {
      formattedResults += `${index + 1}. "${result.title}"\n`;
      formattedResults += `   URL: ${result.url}\n`;
      formattedResults += `   Relevance Score: ${result.score}\n`;
      formattedResults += `   Summary: ${result.content.substring(0, 200)}${
        result.content.length > 200 ? '...' : ''
      }\n\n`;
    });

    return formattedResults;
  }

  /**
   * Get the raw Tavily tool for direct access if needed
   */
  getTavilyTool(): TavilySearchResults | undefined {
    return this.tavilyTool;
  }

  /**
   * Check if the service is running in test mode
   */
  isInTestMode(): boolean {
    return this.isTestMode;
  }

  /**
   * Set mock search results for testing
   *
   * @param mockResults The mock results to return from search
   */
  setMockResults(mockResults: SearchResult[]): void {
    this.mockResults = mockResults;

    if (!this.isTestMode) {
      this.isTestMode = true;
    }
  }
}

/**
 * Create a new TavilySearchService with the given options
 *
 * @param options Configuration options for the search
 * @returns A new TavilySearchService instance
 */
export function createTavilySearchService(
  options: TavilySearchOptions = {}
): TavilySearchService {
  return new TavilySearchService(options);
}

/**
 * Create a TavilySearchService in test mode
 *
 * @param mockResults Optional mock results to return from searches
 * @returns A new TavilySearchService instance in test mode
 */
export function createTestTavilySearchService(
  mockResults?: SearchResult[]
): TavilySearchService {
  const service = new TavilySearchService({ testMode: true });

  if (mockResults) {
    service.setMockResults(mockResults);
  }

  return service;
}

// Example usage if this module is run directly
if (import.meta.main) {
  // Check if TAVILY_API_KEY is set
  if (!Deno.env.get('TAVILY_API_KEY')) {
    console.error('TAVILY_API_KEY environment variable not set');
    Deno.exit(1);
  }

  const query = Deno.args[0] || 'What is Deno?';
  const tavilyService = createTavilySearchService();

  console.log(`Searching for: "${query}"`);

  tavilyService
    .searchAndFormatResults(query)
    .then(results => {
      console.log(results);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
