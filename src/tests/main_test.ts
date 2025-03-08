import { assertEquals } from '@std/assert';
import { simpleResearcher } from '../core/researcher.ts';

// This file contains basic tests for the deep-researcher project
// We don't run the actual researcher tests here to avoid API key requirements

// A placeholder test that simply checks the import works
Deno.test('Researcher module imports correctly', () => {
  // If we got here without errors, the module imported successfully
  assertEquals(typeof simpleResearcher, 'function');
});

// Inform users about the researcher tests
console.log(
  'For LangGraph functionality tests, run: deno test src/core/tests/researcher_test.ts'
);
