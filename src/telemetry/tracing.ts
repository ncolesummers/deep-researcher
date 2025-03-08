import {
  trace,
  SpanStatusCode,
  Span,
  context,
  Context,
} from 'npm:@opentelemetry/api@1';

/**
 * Options for creating a traced span
 */
export interface SpanOptions {
  /**
   * Additional attributes to add to the span
   */
  attributes?: Record<string, string | number | boolean>;

  /**
   * Parent span to link this span to
   */
  parentSpan?: Span;

  /**
   * Whether to mark this span as active in the current context
   * @default true
   */
  setActive?: boolean;
}

/**
 * Creates a traced function that wraps an original function with an OpenTelemetry span.
 * This provides automatic tracing with proper error handling and context propagation.
 *
 * @param name - Name of the span to create
 * @param fn - Async function to wrap with tracing
 * @param options - Optional configuration for the span
 * @returns A wrapped function that creates a span during execution
 *
 * @example
 * ```ts
 * const tracedFetch = createTracedFunction(
 *   "fetchData",
 *   async (url: string) => {
 *     const response = await fetch(url);
 *     return response.json();
 *   },
 *   { attributes: { "operation.type": "http" } }
 * );
 *
 * // Usage
 * const data = await tracedFetch("https://api.example.com/data");
 * ```
 */
export function createTracedFunction<T, Args extends unknown[]>(
  name: string,
  fn: (...args: Args) => Promise<T>,
  options: SpanOptions = {}
): (...args: Args) => Promise<T> {
  const tracer = trace.getTracer('deep-research-assistant');

  return async function (...args: Args): Promise<T> {
    // Create the span with any provided attributes
    const span = tracer.startSpan(name, {
      attributes: options.attributes,
    });

    // Create a context with this span
    const activeContext =
      options.setActive !== false
        ? trace.setSpan(context.active(), span)
        : context.active();

    // Run the function within the span's context
    return context.with(activeContext, async () => {
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        // Type-safe error handling
        if (error instanceof Error) {
          span.recordException({
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          });
        } else {
          // Handle non-Error objects
          const errorMessage = String(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: errorMessage,
          });
        }
        throw error;
      } finally {
        span.end();
      }
    });
  };
}

/**
 * Creates a span manager for manual control of span lifecycle.
 * This is useful for long-running operations or when you need
 * fine-grained control over when the span starts and ends.
 *
 * @param name - Name of the span
 * @param options - Optional configuration for the span
 * @returns An object with methods to control the span
 *
 * @example
 * ```ts
 * const spanManager = createSpanManager("database-operation");
 *
 * try {
 *   spanManager.start();
 *   spanManager.addAttribute("db.operation", "query");
 *
 *   // Perform database operation...
 *
 *   spanManager.addEvent("row-retrieved", { count: 42 });
 * } catch (error) {
 *   spanManager.recordError(error);
 *   throw error;
 * } finally {
 *   spanManager.end();
 * }
 * ```
 */
export function createSpanManager(name: string, options: SpanOptions = {}) {
  const tracer = trace.getTracer('deep-research-assistant');
  let span: Span | null = null;
  let activeContext: Context | null = null;

  return {
    /**
     * Starts the span and makes it active in the current context if setActive is true
     * @returns The created span
     */
    start: (): Span => {
      span = tracer.startSpan(name, {
        attributes: options.attributes,
      });

      if (options.setActive !== false) {
        activeContext = trace.setSpan(context.active(), span);
        context.with(activeContext, () => {});
      }

      return span;
    },

    /**
     * Ends the span
     */
    end: (): void => {
      if (span) {
        span.end();
        span = null;
        activeContext = null;
      }
    },

    /**
     * Adds an attribute to the span
     * @param key - Attribute key
     * @param value - Attribute value
     */
    addAttribute: (key: string, value: string | number | boolean): void => {
      if (span) {
        span.setAttribute(key, value);
      }
    },

    /**
     * Adds multiple attributes to the span
     * @param attributes - Record of attribute key-value pairs
     */
    addAttributes: (
      attributes: Record<string, string | number | boolean>
    ): void => {
      if (span && attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span?.setAttribute(key, value);
        });
      }
    },

    /**
     * Records an event on the span
     * @param name - Event name
     * @param attributes - Optional attributes for the event
     */
    addEvent: (
      eventName: string,
      attributes?: Record<string, string | number | boolean>
    ): void => {
      if (span) {
        span.addEvent(eventName, attributes);
      }
    },

    /**
     * Records an error on the span
     * @param error - The error to record
     */
    recordError: (error: unknown): void => {
      if (!span) return;

      if (error instanceof Error) {
        span.recordException({
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
      } else {
        // Handle non-Error objects
        const errorMessage = String(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: errorMessage,
        });
      }
    },

    /**
     * Gets the current span if it exists
     * @returns The current span or null
     */
    getSpan: (): Span | null => span,

    /**
     * Checks if the span is currently active
     * @returns True if the span is active
     */
    isActive: (): boolean => span !== null,
  };
}

/**
 * Creates a helper to wrap a function with a child span.
 * This is useful when you want to create multiple child spans
 * within a parent operation.
 *
 * @returns A function to create traced child functions
 *
 * @example
 * ```ts
 * async function processDocument(doc) {
 *   // Create parent span for the whole operation
 *   const parentSpan = tracer.startSpan("process-document");
 *   const childTracer = createChildTracer(parentSpan);
 *
 *   try {
 *     // Create child spans for sub-operations
 *     const parsedData = await childTracer("parse", () => parseDocument(doc));
 *     const enrichedData = await childTracer("enrich", () => enrichData(parsedData));
 *     return enrichedData;
 *   } finally {
 *     parentSpan.end();
 *   }
 * }
 * ```
 */
export function createChildTracer(parentSpan?: Span) {
  /**
   * Creates a traced function as a child of the parent span
   * @param name - Name of the child span
   * @param fn - Function to trace
   * @param attributes - Optional attributes for the span
   * @returns Result of the function
   */
  return async function traceChild<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ): Promise<T> {
    const tracer = trace.getTracer('deep-research-assistant');
    const ctx = parentSpan
      ? trace.setSpan(context.active(), parentSpan)
      : context.active();

    return context.with(ctx, async () => {
      const span = tracer.startSpan(name, { attributes });

      try {
        return await context.with(trace.setSpan(context.active(), span), fn);
      } catch (error) {
        if (error instanceof Error) {
          span.recordException({
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          });
        } else {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: String(error),
          });
        }
        throw error;
      } finally {
        span.end();
      }
    });
  };
}
