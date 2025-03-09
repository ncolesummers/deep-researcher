import { assertEquals, assertExists } from '@std/assert';
import * as metrics from '../metrics.ts';

/**
 * Tests for the metrics module
 */
Deno.test('Metrics - exports all expected metric names', () => {
  // Test that all expected metric names are exported
  assertExists(metrics.MetricNames);
  assertEquals(metrics.MetricNames.SEARCH_LATENCY, 'search_latency');
  assertEquals(metrics.MetricNames.SEARCH_REQUESTS, 'search_requests');
  assertEquals(metrics.MetricNames.DOCUMENTS_FETCHED, 'documents_fetched');
  assertEquals(metrics.MetricNames.TOKEN_USAGE, 'llm_token_usage');
  assertEquals(metrics.MetricNames.QUERY_HANDLING_TIME, 'query_handling_time');
  assertEquals(metrics.MetricNames.SOURCE_DIVERSITY, 'source_diversity');
  assertEquals(metrics.MetricNames.HALLUCINATION_COUNT, 'hallucination_count');
  assertEquals(metrics.MetricNames.ERROR_COUNT, 'error_count');
});

Deno.test('Metrics - exports all metric instruments', () => {
  // Test that all expected metric instruments are exported
  assertExists(metrics.searchLatency);
  assertExists(metrics.searchRequests);
  assertExists(metrics.documentsFetched);
  assertExists(metrics.tokenUsage);
  assertExists(metrics.queryHandlingTime);
  assertExists(metrics.sourceDiversity);
  assertExists(metrics.hallucinationCount);
  assertExists(metrics.errorCount);
});
