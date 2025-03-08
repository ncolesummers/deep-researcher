#!/usr/bin/env deno run --allow-net --allow-env

/**
 * Tavily Search Example
 *
 * This script demonstrates how to use the Tavily search service in the Deep Researcher application.
 *
 * Usage:
 *   deno run --allow-net --allow-env tavily_search_example.ts "your search query"
 */

import { createTavilySearchService } from '../tavily_search.ts';

// Main function
async function main() {
  // Get query from command line arguments or use default
  const query = Deno.args[0] || 'What is Deno?';

  console.log('=== Deep Researcher - Tavily Search Demo ===');
  console.log(`Searching for: "${query}"`);

  try {
    // Create a Tavily search service
    const searchService = createTavilySearchService({
      maxResults: 5,
      searchDepth: 'basic',
      includeRawContent: true,
    });

    // Perform the search and get formatted results
    const formattedResults = await searchService.searchAndFormatResults(query);

    // Display the results
    console.log('\nSearch Results:');
    console.log('==============\n');
    console.log(formattedResults);

    // You can also get the raw search results
    const rawResults = await searchService.search(query);

    console.log('\nRaw Result Count:', rawResults.length);
    console.log('First Result Title:', rawResults[0]?.title || 'No results');

    // Log total tokens used
    console.log(
      '\nNote: In a full application, these results would be used to inform the LLM response.'
    );
  } catch (error: unknown) {
    console.error(
      'Error performing search:',
      error instanceof Error ? error.message : String(error)
    );

    if (error instanceof Error && error.message.includes('API key')) {
      console.error(
        "\nMake sure you've set the TAVILY_API_KEY environment variable."
      );
      console.error(
        'You can sign up for a Tavily API key at https://tavily.com'
      );
    }
  }
}

// Run the main function
if (import.meta.main) {
  await main();
}
