import { metrics } from 'npm:@opentelemetry/api@1';

// Metric names as constants for consistency
export const MetricNames = {
  SEARCH_LATENCY: 'search_latency',
  SEARCH_REQUESTS: 'search_requests',
  DOCUMENTS_FETCHED: 'documents_fetched',
  TOKEN_USAGE: 'llm_token_usage',
  QUERY_HANDLING_TIME: 'query_handling_time',
  SOURCE_DIVERSITY: 'source_diversity',
  HALLUCINATION_COUNT: 'hallucination_count',
  ERROR_COUNT: 'error_count',
} as const;

// Create a meter
const meter = metrics.getMeter('deep-research-assistant');

/**
 * Histogram for measuring search operation latency.
 */
export const searchLatency = meter.createHistogram(MetricNames.SEARCH_LATENCY, {
  description: 'Latency of search operations',
  unit: 'ms',
});

/**
 * Counter for tracking the number of search requests made.
 */
export const searchRequests = meter.createCounter(MetricNames.SEARCH_REQUESTS, {
  description: 'Number of search requests made',
});

/**
 * Counter for tracking the number of documents fetched.
 */
export const documentsFetched = meter.createCounter(
  MetricNames.DOCUMENTS_FETCHED,
  {
    description: 'Number of documents fetched',
  }
);

/**
 * Counter for tracking token usage in LLM calls.
 */
export const tokenUsage = meter.createCounter(MetricNames.TOKEN_USAGE, {
  description: 'Number of tokens used in LLM calls',
});

/**
 * Histogram for measuring end-to-end query handling time.
 */
export const queryHandlingTime = meter.createHistogram(
  MetricNames.QUERY_HANDLING_TIME,
  {
    description: 'Time to handle a user query end-to-end',
    unit: 'ms',
  }
);

/**
 * Histogram for measuring source diversity (number of unique sources).
 */
export const sourceDiversity = meter.createHistogram(
  MetricNames.SOURCE_DIVERSITY,
  {
    description: 'Number of distinct sources used in a response',
    unit: '1',
  }
);

/**
 * Counter for tracking detected hallucinations.
 */
export const hallucinationCount = meter.createCounter(
  MetricNames.HALLUCINATION_COUNT,
  {
    description: 'Number of detected hallucinations in responses',
  }
);

/**
 * Counter for tracking errors.
 */
export const errorCount = meter.createCounter(MetricNames.ERROR_COUNT, {
  description: 'Number of errors encountered during processing',
});
