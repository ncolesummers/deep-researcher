import { assertEquals, assertExists, assert } from '@std/assert';
import {
  createTestTavilySearchService,
  SearchResult,
} from '../tavily_search.ts';

// Mock search result for testing the formatting function
const MOCK_SEARCH_RESULT: SearchResult = {
  title: 'Deno - A secure runtime for JavaScript and TypeScript',
  url: 'https://deno.land/',
  content:
    'Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust. It was created by Ryan Dahl, original creator of Node.js.',
  score: 0.95,
  raw_content: '<html><body>Full HTML content here...</body></html>',
};

// Test service creation and configuration
Deno.test({
  name: 'TavilySearchService - Test Mode Creation',
  fn() {
    // Create a test service
    const service = createTestTavilySearchService();
    assertExists(service);

    // Should be in test mode
    assertEquals(service.isInTestMode(), true);

    // Create a service with mock results
    const mockResults = [MOCK_SEARCH_RESULT];
    const serviceWithMocks = createTestTavilySearchService(mockResults);

    // Should be in test mode
    assertEquals(serviceWithMocks.isInTestMode(), true);
  },
});

// Test the formatting function with mock results
Deno.test({
  name: 'TavilySearchService - Format search results',
  async fn() {
    // Create a test service with mock results
    const mockResults = [MOCK_SEARCH_RESULT];
    const service = createTestTavilySearchService(mockResults);

    // Test the formatting function
    const formatted = await service.searchAndFormatResults('test query');

    // Verify the format contains expected information
    assert(formatted.includes('Found 1 results'));
    assert(formatted.includes(MOCK_SEARCH_RESULT.title));
    assert(formatted.includes(MOCK_SEARCH_RESULT.url));

    // Test with multiple results
    const multiMockResults = [
      MOCK_SEARCH_RESULT,
      {
        title: 'Another Result',
        url: 'https://example.com',
        content: 'Example content for testing',
        score: 0.8,
      },
    ];

    service.setMockResults(multiMockResults);
    const multiFormatted = await service.searchAndFormatResults(
      'another query'
    );

    // Verify multiple results
    assert(multiFormatted.includes('Found 2 results'));
    assert(multiFormatted.includes('Another Result'));
    assert(multiFormatted.includes('https://example.com'));
  },
});

// Add an integration test that is ignored by default
Deno.test({
  name: 'TavilySearchService - Integration Test (requires API key)',
  ignore: true, // Skip this test by default as it requires an API key
  async fn() {
    // This test is meant to be run manually when you have a valid Tavily API key set

    // Ensure we have an API key
    const apiKey = Deno.env.get('TAVILY_API_KEY');
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY environment variable not set');
    }

    // Import the real service creator
    const { createTavilySearchService } = await import('../tavily_search.ts');

    // Create a service instance with the API key
    const service = createTavilySearchService({ apiKey });

    // Perform a simple search
    const results = await service.searchAndFormatResults('What is Deno?');

    // Just check that we get some results back
    assert(results.length > 0);
    console.log('Integration test results:', results);
  },
});
