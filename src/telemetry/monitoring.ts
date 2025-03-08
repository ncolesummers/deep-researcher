import { Logger } from './logger.ts';
import * as metrics from './metrics.ts';

// Create logger for monitoring subsystem
const logger = new Logger('monitoring');

/**
 * Interface for tracking metrics related to a query.
 */
export interface QueryMetrics {
  queryId: string;
  queryText: string;
  startTime: number;
  searchLatency?: number;
  documentFetchCount?: number;
  tokenUsage?: number;
  totalProcessingTime?: number;
  errorCount?: number;
  sourceDiversity?: number;
  hallucinations?: number;
}

// Map to store active query metrics
const activeQueries = new Map<string, QueryMetrics>();

/**
 * Starts tracking metrics for a new query.
 * @param {string} queryId - Unique identifier for the query
 * @param {string} queryText - The text of the query being processed
 */
export function startQueryTracking(queryId: string, queryText: string): void {
  activeQueries.set(queryId, {
    queryId,
    queryText,
    startTime: performance.now(),
    errorCount: 0,
  });

  logger.info('Query tracking started', { queryId, queryText });
}

/**
 * Records the latency of a search operation for a query.
 * @param {string} queryId - Unique identifier for the query
 * @param {number} latencyMs - The latency in milliseconds
 */
export function recordSearchLatency(queryId: string, latencyMs: number): void {
  const query = activeQueries.get(queryId);
  if (query) {
    query.searchLatency = latencyMs;
    activeQueries.set(queryId, query);

    // Record to OpenTelemetry metrics
    metrics.searchLatency.record(latencyMs);
    metrics.searchRequests.add(1);

    logger.debug('Search latency recorded', { queryId, latencyMs });
  } else {
    logger.warn('Attempted to record search latency for unknown query', {
      queryId,
    });
  }
}

/**
 * Records the number of documents fetched for a query.
 * @param {string} queryId - Unique identifier for the query
 * @param {number} count - The number of documents fetched
 */
export function recordDocumentsFetched(queryId: string, count: number): void {
  const query = activeQueries.get(queryId);
  if (query) {
    query.documentFetchCount = count;
    activeQueries.set(queryId, query);

    metrics.documentsFetched.add(count);

    logger.debug('Documents fetched recorded', { queryId, count });
  } else {
    logger.warn('Attempted to record documents fetched for unknown query', {
      queryId,
    });
  }
}

/**
 * Records token usage for a query.
 * @param {string} queryId - Unique identifier for the query
 * @param {number} tokens - The number of tokens used
 */
export function recordTokenUsage(queryId: string, tokens: number): void {
  const query = activeQueries.get(queryId);
  if (query) {
    query.tokenUsage = (query.tokenUsage || 0) + tokens;
    activeQueries.set(queryId, query);

    metrics.tokenUsage.add(tokens);

    logger.debug('Token usage recorded', { queryId, tokens });
  } else {
    logger.warn('Attempted to record token usage for unknown query', {
      queryId,
    });
  }
}

/**
 * Records source diversity (number of unique sources) for a query.
 * @param {string} queryId - Unique identifier for the query
 * @param {number} uniqueSourceCount - The number of unique sources used
 */
export function recordSourceDiversity(
  queryId: string,
  uniqueSourceCount: number
): void {
  const query = activeQueries.get(queryId);
  if (query) {
    query.sourceDiversity = uniqueSourceCount;
    activeQueries.set(queryId, query);

    metrics.sourceDiversity.record(uniqueSourceCount);

    logger.debug('Source diversity recorded', { queryId, uniqueSourceCount });
  } else {
    logger.warn('Attempted to record source diversity for unknown query', {
      queryId,
    });
  }
}

/**
 * Records an error that occurred during query processing.
 * @param {string} queryId - Unique identifier for the query
 * @param {Error} error - The error that occurred
 */
export function recordError(queryId: string, error: Error): void {
  const query = activeQueries.get(queryId);
  if (query) {
    query.errorCount = (query.errorCount || 0) + 1;
    activeQueries.set(queryId, query);

    metrics.errorCount.add(1, { query_id: queryId, error_type: error.name });

    logger.error('Error during query processing', {
      queryId,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  } else {
    logger.warn('Attempted to record error for unknown query', {
      queryId,
      errorMessage: error.message,
    });
  }
}

/**
 * Finalizes tracking for a query and returns the collected metrics.
 * @param {string} queryId - Unique identifier for the query
 * @returns {QueryMetrics | undefined} The collected metrics, or undefined if query not found
 */
export function finalizeQueryTracking(
  queryId: string
): QueryMetrics | undefined {
  const query = activeQueries.get(queryId);
  if (query) {
    query.totalProcessingTime = performance.now() - query.startTime;

    // Record total time
    metrics.queryHandlingTime.record(query.totalProcessingTime);

    logger.info('Query processing completed', {
      queryId,
      totalProcessingTime: query.totalProcessingTime,
      documentsFetched: query.documentFetchCount,
      tokenUsage: query.tokenUsage,
      sourceDiversity: query.sourceDiversity,
      errorCount: query.errorCount,
    });

    activeQueries.delete(queryId);
    return query;
  }

  logger.warn('Attempted to finalize unknown query', { queryId });
  return undefined;
}
